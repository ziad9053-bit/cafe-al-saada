async function confirmOrder() {
    const tableNo = document.getElementById('tableNo').value;
    
    if (!tableNo) {
        alert("يرجى إدخال رقم الطاولة قبل التأكيد!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // إرسال الطلب لقاعدة البيانات مع رقم الطاولة
    for (const item of cart) {
        await window.supabase.from('order_items').insert([
            { 
                item_id: item.id, 
                quantity: item.quantity, 
                table_no: tableNo 
            }
        ]);
    }
    
    alert("تم إرسال طلبك بنجاح للطاولة رقم " + tableNo);
    localStorage.removeItem('cart');
    window.location.href = 'menu.html';
}
