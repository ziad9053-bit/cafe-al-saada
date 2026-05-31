// [تعديل هام]: استخدم window.supabase بدلاً من supabase
async function testConnection() {
    console.log("بدء الاتصال...");
    try {
        // نستخدم window.supabase لأننا عرفناه عالمياً في ملف الإعدادات
        const { data, error } = await window.supabase.from('items').select('*');
        
        if (error) {
            console.error("خطأ من Supabase:", error);
        } else {
            console.log("تم جلب الأصناف بنجاح:", data);
        }
    } catch (e) {
        console.error("خطأ في الكود:", e);
    }
}

// تشغيل الدالة
testConnection();
