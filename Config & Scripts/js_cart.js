window.addEventListener('DOMContentLoaded', () => {
    console.log("--- بدء تحميل صفحة السلة ---");
    
    const container = document.getElementById('cart-items');
    if (!container) {
        console.error("خطأ حرج: العنصر الذي يحمل id='cart-items' غير موجود!");
        return;
    }

    // 1. محاولة جلب البيانات من localStorage
    let cartData = localStorage.getItem('cart');
    
    // 2. إذا كانت null، نحاول القراءة من window.name (مخزن احتياطي بين الصفحات)
    if (!cartData && window.name) {
        console.log("البيانات غير موجودة في localStorage، يتم الجلب من المخزن الاحتياطي...");
        cartData = window.name;
    }

    console.log("البيانات الخام المستلمة:", cartData);

    let cart = [];
    try {
        cart = JSON.parse(cartData) || [];
    } catch (e) {
        console.error("خطأ في معالجة البيانات:", e);
        cart = [];
    }
    
    // التحقق من وجود أصناف
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        return;
    }

    // عرض الأصناف
    let htmlContent = "";
    cart.forEach((item, index) => {
        htmlContent += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
                <div>
                    <h3 class="font-bold">${item.name || "صنف غير معروف"}</h3>
                    <p class="text-gray-600">${item.price || 0} ريال</p>
                </div>
                <button onclick="removeItem(${index})" class="text-red-500 font-bold hover:text-red-700">حذف</button>
            </div>
        `;
    });
    
    container.innerHTML = htmlContent;
    console.log("تم عرض " + cart.length + " أصناف بنجاح.");
});

// دالة حذف صنف (تحدث المخزنين معاً لضمان المزامنة)
function removeItem(index) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            
            // تحديث كلا المخزنين
            const updatedData = JSON.stringify(cart);
            localStorage.setItem('cart', updatedData);
            window.name = updatedData;
            
            console.log("تم حذف الصنف وتحديث البيانات.");
            location.reload();
        }
    } catch (e) {
        console.error("خطأ أثناء حذف الصنف:", e);
    }
}
