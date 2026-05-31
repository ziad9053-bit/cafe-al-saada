async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) { console.error(error); return; }

    menuContainer.innerHTML = ""; 
    data.forEach(item => {
        menuContainer.innerHTML += `
            <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                <h3 class="font-bold">${item.name}</h3>
                <p>السعر: ${item.price} ريال</p>
                <button onclick="addToCart('${item.id}', '${item.name}', ${item.price})" 
                        class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">إضافة للسلة</button>
            </div>
        `;
    });
    updateCartCount(); // تحديث العداد
}

// دالة الإضافة للسلة
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("تمت إضافة " + name + " للسلة!");
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = JSON.parse(localStorage.getItem('cart') || '[]').length;
}

loadMenu();
