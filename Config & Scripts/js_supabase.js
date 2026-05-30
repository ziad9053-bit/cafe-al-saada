// Config & Scripts/js_supabase.js

// 1. ضع روابطك ومفاتيحك هنا بدلاً من النصوص الموجودة:
const SUPABASE_URL = 'xywrgfnktvesnmeeqlux'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI';

// 2. تهيئة الاتصال (هذا السطر هو الذي يربط موقعك بقاعدة البيانات)
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. نجعل supabase متاحاً للاستخدام في أي ملف آخر
window.supabase = supabase;

console.log("تم الاتصال بقاعدة البيانات بنجاح!");
