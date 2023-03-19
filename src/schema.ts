export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      billing: {
        Row: {
          id: string
          stripe_customer_id: string | null
          subcription_end_date: string | null
          subscribed: boolean
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
          subcription_end_date?: string | null
          subscribed?: boolean
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
          subcription_end_date?: string | null
          subscribed?: boolean
        }
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          text: string
          thread_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          text: string
          thread_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          text?: string
          thread_id?: string
          user_id?: string | null
        }
      }
      threads: {
        Row: {
          admin_auth_id: string
          created_at: string | null
          id: string
          prompter_link: string | null
          title: string
          updated_at: string
          viewer_link: string | null
        }
        Insert: {
          admin_auth_id: string
          created_at?: string | null
          id?: string
          prompter_link?: string | null
          title: string
          updated_at?: string
          viewer_link?: string | null
        }
        Update: {
          admin_auth_id?: string
          created_at?: string | null
          id?: string
          prompter_link?: string | null
          title?: string
          updated_at?: string
          viewer_link?: string | null
        }
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
