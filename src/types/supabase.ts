
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
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
        Relationships: []
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
      audios: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          title?: string
          updated_at?: string | null
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
        Relationships: []
      }
      chat_interactions: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          user_id: string | null
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          user_id?: string | null
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          user_id?: string | null
          user_message?: string
        }
        Relationships: []
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
      daily_reflections: {
        Row: {
          active: boolean | null
          audio_url: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          scheduled_for: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          audio_url?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          audio_url?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          title?: string
          updated_at?: string | null
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
      daily_verses: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          reflection: string
          scheduled_for: string | null
          updated_at: string | null
          verse_reference: string
          verse_text: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reflection: string
          scheduled_for?: string | null
          updated_at?: string | null
          verse_reference: string
          verse_text: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reflection?: string
          scheduled_for?: string | null
          updated_at?: string | null
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      devotional_notes: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          user_id: string
          verse_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
          verse_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
          verse_date?: string
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
      irmandade_members: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
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
        Relationships: []
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
          is_active: boolean
          mood_points: number | null
          motivation_note: string | null
          nome: string | null
          sobriety_start_date: string | null
          telefone: string | null
          tempo_uso: string | null
          tratamentos_concluidos: number | null
          tratamentos_tentados: number | null
          updated_at: string | null
          story: string | null
          rank: string | null
          badges: string[] | null
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
          is_active?: boolean
          mood_points?: number | null
          motivation_note?: string | null
          nome?: string | null
          sobriety_start_date?: string | null
          telefone?: string | null
          tempo_uso?: string | null
          tratamentos_concluidos?: number | null
          tratamentos_tentados?: number | null
          updated_at?: string | null
          story?: string | null
          rank?: string | null
          badges?: string[] | null
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
          is_active?: boolean
          mood_points?: number | null
          motivation_note?: string | null
          nome?: string | null
          sobriety_start_date?: string | null
          telefone?: string | null
          tempo_uso?: string | null
          tratamentos_concluidos?: number | null
          tratamentos_tentados?: number | null
          updated_at?: string | null
          story?: string | null
          rank?: string | null
          badges?: string[] | null
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
      reflections: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
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
      therapeutic_activities: {
        Row: {
          active: boolean | null
          audio_url: string | null
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          audio_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          audio_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
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
        Relationships: []
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
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_therapeutic_activities: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          description: string
          audio_url: string
          created_at: string
          updated_at: string
          created_by: string
          active: boolean
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      set_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      sync_users_to_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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

// Type definitions for the Supabase client
export type UserProfile = {
  id: string;
  nome: string | null;
  avatar_url: string | null;
  dias_sobriedade?: number | null;
  cidade?: string | null;
  story?: string | null;
  rank?: string | null;
  badges?: string[] | null;
};

export type IrmandadeMember = Database['public']['Tables']['irmandade_members']['Row'];
