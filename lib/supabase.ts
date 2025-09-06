import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nqatzqopczulipwhlsed.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface AttendanceConfirmation {
  id?: string
  full_name: string
  nickname?: string
  phone: string
  email: string
  attendance_time: string
  created_at?: string
  updated_at?: string
}
