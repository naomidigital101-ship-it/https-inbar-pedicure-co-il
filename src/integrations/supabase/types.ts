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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_articles: {
        Row: {
          category_slug: string
          created_at: string
          fact_check_report: Json | null
          fact_checked_at: string | null
          hero_image_url: string | null
          id: string
          payload: Json
          published_at: string | null
          qa_attempts: number
          qa_report: Json | null
          scheduled_for: string | null
          slug: string
          status: string
          title: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          fact_check_report?: Json | null
          fact_checked_at?: string | null
          hero_image_url?: string | null
          id?: string
          payload: Json
          published_at?: string | null
          qa_attempts?: number
          qa_report?: Json | null
          scheduled_for?: string | null
          slug: string
          status?: string
          title: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          fact_check_report?: Json | null
          fact_checked_at?: string | null
          hero_image_url?: string | null
          id?: string
          payload?: Json
          published_at?: string | null
          qa_attempts?: number
          qa_report?: Json | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          title?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_articles_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "ai_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_generation_settings: {
        Row: {
          article_model: string
          auto_publish: boolean
          id: number
          image_model: string
          posts_per_week: number
          publish_days: number[]
          publish_hour: number
          qa_model: string
          topic_model: string
          updated_at: string
        }
        Insert: {
          article_model?: string
          auto_publish?: boolean
          id?: number
          image_model?: string
          posts_per_week?: number
          publish_days?: number[]
          publish_hour?: number
          qa_model?: string
          topic_model?: string
          updated_at?: string
        }
        Update: {
          article_model?: string
          auto_publish?: boolean
          id?: number
          image_model?: string
          posts_per_week?: number
          publish_days?: number[]
          publish_hour?: number
          qa_model?: string
          topic_model?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_qa_logs: {
        Row: {
          article_id: string
          attempt: number
          created_at: string
          id: string
          issues: Json
          model: string | null
          passed: boolean
        }
        Insert: {
          article_id: string
          attempt: number
          created_at?: string
          id?: string
          issues?: Json
          model?: string | null
          passed: boolean
        }
        Update: {
          article_id?: string
          attempt?: number
          created_at?: string
          id?: string
          issues?: Json
          model?: string | null
          passed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ai_qa_logs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "ai_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_topics: {
        Row: {
          category_slug: string
          created_at: string
          id: string
          keywords: string[]
          reasoning: string | null
          score: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_slug: string
          created_at?: string
          id?: string
          keywords?: string[]
          reasoning?: string | null
          score?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_slug?: string
          created_at?: string
          id?: string
          keywords?: string[]
          reasoning?: string | null
          score?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      autopilot_runs: {
        Row: {
          created_at: string
          email_status: string | null
          error_message: string | null
          finished_at: string | null
          generated: number
          id: string
          passed: number
          published: number
          results: Json
          scheduled: number
          started_at: string
          status: string
          suggested: number
          trigger: string
        }
        Insert: {
          created_at?: string
          email_status?: string | null
          error_message?: string | null
          finished_at?: string | null
          generated?: number
          id?: string
          passed?: number
          published?: number
          results?: Json
          scheduled?: number
          started_at?: string
          status?: string
          suggested?: number
          trigger?: string
        }
        Update: {
          created_at?: string
          email_status?: string | null
          error_message?: string | null
          finished_at?: string | null
          generated?: number
          id?: string
          passed?: number
          published?: number
          results?: Json
          scheduled?: number
          started_at?: string
          status?: string
          suggested?: number
          trigger?: string
        }
        Relationships: []
      }
      before_after: {
        Row: {
          after_alt: string | null
          after_image: string | null
          before_alt: string | null
          before_image: string
          consent_confirmed: boolean
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          service_slug: string | null
          sessions_count: number | null
          sort_order: number
          timeframe: string | null
          title: string
          updated_at: string
        }
        Insert: {
          after_alt?: string | null
          after_image?: string | null
          before_alt?: string | null
          before_image: string
          consent_confirmed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          service_slug?: string | null
          sessions_count?: number | null
          sort_order?: number
          timeframe?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          after_alt?: string | null
          after_image?: string | null
          before_alt?: string | null
          before_image?: string
          consent_confirmed?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          service_slug?: string | null
          sessions_count?: number | null
          sort_order?: number
          timeframe?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          block_key: string
          description: string | null
          heading: string | null
          is_published: boolean
          item_schema: Json
          items: Json
          label: string
          sort_order: number
          subheading: string | null
          updated_at: string
        }
        Insert: {
          block_key: string
          description?: string | null
          heading?: string | null
          is_published?: boolean
          item_schema?: Json
          items?: Json
          label: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          block_key?: string
          description?: string | null
          heading?: string | null
          is_published?: boolean
          item_schema?: Json
          items?: Json
          label?: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          after_image_url: string | null
          before_image_url: string | null
          caption: string
          created_at: string
          created_by: string | null
          hashtags: string
          id: string
          idea: Json | null
          ig_media_id: string | null
          image_url: string | null
          post_type: string
          publish_error: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          after_image_url?: string | null
          before_image_url?: string | null
          caption?: string
          created_at?: string
          created_by?: string | null
          hashtags?: string
          id?: string
          idea?: Json | null
          ig_media_id?: string | null
          image_url?: string | null
          post_type?: string
          publish_error?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          after_image_url?: string | null
          before_image_url?: string | null
          caption?: string
          created_at?: string
          created_by?: string | null
          hashtags?: string
          id?: string
          idea?: Json | null
          ig_media_id?: string | null
          image_url?: string | null
          post_type?: string
          publish_error?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_categories: {
        Row: {
          created_at: string
          description: string | null
          hero_image: string | null
          id: string
          is_published: boolean
          label: string
          meta_description: string | null
          meta_title: string | null
          mod_code: string | null
          short_name: string | null
          slug: string
          sort_order: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          hero_image?: string | null
          id?: string
          is_published?: boolean
          label: string
          meta_description?: string | null
          meta_title?: string | null
          mod_code?: string | null
          short_name?: string | null
          slug: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          hero_image?: string | null
          id?: string
          is_published?: boolean
          label?: string
          meta_description?: string | null
          meta_title?: string | null
          mod_code?: string | null
          short_name?: string | null
          slug?: string
          sort_order?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          handled_at: string | null
          id: string
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          service_slug: string | null
          source_page: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          handled_at?: string | null
          id?: string
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          service_slug?: string | null
          source_page?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          handled_at?: string | null
          id?: string
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          service_slug?: string | null
          source_page?: string | null
          status?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          created_at: string
          folder: string
          height: number | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          title: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          created_at?: string
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          title?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          created_at?: string
          folder?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          title?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_area: string | null
          author_name: string
          body: string
          created_at: string
          id: string
          is_featured: boolean
          is_published: boolean
          rating: number
          review_date: string
          service_slug: string | null
          sort_order: number
          source: string
          source_url: string | null
          updated_at: string
        }
        Insert: {
          author_area?: string | null
          author_name: string
          body: string
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          rating?: number
          review_date?: string
          service_slug?: string | null
          sort_order?: number
          source?: string
          source_url?: string | null
          updated_at?: string
        }
        Update: {
          author_area?: string | null
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          rating?: number
          review_date?: string
          service_slug?: string | null
          sort_order?: number
          source?: string
          source_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          canonical: string | null
          card_alt: string | null
          card_image: string | null
          created_at: string
          faqs: Json
          flagship_accent: string | null
          flagship_icon: string | null
          flagship_sub: string | null
          flagship_tag: string | null
          flagship_title: string | null
          h1: string | null
          hero_image: string | null
          id: string
          intro: string | null
          is_flagship: boolean
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          nav_label: string
          noindex: boolean
          og_image: string | null
          price_text: string | null
          price_visible: boolean
          quick_facts: Json
          red_flags: Json
          schema_type: string
          sections: Json
          slug: string
          sort_order: number
          sources: Json
          subtitle: string | null
          title: string
          tldr: string | null
          updated_at: string
        }
        Insert: {
          canonical?: string | null
          card_alt?: string | null
          card_image?: string | null
          created_at?: string
          faqs?: Json
          flagship_accent?: string | null
          flagship_icon?: string | null
          flagship_sub?: string | null
          flagship_tag?: string | null
          flagship_title?: string | null
          h1?: string | null
          hero_image?: string | null
          id?: string
          intro?: string | null
          is_flagship?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          nav_label: string
          noindex?: boolean
          og_image?: string | null
          price_text?: string | null
          price_visible?: boolean
          quick_facts?: Json
          red_flags?: Json
          schema_type?: string
          sections?: Json
          slug: string
          sort_order?: number
          sources?: Json
          subtitle?: string | null
          title: string
          tldr?: string | null
          updated_at?: string
        }
        Update: {
          canonical?: string | null
          card_alt?: string | null
          card_image?: string | null
          created_at?: string
          faqs?: Json
          flagship_accent?: string | null
          flagship_icon?: string | null
          flagship_sub?: string | null
          flagship_tag?: string | null
          flagship_title?: string | null
          h1?: string | null
          hero_image?: string | null
          id?: string
          intro?: string | null
          is_flagship?: boolean
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          nav_label?: string
          noindex?: boolean
          og_image?: string | null
          price_text?: string | null
          price_visible?: boolean
          quick_facts?: Json
          red_flags?: Json
          schema_type?: string
          sections?: Json
          slug?: string
          sort_order?: number
          sources?: Json
          subtitle?: string | null
          title?: string
          tldr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          group_key: string
          help_text: string | null
          input_type: string
          key: string
          label: string
          sort_order: number
          updated_at: string
          value: string | null
        }
        Insert: {
          group_key?: string
          help_text?: string | null
          input_type?: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Update: {
          group_key?: string
          help_text?: string | null
          input_type?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role:
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
