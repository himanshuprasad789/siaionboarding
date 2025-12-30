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
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_opportunities: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          opportunity_id: string
          priority: number | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id: string
          priority?: number | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id?: string
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          assigned_team_id: string | null
          created_at: string
          current_employer: string | null
          current_title: string | null
          field_of_expertise: string | null
          id: string
          last_active_at: string | null
          niche: string | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          status: string | null
          target_visa_type: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          assigned_team_id?: string | null
          created_at?: string
          current_employer?: string | null
          current_title?: string | null
          field_of_expertise?: string | null
          id?: string
          last_active_at?: string | null
          niche?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          status?: string | null
          target_visa_type?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          assigned_team_id?: string | null
          created_at?: string
          current_employer?: string | null
          current_title?: string | null
          field_of_expertise?: string | null
          id?: string
          last_active_at?: string | null
          niche?: string | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          status?: string | null
          target_visa_type?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_assigned_team_id_fkey"
            columns: ["assigned_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      client_workflows: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          current_stage_id: string | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at: string
          workflow_id: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          current_stage_id?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at?: string
          workflow_id: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          current_stage_id?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_workflows_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_workflows_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_workflows_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_items: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          file_path: string | null
          id: string
          metadata: Json | null
          opportunity_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["evidence_status"]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          file_path?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          file_path?: string | null
          id?: string
          metadata?: Json | null
          opportunity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_items_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_items_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: number | null
          estimated_time_weeks: number | null
          evidence_types: string[] | null
          id: string
          requirements: Json | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_time_weeks?: number | null
          evidence_types?: string[] | null
          id?: string
          requirements?: Json | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: number | null
          estimated_time_weeks?: number | null
          evidence_types?: string[] | null
          id?: string
          requirements?: Json | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          team_id: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          team_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          team_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_workflow_access: {
        Row: {
          created_at: string
          id: string
          team_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          team_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          team_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_workflow_access_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_workflow_access_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_internal: boolean | null
          ticket_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_internal?: boolean | null
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_field_values: {
        Row: {
          created_at: string
          field_id: string
          id: string
          ticket_id: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          field_id: string
          id?: string
          ticket_id: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          field_id?: string
          id?: string
          ticket_id?: string
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ticket_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "workflow_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_field_values_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          client_id: string
          created_at: string
          created_by: string | null
          current_stage_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          related_evidence_id: string | null
          related_workflow_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          client_id: string
          created_at?: string
          created_by?: string | null
          current_stage_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          related_evidence_id?: string | null
          related_workflow_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          current_stage_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          related_evidence_id?: string | null
          related_workflow_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_current_stage_id_fkey"
            columns: ["current_stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_related_evidence_id_fkey"
            columns: ["related_evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_related_workflow_id_fkey"
            columns: ["related_workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
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
      workflow_fields: {
        Row: {
          created_at: string
          default_value: Json | null
          description: string | null
          field_type: string
          id: string
          is_required: boolean | null
          label: string
          name: string
          options: Json | null
          order_index: number | null
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          field_type: string
          id?: string
          is_required?: boolean | null
          label: string
          name: string
          options?: Json | null
          order_index?: number | null
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          description?: string | null
          field_type?: string
          id?: string
          is_required?: boolean | null
          label?: string
          name?: string
          options?: Json | null
          order_index?: number | null
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_fields_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_permissions: {
        Row: {
          created_at: string
          id: string
          permission_level: Database["public"]["Enums"]["permission_level"]
          role: Database["public"]["Enums"]["app_role"]
          stage_id: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          role: Database["public"]["Enums"]["app_role"]
          stage_id: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_level?: Database["public"]["Enums"]["permission_level"]
          role?: Database["public"]["Enums"]["app_role"]
          stage_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_permissions_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_permissions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stage_progress: {
        Row: {
          assigned_to: string | null
          client_workflow_id: string
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          stage_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_workflow_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          stage_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_workflow_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          stage_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["workflow_stage_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stage_progress_client_workflow_id_fkey"
            columns: ["client_workflow_id"]
            isOneToOne: false
            referencedRelation: "client_workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_stage_progress_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          name: string
          order_index: number
          required_role: Database["public"]["Enums"]["app_role"] | null
          workflow_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          order_index: number
          required_role?: Database["public"]["Enums"]["app_role"] | null
          workflow_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          order_index?: number
          required_role?: Database["public"]["Enums"]["app_role"] | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          team: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          team: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_client_profile_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "client" | "press" | "research" | "paper" | "admin"
      evidence_status: "pending" | "approved" | "rejected" | "needs_revision"
      evidence_type:
        | "publication"
        | "citation"
        | "patent"
        | "award"
        | "grant"
        | "media_coverage"
        | "speaking_engagement"
        | "review_work"
        | "membership"
        | "leadership"
        | "salary_evidence"
        | "other"
      opportunity_status: "draft" | "review" | "published" | "archived"
      permission_level: "hidden" | "masked" | "read" | "edit"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "pending_review" | "closed"
      workflow_stage_status: "pending" | "in_progress" | "completed" | "blocked"
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
      app_role: ["client", "press", "research", "paper", "admin"],
      evidence_status: ["pending", "approved", "rejected", "needs_revision"],
      evidence_type: [
        "publication",
        "citation",
        "patent",
        "award",
        "grant",
        "media_coverage",
        "speaking_engagement",
        "review_work",
        "membership",
        "leadership",
        "salary_evidence",
        "other",
      ],
      opportunity_status: ["draft", "review", "published", "archived"],
      permission_level: ["hidden", "masked", "read", "edit"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "pending_review", "closed"],
      workflow_stage_status: ["pending", "in_progress", "completed", "blocked"],
    },
  },
} as const
