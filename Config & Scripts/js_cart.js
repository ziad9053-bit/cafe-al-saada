// Config & Scripts/js_cart.js

// [تنبيه: هذا الملف لا يتطلب إضافة روابط أو مفاتيح API، فهو يعتمد على الاتصال الذي تم إعداده مسبقاً في ملف js_supabase.js]

async function loadCart() {
    // [تنبيه: نقوم بجلب رقم الطاولة من ذاكرة المتصفح التي حفظناها عند تسجيل الدخول في ملف js_app.js]
    const tableNumber = localStorage.getItem('tableNumber');
    
    if (!tableNumber) {
        console.warn("لم يتم العثور على رقم طاولة في الذاكرة");
        return;
    }

    // [تنبيه: هنا نقوم بجلب المنتجات المرتبطة بهذه الطاولة من جدول order_items]
    // [تنبيه: الكود يقوم بعمل "join" لجلب تفاصيل المنتج (الاسم والسعر) من جدول items]
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            *,
            items (
                name,
                price
            )
        `)
        .eq('table_no', tableNumber);

    if (error) {
        // [تنبيه: إذا ظهر خطأ هنا، تأكد من أن أسماء الأعمدة (table_no, item_id) في قاعدة البيانات تطابق الكود]
        console.error("خطأ أثناء جلب الطلبات من قاعدة البيانات:", error);
        return;
    }

    // [تنبيه: نقوم بعرض البيانات التي جلبناها داخل عنصر HTML الذي يحمل id="cart-items"]
    const cartContainer = document.getElementById('cart-items');
    
    if (data.length === 0) {
        cartContainer.innerHTML = "<p>السلة فارغة حالياً.</p>";
        return;
    }

    cartContainer.innerHTML = ""; // تفريغ الحاوية قبل عرض المنتجات
    
    data.forEach(order => {
        // [تنبيه: نتأكد من وجود بيانات في items قبل عرضها لتجنب أي أخطاء في العرض]
        const itemName = order.items ? order.items.name : "منتج غير معروف";
        const itemPrice = order.items ? order.items.price : "0";

        cartContainer.innerHTML += `
            <div class="bg-white p-4 shadow rounded flex justify-between border-b">
                <span>${itemName}</span>
                <span class="font-bold">${itemPrice} ريال</span>
            </div>
        `;
    });
}

// [تنبيه: تشغيل الدالة تلقائياً بمجرد تحميل الصفحة]
loadCart();
