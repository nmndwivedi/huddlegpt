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
          created_at: string
          id: string
          parent_id: string | null
          sender_auth_id: string | null
          text: string
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id?: string | null
          sender_auth_id?: string | null
          text: string
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string | null
          sender_auth_id?: string | null
          text?: string
          thread_id?: string
        }
      }
      metadata: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
      }
      threads: {
        Row: {
          admin_auth_id: string
          created_at: string | null
          creativity: number
          id: string
          model: string
          prompter_link: string | null
          role: string
          title: string | null
          updated_at: string
          viewer_link: string | null
        }
        Insert: {
          admin_auth_id: string
          created_at?: string | null
          creativity?: number
          id?: string
          model?: string
          prompter_link?: string | null
          role?: string
          title?: string | null
          updated_at?: string
          viewer_link?: string | null
        }
        Update: {
          admin_auth_id?: string
          created_at?: string | null
          creativity?: number
          id?: string
          model?: string
          prompter_link?: string | null
          role?: string
          title?: string | null
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
