window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return;

    // جلب البيانات مع التأكد من معالجتها كـ JSON
    let cart = [];
    try {
        const rawData = localStorage.getItem('cart') || window.name || '[]';
        cart = JSON.parse(rawData);
    } catch (e) {
        cart = [];
    }
    
    // إذا كانت السلة فارغة
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة حالياً.</p>";
        return;
    }

    // عرض الأصناف
    // ملاحظة: بما أنك قمت بتعديل addToCart لدمج الأصناف بالـ ID، 
    // فالمصفوفة الآن تحتوي على العناصر مجمعة بالفعل.
    container.innerHTML = cart.map((item, index) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border mb-3">
            <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${item.quantity}</p>
            </div>
            <button onclick="removeItem(${index})" class="text-red-500 font-bold hover:text-red-700">حذف</button>
        </div>
    `).join('');
});

// دالة الحذف (تقوم بحذف الصنف بالكامل من المصفوفة بناءً على ترتيبه)
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
    
    // إزالة العنصر من المصفوفة
    cart.splice(index, 1);
    
    const updatedData = JSON.stringify(cart);
    localStorage.setItem('cart', updatedData);
    window.name = updatedData;
    
    // إعادة تحميل الصفحة لتحديث العرض
    location.reload();
}
