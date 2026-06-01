// تهيئة اتصال Supabase
const supabaseUrl = 'https://xywrgfnktvesnmeeqlux.supabase.co';
// ملاحظة: استبدل هذا المفتاح بالمفتاح الجديد بعد إعادة توليده من لوحة تحكم Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI'; 

// التحقق من وجود المكتبة (استخدام try-catch للتعامل مع التأخير في التحميل)
try {
    if (typeof supabase !== 'undefined') {
        window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        console.log("✅ تم تهيئة Supabase بنجاح");
    } else {
        // إذا لم تُحمل المكتبة بعد، سننتظر تحميلها
        console.warn("⚠️ مكتبة Supabase لم تُحمل بعد، بانتظار تحميلها...");
        window.addEventListener('load', () => {
            if (typeof supabase !== 'undefined') {
                window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
                console.log("✅ تم تهيئة Supabase بنجاح بعد التحميل");
            }
        });
    }
} catch (error) {
    console.error("❌ حدث خطأ أثناء تهيئة Supabase:", error);
}
