window.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل صفحة السلة وبدء المعالجة...");
    
    const container = document.getElementById('cart-items');
    if (!container) {
        console.error("خطأ: لا يوجد عنصر بـ id='cart-items' في هذه الصفحة!");
        return;
    }

    const cartData = localStorage.getItem('cart');
    console.log("البيانات الخام من localStorage:", cartData);

    const cart = JSON.parse(cartData) || [];
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        return;
    }

    let htmlContent = "";
    cart.forEach((item, index) => {
        htmlContent += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
                <div>
                    <h3 class="font-bold">${item.name || "صنف"}</h3>
                    <p class="text-gray-600">${item.price || 0} ريال</p>
                </div>
                <button onclick="removeItem(${index})" class="text-red-500 font-bold">حذف</button>
            </div>
        `;
    });
    container.innerHTML = htmlContent;
    console.log("تم عرض الأصناف بنجاح.");
});

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}
