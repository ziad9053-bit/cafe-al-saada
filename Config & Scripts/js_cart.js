// دالة الإضافة للسلة (مُعدلة للمزامنة المزدوجة والموثوقية)
function addToCart(id, name, price) {
    try {
        // 1. جلب البيانات الحالية من localStorage (أو المخزن الاحتياطي إذا لزم الأمر)
        let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
        
        // 2. إضافة الصنف الجديد
        cart.push({ id, name, price });
        
        // 3. تحويل المصفوفة إلى نص (Stringify)
        const cartString = JSON.stringify(cart);
        
        // 4. الحفظ المزدوج للمزامنة بين الصفحات
        localStorage.setItem('cart', cartString);
        window.name = cartString; 
        
        console.log("تم إضافة الصنف بنجاح. السلة الحالية:", cart);
        
        // 5. تنبيه المستخدم
        alert("تمت إضافة " + name + " للسلة!");
        
        // 6. تحديث العداد في الصفحة الحالية
        updateCartCount();
        
    } catch (e) {
        console.error("خطأ أثناء إضافة الصنف للسلة:", e);
        alert("حدث خطأ أثناء إضافة الصنف، يرجى المحاولة مرة أخرى.");
    }
}
