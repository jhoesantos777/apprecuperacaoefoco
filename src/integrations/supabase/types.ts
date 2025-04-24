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
      achievement_types: {
        Row: {
          description: string
          icon_type: string
          name: string
        }
        Insert: {
          description: string
          icon_type: string
          name: string
        }
        Update: {
          description?: string
          icon_type?: string
          name?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          earned_at: string | null
          id: string
          name: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          name: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          name?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      atividades: {
        Row: {
          atividade: string | null
          data: string | null
          id: string
          paciente_id: string | null
          presente: boolean | null
        }
        Insert: {
          atividade?: string | null
          data?: string | null
          id?: string
          paciente_id?: string | null
          presente?: boolean | null
        }
        Update: {
          atividade?: string | null
          data?: string | null
          id?: string
          paciente_id?: string | null
          presente?: boolean | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          descricao: string | null
          updated_at: string | null
          valor: string
        }
        Insert: {
          chave: string
          descricao?: string | null
          updated_at?: string | null
          valor: string
        }
        Update: {
          chave?: string
          descricao?: string | null
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      "ct resgatados": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      dados_sincronizados: {
        Row: {
          dados: string
          id: string
          ultima_atualizacao: string
        }
        Insert: {
          dados: string
          id: string
          ultima_atualizacao?: string
        }
        Update: {
          dados?: string
          id?: string
          ultima_atualizacao?: string
        }
        Relationships: []
      }
      faltas: {
        Row: {
          created_at: string | null
          data: string
          foi_justificada: boolean | null
          id: string
          justificativa: string | null
          observacoes: string | null
          paciente_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          data: string
          foi_justificada?: boolean | null
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          tipo?: string
        }
        Update: {
          created_at?: string | null
          data?: string
          foi_justificada?: boolean | null
          id?: string
          justificativa?: string | null
          observacoes?: string | null
          paciente_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "faltas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      informacoes_pagamento: {
        Row: {
          created_at: string | null
          id: string
          metodo_pagamento: string | null
          numero_whatsapp: string | null
          paciente_id: string | null
          permite_lembretes: boolean | null
          responsavel_pagamento: string | null
          valor_mensalidade: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metodo_pagamento?: string | null
          numero_whatsapp?: string | null
          paciente_id?: string | null
          permite_lembretes?: boolean | null
          responsavel_pagamento?: string | null
          valor_mensalidade: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metodo_pagamento?: string | null
          numero_whatsapp?: string | null
          paciente_id?: string | null
          permite_lembretes?: boolean | null
          responsavel_pagamento?: string | null
          valor_mensalidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "informacoes_pagamento_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_attendance: {
        Row: {
          attended: boolean | null
          created_at: string | null
          date: string
          id: string
          meeting_type: string
          notes: string | null
          patient_id: string | null
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          meeting_type: string
          notes?: string | null
          patient_id?: string | null
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          meeting_type?: string
          notes?: string | null
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensalidades: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          forma_pagamento: string | null
          id: string
          lembrete_enviado: boolean | null
          mes_referencia: string
          pago: boolean | null
          patient_id: string | null
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          forma_pagamento?: string | null
          id?: string
          lembrete_enviado?: boolean | null
          mes_referencia: string
          pago?: boolean | null
          patient_id?: string | null
          valor: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          forma_pagamento?: string | null
          id?: string
          lembrete_enviado?: boolean | null
          mes_referencia?: string
          pago?: boolean | null
          patient_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "mensalidades_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          created_at: string | null
          data_ocorrencia: string
          descricao: string
          detalhes_medida: string | null
          id: string
          medida_tomada: string
          monitor_responsavel: string
        }
        Insert: {
          created_at?: string | null
          data_ocorrencia?: string
          descricao: string
          detalhes_medida?: string | null
          id?: string
          medida_tomada: string
          monitor_responsavel: string
        }
        Update: {
          created_at?: string | null
          data_ocorrencia?: string
          descricao?: string
          detalhes_medida?: string | null
          id?: string
          medida_tomada?: string
          monitor_responsavel?: string
        }
        Relationships: []
      }
      ocorrencias_pacientes: {
        Row: {
          data_fim_advertencia: string | null
          data_inicio_advertencia: string | null
          dias_advertencia: number | null
          id: string
          notas_advertencia: string | null
          ocorrencia_id: string
          paciente_id: string
        }
        Insert: {
          data_fim_advertencia?: string | null
          data_inicio_advertencia?: string | null
          dias_advertencia?: number | null
          id?: string
          notas_advertencia?: string | null
          ocorrencia_id: string
          paciente_id: string
        }
        Update: {
          data_fim_advertencia?: string | null
          data_inicio_advertencia?: string | null
          dias_advertencia?: number | null
          id?: string
          notas_advertencia?: string | null
          ocorrencia_id?: string
          paciente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_pacientes_ocorrencia_id_fkey"
            columns: ["ocorrencia_id"]
            isOneToOne: false
            referencedRelation: "ocorrencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_pacientes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      paciente_login: {
        Row: {
          created_at: string | null
          id: string
          paciente_id: string | null
          senha: string
          status_login: string | null
          usuario: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          paciente_id?: string | null
          senha: string
          status_login?: string | null
          usuario: string
        }
        Update: {
          created_at?: string | null
          id?: string
          paciente_id?: string | null
          senha?: string
          status_login?: string | null
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "paciente_login_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          data_desativacao: string | null
          data_entrada: string | null
          hora_desativacao: string | null
          id: string
          motivo_desativacao: string | null
          nome: string | null
          observacoes_desativacao: string | null
          pix_vencimento_dia: number | null
          responsavel_cpf: string | null
          responsavel_desativacao: string | null
          responsavel_endereco: string | null
          responsavel_nome: string | null
          senha: string | null
          status: string | null
        }
        Insert: {
          data_desativacao?: string | null
          data_entrada?: string | null
          hora_desativacao?: string | null
          id?: string
          motivo_desativacao?: string | null
          nome?: string | null
          observacoes_desativacao?: string | null
          pix_vencimento_dia?: number | null
          responsavel_cpf?: string | null
          responsavel_desativacao?: string | null
          responsavel_endereco?: string | null
          responsavel_nome?: string | null
          senha?: string | null
          status?: string | null
        }
        Update: {
          data_desativacao?: string | null
          data_entrada?: string | null
          hora_desativacao?: string | null
          id?: string
          motivo_desativacao?: string | null
          nome?: string | null
          observacoes_desativacao?: string | null
          pix_vencimento_dia?: number | null
          responsavel_cpf?: string | null
          responsavel_desativacao?: string | null
          responsavel_endereco?: string | null
          responsavel_nome?: string | null
          senha?: string | null
          status?: string | null
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          comprovante_url: string | null
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          id: string
          metodo_pagamento: string
          notificacoes_enviadas: Json | null
          paciente_id: string | null
          responsavel_cpf: string | null
          responsavel_endereco: string | null
          responsavel_nome: string
          status: string
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          id?: string
          metodo_pagamento: string
          notificacoes_enviadas?: Json | null
          paciente_id?: string | null
          responsavel_cpf?: string | null
          responsavel_endereco?: string | null
          responsavel_nome: string
          status: string
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          id?: string
          metodo_pagamento?: string
          notificacoes_enviadas?: Json | null
          paciente_id?: string | null
          responsavel_cpf?: string | null
          responsavel_endereco?: string | null
          responsavel_nome?: string
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_messages: {
        Row: {
          answered_at: string | null
          created_at: string
          id: string
          is_answered: boolean | null
          is_read: boolean | null
          message: string
          patient_id: string
          response: string | null
        }
        Insert: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_read?: boolean | null
          message: string
          patient_id: string
          response?: string | null
        }
        Update: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_read?: boolean | null
          message?: string
          patient_id?: string
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_weight: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          patient_id: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_weight_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      presencas: {
        Row: {
          atividade_id: string
          created_at: string | null
          data: string
          id: string
          notas: string | null
          paciente_id: string | null
          presente: boolean | null
        }
        Insert: {
          atividade_id: string
          created_at?: string | null
          data: string
          id?: string
          notas?: string | null
          paciente_id?: string | null
          presente?: boolean | null
        }
        Update: {
          atividade_id?: string
          created_at?: string | null
          data?: string
          id?: string
          notas?: string | null
          paciente_id?: string | null
          presente?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "presencas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      progresso: {
        Row: {
          created_at: string
          data_conclusao: string | null
          data_inicio: string
          descricao: string | null
          etapa: string
          id: string
          ordem: number
          paciente_id: string
          status: string
        }
        Insert: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          descricao?: string | null
          etapa: string
          id?: string
          ordem: number
          paciente_id: string
          status: string
        }
        Update: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          descricao?: string | null
          etapa?: string
          id?: string
          ordem?: number
          paciente_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      resocialization_events: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          patient_id: string | null
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          patient_id?: string | null
          start_date: string
          status: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          patient_id?: string | null
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "resocialization_events_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      responsaveis: {
        Row: {
          cpf: string | null
          created_at: string | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_estado: string | null
          endereco_rua: string | null
          id: string
          nome_completo: string
          paciente_id: string | null
          relacionamento: string | null
          rg: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_estado?: string | null
          endereco_rua?: string | null
          id?: string
          nome_completo: string
          paciente_id?: string | null
          relacionamento?: string | null
          rg?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_estado?: string | null
          endereco_rua?: string | null
          id?: string
          nome_completo?: string
          paciente_id?: string | null
          relacionamento?: string | null
          rg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responsaveis_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      support_materials: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string
          file_type: string
          id: string
          is_public: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path: string
          file_type: string
          id?: string
          is_public?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string
          file_type?: string
          id?: string
          is_public?: boolean | null
          title?: string
        }
        Relationships: []
      }
      treatment_phases: {
        Row: {
          created_at: string | null
          current_phase: boolean | null
          end_date: string | null
          id: string
          patient_id: string | null
          phase_name: string
          start_date: string
        }
        Insert: {
          created_at?: string | null
          current_phase?: boolean | null
          end_date?: string | null
          id?: string
          patient_id?: string | null
          phase_name: string
          start_date: string
        }
        Update: {
          created_at?: string | null
          current_phase?: boolean | null
          end_date?: string | null
          id?: string
          patient_id?: string | null
          phase_name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_phases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          patient_id: string | null
          role: string
          status: string | null
          type: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          patient_id?: string | null
          role?: string
          status?: string | null
          type?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          patient_id?: string | null
          role?: string
          status?: string | null
          type?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_images: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          image_path: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          image_path: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          image_path?: string
          title?: string
        }
        Relationships: []
      }
      visit_schedules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          visit_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          visit_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          visit_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      atualizar_status_pagamentos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      buscar_dados_sincronizados: {
        Args: { p_id: string }
        Returns: Json
      }
      criar_funcao_buscar_dados_sincronizados: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      criar_funcao_salvar_dados_sincronizados: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      criar_tabela_dados_sincronizados: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      criar_tabela_dados_sincronizados_se_nao_existir: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      gerar_parcelas_paciente: {
        Args: {
          p_paciente_id: string
          p_responsavel_nome: string
          p_responsavel_cpf: string
          p_responsavel_endereco: string
          p_metodo_pagamento: string
          p_data_inicio: string
          p_valor: number
        }
        Returns: string[]
      }
      get_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
        }[]
      }
      salvar_dados_sincronizados: {
        Args: { p_id: string; p_dados: string; p_ultima_atualizacao: string }
        Returns: boolean
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
