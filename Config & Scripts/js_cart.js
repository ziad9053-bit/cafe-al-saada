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

    // 1. إنشاء الطلب الرئيسي في جدول orders
    const { data: orderData, error: orderError } = await window.supabase
        .from('orders')
        .insert([{ 
            table_no: tableNo, 
            status: 'confirmed' 
        }])
        .select('id')
        .single();

    if (orderError) {
        console.error("خطأ في إنشاء الطلب:", orderError);
        alert("حدث خطأ في النظام، حاول مرة أخرى.");
        return;
    }

    const orderId = orderData.id;

    // 2. تحضير الأصناف لإرسالها لجدول order_items
    const itemsToInsert = cart.map(item => ({
        order_id: orderId,
        item_id: item.id,
        quantity: item.quantity || 1,
        table_no: parseFloat(tableNo) // كما في جدول order_items لديك (float4)
    }));

    // 3. إرسال جميع الأصناف دفعة واحدة
    const { error: itemsError } = await window.supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        console.error("خطأ أثناء حفظ الأصناف:", itemsError);
        alert("تم إنشاء الطلب ولكن حدث خطأ في حفظ الأصناف.");
        return;
    }

    alert("تم تأكيد طلبك بنجاح! سيصل للمطبخ فوراً.");
    localStorage.removeItem('cart');
    window.location.href = 'menu.html';
}
