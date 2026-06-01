// تهيئة اتصال Supabase
const supabaseUrl = 'https://xywrgfnktvesnmeeqlux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI'; 

// دالة لتهيئة العميل ونشر حدث الجاهزية
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        console.log("✅ تم تهيئة Supabase بنجاح");
        // إرسال إشارة لباقي الملفات أن الاتصال أصبح جاهزاً
        window.dispatchEvent(new CustomEvent('supabaseReady'));
    } else {
        console.warn("⚠️ مكتبة Supabase غير موجودة، تأكد من استدعاء مكتبة supabase-js في HTML");
    }
}

// محاولة التهيئة فوراً
if (typeof supabase !== 'undefined') {
    initSupabase();
} else {
    // الانتظار حتى تحميل كامل الصفحة ثم المحاولة
    window.addEventListener('load', initSupabase);
}
