import { FOTO_BYTES_MAXIMOS, FOTO_LADO_MAXIMO } from './diagnostico'

/**
 * Reduz a foto no próprio aparelho antes de enviar.
 *
 * Foto de celular tem de 3 a 12 MB. Redesenhar num canvas de até 1280 px e
 * salvar em JPEG deixa o envio rápido no 4G e, de quebra, remove os metadados
 * do arquivo original (data, modelo do aparelho, localização por GPS): o que
 * sai daqui é só a imagem.
 */
export async function prepararFoto(arquivo: File): Promise<Blob> {
  if (!arquivo.type.startsWith('image/')) throw new Error('não é imagem')

  const imagem = await carregar(arquivo)
  const escala = Math.min(1, FOTO_LADO_MAXIMO / Math.max(imagem.largura, imagem.altura))
  const largura = Math.max(1, Math.round(imagem.largura * escala))
  const altura = Math.max(1, Math.round(imagem.altura * escala))

  const canvas = document.createElement('canvas')
  canvas.width = largura
  canvas.height = altura
  const contexto = canvas.getContext('2d')
  if (!contexto) throw new Error('canvas indisponível')
  contexto.drawImage(imagem.fonte, 0, 0, largura, altura)
  imagem.liberar()

  // Baixa a qualidade até caber no limite da rota.
  for (const qualidade of [0.82, 0.7, 0.55]) {
    const blob = await paraJpeg(canvas, qualidade)
    if (blob.size <= FOTO_BYTES_MAXIMOS) return blob
  }
  throw new Error('imagem grande demais')
}

interface ImagemCarregada {
  fonte: CanvasImageSource
  largura: number
  altura: number
  liberar: () => void
}

async function carregar(arquivo: File): Promise<ImagemCarregada> {
  // createImageBitmap respeita a rotação gravada pela câmera.
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(arquivo, { imageOrientation: 'from-image' })
      return { fonte: bitmap, largura: bitmap.width, altura: bitmap.height, liberar: () => bitmap.close() }
    } catch {
      // Navegador antigo ou formato que ele não decodifica assim: tenta <img>.
    }
  }

  const url = URL.createObjectURL(arquivo)
  try {
    const img = await new Promise<HTMLImageElement>((resolver, rejeitar) => {
      const elemento = new Image()
      elemento.onload = () => resolver(elemento)
      elemento.onerror = () => rejeitar(new Error('imagem ilegível'))
      elemento.src = url
    })
    return { fonte: img, largura: img.naturalWidth, altura: img.naturalHeight, liberar: () => URL.revokeObjectURL(url) }
  } catch (erro) {
    URL.revokeObjectURL(url)
    throw erro
  }
}

function paraJpeg(canvas: HTMLCanvasElement, qualidade: number): Promise<Blob> {
  return new Promise((resolver, rejeitar) => {
    canvas.toBlob(
      (blob) => (blob ? resolver(blob) : rejeitar(new Error('falha ao gerar a imagem'))),
      'image/jpeg',
      qualidade
    )
  })
}
