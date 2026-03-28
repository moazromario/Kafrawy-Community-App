import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qbplkookkahsbqoflafy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFicGxrb29ra2Foc2Jxb2ZsYWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NTQ3NjIsImV4cCI6MjA5MDIzMDc2Mn0.docRw9nhwMSfw7Ol4T06pQAsRahWbqXLECJ0Bv0Uemw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Global connection status
export const supabaseConnection = {
  isOffline: false,
  url: supabaseUrl
};

// Test connection
if (supabaseUrl && supabaseAnonKey) {
  fetch(`${supabaseUrl}/rest/v1/`, { 
    method: 'HEAD',
    headers: {
      'apikey': supabaseAnonKey
    }
  })
    .catch(() => {
      console.error(`Failed to connect to Supabase at ${supabaseUrl}. The project might be paused, deleted, or the URL is incorrect.`);
      supabaseConnection.isOffline = true;
      // Dispatch a custom event so the UI can react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('supabase-offline'));
      }
    });
}
