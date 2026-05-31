const supabaseUrl = 'https://xywrgfnktvesnmeeqlux.supabase.co'; // أضفت الرابط الكامل
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI';

// تعريف العميل وجعله متاحاً عالمياً
window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
