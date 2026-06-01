async function confirmOrder() {
    // 1. فحص جاهزية Supabase
    if (typeof window.supabase === 'undefined') {
        return alert("جاري تهيئة النظام، يرجى الانتظار ثانية.");
    }

    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    // 2. التحقق من المدخلات
    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    // 3. تجهيز البيانات (تم تصحيح اسم العمود إلى table_no)
    const orderData = {
        table_no: parseInt(tableNo), // الاسم مطابق تماماً لقاعدة البيانات
        items: JSON.parse(JSON.stringify(cart)), 
        status: 'pending'
    };

    // 4. تنفيذ الإدخال
    const { data, error } = await window.supabase
        .from('orders')
        .insert([orderData])
        .select('id'); // استرجاع المعرف فقط

    // 5. التعامل مع الأخطاء
    if (error) {
        console.error("Supabase Error Details:", error);
        return alert("خطأ في الإرسال: " + error.message);
    }

    // 6. نجاح العملية
    if (data && data.length > 0) {
        const orderId = data[0].id;
        
        // تنظيف السلة وحفظ الطلب المعلق
        localStorage.removeItem('cart');
        localStorage.setItem('pendingOrderId', orderId);

        // تحديث الواجهة فوراً
        showWaitScreen(orderId);
        monitorOrderStatus(orderId);
    } else {
        alert("خطأ: لم يتم استرجاع رقم الطلب من السيرفر.");
    }
}
