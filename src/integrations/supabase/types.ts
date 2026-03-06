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
          last_message_at: string | null
          session_id: string
          status: string
          subject: string | null
          type: string | null
          unread_count: number | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          session_id: string
          status?: string
          subject?: string | null
          type?: string | null
          unread_count?: number | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          last_message_at?: string | null
          session_id?: string
          status?: string
          subject?: string | null
          type?: string | null
          unread_count?: number | null
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
          read_at: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
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
      customer_notifications: {
        Row: {
          body: string
          created_at: string | null
          customer_id: string
          data: Json | null
          id: string
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          body: string
          created_at?: string | null
          customer_id: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          body?: string
          created_at?: string | null
          customer_id?: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notifications_customer_id_fkey"
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
          email_notifications_enabled: boolean | null
          id: string
          notification_preferences: Json | null
          phone: string | null
          push_notifications_enabled: boolean | null
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
          email_notifications_enabled?: boolean | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          push_notifications_enabled?: boolean | null
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
          email_notifications_enabled?: boolean | null
          id?: string
          notification_preferences?: Json | null
          phone?: string | null
          push_notifications_enabled?: boolean | null
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
      customer_saved_equipment: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          inventory_id: string | null
          notes: string | null
          product_data: Json | null
          product_name: string
          shopify_product_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          inventory_id?: string | null
          notes?: string | null
          product_data?: Json | null
          product_name: string
          shopify_product_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          inventory_id?: string | null
          notes?: string | null
          product_data?: Json | null
          product_name?: string
          shopify_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_saved_equipment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_saved_equipment_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          email_opt_in: boolean | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          sms_opt_in: boolean | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          email_opt_in?: boolean | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          email_opt_in?: boolean | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          sms_opt_in?: boolean | null
          updated_at?: string | null
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
          quote_id: string | null
          recipient: string
          timecard_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_id: string
          event_type: string
          id?: string
          payload?: Json | null
          quote_id?: string | null
          recipient: string
          timecard_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          quote_id?: string | null
          recipient?: string
          timecard_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_delivery_events_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_delivery_events_timecard_id_fkey"
            columns: ["timecard_id"]
            isOneToOne: false
            referencedRelation: "contractor_timecards"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          clicked_at: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          opened_at: string | null
          recipient: string
          resend_email_id: string | null
          sell_request_id: string | null
          status: string | null
          subject: string | null
          template_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          opened_at?: string | null
          recipient: string
          resend_email_id?: string | null
          sell_request_id?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          opened_at?: string | null
          recipient?: string
          resend_email_id?: string | null
          sell_request_id?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_sell_request_id_fkey"
            columns: ["sell_request_id"]
            isOneToOne: false
            referencedRelation: "equipment_sell_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_enrollments: {
        Row: {
          completed_at: string | null
          current_step: number | null
          id: string
          lead_id: string | null
          next_email_at: string | null
          sequence_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          lead_id?: string | null
          next_email_at?: string | null
          sequence_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          lead_id?: string | null
          next_email_at?: string | null
          sequence_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_enrollments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_steps: {
        Row: {
          condition_type: string | null
          created_at: string | null
          delay_days: number | null
          delay_hours: number | null
          id: string
          is_active: boolean | null
          sequence_id: string | null
          step_order: number
          template_id: string | null
        }
        Insert: {
          condition_type?: string | null
          created_at?: string | null
          delay_days?: number | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          sequence_id?: string | null
          step_order: number
          template_id?: string | null
        }
        Update: {
          condition_type?: string | null
          created_at?: string | null
          delay_days?: number | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          sequence_id?: string | null
          step_order?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequence_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_config: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_config?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_config?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          category: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          total_clicked: number | null
          total_opened: number | null
          total_sent: number | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          total_clicked?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          total_clicked?: number | null
          total_opened?: number | null
          total_sent?: number | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      equipment_images: {
        Row: {
          caption: string | null
          created_at: string | null
          file_name: string | null
          file_url: string
          id: string
          image_type: string | null
          sell_request_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url: string
          id?: string
          image_type?: string | null
          sell_request_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          file_name?: string | null
          file_url?: string
          id?: string
          image_type?: string | null
          sell_request_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_images_sell_request_id_fkey"
            columns: ["sell_request_id"]
            isOneToOne: false
            referencedRelation: "equipment_sell_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_rentals: {
        Row: {
          created_at: string | null
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          daily_rate: number | null
          delivery_address: string | null
          delivery_notes: string | null
          deposit_amount: number | null
          end_date: string
          id: string
          inventory_id: string | null
          monthly_rate: number | null
          notes: string | null
          pickup_date: string | null
          pickup_reminder_sent: boolean | null
          return_date: string | null
          return_reminder_sent: boolean | null
          start_date: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
          weekly_rate: number | null
        }
        Insert: {
          created_at?: string | null
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          daily_rate?: number | null
          delivery_address?: string | null
          delivery_notes?: string | null
          deposit_amount?: number | null
          end_date: string
          id?: string
          inventory_id?: string | null
          monthly_rate?: number | null
          notes?: string | null
          pickup_date?: string | null
          pickup_reminder_sent?: boolean | null
          return_date?: string | null
          return_reminder_sent?: boolean | null
          start_date: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          weekly_rate?: number | null
        }
        Update: {
          created_at?: string | null
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          daily_rate?: number | null
          delivery_address?: string | null
          delivery_notes?: string | null
          deposit_amount?: number | null
          end_date?: string
          id?: string
          inventory_id?: string | null
          monthly_rate?: number | null
          notes?: string | null
          pickup_date?: string | null
          pickup_reminder_sent?: boolean | null
          return_date?: string | null
          return_reminder_sent?: boolean | null
          start_date?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          weekly_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_rentals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_rentals_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_sell_requests: {
        Row: {
          city: string | null
          company: string | null
          condition: string | null
          country: string | null
          created_at: string
          daily_scan_volume: string | null
          deal_priority: string | null
          desired_price: string | null
          email: string
          email_opt_in: boolean | null
          equipment_status: string | null
          equipment_type: string
          facility_type: string | null
          has_ct: boolean | null
          has_mri: boolean | null
          has_service_history: boolean | null
          id: string
          is_mobile: boolean | null
          location: string | null
          magnet_strength: string | null
          manufacturer: string | null
          message: string | null
          mobile_status: string | null
          mobile_units_count: number | null
          model: string | null
          name: string
          phone: string | null
          reason_for_selling: string | null
          seller_role: string | null
          sms_opt_in: boolean | null
          software_version: string | null
          state: string | null
          status: string | null
          systems_count: number | null
          systems_count_range: string | null
          systems_detail: Json | null
          timeline: string | null
          trailer_included: boolean | null
          year_installed: number | null
          year_manufactured: number | null
        }
        Insert: {
          city?: string | null
          company?: string | null
          condition?: string | null
          country?: string | null
          created_at?: string
          daily_scan_volume?: string | null
          deal_priority?: string | null
          desired_price?: string | null
          email: string
          email_opt_in?: boolean | null
          equipment_status?: string | null
          equipment_type: string
          facility_type?: string | null
          has_ct?: boolean | null
          has_mri?: boolean | null
          has_service_history?: boolean | null
          id?: string
          is_mobile?: boolean | null
          location?: string | null
          magnet_strength?: string | null
          manufacturer?: string | null
          message?: string | null
          mobile_status?: string | null
          mobile_units_count?: number | null
          model?: string | null
          name: string
          phone?: string | null
          reason_for_selling?: string | null
          seller_role?: string | null
          sms_opt_in?: boolean | null
          software_version?: string | null
          state?: string | null
          status?: string | null
          systems_count?: number | null
          systems_count_range?: string | null
          systems_detail?: Json | null
          timeline?: string | null
          trailer_included?: boolean | null
          year_installed?: number | null
          year_manufactured?: number | null
        }
        Update: {
          city?: string | null
          company?: string | null
          condition?: string | null
          country?: string | null
          created_at?: string
          daily_scan_volume?: string | null
          deal_priority?: string | null
          desired_price?: string | null
          email?: string
          email_opt_in?: boolean | null
          equipment_status?: string | null
          equipment_type?: string
          facility_type?: string | null
          has_ct?: boolean | null
          has_mri?: boolean | null
          has_service_history?: boolean | null
          id?: string
          is_mobile?: boolean | null
          location?: string | null
          magnet_strength?: string | null
          manufacturer?: string | null
          message?: string | null
          mobile_status?: string | null
          mobile_units_count?: number | null
          model?: string | null
          name?: string
          phone?: string | null
          reason_for_selling?: string | null
          seller_role?: string | null
          sms_opt_in?: boolean | null
          software_version?: string | null
          state?: string | null
          status?: string | null
          systems_count?: number | null
          systems_count_range?: string | null
          systems_detail?: Json | null
          timeline?: string | null
          trailer_included?: boolean | null
          year_installed?: number | null
          year_manufactured?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          availability_status: string | null
          avg_discount_percentage: number | null
          condition: string | null
          conversion_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          is_rental: boolean | null
          last_offer_at: string | null
          last_quote_at: string | null
          location: string | null
          magnet_type: string | null
          modality: string
          next_available_date: string | null
          notes: string | null
          oem: string
          open_offers_count: number | null
          open_quotes_count: number | null
          price: number | null
          product_name: string
          rental_daily_rate: number | null
          rental_monthly_rate: number | null
          rental_weekly_rate: number | null
          sales_strategy: string | null
          serial_number: string | null
          software_version: string | null
          total_offers_count: number | null
          total_quotes_count: number | null
          updated_at: string | null
          warehouse_location: string | null
          year_manufactured: number | null
        }
        Insert: {
          availability_status?: string | null
          avg_discount_percentage?: number | null
          condition?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_rental?: boolean | null
          last_offer_at?: string | null
          last_quote_at?: string | null
          location?: string | null
          magnet_type?: string | null
          modality: string
          next_available_date?: string | null
          notes?: string | null
          oem: string
          open_offers_count?: number | null
          open_quotes_count?: number | null
          price?: number | null
          product_name: string
          rental_daily_rate?: number | null
          rental_monthly_rate?: number | null
          rental_weekly_rate?: number | null
          sales_strategy?: string | null
          serial_number?: string | null
          software_version?: string | null
          total_offers_count?: number | null
          total_quotes_count?: number | null
          updated_at?: string | null
          warehouse_location?: string | null
          year_manufactured?: number | null
        }
        Update: {
          availability_status?: string | null
          avg_discount_percentage?: number | null
          condition?: string | null
          conversion_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_rental?: boolean | null
          last_offer_at?: string | null
          last_quote_at?: string | null
          location?: string | null
          magnet_type?: string | null
          modality?: string
          next_available_date?: string | null
          notes?: string | null
          oem?: string
          open_offers_count?: number | null
          open_quotes_count?: number | null
          price?: number | null
          product_name?: string
          rental_daily_rate?: number | null
          rental_monthly_rate?: number | null
          rental_weekly_rate?: number | null
          sales_strategy?: string | null
          serial_number?: string | null
          software_version?: string | null
          total_offers_count?: number | null
          total_quotes_count?: number | null
          updated_at?: string | null
          warehouse_location?: string | null
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
          email_opt_in: boolean | null
          id: string
          interest: string
          is_hot: boolean
          lead_score: number
          message: string | null
          name: string
          phone: string | null
          sms_opt_in: boolean | null
          source_page: string
          status: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          email_opt_in?: boolean | null
          id?: string
          interest: string
          is_hot?: boolean
          lead_score?: number
          message?: string | null
          name: string
          phone?: string | null
          sms_opt_in?: boolean | null
          source_page: string
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          email_opt_in?: boolean | null
          id?: string
          interest?: string
          is_hot?: boolean
          lead_score?: number
          message?: string | null
          name?: string
          phone?: string | null
          sms_opt_in?: boolean | null
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
      pricing_rules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          modality: string | null
          rule_type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          modality?: string | null
          rule_type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          modality?: string | null
          rule_type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      product_offers: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          competitor_info: string | null
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          expires_at: string | null
          follow_up_count: number | null
          follow_up_sent_at: string | null
          id: string
          inventory_id: string | null
          list_price: number | null
          margin_percentage: number | null
          offer_amount: number
          offer_type: string | null
          purchase_completed: boolean | null
          reason: string | null
          requires_approval: boolean | null
          status: string | null
          target_price: number | null
          updated_at: string | null
          validity_days: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          competitor_info?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_email?: string | null
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          expires_at?: string | null
          follow_up_count?: number | null
          follow_up_sent_at?: string | null
          id?: string
          inventory_id?: string | null
          list_price?: number | null
          margin_percentage?: number | null
          offer_amount: number
          offer_type?: string | null
          purchase_completed?: boolean | null
          reason?: string | null
          requires_approval?: boolean | null
          status?: string | null
          target_price?: number | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          competitor_info?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_email?: string | null
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          expires_at?: string | null
          follow_up_count?: number | null
          follow_up_sent_at?: string | null
          id?: string
          inventory_id?: string | null
          list_price?: number | null
          margin_percentage?: number | null
          offer_amount?: number
          offer_type?: string | null
          purchase_completed?: boolean | null
          reason?: string | null
          requires_approval?: boolean | null
          status?: string | null
          target_price?: number | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_offers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_offers_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
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
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          discount: number | null
          id: string
          items: Json | null
          lead_id: string | null
          notes: string | null
          quote_number: string
          rejected_at: string | null
          rejection_reason: string | null
          resend_email_id: string | null
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
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          discount?: number | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          notes?: string | null
          quote_number: string
          rejected_at?: string | null
          rejection_reason?: string | null
          resend_email_id?: string | null
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
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount?: number | null
          id?: string
          items?: Json | null
          lead_id?: string | null
          notes?: string | null
          quote_number?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          resend_email_id?: string | null
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
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
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
      site_visits: {
        Row: {
          assigned_to: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          lead_id: string | null
          location_address: string | null
          location_notes: string | null
          notes: string | null
          scheduled_date: string
          scheduled_time: string | null
          sell_request_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          lead_id?: string | null
          location_address?: string | null
          location_notes?: string | null
          notes?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          sell_request_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          lead_id?: string | null
          location_address?: string | null
          location_notes?: string | null
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          sell_request_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_visits_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "site_visits_sell_request_id_fkey"
            columns: ["sell_request_id"]
            isOneToOne: false
            referencedRelation: "equipment_sell_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      timecard_audit_log: {
        Row: {
          action: string
          edit_reason: string | null
          id: string
          new_value: string | null
          old_value: string | null
          performed_at: string
          timecard_entry_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          edit_reason?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          performed_at?: string
          timecard_entry_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          edit_reason?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          performed_at?: string
          timecard_entry_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecard_audit_log_timecard_entry_id_fkey"
            columns: ["timecard_entry_id"]
            isOneToOne: false
            referencedRelation: "timecard_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      timecard_breaks: {
        Row: {
          break_end: string | null
          break_start: string
          created_at: string
          entry_id: string
          id: string
          user_id: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string
          created_at?: string
          entry_id: string
          id?: string
          user_id: string
        }
        Update: {
          break_end?: string | null
          break_start?: string
          created_at?: string
          entry_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecard_breaks_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "timecard_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      timecard_entries: {
        Row: {
          break_minutes: number
          clock_in: string
          clock_out: string | null
          created_at: string
          entry_type: string
          id: string
          locked_by_admin: boolean
          notes: string | null
          unlocked_at: string | null
          user_id: string
          week_submitted: boolean
        }
        Insert: {
          break_minutes?: number
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          entry_type?: string
          id?: string
          locked_by_admin?: boolean
          notes?: string | null
          unlocked_at?: string | null
          user_id: string
          week_submitted?: boolean
        }
        Update: {
          break_minutes?: number
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          entry_type?: string
          id?: string
          locked_by_admin?: boolean
          notes?: string | null
          unlocked_at?: string | null
          user_id?: string
          week_submitted?: boolean
        }
        Relationships: []
      }
      timecard_weeks: {
        Row: {
          created_at: string
          id: string
          locked: boolean
          submitted: boolean
          submitted_at: string | null
          total_hours: number
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          locked?: boolean
          submitted?: boolean
          submitted_at?: string | null
          total_hours?: number
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          locked?: boolean
          submitted?: boolean
          submitted_at?: string | null
          total_hours?: number
          user_id?: string
          week_end?: string
          week_start?: string
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
