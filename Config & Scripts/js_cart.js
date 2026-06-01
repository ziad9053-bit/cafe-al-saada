async function confirmOrder() {
    if (typeof window.supabase === 'undefined') {
        return alert("جاري تهيئة النظام، يرجى الانتظار ثانية.");
    }

    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    // نستخدم هيكل إدخال أكثر أماناً وتوافقاً
    const orderData = {
        table_number: parseInt(tableNo),
        items: JSON.parse(JSON.stringify(cart)), // نضمن تحويلها لـ JSON صريح
        status: 'pending'
    };

    // التعديل: قمنا بإزالة .select() مؤقتاً لتجنب خطأ 400
    // وقمت بتغيير صيغة الإدخال
    const { data, error } = await window.supabase
        .from('orders')
        .insert([orderData])
        .select('id'); // نطلب فقط الـ id لضمان عدم التعارض

    if (error) {
        console.error("Supabase Error Details:", error);
        return alert("خطأ في الإرسال: " + error.message);
    }

    // إذا تم الإدخال بنجاح، ستكون data موجودة
    if (data && data.length > 0) {
        const orderId = data[0].id;
        localStorage.removeItem('cart');
        localStorage.setItem('pendingOrderId', orderId);

        showWaitScreen(orderId);
        monitorOrderStatus(orderId);
    } else {
        alert("خطأ: لم يتم استرجاع رقم الطلب.");
    }
}
