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

    // إرسال البيانات
    for (const item of cart) {
        // نستخدم أسماء الأعمدة الموجودة في صورتك بدقة
        const { error } = await window.supabase.from('order_items').insert([
            { 
                item_id: item.id,       // مطابق للعمود في الصورة
                quantity: item.quantity, // مطابق للعمود في الصورة
                table_no: parseFloat(tableNo) // تحويل القيمة لرقم لأن النوع float4
            }
        ]);

        if (error) {
            console.error("خطأ أثناء الإرسال:", error);
            alert("حدث خطأ، حاول مرة أخرى.");
            return;
        }
    }

    alert("تم تأكيد طلبك بنجاح!");
    localStorage.removeItem('cart');
    window.location.href = 'menu.html';
}
