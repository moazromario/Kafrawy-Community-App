import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qbplkookkahsbqoflafy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGxrb29ra2Foc2Jxb2ZsYWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NTQ3NjIsImV4cCI6MjA5MDIzMDc2Mn0.docRw9nhwMSfw7Ol4T06pQAsRahWbqXLECJ0Bv0Uemw';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase server-side environment variables. Server operations may fail.');
}

export const supabaseAdmin = createClient(supabaseUrl || '', supabaseKey || '');
