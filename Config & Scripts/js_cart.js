async function confirmOrder() {
    const tableNo = document.getElementById('tableNo').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!tableNo) {
        alert("يرجى إدخال رقم الطاولة!");
        return;
    }
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    // 1. إنشاء الطلب الرئيسي (Parent Order)
    const { data: orderData, error: orderError } = await window.supabase
        .from('orders')
        .insert([{ table_no: parseFloat(tableNo) }])
        .select('id')
        .single();

    if (orderError) {
        console.error("خطأ في إنشاء الطلب الرئيسي:", orderError);
        alert("حدث خطأ في النظام، حاول مرة أخرى.");
        return;
    }

    const orderId = orderData.id;

    // 2. إرسال الأصناف مع ربطها بـ order_id الذي حصلنا عليه
    const itemsToInsert = cart.map(item => ({
        order_id: orderId,
        item_id: item.id,
        quantity: item.quantity || 1,
        table_no: parseFloat(tableNo)
    }));

    const { error: itemsError } = await window.supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        console.error("خطأ أثناء إضافة الأصناف:", itemsError);
        alert("حدث خطأ أثناء حفظ الطلبات.");
        return;
    }

    alert("تم تأكيد طلبك بنجاح! سيصل للمطبخ فوراً.");
    localStorage.removeItem('cart');
    window.location.href = 'menu.html';
}
