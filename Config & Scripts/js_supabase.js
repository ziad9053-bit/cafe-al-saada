// Config & Scripts/js_supabase.js

// 1. ضع هنا بيانات مشروعك من لوحة تحكم Supabase
const SUPABASE_URL = 'ضع_رابط_المشروع_هنا';
const SUPABASE_ANON_KEY = 'ضع_مفتاح_API_هنا';

// 2. تهيئة الاتصال بقاعدة البيانات
// ملاحظة: supabase هي كائن يتم توفيره بواسطة مكتبة supabase-js 
// التي قمنا باستدعائها في ملف الـ HTML
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. تصدير الكائن ليكون متاحاً لبقية ملفات المشروع
export { supabase };
