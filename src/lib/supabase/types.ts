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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      approach: {
        Row: {
          description: string
          id: string
          is_active: boolean
          sort_order: number
          step_number: number
          title: string
        }
        Insert: {
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          step_number: number
          title: string
        }
        Update: {
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          step_number?: number
          title?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          icon: string
          id: string
          platform: string
          url: string
        }
        Insert: {
          icon?: string
          id?: string
          platform: string
          url: string
        }
        Update: {
          icon?: string
          id?: string
          platform?: string
          url?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          cv_url: string | null
          email: string | null
          highlights: Json
          id: string
          location: string | null
          name: string | null
          phone: string | null
          photo_url: string | null
          summary: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          cv_url?: string | null
          email?: string | null
          highlights?: Json
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          summary?: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          cv_url?: string | null
          email?: string | null
          highlights?: Json
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          summary?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_tech_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          project_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          project_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          project_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tech_tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          featured: boolean
          github_url: string | null
          id: string
          image_url: string | null
          live_url: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean
          github_url?: string | null
          id?: string
          image_url?: string | null
          live_url?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          id: string
          items: string[]
          sort_order: number
        }
        Insert: {
          category: string
          id?: string
          items?: string[]
          sort_order?: number
        }
        Update: {
          category?: string
          id?: string
          items?: string[]
          sort_order?: number
        }
        Relationships: []
      }
      stats: {
        Row: {
          id: string
          label: string
          prefix: string
          sort_order: number
          suffix: string
          value: number
        }
        Insert: {
          id?: string
          label: string
          prefix?: string
          sort_order?: number
          suffix?: string
          value?: number
        }
        Update: {
          id?: string
          label?: string
          prefix?: string
          sort_order?: number
          suffix?: string
          value?: number
        }
        Relationships: []
      }
      titles: {
        Row: {
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
