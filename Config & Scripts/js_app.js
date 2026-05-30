// Config & Scripts/js_app.js

async function startOrder(tableNumber) {
    try {
        console.log("جاري تسجيل الطاولة:", tableNumber);

        // 1. إرسال بيانات الطاولة لقاعدة البيانات
        const { data, error } = await supabase
            .from('orders')
            .insert([
                { 
                    table_number: tableNumber, 
                    status: 'pending',
                    created_at: new Date() 
                }
            ])
            .select();

        if (error) {
            console.error("خطأ من Supabase:", error);
            alert("حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من إعدادات Supabase.");
            return;
        }

        // 2. حفظ رقم الطاولة في ذاكرة المتصفح لاستخدامه في الصفحات القادمة
        localStorage.setItem('tableNumber', tableNumber);
        
        // 3. الانتقال لصفحة المنيو
        window.location.href = 'menu.html';

    } catch (err) {
        console.error("خطأ غير متوقع:", err);
    }
}
