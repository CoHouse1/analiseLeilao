export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      app_config: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          free_credits: number
          paid_credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          free_credits?: number
          paid_credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          free_credits?: number
          paid_credits?: number
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          transaction_type: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          transaction_type: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          transaction_type?: string
          description?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: string
          payment_method: string | null
          payment_id: string | null
          credits_added: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          status: string
          payment_method?: string | null
          payment_id?: string | null
          credits_added: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: string
          payment_method?: string | null
          payment_id?: string | null
          credits_added?: number
          created_at?: string
          updated_at?: string
        }
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          title: string
          file_name: string
          tipo_imovel: string | null
          matricula: string | null
          estado: string | null
          cidade: string | null
          instrucoes: string | null
          credits_used: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_name: string
          tipo_imovel?: string | null
          matricula?: string | null
          estado?: string | null
          cidade?: string | null
          instrucoes?: string | null
          credits_used?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_name?: string
          tipo_imovel?: string | null
          matricula?: string | null
          estado?: string | null
          cidade?: string | null
          instrucoes?: string | null
          credits_used?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      analysis_results: {
        Row: {
          id: string
          analysis_id: string
          result_data: Json
          html_content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          analysis_id: string
          result_data: Json
          html_content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          analysis_id?: string
          result_data?: Json
          html_content?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type AppConfig = Database["public"]["Tables"]["app_config"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type UserCredits = Database["public"]["Tables"]["user_credits"]["Row"]
export type CreditTransaction = Database["public"]["Tables"]["credit_transactions"]["Row"]
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
export type Analysis = Database["public"]["Tables"]["analyses"]["Row"]
export type AnalysisResult = Database["public"]["Tables"]["analysis_results"]["Row"]
