async function loadMenu() {
    console.log("جاري البدء في جلب الأصناف...");

    // جلب البيانات من Supabase
    const { data, error } = await window.supabase.from('items').select('*');
    
    if (error) {
        console.error("خطأ أثناء الاتصال بقاعدة البيانات:", error);
        return;
    }

    console.log("تم استلام البيانات بنجاح:", data);

    // البحث عن عنصر العرض في صفحة الـ HTML
    const menuContainer = document.getElementById('menu-items');
    
    // فحص دقيق: هل العنصر موجود؟
    if (!menuContainer) {
        console.error("خطأ حرج: لم يتم العثور على <div id='menu-items'> في ملف الـ HTML الخاص بك!");
        alert("خطأ: تأكد أنك وضعت <div id='menu-items'> في صفحة الـ HTML");
        return;
    }

    console.log("تم العثور على عنصر العرض، جاري إضافة الأصناف...");
    menuContainer.innerHTML = ""; // تفريغ المحتوى القديم
    
    // إضافة الأصناف
    if (data.length === 0) {
        menuContainer.innerHTML = "<p>لا توجد أصناف متاحة حالياً.</p>";
    } else {
        data.forEach(item => {
            console.log("جاري إضافة الصنف:", item.name);
            menuContainer.innerHTML += `
                <div class="menu-item" style="border: 1px solid #ccc; padding: 15px; margin: 10px; border-radius: 8px;">
                    <h3 style="margin: 0;">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button onclick="addToCart('${item.id}')" style="cursor: pointer; padding: 5px 10px;">إضافة للسلة</button>
                </div>
            `;
        });
    }
}

// تشغيل الدالة
loadMenu();

// دالة وهمية لتجنب خطأ عند الضغط على الزر قبل بناء السلة
function addToCart(id) {
    console.log("تم الضغط على إضافة الصنف رقم:", id);
    alert("تم إضافة الصنف للسلة (تحتاج لبناء وظيفة السلة لاحقاً)");
}
