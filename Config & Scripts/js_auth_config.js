/**
 * ملف: js_auth_config.js
 * المسؤول عن تخزين كلمات المرور وتحديد الصلاحيات
 */
const AUTH_CONFIG = {
    ADMIN_PASS: "123456", // 1111
    WORKER_PASS: "0000",  // 2424
};

// دالة التحقق من الدخول
function verifyLogin(password, type) {
    if (type === 'admin' && password === AUTH_CONFIG.ADMIN_PASS) {
        localStorage.setItem('role', 'admin');
        return true;
    }
    if (type === 'worker' && password === AUTH_CONFIG.WORKER_PASS) {
        localStorage.setItem('role', 'worker');
        return true;
    }
    return false;
}
