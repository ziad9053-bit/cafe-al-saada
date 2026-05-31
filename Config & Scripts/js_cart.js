async function confirmOrder() {
    const tableNo = document.getElementById('tableNo').value;
    
    if (!tableNo) {
        alert("يرجى إدخال رقم الطاولة أولاً!");
        return;
    }

    // 1. جلب محتويات السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    // 2. إرسال كل عنصر في السلة إلى جدول order_items
    for (const item of cart) {
        const { error } = await supabase
            .from('order_items')
            .insert([
                { 
                    item_id: item.id, 
                    quantity: item.quantity, 
                    table_no: tableNo // [تنبيه: هنا نربط رقم الطاولة بالطلب]
                }
            ]);

        if (error) {
            console.error("خطأ أثناء إرسال الطلب:", error);
            alert("حدث خطأ، حاول مرة أخرى.");
            return;
        }
    }

    alert("تم تأكيد طلبك بنجاح! سيصل للمطبخ فوراً.");
    localStorage.removeItem('cart'); // تفريغ السلة
    window.location.href = 'menu.html'; // العودة للقائمة
}
