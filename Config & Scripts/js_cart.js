// 1. عرض الأصناف عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>سلتك فارغة حالياً.</p>";
        return;
    }

    container.innerHTML = "";
    cart.forEach(item => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <span class="font-bold">${item.name}</span>
                <span class="text-gray-600">${item.price} ريال</span>
            </div>
        `;
    });
});

// 2. دالة تأكيد الطلب
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

    // الخطوة أ: إنشاء الطلب الرئيسي في جدول orders
    const { data: orderData, error: orderError } = await window.supabase
        .from('orders')
        .insert([{ table_no: tableNo, status: 'confirmed' }])
        .select('id')
        .single();

    if (orderError) {
        console.error("خطأ في الطلب الرئيسي:", orderError);
        alert("حدث خطأ في النظام، حاول مرة أخرى.");
        return;
    }

    const orderId = orderData.id;

    // الخطوة ب: إرسال الأصناف لجدول order_items مربوطة بالـ order_id
    const itemsToInsert = cart.map(item => ({
        order_id: orderId,
        item_id: item.id,
        quantity: 1, // يمكنك تعديل هذا إذا أضفت ميزة الكمية لاحقاً
        table_no: parseFloat(tableNo)
    }));

    const { error: itemsError } = await window.supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        console.error("خطأ في الأصناف:", itemsError);
        alert("تم إنشاء الطلب لكن حدث خطأ في تفاصيل الأصناف.");
        return;
    }

    alert("تم تأكيد طلبك بنجاح! شكراً لك.");
    localStorage.removeItem('cart');
    window.location.href = 'menu.html';
}
