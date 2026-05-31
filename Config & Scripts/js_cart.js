// دالة عرض محتويات السلة
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p class='text-center text-gray-500'>سلتك فارغة حالياً.</p>";
        return;
    }

    cartContainer.innerHTML = ""; // تفريغ الحاوية قبل الرسم
    
    cart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div>
                    <h3 class="font-bold text-lg">${item.name}</h3>
                    <p class="text-gray-600">${item.price} ريال</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 font-bold">
                    حذف
                </button>
            </div>
        `;
    });
}

// دالة حذف صنف من السلة
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); // حذف الصنف
    localStorage.setItem('cart', JSON.stringify(cart)); // تحديث التخزين
    renderCart(); // إعادة رسم السلة
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', renderCart);
