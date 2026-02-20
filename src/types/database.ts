export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          rarity: Database["public"]["Enums"]["achievement_rarity"] | null
          title: string
          unlock_condition: Json | null
          xp_reward: number | null
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"] | null
          title: string
          unlock_condition?: Json | null
          xp_reward?: number | null
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          rarity?: Database["public"]["Enums"]["achievement_rarity"] | null
          title?: string
          unlock_condition?: Json | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      admin_metrics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          metadata: Json | null
          metric_type: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          metadata?: Json | null
          metric_type: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          metadata?: Json | null
          metric_type?: string
          value?: number
        }
        Relationships: []
      }
      banners: {
        Row: {
          alt_text: string
          created_at: string | null
          desktop_image_url: string
          id: string
          is_active: boolean
          link_url: string | null
          mobile_image_url: string
          order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          alt_text: string
          created_at?: string | null
          desktop_image_url: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          mobile_image_url: string
          order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string
          created_at?: string | null
          desktop_image_url?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          mobile_image_url?: string
          order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calculator_logs: {
        Row: {
          area_m2: number
          converted_to_cart: boolean | null
          converted_to_subscription: boolean | null
          created_at: string | null
          grass_type: string | null
          has_irrigation: boolean | null
          id: string
          lawn_condition: string | null
          result: Json
          session_id: string | null
          sun_exposure: string | null
          user_id: string | null
        }
        Insert: {
          area_m2: number
          converted_to_cart?: boolean | null
          converted_to_subscription?: boolean | null
          created_at?: string | null
          grass_type?: string | null
          has_irrigation?: boolean | null
          id?: string
          lawn_condition?: string | null
          result: Json
          session_id?: string | null
          sun_exposure?: string | null
          user_id?: string | null
        }
        Update: {
          area_m2?: number
          converted_to_cart?: boolean | null
          converted_to_subscription?: boolean | null
          created_at?: string | null
          grass_type?: string | null
          has_irrigation?: boolean | null
          id?: string
          lawn_condition?: string | null
          result?: Json
          session_id?: string | null
          sun_exposure?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculator_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          badge_icon: string | null
          badge_title: string | null
          color: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_min: number | null
          icon: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          metadata: Json | null
          order: number | null
          prerequisites: string[] | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          badge_icon?: string | null
          badge_title?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_min?: number | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          order?: number | null
          prerequisites?: string[] | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          badge_icon?: string | null
          badge_title?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_min?: number | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          metadata?: Json | null
          order?: number | null
          prerequisites?: string[] | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: Json
          course_id: string
          created_at: string | null
          duration_min: number | null
          id: string
          is_published: boolean | null
          order: number | null
          quiz: Json | null
          slug: string
          title: string
          updated_at: string | null
          xp_reward: number | null
        }
        Insert: {
          content?: Json
          course_id: string
          created_at?: string | null
          duration_min?: number | null
          id?: string
          is_published?: boolean | null
          order?: number | null
          quiz?: Json | null
          slug: string
          title: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Update: {
          content?: Json
          course_id?: string
          created_at?: string | null
          duration_min?: number | null
          id?: string
          is_published?: boolean | null
          order?: number | null
          quiz?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_data: Json | null
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_sync: {
        Row: {
          created_at: string | null
          currency: string | null
          fulfillment_status: string | null
          id: string
          line_items: Json | null
          shopify_created_at: string | null
          shopify_order_id: string
          shopify_order_number: string | null
          status: string | null
          synced_at: string | null
          total_price: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          fulfillment_status?: string | null
          id?: string
          line_items?: Json | null
          shopify_created_at?: string | null
          shopify_order_id: string
          shopify_order_number?: string | null
          status?: string | null
          synced_at?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          fulfillment_status?: string | null
          id?: string
          line_items?: Json | null
          shopify_created_at?: string | null
          shopify_order_id?: string
          shopify_order_number?: string | null
          status?: string | null
          synced_at?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_sync_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          last_activity_date: string | null
          level: number | null
          notification_settings: Json | null
          phone: string | null
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"] | null
          shopify_customer_id: string | null
          shopify_email: string | null
          streak_days: number | null
          updated_at: string | null
          xp_total: number | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          level?: number | null
          notification_settings?: Json | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          shopify_customer_id?: string | null
          shopify_email?: string | null
          streak_days?: number | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          notification_settings?: Json | null
          phone?: string | null
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"] | null
          shopify_customer_id?: string | null
          shopify_email?: string | null
          streak_days?: number | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          address_number: string | null
          available_products: string[] | null
          business_hours: Json | null
          cep: string | null
          city: string
          complement: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          metadata: Json | null
          name: string
          neighborhood: string | null
          phone: string | null
          photos: string[] | null
          slug: string
          state: string
          tags: string[] | null
          type: Database["public"]["Enums"]["store_type"] | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address: string
          address_number?: string | null
          available_products?: string[] | null
          business_hours?: Json | null
          cep?: string | null
          city: string
          complement?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          photos?: string[] | null
          slug: string
          state: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["store_type"] | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string
          address_number?: string | null
          available_products?: string[] | null
          business_hours?: Json | null
          cep?: string | null
          city?: string
          complement?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          photos?: string[] | null
          slug?: string
          state?: string
          tags?: string[] | null
          type?: Database["public"]["Enums"]["store_type"] | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          delivery_count: number | null
          frequency_days: number
          id: string
          last_delivery_date: string | null
          metadata: Json | null
          next_delivery_date: string | null
          paused_at: string | null
          products: Json
          shipping_address: Json | null
          shopify_contract_id: string | null
          shopify_subscription_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          delivery_count?: number | null
          frequency_days: number
          id?: string
          last_delivery_date?: string | null
          metadata?: Json | null
          next_delivery_date?: string | null
          paused_at?: string | null
          products?: Json
          shipping_address?: Json | null
          shopify_contract_id?: string | null
          shopify_subscription_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          delivery_count?: number | null
          frequency_days?: number
          id?: string
          last_delivery_date?: string | null
          metadata?: Json | null
          next_delivery_date?: string | null
          paused_at?: string | null
          products?: Json
          shipping_address?: Json | null
          shopify_contract_id?: string | null
          shopify_subscription_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          context: Json | null
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          context?: Json | null
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          context?: Json | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          lesson_id: string
          quiz_answers: Json | null
          quiz_attempts: number | null
          quiz_score: number | null
          started_at: string | null
          time_spent: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          lesson_id: string
          quiz_answers?: Json | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          started_at?: string | null
          time_spent?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          lesson_id?: string
          quiz_answers?: Json | null
          quiz_attempts?: number | null
          quiz_score?: number | null
          started_at?: string | null
          time_spent?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_xp: {
        Args: { p_user_id: string; p_xp_amount: number }
        Returns: undefined
      }
      find_nearby_stores: {
        Args: {
          max_results?: number
          radius_km?: number
          user_lat: number
          user_lng: number
        }
        Returns: {
          address: string
          city: string
          distance_km: number
          id: string
          latitude: number
          longitude: number
          name: string
          phone: string
          state: string
        }[]
      }
    }
    Enums: {
      achievement_rarity: "common" | "rare" | "epic" | "legendary"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      store_type:
        | "garden_center"
        | "pet_shop"
        | "agricultural"
        | "online"
        | "other"
      subscription_status: "active" | "paused" | "cancelled" | "pending"
      user_role: "customer" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
