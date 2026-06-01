async function confirmOrder() {
    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    // 1. إرسال الطلب واستقبال الـ ID المولد من القاعدة
    const { data, error } = await window.supabase.from('orders').insert([
        { table_number: parseInt(tableNo), items: cart, status: 'pending' }
    ]).select(); // استخدمنا select لاستقبال البيانات المضافة

    if (error) {
        alert("خطأ في إرسال الطلب: " + error.message);
        return;
    }

    const orderId = data[0].id; // هذا هو رقم الطلب الفريد

    // 2. تغيير واجهة الصفحة برمجياً (بدون التخريب على الدوال الأخرى)
    document.body.innerHTML = `
        <div class="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div id="status-card" class="w-full max-w-sm bg-amber-500 p-8 rounded-3xl shadow-xl text-white transition-colors duration-1000">
                <h2 class="text-2xl font-bold mb-4">شكراً لاختيارك لنا! ☕</h2>
                <div id="qrcode" class="my-6 bg-white p-4 rounded-xl flex justify-center"></div>
                <p class="text-sm font-bold">رقم طلبك: #${orderId}</p>
                <p class="text-sm mt-2">انتظر تحول الكود للأخضر عند اكتمال الطلب</p>
            </div>
        </div>
    `;

    // 3. توليد الـ QR Code (يحتوي على رقم الطلب ليتم مسحه)
    new QRCode(document.getElementById("qrcode"), {
        text: `ORDER_ID:${orderId}`,
        width: 150,
        height: 150
    });

    // 4. مراقبة التغييرات (Realtime) للتحول للأخضر
    monitorOrderStatus(orderId);
}

// دالة المراقبة (تحتاج تفعيل Realtime في Supabase لجدول orders)
function monitorOrderStatus(orderId) {
    window.supabase.channel('orders')
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'orders', 
            filter: `id=eq.${orderId}` 
        }, (payload) => {
            if (payload.new.status === 'completed') {
                const card = document.getElementById('status-card');
                card.classList.remove('bg-amber-500');
                card.classList.add('bg-green-600');
                card.querySelector('h2').innerText = "طلبك جاهز! 🎉";
            }
        }).subscribe();
}
