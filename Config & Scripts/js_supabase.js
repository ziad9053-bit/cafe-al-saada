// استدعاء مكتبة Supabase عبر CDN إذا لم تكن تستخدم npm
// تأكد من ربط السكريبت الخاص بـ Supabase في الـ HTML أولاً
const supabaseUrl = 'رابط_مشروعك_من_supabase';
const supabaseKey = 'مفتاح_api_من_supabase';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);
