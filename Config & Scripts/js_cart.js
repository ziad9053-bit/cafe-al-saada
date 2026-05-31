window.addEventListener('DOMContentLoaded', () => {
    console.log("--- بدء تحميل صفحة السلة ---");
    
    const container = document.getElementById('cart-items');
    if (!container) return;

    // جلب البيانات من localStorage أو window.name
    let cartData = localStorage.getItem('cart') || window.name;
    console.log("البيانات المستلمة:", cartData);

    let cart = [];
    try {
        cart = JSON.parse(cartData) || [];
    } catch (e) {
        console.error("خطأ في معالجة البيانات:", e);
        cart = [];
    }
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        return;
    }

    let htmlContent = "";
    cart.forEach((item, index) => {
        htmlContent += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
                <div>
                    <h3 class="font-bold">${item.name}</h3>
                    <p class="text-gray-600">${item.price} ريال</p>
                </div>
                <button onclick="removeItem(${index})" class="text-red-500 font-bold hover:text-red-700">حذف</button>
            </div>
        `;
    });
    
    container.innerHTML = htmlContent;
});

function removeItem(index) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
        if (index > -1 && index < cart.length) {
            cart.splice(index, 1);
            const updatedData = JSON.stringify(cart);
            localStorage.setItem('cart', updatedData);
            window.name = updatedData;
            location.reload();
        }
    } catch (e) {
        console.error("خطأ أثناء حذف الصنف:", e);
    }
}
