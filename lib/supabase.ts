import { createClient } from '@supabase/supabase-js';

// Menggunakan kredensial yang diberikan oleh pengguna
const supabaseUrl = 'https://tiavnaiimrrpepvohtqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXZuYWlpbXJycGVwdm9odHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMTUyMzIsImV4cCI6MjA4Mjg5MTIzMn0._KS4KtRs6xeyix2VJXiiBuIf_HovYt69ykO0hD6sFYM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);