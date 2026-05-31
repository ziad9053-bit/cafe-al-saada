window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return; // لا تفعل شيئاً إذا لم تكن في صفحة السلة

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>سلتك فارغة.</p>";
        return;
    }

    container.innerHTML = "";
    cart.forEach(item => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <span class="font-bold">${item.name}</span>
                <span class="text-gray-600">${item.price} ريال</span>
            </div>
        `;
    });
});
