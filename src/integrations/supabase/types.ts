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
      activities: {
        Row: {
          activity_date: string
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          activity_date: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          activity_date?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      activity_attendance: {
        Row: {
          activity_id: string
          attended: boolean
          created_at: string
          id: string
          notes: string | null
          patient_id: string
        }
        Insert: {
          activity_id: string
          attended?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
        }
        Update: {
          activity_id?: string
          attended?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_attendance_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_attendance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          call_date: string
          call_duration: number
          call_time: string
          caller_name: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
        }
        Insert: {
          call_date: string
          call_duration: number
          call_time: string
          caller_name: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
        }
        Update: {
          call_date?: string
          call_duration?: number
          call_time?: string
          caller_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      family_visits: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string | null
          relationship: string | null
          status: string | null
          visit_date: string
          visit_time_end: string | null
          visit_time_start: string | null
          visitor_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          relationship?: string | null
          status?: string | null
          visit_date: string
          visit_time_end?: string | null
          visit_time_start?: string | null
          visitor_name: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          relationship?: string | null
          status?: string | null
          visit_date?: string
          visit_time_end?: string | null
          visit_time_start?: string | null
          visitor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      gas_containers: {
        Row: {
          created_at: string
          days_in_use: number
          days_remaining: number
          id: string
          in_use_start_date: string | null
          last_refill_date: string
          name: string
          refill_time: string
          responsible: string
          status: string
        }
        Insert: {
          created_at?: string
          days_in_use?: number
          days_remaining?: number
          id?: string
          in_use_start_date?: string | null
          last_refill_date: string
          name: string
          refill_time: string
          responsible: string
          status: string
        }
        Update: {
          created_at?: string
          days_in_use?: number
          days_remaining?: number
          id?: string
          in_use_start_date?: string | null
          last_refill_date?: string
          name?: string
          refill_time?: string
          responsible?: string
          status?: string
        }
        Relationships: []
      }
      gas_refill_records: {
        Row: {
          container_id: string
          container_name: string
          created_at: string
          date: string
          id: string
          notes: string | null
          responsible: string
          time: string
        }
        Insert: {
          container_id: string
          container_name: string
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          responsible: string
          time: string
        }
        Update: {
          container_id?: string
          container_name?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          responsible?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "gas_refill_records_container_id_fkey"
            columns: ["container_id"]
            isOneToOne: false
            referencedRelation: "gas_containers"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_administration_logs: {
        Row: {
          administered_at: string
          administered_by: string
          created_at: string
          id: string
          notes: string | null
          patient_medication_id: string
        }
        Insert: {
          administered_at?: string
          administered_by: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_medication_id: string
        }
        Update: {
          administered_at?: string
          administered_by?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_medication_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_administration_logs_patient_medication_id_fkey"
            columns: ["patient_medication_id"]
            isOneToOne: false
            referencedRelation: "patient_medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          description: string | null
          expiration_date: string | null
          id: string
          name: string
          quantity: number
          storage_location: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          name: string
          quantity?: number
          storage_location?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          name?: string
          quantity?: number
          storage_location?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean
          read_at: string | null
          title: string
          type: string
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      occurrences: {
        Row: {
          created_at: string
          description: string | null
          disciplinary_days: string | null
          disciplinary_measure: string | null
          id: string
          measure_details: string | null
          monitor_name: string | null
          occurrence_date: string
          occurrence_time: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          disciplinary_days?: string | null
          disciplinary_measure?: string | null
          id?: string
          measure_details?: string | null
          monitor_name?: string | null
          occurrence_date?: string
          occurrence_time?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          disciplinary_days?: string | null
          disciplinary_measure?: string | null
          id?: string
          measure_details?: string | null
          monitor_name?: string | null
          occurrence_date?: string
          occurrence_time?: string | null
          title?: string
        }
        Relationships: []
      }
      patient_contracts: {
        Row: {
          contract_url: string
          created_at: string | null
          id: string
          patient_id: string | null
          updated_at: string | null
        }
        Insert: {
          contract_url: string
          created_at?: string | null
          id?: string
          patient_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_url?: string
          created_at?: string | null
          id?: string
          patient_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_contracts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_details: {
        Row: {
          admission_date: string | null
          attendance_percentage: number | null
          chronic_disease_details: string | null
          conclusion_date: string | null
          cpf: string | null
          created_at: string | null
          emergency_contact1: string | null
          emergency_contact2: string | null
          father_name: string | null
          has_chronic_disease: boolean | null
          has_health_plan: boolean | null
          has_legal_problems: boolean | null
          has_pain: boolean | null
          has_seizures: boolean | null
          health_plan_details: string | null
          id: string
          is_pcd: boolean | null
          is_recurrent: boolean | null
          medication_details: string | null
          mother_name: string | null
          other_substances: string | null
          pain_details: string | null
          patient_id: string
          pcd_details: string | null
          profile_image: string | null
          registration_number: string | null
          rg: string | null
          seizure_details: string | null
          signing_date: string | null
          substances: string[] | null
          takes_medication: boolean | null
          treatment_phase: string | null
          vacancy_type: string | null
        }
        Insert: {
          admission_date?: string | null
          attendance_percentage?: number | null
          chronic_disease_details?: string | null
          conclusion_date?: string | null
          cpf?: string | null
          created_at?: string | null
          emergency_contact1?: string | null
          emergency_contact2?: string | null
          father_name?: string | null
          has_chronic_disease?: boolean | null
          has_health_plan?: boolean | null
          has_legal_problems?: boolean | null
          has_pain?: boolean | null
          has_seizures?: boolean | null
          health_plan_details?: string | null
          id?: string
          is_pcd?: boolean | null
          is_recurrent?: boolean | null
          medication_details?: string | null
          mother_name?: string | null
          other_substances?: string | null
          pain_details?: string | null
          patient_id: string
          pcd_details?: string | null
          profile_image?: string | null
          registration_number?: string | null
          rg?: string | null
          seizure_details?: string | null
          signing_date?: string | null
          substances?: string[] | null
          takes_medication?: boolean | null
          treatment_phase?: string | null
          vacancy_type?: string | null
        }
        Update: {
          admission_date?: string | null
          attendance_percentage?: number | null
          chronic_disease_details?: string | null
          conclusion_date?: string | null
          cpf?: string | null
          created_at?: string | null
          emergency_contact1?: string | null
          emergency_contact2?: string | null
          father_name?: string | null
          has_chronic_disease?: boolean | null
          has_health_plan?: boolean | null
          has_legal_problems?: boolean | null
          has_pain?: boolean | null
          has_seizures?: boolean | null
          health_plan_details?: string | null
          id?: string
          is_pcd?: boolean | null
          is_recurrent?: boolean | null
          medication_details?: string | null
          mother_name?: string | null
          other_substances?: string | null
          pain_details?: string | null
          patient_id?: string
          pcd_details?: string | null
          profile_image?: string | null
          registration_number?: string | null
          rg?: string | null
          seizure_details?: string | null
          signing_date?: string | null
          substances?: string[] | null
          takes_medication?: boolean | null
          treatment_phase?: string | null
          vacancy_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_details_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_financial: {
        Row: {
          created_at: string | null
          id: string
          late_fee_amount: number | null
          monthly_fee: number | null
          patient_id: string
          payment_day: number | null
          payment_method: string | null
          payment_responsible: string | null
          send_payment_reminders: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          late_fee_amount?: number | null
          monthly_fee?: number | null
          patient_id: string
          payment_day?: number | null
          payment_method?: string | null
          payment_responsible?: string | null
          send_payment_reminders?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          late_fee_amount?: number | null
          monthly_fee?: number | null
          patient_id?: string
          payment_day?: number | null
          payment_method?: string | null
          payment_responsible?: string | null
          send_payment_reminders?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_financial_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_medications: {
        Row: {
          administration_times: string[]
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          image_url: string | null
          medication_id: string
          notes: string | null
          patient_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          administration_times: string[]
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          image_url?: string | null
          medication_id: string
          notes?: string | null
          patient_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          administration_times?: string[]
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          medication_id?: string
          notes?: string | null
          patient_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_medications_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_occurrences: {
        Row: {
          created_at: string
          id: string
          occurrence_id: string
          patient_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          occurrence_id: string
          patient_id: string
        }
        Update: {
          created_at?: string
          id?: string
          occurrence_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_occurrences_occurrence_id_fkey"
            columns: ["occurrence_id"]
            isOneToOne: false
            referencedRelation: "occurrences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_occurrences_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_responsibles: {
        Row: {
          address: string | null
          cpf: string | null
          created_at: string | null
          id: string
          kinship: string | null
          name: string
          patient_id: string
          rg: string | null
        }
        Insert: {
          address?: string | null
          cpf?: string | null
          created_at?: string | null
          id?: string
          kinship?: string | null
          name: string
          patient_id: string
          rg?: string | null
        }
        Update: {
          address?: string | null
          cpf?: string | null
          created_at?: string | null
          id?: string
          kinship?: string | null
          name?: string
          patient_id?: string
          rg?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_responsibles_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_therapeutic_messages: {
        Row: {
          created_at: string | null
          id: string
          material_id: string | null
          message: string
          patient_id: string
          read_at: string | null
          responded: boolean | null
          response: string | null
          response_at: string | null
          response_by: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          material_id?: string | null
          message: string
          patient_id: string
          read_at?: string | null
          responded?: boolean | null
          response?: string | null
          response_at?: string | null
          response_by?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          id?: string
          material_id?: string | null
          message?: string
          patient_id?: string
          read_at?: string | null
          responded?: boolean | null
          response?: string | null
          response_at?: string | null
          response_by?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_therapeutic_messages_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "therapeutic_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_therapeutic_messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_weight_records: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          recorded_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          recorded_at?: string
          weight: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          recorded_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_weight_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          active: boolean | null
          address: string | null
          birth_date: string | null
          created_at: string
          deactivation_date: string | null
          deactivation_reason: string | null
          deactivation_responsible: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          password: string
          phone: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          birth_date?: string | null
          created_at?: string
          deactivation_date?: string | null
          deactivation_reason?: string | null
          deactivation_responsible?: string | null
          email: string
          id?: string
          last_login?: string | null
          name: string
          password: string
          phone?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          birth_date?: string | null
          created_at?: string
          deactivation_date?: string | null
          deactivation_reason?: string | null
          deactivation_responsible?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          password?: string
          phone?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          notification_history: Json | null
          patient_id: string
          payment_date: string
          payment_type: string
          receipt_url: string | null
          status: string
          total_with_fees: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          notification_history?: Json | null
          patient_id: string
          payment_date: string
          payment_type: string
          receipt_url?: string | null
          status?: string
          total_with_fees?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          notification_history?: Json | null
          patient_id?: string
          payment_date?: string
          payment_type?: string
          receipt_url?: string | null
          status?: string
          total_with_fees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      resocializations: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          patient_id: string
          start_date: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          patient_id: string
          start_date: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          patient_id?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "resocializations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      support_materials: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      therapeutic_materials: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      therapeutic_team: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          password: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          name: string
          password: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          password?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          last_activity: string
          user_id: string
          user_name: string
          user_type: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          last_activity?: string
          user_id: string
          user_name: string
          user_type: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          last_activity?: string
          user_id?: string
          user_name?: string
          user_type?: string
        }
        Relationships: []
      }
      user_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          type?: string
        }
        Relationships: []
      }
      visit_announcements: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_patient_details: {
        Args: {
          p_patient_id: string
          p_registration_number: string
          p_admission_date: string
          p_conclusion_date: string
          p_vacancy_type: string
          p_is_recurrent: boolean
          p_rg: string
          p_cpf: string
          p_father_name: string
          p_mother_name: string
          p_emergency_contact1: string
          p_emergency_contact2: string
          p_profile_image: string
          p_has_legal_problems: boolean
          p_signing_date: string
          p_has_chronic_disease: boolean
          p_chronic_disease_details: string
          p_takes_medication: boolean
          p_medication_details: string
          p_is_pcd: boolean
          p_pcd_details: string
          p_has_pain: boolean
          p_pain_details: string
          p_has_seizures: boolean
          p_seizure_details: string
          p_substances: string[]
          p_other_substances: string
          p_has_health_plan: boolean
          p_health_plan_details: string
        }
        Returns: undefined
      }
      insert_patient_financial: {
        Args: {
          p_patient_id: string
          p_monthly_fee: number
          p_payment_responsible: string
          p_payment_method: string
          p_payment_day: number
          p_send_payment_reminders: boolean
        }
        Returns: undefined
      }
      insert_patient_responsible: {
        Args: {
          p_patient_id: string
          p_name: string
          p_kinship: string
          p_rg: string
          p_cpf: string
          p_address: string
        }
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
