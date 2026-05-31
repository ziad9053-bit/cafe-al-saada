// التأكد من أن السلة تُعرض فور تحميل صفحة cart.html
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    // جلب البيانات من localStorage باستخدام مفتاح "cart"
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log("البيانات المستلمة في السلة:", cart); // للتحقق من وجود بيانات

    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        return;
    }

    container.innerHTML = "";
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
                <div>
                    <h3 class="font-bold">${item.name || "صنف بدون اسم"}</h3>
                    <p class="text-gray-600">${item.price || 0} ريال</p>
                </div>
                <button onclick="removeItem(${index})" class="text-red-500 font-bold">حذف</button>
            </div>
        `;
    });
});

// دالة حذف صنف (للمرونة)
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // تحديث الصفحة لرؤية التغيير
}
