import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bxuaqpguoaengzslkwfr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dWFxcGd1b2Flbmd6c2xrd2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjIxMjAsImV4cCI6MjA3Nzg5ODEyMH0.BM6iYcPQsDQkRKflfwddpXW9lwYcM4AHehh4AfNJwuQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
