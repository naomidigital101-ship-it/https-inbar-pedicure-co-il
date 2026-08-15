export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      before_after: {
        Row: {
          id: string;
          service_slug: string | null;
          title: string;
          description: string | null;
          before_image: string;
          before_alt: string | null;
          after_image: string;
          after_alt: string | null;
          sessions_count: number | null;
          timeframe: string | null;
          consent_confirmed: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_slug?: string | null;
          title: string;
          description?: string | null;
          before_image: string;
          before_alt?: string | null;
          after_image: string;
          after_alt?: string | null;
          sessions_count?: number | null;
          timeframe?: string | null;
          consent_confirmed?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_slug?: string | null;
          title?: string;
          description?: string | null;
          before_image?: string;
          before_alt?: string | null;
          after_image?: string;
          after_alt?: string | null;
          sessions_count?: number | null;
          timeframe?: string | null;
          consent_confirmed?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_categories: {
        Row: {
          id: string;
          slug: string;
          label: string;
          title: string | null;
          description: string | null;
          meta_title: string | null;
          meta_description: string | null;
          hero_image: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          short_name: string | null;
          mod_code: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          title?: string | null;
          description?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          hero_image?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          short_name?: string | null;
          mod_code?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          title?: string | null;
          description?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          hero_image?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          short_name?: string | null;
          mod_code?: string | null;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          path: string;
          url: string;
          alt: string | null;
          title: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          width: number | null;
          height: number | null;
          folder: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          url: string;
          alt?: string | null;
          title?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          folder?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          url?: string;
          alt?: string | null;
          title?: string | null;
          mime_type?: string | null;
          size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          folder?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          author_name: string;
          author_area: string | null;
          rating: number;
          body: string;
          service_slug: string | null;
          source: string;
          source_url: string | null;
          review_date: string;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_area?: string | null;
          rating?: number;
          body: string;
          service_slug?: string | null;
          source?: string;
          source_url?: string | null;
          review_date?: string;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_area?: string | null;
          rating?: number;
          body?: string;
          service_slug?: string | null;
          source?: string;
          source_url?: string | null;
          review_date?: string;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          nav_label: string;
          title: string;
          subtitle: string | null;
          meta_title: string | null;
          meta_description: string | null;
          h1: string | null;
          canonical: string | null;
          og_image: string | null;
          noindex: boolean;
          tldr: string | null;
          intro: string | null;
          quick_facts: Json;
          sections: Json;
          red_flags: Json;
          faqs: Json;
          sources: Json;
          hero_image: string | null;
          card_image: string | null;
          card_alt: string | null;
          price_text: string | null;
          price_visible: boolean;
          is_flagship: boolean;
          flagship_tag: string | null;
          flagship_sub: string | null;
          flagship_icon: string | null;
          flagship_accent: string | null;
          schema_type: string;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          flagship_title: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          nav_label: string;
          title: string;
          subtitle?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          h1?: string | null;
          canonical?: string | null;
          og_image?: string | null;
          noindex?: boolean;
          tldr?: string | null;
          intro?: string | null;
          quick_facts?: Json;
          sections?: Json;
          red_flags?: Json;
          faqs?: Json;
          sources?: Json;
          hero_image?: string | null;
          card_image?: string | null;
          card_alt?: string | null;
          price_text?: string | null;
          price_visible?: boolean;
          is_flagship?: boolean;
          flagship_tag?: string | null;
          flagship_sub?: string | null;
          flagship_icon?: string | null;
          flagship_accent?: string | null;
          schema_type?: string;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          flagship_title?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          nav_label?: string;
          title?: string;
          subtitle?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          h1?: string | null;
          canonical?: string | null;
          og_image?: string | null;
          noindex?: boolean;
          tldr?: string | null;
          intro?: string | null;
          quick_facts?: Json;
          sections?: Json;
          red_flags?: Json;
          faqs?: Json;
          sources?: Json;
          hero_image?: string | null;
          card_image?: string | null;
          card_alt?: string | null;
          price_text?: string | null;
          price_visible?: boolean;
          is_flagship?: boolean;
          flagship_tag?: string | null;
          flagship_sub?: string | null;
          flagship_icon?: string | null;
          flagship_accent?: string | null;
          schema_type?: string;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
          flagship_title?: string | null;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          group_key: string;
          label: string;
          input_type: string;
          help_text: string | null;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: string | null;
          group_key?: string;
          label: string;
          input_type?: string;
          help_text?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string | null;
          group_key?: string;
          label?: string;
          input_type?: string;
          help_text?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_articles: {
        Row: {
          category_slug: string;
          created_at: string;
          fact_check_report: Json | null;
          fact_checked_at: string | null;
          hero_image_url: string | null;
          id: string;
          payload: Json;
          published_at: string | null;
          qa_attempts: number;
          qa_report: Json | null;
          scheduled_for: string | null;
          slug: string;
          status: string;
          title: string;
          topic_id: string | null;
          updated_at: string;
        };
        Insert: {
          category_slug: string;
          created_at?: string;
          fact_check_report?: Json | null;
          fact_checked_at?: string | null;
          hero_image_url?: string | null;
          id?: string;
          payload: Json;
          published_at?: string | null;
          qa_attempts?: number;
          qa_report?: Json | null;
          scheduled_for?: string | null;
          slug: string;
          status?: string;
          title: string;
          topic_id?: string | null;
          updated_at?: string;
        };
        Update: {
          category_slug?: string;
          created_at?: string;
          fact_check_report?: Json | null;
          fact_checked_at?: string | null;
          hero_image_url?: string | null;
          id?: string;
          payload?: Json;
          published_at?: string | null;
          qa_attempts?: number;
          qa_report?: Json | null;
          scheduled_for?: string | null;
          slug?: string;
          status?: string;
          title?: string;
          topic_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_articles_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "ai_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_generation_settings: {
        Row: {
          article_model: string;
          auto_publish: boolean;
          id: number;
          image_model: string;
          posts_per_week: number;
          publish_days: number[];
          publish_hour: number;
          qa_model: string;
          topic_model: string;
          updated_at: string;
        };
        Insert: {
          article_model?: string;
          auto_publish?: boolean;
          id?: number;
          image_model?: string;
          posts_per_week?: number;
          publish_days?: number[];
          publish_hour?: number;
          qa_model?: string;
          topic_model?: string;
          updated_at?: string;
        };
        Update: {
          article_model?: string;
          auto_publish?: boolean;
          id?: number;
          image_model?: string;
          posts_per_week?: number;
          publish_days?: number[];
          publish_hour?: number;
          qa_model?: string;
          topic_model?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_qa_logs: {
        Row: {
          article_id: string;
          attempt: number;
          created_at: string;
          id: string;
          issues: Json;
          model: string | null;
          passed: boolean;
        };
        Insert: {
          article_id: string;
          attempt: number;
          created_at?: string;
          id?: string;
          issues?: Json;
          model?: string | null;
          passed: boolean;
        };
        Update: {
          article_id?: string;
          attempt?: number;
          created_at?: string;
          id?: string;
          issues?: Json;
          model?: string | null;
          passed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "ai_qa_logs_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "ai_articles";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_topics: {
        Row: {
          category_slug: string;
          created_at: string;
          id: string;
          keywords: string[];
          reasoning: string | null;
          score: number;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category_slug: string;
          created_at?: string;
          id?: string;
          keywords?: string[];
          reasoning?: string | null;
          score?: number;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category_slug?: string;
          created_at?: string;
          id?: string;
          keywords?: string[];
          reasoning?: string | null;
          score?: number;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      autopilot_runs: {
        Row: {
          created_at: string;
          email_status: string | null;
          error_message: string | null;
          finished_at: string | null;
          generated: number;
          id: string;
          passed: number;
          published: number;
          results: Json;
          scheduled: number;
          started_at: string;
          status: string;
          suggested: number;
          trigger: string;
        };
        Insert: {
          created_at?: string;
          email_status?: string | null;
          error_message?: string | null;
          finished_at?: string | null;
          generated?: number;
          id?: string;
          passed?: number;
          published?: number;
          results?: Json;
          scheduled?: number;
          started_at?: string;
          status?: string;
          suggested?: number;
          trigger?: string;
        };
        Update: {
          created_at?: string;
          email_status?: string | null;
          error_message?: string | null;
          finished_at?: string | null;
          generated?: number;
          id?: string;
          passed?: number;
          published?: number;
          results?: Json;
          scheduled?: number;
          started_at?: string;
          status?: string;
          suggested?: number;
          trigger?: string;
        };
        Relationships: [];
      };
      email_send_log: {
        Row: {
          created_at: string;
          error_message: string | null;
          id: string;
          message_id: string | null;
          metadata: Json | null;
          recipient_email: string;
          status: string;
          template_name: string;
        };
        Insert: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          metadata?: Json | null;
          recipient_email: string;
          status: string;
          template_name: string;
        };
        Update: {
          created_at?: string;
          error_message?: string | null;
          id?: string;
          message_id?: string | null;
          metadata?: Json | null;
          recipient_email?: string;
          status?: string;
          template_name?: string;
        };
        Relationships: [];
      };
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number;
          batch_size: number;
          id: number;
          retry_after_until: string | null;
          send_delay_ms: number;
          transactional_email_ttl_minutes: number;
          updated_at: string;
        };
        Insert: {
          auth_email_ttl_minutes?: number;
          batch_size?: number;
          id?: number;
          retry_after_until?: string | null;
          send_delay_ms?: number;
          transactional_email_ttl_minutes?: number;
          updated_at?: string;
        };
        Update: {
          auth_email_ttl_minutes?: number;
          batch_size?: number;
          id?: number;
          retry_after_until?: string | null;
          send_delay_ms?: number;
          transactional_email_ttl_minutes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      email_unsubscribe_tokens: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          token: string;
          used_at: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          token: string;
          used_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          token?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
      instagram_posts: {
        Row: {
          after_image_url: string | null;
          before_image_url: string | null;
          caption: string;
          created_at: string;
          created_by: string | null;
          hashtags: string;
          id: string;
          idea: Json | null;
          ig_media_id: string | null;
          image_url: string | null;
          post_type: string;
          publish_error: string | null;
          published_at: string | null;
          scheduled_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          after_image_url?: string | null;
          before_image_url?: string | null;
          caption?: string;
          created_at?: string;
          created_by?: string | null;
          hashtags?: string;
          id?: string;
          idea?: Json | null;
          ig_media_id?: string | null;
          image_url?: string | null;
          post_type?: string;
          publish_error?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          after_image_url?: string | null;
          before_image_url?: string | null;
          caption?: string;
          created_at?: string;
          created_by?: string | null;
          hashtags?: string;
          id?: string;
          idea?: Json | null;
          ig_media_id?: string | null;
          image_url?: string | null;
          post_type?: string;
          publish_error?: string | null;
          published_at?: string | null;
          scheduled_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          handled_at: string | null;
          id: string;
          message: string | null;
          name: string | null;
          notes: string | null;
          phone: string | null;
          service_slug: string | null;
          source_page: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          handled_at?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          service_slug?: string | null;
          source_page?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          handled_at?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
          notes?: string | null;
          phone?: string | null;
          service_slug?: string | null;
          source_page?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      suppressed_emails: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          metadata: Json | null;
          reason: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          metadata?: Json | null;
          reason: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          metadata?: Json | null;
          reason?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string };
        Returns: boolean;
      };
      enqueue_email: {
        Args: { payload: Json; queue_name: string };
        Returns: number;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      move_to_dlq: {
        Args: {
          dlq_name: string;
          message_id: number;
          payload: Json;
          source_queue: string;
        };
        Returns: number;
      };
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number };
        Returns: {
          message: Json;
          msg_id: number;
          read_ct: number;
        }[];
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
