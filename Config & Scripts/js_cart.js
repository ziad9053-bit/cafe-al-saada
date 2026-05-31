// Config & Scripts/js_cart.js

// [تنبيه: هذا الملف لا يتطلب إضافة روابط أو مفاتيح API، فهو يعتمد على الاتصال الذي تم إعداده مسبقاً في ملف js_supabase.js]

async function loadCart() {
    // [تنبيه: نقوم بجلب رقم الطاولة من ذاكرة المتصفح]
    const tableNumber = localStorage.getItem('tableNumber');
    
    if (!tableNumber) {
        console.warn("لم يتم العثور على رقم طاولة في الذاكرة");
        return;
    }

    // [تنبيه: نقوم بجلب بيانات السلة مع ربط جدول المنتجات للحصول على الاسم والسعر]
    // [تنبيه: تأكد أنك قمت بعمل Foreign Key في Supabase لربط item_id بجدول items]
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id,
            item_id,
            table_no,
            items (
                name,
                price
            )
        `)
        .eq('table_no', tableNumber);

    if (error) {
        // [تنبيه: إذا ظهر خطأ هنا، تحقق من إعدادات الربط (Foreign Key) في Supabase]
        console.error("خطأ أثناء جلب الطلبات من قاعدة البيانات:", error);
        return;
    }

    // [تنبيه: نقوم بعرض البيانات التي جلبناها داخل عنصر HTML الذي يحمل id="cart-items"]
    const cartContainer = document.getElementById('cart-items');
    
    if (!cartContainer) return; // الحماية في حال عدم وجود العنصر في الصفحة

    if (data.length === 0) {
        cartContainer.innerHTML = "<p>السلة فارغة حالياً.</p>";
        return;
    }

    cartContainer.innerHTML = ""; // تفريغ الحاوية قبل عرض المنتجات
    
    data.forEach(order => {
        // [تنبيه: نتأكد من وجود بيانات في items قبل عرضها لتجنب أي أخطاء]
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
