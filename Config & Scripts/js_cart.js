window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');

    // تجميع العناصر المتطابقة (بناءً على ID) لمنع أي تكرار مرئي
    const groupedCart = cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        if (found) {
            found.quantity = (parseInt(found.quantity) || 1) + (parseInt(item.quantity) || 1);
        } else {
            acc.push({ ...item, quantity: parseInt(item.quantity) || 1 });
        }
        return acc;
    }, []);

    if (groupedCart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    container.innerHTML = groupedCart.map((item, index) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border mb-2">
            <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${item.quantity}</p>
            </div>
            <button onclick="removeItem('${item.id}')" class="text-red-500 font-bold">حذف</button>
        </div>
    `).join('');
});
