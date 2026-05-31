window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border">
            <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال</p>
            </div>
            <button onclick="removeItem(${index})" class="text-red-500 font-bold">حذف</button>
        </div>
    `).join('');
});

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}
