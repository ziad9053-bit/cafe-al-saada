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

    if (error) {
        console.error("خطأ في جلب البيانات من Supabase:", error);
        return;
    }

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف في هذا القسم.</p>";
    } else {
        data.forEach(item => {
            // ترميز الاسم لمنع أي أخطاء في الـ HTML/JavaScript
            const encodedName = btoa(encodeURIComponent(item.name));
            
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button onclick="addToCart('${item.id}', '${encodedName}', ${item.price})" 
                            class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">إضافة للسلة</button>
                </div>
            `;
        });
    }
    updateCartCount();
}

function addToCart(id, encodedName, price) {
    // فك ترميز الاسم
    const name = decodeURIComponent(atob(encodedName));
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ id, name, price });
    
    const cartString = JSON.stringify(cart);
    localStorage.setItem('cart', cartString);
    window.name = cartString; 
    
    alert("تمت إضافة " + name + " للسلة!");
    updateCartCount();
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        badge.innerText = cart.length;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    updateCartCount();
});
