async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) { console.error(error); return; }

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف.</p>";
    } else {
        data.forEach(item => {
            // تخزين البيانات كـ Attributes للوصول إليها برمجياً
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button class="add-to-cart-btn mt-2 bg-green-600 text-white px-4 py-2 rounded-lg" 
                            data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                            إضافة للسلة
                    </button>
                </div>
            `;
        });
        
        // ربط الأحداث بعد إضافة العناصر للـ DOM
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const { id, name, price } = e.target.dataset;
                addToCart(id, name, parseFloat(price));
            });
        });
    }
    updateCartCount();
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    
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

window.addEventListener('DOMContentLoaded', loadMenu);
