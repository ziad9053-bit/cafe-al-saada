// مجرد روابط لاستدعاء الملفات
document.write('<script src="https://cdn.tailwindcss.com"></script>');
document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
document.write('<script src="js_supabase.js"></script>');
// تأكد من وجود هذا السطر
window.supabase = supabase.createClient('YOUR_URL', 'YOUR_KEY');
