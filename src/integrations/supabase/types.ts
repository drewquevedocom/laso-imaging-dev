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
      activities: {
        Row: {
          activity_type: string
          content: string
          created_at: string | null
          created_by: string | null
          direction: string | null
          id: string
          lead_id: string
          metadata: Json | null
          subject: string | null
        }
        Insert: {
          activity_type: string
          content: string
          created_at?: string | null
          created_by?: string | null
          direction?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          subject?: string | null
        }
        Update: {
          activity_type?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          direction?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          subject?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
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
      chat_conversations: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string | null
          id: string
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          session_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_timecards: {
        Row: {
          created_at: string
          deductions: number
          email_sent_at: string | null
          expense_reimb: number
          id: string
          net_pay: number
          notes: string | null
          pay_period_end: string
          pay_period_start: string
          payee_email: string
          payee_name: string
          payment_date: string | null
          payment_method: string | null
          rate_per_hour: number
          resend_email_id: string | null
          send_to_email: string
          status: string
          time_entries: Json
          total_hours: number
          total_pay: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deductions?: number
          email_sent_at?: string | null
          expense_reimb?: number
          id?: string
          net_pay?: number
          notes?: string | null
          pay_period_end: string
          pay_period_start: string
          payee_email: string
          payee_name: string
          payment_date?: string | null
          payment_method?: string | null
          rate_per_hour?: number
          resend_email_id?: string | null
          send_to_email: string
          status?: string
          time_entries?: Json
          total_hours?: number
          total_pay?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deductions?: number
          email_sent_at?: string | null
          expense_reimb?: number
          id?: string
          net_pay?: number
          notes?: string | null
          pay_period_end?: string
          pay_period_start?: string
          payee_email?: string
          payee_name?: string
          payment_date?: string | null
          payment_method?: string | null
          rate_per_hour?: number
          resend_email_id?: string | null
          send_to_email?: string
          status?: string
          time_entries?: Json
          total_hours?: number
          total_pay?: number
          updated_at?: string
        }
        Relationships: []
      }
      customer_documents: {
        Row: {
          created_at: string
          customer_id: string
          document_type: string | null
          file_url: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          document_type?: string | null
          file_url: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          document_type?: string | null
          file_url?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          created_at: string
          customer_type: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          customer_type?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          customer_type?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip?: string | null
        }
        Relationships: []
      }
      customer_reviews: {
        Row: {
          approved: boolean
          company: string | null
          consent_given: boolean
          created_at: string
          email: string
          featured: boolean
          id: string
          name: string
          rating: number
          review_text: string
          service_used: string | null
          title: string | null
        }
        Insert: {
          approved?: boolean
          company?: string | null
          consent_given?: boolean
          created_at?: string
          email: string
          featured?: boolean
          id?: string
          name: string
          rating: number
          review_text: string
          service_used?: string | null
          title?: string | null
        }
        Update: {
          approved?: boolean
          company?: string | null
          consent_given?: boolean
          created_at?: string
          email?: string
          featured?: boolean
          id?: string
          name?: string
          rating?: number
          review_text?: string
          service_used?: string | null
          title?: string | null
        }
        Relationships: []
      }
      email_delivery_events: {
        Row: {
          created_at: string | null
          email_id: string
          event_type: string
          id: string
          payload: Json | null
          recipient: string
          timecard_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_id: string
          event_type: string
          id?: string
          payload?: Json | null
          recipient: string
          timecard_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          recipient?: string
          timecard_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_delivery_events_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "contractor_timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_sell_requests: {
        Row: {
          company: string | null
          condition: string | null
          created_at: string
          email: string
          equipment_type: string
          has_service_history: boolean | null
          id: string
          location: string | null
          manufacturer: string | null
          message: string | null
          model: string | null
          name: string
          phone: string | null
          reason_for_selling: string | null
          software_version: string | null
          status: string | null
          timeline: string | null
          year_manufactured: number | null
        }
        Insert: {
          company?: string | null
          condition?: string | null
          created_at?: string
          email: string
          equipment_type: string
          has_service_history?: boolean | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          message?: string | null
          model?: string | null
          name: string
          phone?: string | null
          reason_for_selling?: string | null
          software_version?: string | null
          status?: string | null
          timeline?: string | null
          year_manufactured?: number | null
        }
        Update: {
          company?: string | null
          condition?: string | null
          created_at?: string
          email?: string
          equipment_type?: string
          has_service_history?: boolean | null
          id?: string
          location?: string | null
          manufacturer?: string | null
          message?: string | null
          model?: string | null
          name?: string
          phone?: string | null
          reason_for_selling?: string | null
          software_version?: string | null
          status?: string | null
          timeline?: string | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      lead_scoring_rules: {
        Row: {
          condition_field: string
          condition_value: string
          created_at: string
          id: string
          is_active: boolean
          points: number
          rule_name: string
        }
        Insert: {
          condition_field: string
          condition_value: string
          created_at?: string
          id?: string
          is_active?: boolean
          points?: number
          rule_name: string
        }
        Update: {
          condition_field?: string
          condition_value?: string
          created_at?: string
          id?: string
          is_active?: boolean
          points?: number
          rule_name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          interest: string
          is_hot: boolean
          lead_score: number
          message: string | null
          name: string
          phone: string | null
          source_page: string
          status: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          interest: string
          is_hot?: boolean
          lead_score?: number
          message?: string | null
          name: string
          phone?: string | null
          source_page: string
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          interest?: string
          is_hot?: boolean
          lead_score?: number
          message?: string | null
          name?: string
          phone?: string | null
          source_page?: string
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          equipment_description: string | null
          estimated_delivery: string | null
          id: string
          installation_date: string | null
          notes: string | null
          order_number: string
          status: string
          total_amount: number | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          equipment_description?: string | null
          estimated_delivery?: string | null
          id?: string
          installation_date?: string | null
          notes?: string | null
          order_number: string
          status?: string
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          equipment_description?: string | null
          estimated_delivery?: string | null
          id?: string
          installation_date?: string | null
          notes?: string | null
          order_number?: string
          status?: string
          total_amount?: number | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_templates: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          items: Json
          name: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          items?: Json
          name: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          items?: Json
          name?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          acceptance_token: string | null
          accepted_at: string | null
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          items: Json | null
          lead_id: string | null
          notes: string | null
          quote_number: string
          rejected_at: string | null
          rejection_reason: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total_amount: number | null
          updated_at: string
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          acceptance_token?: string | null
          accepted_at?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          notes?: string | null
          quote_number: string
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          acceptance_token?: string | null
          accepted_at?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          notes?: string | null
          quote_number?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tickets: {
        Row: {
          assigned_technician: string | null
          created_at: string
          customer_id: string
          equipment_serial: string | null
          equipment_type: string | null
          id: string
          issue_description: string | null
          priority: string
          resolution_notes: string | null
          scheduled_date: string | null
          status: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_technician?: string | null
          created_at?: string
          customer_id: string
          equipment_serial?: string | null
          equipment_type?: string | null
          id?: string
          issue_description?: string | null
          priority?: string
          resolution_notes?: string | null
          scheduled_date?: string | null
          status?: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_technician?: string | null
          created_at?: string
          customer_id?: string
          equipment_serial?: string | null
          equipment_type?: string | null
          id?: string
          issue_description?: string | null
          priority?: string
          resolution_notes?: string | null
          scheduled_date?: string | null
          status?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      get_session_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer" | "reseller" | "engineer"
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
      app_role: ["admin", "customer", "reseller", "engineer"],
    },
  },
} as const
