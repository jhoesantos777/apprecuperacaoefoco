export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          payment_amount: number
          payment_id: string | null
          payment_status: string
          professional_id: string
          slot_id: string
          start_time: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          payment_amount: number
          payment_id?: string | null
          payment_status?: string
          professional_id: string
          slot_id: string
          start_time: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          payment_amount?: number
          payment_id?: string | null
          payment_status?: string
          professional_id?: string
          slot_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "available_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      atividades_usuario: {
        Row: {
          data_registro: string
          descricao: string | null
          id: string
          pontos: number
          tipo_atividade: string
          user_id: string
        }
        Insert: {
          data_registro?: string
          descricao?: string | null
          id?: string
          pontos: number
          tipo_atividade: string
          user_id: string
        }
        Update: {
          data_registro?: string
          descricao?: string | null
          id?: string
          pontos?: number
          tipo_atividade?: string
          user_id?: string
        }
        Relationships: []
      }
      available_slots: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_available: boolean
          professional_id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          professional_id: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          professional_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_slots_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          duration: string
          id: string
          lessons_count: number
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration: string
          id?: string
          lessons_count?: number
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration?: string
          id?: string
          lessons_count?: number
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          description: string
          id: string
          name: string
          points: number
        }
        Insert: {
          description: string
          id?: string
          name: string
          points?: number
        }
        Update: {
          description?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      devotional_visits: {
        Row: {
          id: string
          user_id: string
          visited_at: string
        }
        Insert: {
          id?: string
          user_id: string
          visited_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          visited_at?: string
        }
        Relationships: []
      }
      humores: {
        Row: {
          created_at: string | null
          data_registro: string
          emocao: string
          id: string
          pontos: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_registro?: string
          emocao: string
          id?: string
          pontos: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_registro?: string
          emocao?: string
          id?: string
          pontos?: number
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string
          course_id: string
          created_at: string | null
          duration: string
          id: string
          order_number: number
          title: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string | null
          duration: string
          id?: string
          order_number: number
          title: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string | null
          duration?: string
          id?: string
          order_number?: number
          title?: string
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
      medals: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mood: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mood: string
          points: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mood?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          bio: string | null
          created_at: string | null
          hourly_rate: number
          id: string
          image_url: string | null
          name: string
          specialty: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          hourly_rate: number
          id?: string
          image_url?: string | null
          name: string
          specialty: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          hourly_rate?: number
          id?: string
          image_url?: string | null
          name?: string
          specialty?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cidade: string | null
          created_at: string | null
          data_nascimento: string | null
          dias_sobriedade: number | null
          drogas_uso: string[] | null
          email: string | null
          estado: string | null
          historico_familiar_uso: boolean | null
          id: string
          idade: number | null
          mood_points: number | null
          motivation_note: string | null
          nome: string | null
          sobriety_start_date: string | null
          telefone: string | null
          tempo_uso: string | null
          tratamentos_concluidos: number | null
          tratamentos_tentados: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          dias_sobriedade?: number | null
          drogas_uso?: string[] | null
          email?: string | null
          estado?: string | null
          historico_familiar_uso?: boolean | null
          id: string
          idade?: number | null
          mood_points?: number | null
          motivation_note?: string | null
          nome?: string | null
          sobriety_start_date?: string | null
          telefone?: string | null
          tempo_uso?: string | null
          tratamentos_concluidos?: number | null
          tratamentos_tentados?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          dias_sobriedade?: number | null
          drogas_uso?: string[] | null
          email?: string | null
          estado?: string | null
          historico_familiar_uso?: boolean | null
          id?: string
          idade?: number | null
          mood_points?: number | null
          motivation_note?: string | null
          nome?: string | null
          sobriety_start_date?: string | null
          telefone?: string | null
          tempo_uso?: string | null
          tratamentos_concluidos?: number | null
          tratamentos_tentados?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recovery_triggers: {
        Row: {
          created_at: string
          id: string
          trigger_description: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          trigger_description: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          trigger_description?: string
          user_id?: string
        }
        Relationships: []
      }
      sobriety_declarations: {
        Row: {
          declared_at: string
          id: string
          user_id: string
        }
        Insert: {
          declared_at?: string
          id?: string
          user_id: string
        }
        Update: {
          declared_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sobriety_medals: {
        Row: {
          days_milestone: number
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          days_milestone: number
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          days_milestone?: number
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          completed_lessons: number[] | null
          course_id: string
          id: string
          last_accessed: string | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_lessons?: number[] | null
          course_id: string
          id?: string
          last_accessed?: string | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_lessons?: number[] | null
          course_id?: string
          id?: string
          last_accessed?: string | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_medals: {
        Row: {
          earned_at: string | null
          id: string
          medal_id: string | null
          user_id: string | null
        }
        Insert: {
          earned_at?: string | null
          id?: string
          medal_id?: string | null
          user_id?: string | null
        }
        Update: {
          earned_at?: string | null
          id?: string
          medal_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_medals_medal_id_fkey"
            columns: ["medal_id"]
            isOneToOne: false
            referencedRelation: "medals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_medals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_task_completions: {
        Row: {
          completed_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_task_completions_task"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "daily_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_mood: {
        Args: { mood_value: string; mood_timestamp: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
