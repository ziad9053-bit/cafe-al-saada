// Config & Scripts/js_app.js

window.startOrder = async function(tableNumber) {
    // [تنبيه: هذا الكود لا يحتاج مفاتيح إضافية، هو يعتمد على الربط الموجود في js_supabase.js]
    
    try {
        console.log("جاري إرسال الطلب للطاولة:", tableNumber);

        const { data, error } = await supabase
            .from('orders')
            .insert([{ table_no: tableNumber, status: 'confirmed' }])
            .select();

        if (error) {
            console.error("خطأ من قاعدة البيانات:", error);
            // [تنبيه: إذا ظهر هذا الخطأ، تأكد من أن السياسات (Policies) في Supabase مفعّلة]
            return;
        }

        localStorage.setItem('tableNumber', tableNumber);
        window.location.href = 'menu.html';

    } catch (err) {
        console.error("خطأ تقني:", err);
    }
};
