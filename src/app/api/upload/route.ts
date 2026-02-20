import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (default)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB (vídeos)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_MIME_IMAGES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_MIME_VIDEO = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const ALLOWED_MIME_DOCS = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'];
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'ogg', 'mov', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'txt', 'csv']);

const HAS_SERVICE_KEY = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function uploadToSupabaseStorage(file: File, folder: string) {
  const { supabaseAdmin } = await import('@/lib/supabase/admin');
  const BUCKET_NAME = 'academia';

  // Tentar criar bucket se não existir
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_VIDEO_SIZE, // 100MB para suportar vídeos
    });
    if (error && !error.message.includes('already exists')) {
      throw new Error(`Erro ao criar bucket: ${error.message}`);
    }
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
  const filePath = `${folder}/${safeName}-${timestamp}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, path: data.path, size: file.size };
}

async function uploadLocally(file: File, folder: string) {
  const uploadFolder = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(uploadFolder, { recursive: true });

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
  const fileName = `${safeName}-${timestamp}.${ext}`;
  const filePath = path.join(uploadFolder, fileName);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${fileName}`;
  return { url: publicUrl, path: publicUrl, size: file.size };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const role = profile?.role;
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'thumbnails';

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
    }
    const allowedMimes = [...ALLOWED_MIME_IMAGES, ...ALLOWED_MIME_VIDEO, ...ALLOWED_MIME_DOCS];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json({ error: `Arquivo muito grande (máx ${maxMB}MB)` }, { status: 400 });
    }

    let result;

    if (HAS_SERVICE_KEY) {
      try {
        result = await uploadToSupabaseStorage(file, folder);
      } catch (err: any) {
        console.warn('[Upload] Supabase Storage falhou, usando local:', err.message);
        result = await uploadLocally(file, folder);
      }
    } else {
      result = await uploadLocally(file, folder);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Upload] Erro:', err);
    return NextResponse.json(
      { error: err.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
