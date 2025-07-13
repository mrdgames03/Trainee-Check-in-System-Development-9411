import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iwfdkrjcwfshmlgqjpbg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZmRrcmpjd2ZzaG1sZ3FqcGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTEzNTMsImV4cCI6MjA2Nzk4NzM1M30.k4zV1fAtlYFiMOvXdE7qqnuo8SXUj_xdEL_teO5qkiQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Updated table names for reference:
// trainees_mrd5x2
// checkins_mrd5x2
// flags_mrd5x2