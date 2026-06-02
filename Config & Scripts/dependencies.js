async function confirmOrder() {
    const btn = document.getElementById('confirm-btn');
    
    // الانتظار حتى تكون Supabase جاهزة إذا لم تكن جاهزة بعد
    if (!window.supabase) {
        alert("جاري الاتصال بقاعدة البيانات، يرجى الانتظار ثانية...");
        return;
    }

    const tableNo = document.getElementById('tableNo')?.value;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إخل رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    btn.disabled = true;
    btn.innerText = "جاري الإرسال...";

    const { error } = await window.supabase
        .from('orders')
        .insert([{
            table_no: parseInt(tableNo),
            items: cart
        }]);

    if (error) {
        console.error("خطأ Supabase:", error);
        btn.disabled = false;
        btn.innerText = "تأكيد الطلب";
        return alert("خطأ في الإرسال: " + error.message);
    }

    localStorage.removeItem('cart');
    alert("تم إرسال طلبك بنجاح!");
    window.location.href = "index.html";
}
