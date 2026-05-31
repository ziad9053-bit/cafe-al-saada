// Config & Scripts/js_admin.js

// [تنبيه: دالة لإضافة صنف جديد إلى جدول items]
async function addItem() {
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;

    if (!name || !price) {
        alert("يرجى تعبئة جميع الحقول!");
        return;
    }

    // [تنبيه: نستخدم .insert() لإضافة بيانات جديدة للجدول]
    const { data, error } = await supabase
        .from('items')
        .insert([
            { name: name, price: price }
        ]);

    if (error) {
        console.error("خطأ في إضافة الصنف:", error);
        alert("حدث خطأ أثناء الإضافة.");
    } else {
        alert("تمت إضافة الصنف بنجاح!");
        // [تنبيه: نقوم بتفريغ الحقول بعد الإضافة]
        document.getElementById('itemName').value = "";
        document.getElementById('itemPrice').value = "";
    }
}
