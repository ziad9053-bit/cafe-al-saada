// [تنبيه: هذا الكود لا يحتاج مفاتيح إضافية، يعتمد على الربط الموجود مسبقاً]

async function addToCart(itemId) {
    // 1. جلب رقم الطاولة الذي حفظناه سابقاً في الصفحة الأولى
    const tableNumber = localStorage.getItem('tableNumber');
    
    if (!tableNumber) {
        alert("يرجى العودة للصفحة الرئيسية وتحديد رقم الطاولة");
        return;
    }

    console.log("جاري إضافة المنتج للطلب...");

    // 2. إضافة المنتج لجدول order_items
    const { data, error } = await supabase
        .from('order_items')
        .insert([
            { 
                item_id: itemId,       // معرف المنتج
                table_no: tableNumber  // ربط المنتج بالطاولة
            }
        ]);

    if (error) {
        console.error("خطأ عند الإضافة:", error);
        alert("فشل إضافة المنتج. تأكد من إعدادات السياسات (Policies) في Supabase.");
    } else {
        alert("تمت إضافة المنتج للطلب!");
    }
}
