// تهيئة اتصال Supabase
// تأكد من استبدال الروابط أدناه ببيانات مشروعك الحقيقية
const supabaseUrl = 'https://xywrgfnktvesnmeeqlux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI';

// التأكد من أن مكتبة supabase متاحة قبل التهيئة
if (typeof supabase !== 'undefined') {
    window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
    console.log("تم تهيئة Supabase بنجاح");
} else {
    console.error("مكتبة Supabase لم تُحمل! تأكد من استدعائها في الـ HTML أولاً.");
}
