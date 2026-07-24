-- ============================================================
-- TERRAVIK - Schema Completo do Banco de Dados
-- Gerado em: 2026-07-23
-- Projeto: vanlpqkxchovxnadolgh (contato@terravik.com.br)
-- ============================================================
-- Rodar no SQL Editor do Supabase Dashboard:
-- https://supabase.com/dashboard/project/vanlpqkxchovxnadolgh/sql/new
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE store_type AS ENUM ('garden_center', 'pet_shop', 'agricultural', 'online', 'other');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'pending');
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'super_admin');

-- ============================================================
-- TABELAS
-- ============================================================

-- profiles (vinculado ao Supabase Auth)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  address jsonb,
  role user_role DEFAULT 'customer',
  xp_total integer DEFAULT 0,
  level integer DEFAULT 1,
  streak_days integer DEFAULT 0,
  last_activity_date date,
  shopify_customer_id text,
  shopify_email text,
  preferences jsonb,
  notification_settings jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- achievements
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  icon text,
  color text,
  rarity achievement_rarity DEFAULT 'common',
  xp_reward integer DEFAULT 0,
  unlock_condition jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- user_achievements
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  context jsonb
);

-- banners
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  alt_text text NOT NULL,
  desktop_image_url text NOT NULL,
  mobile_image_url text NOT NULL,
  link_url text,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- courses
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  icon text,
  color text,
  difficulty difficulty_level DEFAULT 'beginner',
  estimated_duration_min integer,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  badge_title text,
  badge_icon text,
  prerequisites text[] DEFAULT '{}',
  "order" integer,
  metadata jsonb,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- campos de vídeo (migration 20260216)
  thumbnail_url text,
  trailer_url text,
  subtitle text,
  tags text[] DEFAULT '{}'
);

-- lessons
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}',
  quiz jsonb,
  duration_min integer,
  xp_reward integer DEFAULT 0,
  "order" integer,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- campos de vídeo (migration 20260216)
  video_url text,
  video_duration_sec integer DEFAULT 0,
  thumbnail_url text,
  description text,
  type text DEFAULT 'video',
  UNIQUE(course_id, slug)
);

-- lesson_materials (migration 20260216)
CREATE TABLE lesson_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'pdf',
  file_url text NOT NULL,
  file_size_bytes bigint DEFAULT 0,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- user_progress
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  started_at timestamptz,
  completed_at timestamptz,
  time_spent integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  quiz_score integer,
  quiz_attempts integer DEFAULT 0,
  quiz_answers jsonb,
  CONSTRAINT user_progress_unique_lesson UNIQUE (user_id, lesson_id)
);

-- stores
CREATE TABLE stores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  type store_type DEFAULT 'other',
  address text NOT NULL,
  address_number text,
  complement text,
  neighborhood text,
  city text NOT NULL,
  state text NOT NULL,
  cep text,
  latitude numeric,
  longitude numeric,
  phone text,
  whatsapp text,
  email text,
  website text,
  logo_url text,
  photos text[],
  business_hours jsonb,
  available_products text[],
  tags text[],
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shopify_subscription_id text,
  shopify_contract_id text,
  status subscription_status DEFAULT 'pending',
  products jsonb NOT NULL DEFAULT '[]',
  frequency_days integer NOT NULL,
  next_delivery_date date,
  last_delivery_date date,
  delivery_count integer DEFAULT 0,
  shipping_address jsonb,
  started_at timestamptz,
  paused_at timestamptz,
  cancelled_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- orders_sync (cache de pedidos Shopify)
