window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return;

    // جلب البيانات مع ضمان معالجة الكميات
    let cart = [];
    try {
        const rawData = localStorage.getItem('cart') || window.name || '[]';
        cart = JSON.parse(rawData);
    } catch (e) {
        cart = [];
    }
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    // عرض الأصناف مع إظهار الكمية
    container.innerHTML = cart.map((item, index) => {
        // نستخدم item.quantity إذا كانت موجودة، وإلا نفترض أنها 1
        const quantity = item.quantity || 1;
        return `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
            <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${quantity}</p>
            </div>
            <button onclick="removeItem(${index})" class="text-red-500 font-bold hover:text-red-700">حذف</button>
        </div>
    `}).join('');
});

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
    
    // إذا كانت الكمية أكثر من 1، نقوم بإنقاص الكمية بدلاً من حذف الصنف بالكامل
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        // حذف الصنف بالكامل إذا كانت الكمية 1
        cart.splice(index, 1);
    }
    
    const updatedData = JSON.stringify(cart);
    localStorage.setItem('cart', updatedData);
    window.name = updatedData;
    
    location.reload();
}
