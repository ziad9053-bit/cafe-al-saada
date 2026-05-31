window.addEventListener('DOMContentLoaded', () => {
    console.log("--- بدء تحميل صفحة السلة ---");
    
    const container = document.getElementById('cart-items');
    if (!container) {
        console.error("خطأ حرج: العنصر الذي يحمل id='cart-items' غير موجود في صفحة HTML!");
        return;
    }

    // محاولة جلب البيانات
    const cartData = localStorage.getItem('cart');
    console.log("البيانات المستلمة من التخزين (localStorage):", cartData);

    // معالجة البيانات
    let cart = [];
    try {
        cart = JSON.parse(cartData) || [];
    } catch (e) {
        console.error("خطأ في قراءة بيانات السلة، تم إعادة تهيئتها:", e);
        cart = [];
    }
    
    // التحقق من وجود أصناف
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        console.log("السلة فارغة، لا يوجد ما يتم عرضه.");
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

// دالة حذف صنف
function removeItem(index) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log("تم حذف الصنف رقم:", index);
            location.reload();
        }
    } catch (e) {
        console.error("خطأ أثناء حذف الصنف:", e);
    }
}
