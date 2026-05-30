// Config & Scripts/js_app.js

async function startOrder(tableNumber) {
    try {
        console.log("جاري تسجيل الطلب للطاولة:", tableNumber);

        // نقوم بإرسال البيانات لتطابق الأعمدة في جدولك: table_no
        const { data, error } = await supabase
            .from('orders')
            .insert([
                { 
                    table_no: tableNumber, // تطابق اسم العمود في جدولك
                    status: 'confirmed'    // تطابق القيمة الافتراضية في جدولك
                }
            ])
            .select();

        if (error) {
            console.error("خطأ من Supabase:", error);
            alert("حدث خطأ أثناء الاتصال بقاعدة البيانات. تأكد من اسم الجدول والأعمدة.");
            return;
        }

        console.log("تم تسجيل الطلب بنجاح:", data);

        // 2. حفظ رقم الطاولة في المتصفح لاستخدامه في الصفحات القادمة
        localStorage.setItem('tableNumber', tableNumber);
        
        // 3. الانتقال لصفحة المنيو
        window.location.href = 'menu.html';

    } catch (err) {
        console.error("خطأ غير متوقع:", err);
    }
}
