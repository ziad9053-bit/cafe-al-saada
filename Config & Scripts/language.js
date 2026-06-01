/**
 * ملف إدارة اللغة: language.js
 */
const translations = {
    'ar': {
        'welcome': 'أهلاً بك في مقهانا',
        'browse': 'تصفح القائمة',
        'kitchen': 'لوحة تحكم المطبخ'
    },
    'en': {
        'welcome': 'Welcome to our cafe',
        'browse': 'Browse Menu',
        'kitchen': 'Kitchen Dashboard'
    }
};

function changeLanguage() {
    const currentDir = document.documentElement.getAttribute('dir');
    const newLang = (currentDir === 'rtl') ? 'en' : 'ar';
    
    // تغيير اتجاه الصفحة
    document.documentElement.setAttribute('dir', (newLang === 'ar') ? 'rtl' : 'ltr');
    
    // تحديث النصوص (بشرط إضافة data-key="welcome" للعناصر)
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.innerText = translations[newLang][key];
    });
}
