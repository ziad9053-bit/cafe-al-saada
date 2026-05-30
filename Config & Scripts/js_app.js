console.log("تم تحميل ملف js_app.js بنجاح!");
// Config & Scripts/js_app.js

window.startOrder = async function(tableNumber) {
    try {
        console.log("جاري تسجيل الطلب للطاولة:", tableNumber);

        // إرسال البيانات لقاعدة البيانات
        // تأكد أن أسماء الأعمدة (table_no, status) مطابقة تماماً لما هو موجود في Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert([
                { 
                    table_no: tableNumber, 
                    status: 'confirmed'
                }
            ])
            .select();

        if (error) {
            console.error("خطأ من Supabase:", error);
            alert("فشل الاتصال بقاعدة البيانات. تأكد من إعدادات السياسات (Policies) في Supabase.");
            return;
        }

        console.log("تم تسجيل الطلب بنجاح:", data);

        // حفظ رقم الطاولة في ذاكرة المتصفح
        localStorage.setItem('tableNumber', tableNumber);
        
        // الانتقال لصفحة المنيو
        // ملاحظة: بما أننا في مجلد منفصل، نستخدم المسار الصحيح للمجلد الحالي
        window.location.href = 'menu.html';

    } catch (err) {
        console.error("خطأ غير متوقع:", err);
        alert("حدث خطأ تقني، يرجى مراجعة Console المتصفح.");
    }
};
