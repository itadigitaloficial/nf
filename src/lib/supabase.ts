import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://knvgprwdfizvelroztkf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudmdwcndkZml6dmVscm96dGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0Mzg5ODUsImV4cCI6MjA1MDAxNDk4NX0.qSxqX86qL3DROdhdfPhehkWQfBK_NYa-MdIw22iSonU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
