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
          business_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          practitioner_id: string
          service_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id: string
          practitioner_id: string
          service_id: string
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string
          practitioner_id?: string
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
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
      patients: {
        Row: {
          allergies: string | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          id: string
          medical_history: string | null
          notes: string | null
          preferred_practitioner_id: string | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          id: string
          medical_history?: string | null
          notes?: string | null
          preferred_practitioner_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          id?: string
          medical_history?: string | null
          notes?: string | null
          preferred_practitioner_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_preferred_practitioner_id_fkey"
            columns: ["preferred_practitioner_id"]
            isOneToOne: false
            referencedRelation: "practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      practitioners: {
        Row: {
          availability: Json | null
          bio: string | null
          business_id: string
          created_at: string | null
          id: string
          name: string
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          business_id: string
          created_at?: string | null
          id?: string
          name: string
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          business_id?: string
          created_at?: string | null
          id?: string
          name?: string
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practitioners_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          business_id: string
          created_at: string | null
          customer_name: string
          date: string
          id: string
          notes: string | null
          party_size: number
          table_id: string
          time: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_name: string
          date: string
          id?: string
          notes?: string | null
          party_size: number
          table_id: string
          time: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_name?: string
          date?: string
          id?: string
          notes?: string | null
          party_size?: number
          table_id?: string
          time?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          duration: number
          id: string
          name: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          duration: number
          id?: string
          name: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          id?: string
          name?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          active: boolean | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          id: string
          payment_method: Json | null
          plan_id: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          payment_method?: Json | null
          plan_id: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          payment_method?: Json | null
          plan_id?: string
          user_id?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          business_id: string
          capacity: number
          height: number
          id: string
          number: number
          rotation: number | null
          shape: string | null
          status: string | null
          width: number
          x: number
          y: number
        }
        Insert: {
          business_id: string
          capacity: number
          height?: number
          id?: string
          number: number
          rotation?: number | null
          shape?: string | null
          status?: string | null
          width?: number
          x?: number
          y?: number
        }
        Update: {
          business_id?: string
          capacity?: number
          height?: number
          id?: string
          number?: number
          rotation?: number | null
          shape?: string | null
          status?: string | null
          width?: number
          x?: number
          y?: number
        }
        Relationships: []
      }
      waitlist_entries: {
        Row: {
          created_at: string | null
          estimated_wait_time: number | null
          id: string
          notes: string | null
          position: number
          status: string
          updated_at: string | null
          user_id: string
          waitlist_id: string
        }
        Insert: {
          created_at?: string | null
          estimated_wait_time?: number | null
          id?: string
          notes?: string | null
          position: number
          status?: string
          updated_at?: string | null
          user_id: string
          waitlist_id: string
        }
        Update: {
          created_at?: string | null
          estimated_wait_time?: number | null
          id?: string
          notes?: string | null
          position?: number
          status?: string
          updated_at?: string | null
          user_id?: string
          waitlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_entries_waitlist_id_fkey"
            columns: ["waitlist_id"]
            isOneToOne: false
            referencedRelation: "waitlists"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlists: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          max_capacity: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_capacity?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlists_business_id_fkey"
            columns: ["business_id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
