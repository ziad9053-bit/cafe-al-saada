// تهيئة اتصال Supabase
const supabaseUrl = 'https://xywrgfnktvesnmeeqlux.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3JnZm5rdHZlc25tZWVxbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzgyMTgsImV4cCI6MjA5NTY1NDIxOH0.mMWZsGlwDimcGoKA96F9nLuXJBE0k3UC9_JYbvqLisI'; 

function initSupabase() {
    // التأكد من أن supabase موجودة وأن لديها دالة createClient
    // ملاحظة: عند استخدام CDN، غالباً ما تكون المكتبة موجودة في الكائن 'supabase'
    if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
        window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
        console.log("✅ تم تهيئة Supabase بنجاح");
        window.dispatchEvent(new CustomEvent('supabaseReady'));
    } 
    // محاولة الوصول إليها عبر النافذة في حال تم تحميلها كـ global
    else if (window.supabase && typeof window.supabase.createClient === 'function') {
        window.supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log("✅ تم تهيئة Supabase بنجاح (الطريقة البديلة)");
        window.dispatchEvent(new CustomEvent('supabaseReady'));
    } 
    else {
        console.warn("⚠️ مكتبة Supabase غير موجودة أو لم يتم تحميلها بشكل صحيح. تأكد من وضع سكريبت المكتبة قبل هذا الملف.");
    }
}

// تشغيل التهيئة
if (document.readyState === 'complete') {
    initSupabase();
} else {
    window.addEventListener('load', initSupabase);
}
