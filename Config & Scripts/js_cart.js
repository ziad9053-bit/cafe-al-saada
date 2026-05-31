window.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// دالة لتجميع الطلبات (يمكنك استدعاؤها في أي صفحة)
function getGroupedCart() {
    let cart = [];
    try {
        const rawData = localStorage.getItem('cart') || window.name || '[]';
        cart = JSON.parse(rawData);
    } catch (e) {
        cart = [];
    }

    return cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        const quantity = parseInt(item.quantity) || 1;
        if (found) {
            found.quantity += quantity;
        } else {
            acc.push({ ...item, quantity });
        }
        return acc;
    }, []);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const groupedCart = getGroupedCart();

    if (groupedCart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    container.innerHTML = groupedCart.map((item) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border mb-2 transition-all">
            <div>
                <h3 class="font-bold text-lg">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${item.quantity}</p>
            </div>
            <button onclick="removeItem('${item.id}', '${item.name}')" 
                    class="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100 transition-colors">
                حذف
            </button>
        </div>
    `).join('');
}

function removeItem(id, name) {
    if (!confirm(`هل أنت متأكد من حذف ${name} من السلة؟`)) return;

    let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
    const updatedCart = cart.filter(item => item.id !== id);
    
    const updatedData = JSON.stringify(updatedCart);
    localStorage.setItem('cart', updatedData);
    window.name = updatedData;
    
    location.reload(); 
}
