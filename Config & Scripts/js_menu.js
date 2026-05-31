async function testConnection() {
    console.log("بدء الاتصال...");
    try {
        const { data, error } = await supabase.from('items').select('*');
        
        if (error) {
            console.error("خطأ من Supabase:", error);
        } else {
            console.log("تم جلب الأصناف بنجاح:", data);
        }
    } catch (e) {
        console.error("خطأ غير متوقع:", e);
    }
}

testConnection();