CREATE TABLE orders_sync (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  shopify_order_id text NOT NULL UNIQUE,
  shopify_order_number text,
  status text,
  fulfillment_status text,
  total_price numeric,
  currency text,
  line_items jsonb,
  shopify_created_at timestamptz,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- admin_metrics
CREATE TABLE admin_metrics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type text NOT NULL,
  date date NOT NULL,
  value numeric NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  action_url text,
  action_data jsonb,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- calculator_logs
CREATE TABLE calculator_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  area_m2 numeric NOT NULL,
  grass_type text,
  lawn_condition text,
  sun_exposure text,
  has_irrigation boolean,
  result jsonb NOT NULL,
  converted_to_cart boolean DEFAULT false,
  converted_to_subscription boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- video_testimonials
CREATE TABLE video_testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  handle text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url text,
  product_name text NOT NULL,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- photo_testimonials
CREATE TABLE photo_testimonials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  location text,
  rating integer DEFAULT 5,
  text text NOT NULL,
  months integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_lessons_course_order ON lessons(course_id, "order");
CREATE INDEX idx_lesson_materials_lesson ON lesson_materials(lesson_id, "order");
CREATE INDEX idx_courses_published ON courses(is_published, "order");
CREATE INDEX idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_stores_city ON stores(city);
CREATE INDEX idx_stores_active ON stores(is_active);
CREATE INDEX idx_orders_sync_user ON orders_sync(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, status);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Adicionar XP ao usuário e recalcular nível
CREATE OR REPLACE FUNCTION add_user_xp(p_user_id uuid, p_xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_xp integer;
  v_new_level integer;
BEGIN
  UPDATE profiles
  SET
    xp_total = xp_total + p_xp_amount,
    updated_at = now()
  WHERE id = p_user_id
  RETURNING xp_total INTO v_new_xp;

  -- Cálculo de nível: level = floor(sqrt(xp / 100)) + 1
  v_new_level := floor(sqrt(v_new_xp::float / 100))::integer + 1;

  UPDATE profiles
  SET level = v_new_level
  WHERE id = p_user_id AND level <> v_new_level;
END;
$$;

-- Buscar lojas próximas (requer extensão postgis)
CREATE OR REPLACE FUNCTION find_nearby_stores(
  user_lat numeric,
  user_lng numeric,
  radius_km numeric DEFAULT 50,
  max_results integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  name text,
  address text,
  city text,
  state text,
  phone text,
  latitude numeric,
  longitude numeric,
  distance_km numeric
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    s.id,
    s.name,
    s.address,
    s.city,
    s.state,
    s.phone,
    s.latitude,
    s.longitude,
    round(
      (ST_Distance(
        ST_MakePoint(s.longitude, s.latitude)::geography,
        ST_MakePoint(user_lng, user_lat)::geography
      ) / 1000.0)::numeric
    , 2) AS distance_km
  FROM stores s
  WHERE
    s.is_active = true
    AND s.latitude IS NOT NULL
    AND s.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(s.longitude, s.latitude)::geography,
      ST_MakePoint(user_lng, user_lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km ASC
  LIMIT max_results;
$$;

-- Trigger para criar profile automaticamente após signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_logs ENABLE ROW LEVEL SECURITY;

-- profiles: usuário vê/edita apenas o próprio; admin vê todos
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- achievements: leitura pública
CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (is_active = true);
CREATE POLICY "achievements_admin_all" ON achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- user_achievements: usuário vê os próprios
CREATE POLICY "user_achievements_select_own" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_insert_own" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- banners: leitura pública; escrita apenas admin
CREATE POLICY "banners_public_read" ON banners FOR SELECT USING (is_active = true);
CREATE POLICY "banners_admin_all" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- courses: leitura pública para publicados
CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses_admin_all" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- lessons: leitura pública para publicadas
CREATE POLICY "lessons_public_read" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "lessons_admin_all" ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- lesson_materials: leitura pública
CREATE POLICY "lesson_materials_public_read" ON lesson_materials FOR SELECT USING (true);
CREATE POLICY "lesson_materials_admin_all" ON lesson_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- user_progress: usuário vê/edita o próprio
CREATE POLICY "user_progress_select_own" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_progress_insert_own" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_update_own" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- stores: leitura pública para ativas
CREATE POLICY "stores_public_read" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "stores_admin_all" ON stores FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- subscriptions: usuário vê/edita as próprias
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_insert_own" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions_update_own" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "subscriptions_admin_all" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- orders_sync: usuário vê os próprios
CREATE POLICY "orders_sync_select_own" ON orders_sync FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_sync_admin_all" ON orders_sync FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- admin_metrics: apenas admin
CREATE POLICY "admin_metrics_admin_all" ON admin_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- notifications: usuário vê as próprias
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_admin_all" ON notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- calculator_logs: usuário vê os próprios; anônimo pode inserir
CREATE POLICY "calculator_logs_select_own" ON calculator_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calculator_logs_insert_anon" ON calculator_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "calculator_logs_admin_all" ON calculator_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
