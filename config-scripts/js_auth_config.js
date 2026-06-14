/**
 * ملف: js_auth_config.js
 * المسؤول عن إدارة كلمات المرور والصلاحيات وتشفيرها
 */

// افتراضيات (تُستخدم كمرجع أولي في حال عدم وجود إعدادات في قاعدة البيانات)
const DEFAULT_PASSWORDS = {
    admin: "123456",
    worker: "0000"
};

/**
 * دالة لتشفير كلمة المرور (تشفير أحادي الاتجاه SHA-256)
 * @param {string} message 
 * @returns {Promise<string>}
 */
async function hashPassword(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * دالة لجلب كلمات المرور المشفرة من Supabase
 */
async function getAuthSettings() {
    const client = typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!client) return null;
    const { data } = await client.from("app_settings").select("value").eq("key", "auth_config").maybeSingle();
    return data ? data.value : null;
}

/**
 * دالة التحقق من الدخول (غير متزامنة)
 * @param {string} password - كلمة المرور المدخلة
 * @param {string} type - نوع المستخدم ('admin' أو 'worker')
 * @returns {Promise<boolean>}
 */
async function verifyLogin(password, type) {
    logout(); // مسح الجلسة السابقة
    
    let dbAuth = await getAuthSettings();
    let hashedInput = await hashPassword(password);
    
    let isValid = false;

    if (dbAuth && dbAuth[type]) {
        // التحقق باستخدام الكلمة المشفرة المحفوظة في قاعدة البيانات
        if (dbAuth[type] === hashedInput) {
            isValid = true;
        }
    } else {
        // في حال عدم توفر الاتصال أو أول استخدام، الاعتماد على الافتراضيات
        if (password === DEFAULT_PASSWORDS[type]) {
            isValid = true;
        }
    }

    if (isValid) {
        localStorage.setItem('role', type);
        return true;
    }
    return false;
}

/**
 * دالة لتغيير كلمة المرور المشفرة وحفظها في قاعدة البيانات
 * @param {string} type - 'admin' أو 'worker'
 * @param {string} newPassword - كلمة المرور الجديدة
 */
async function saveNewPassword(type, newPassword) {
    const client = typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!client) throw new Error("لا يوجد اتصال بقاعدة البيانات");

    let dbAuth = await getAuthSettings() || {};
    // تشفير الكلمة الجديدة قبل حفظها
    dbAuth[type] = await hashPassword(newPassword);

    const { error } = await client.from("app_settings").upsert({
        key: "auth_config",
        value: dbAuth,
        updated_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
}

/**
 * دالة تسجيل الخروج (لمسح الجلسة)
 */
function logout() {
    localStorage.removeItem('role');
}

/**
 * دالة للتحقق مما إذا كان المستخدم مسجلاً للدخول بالفعل (متزامنة للواجهات)
 * @param {string} requiredRole - الدور المطلوب
 * @returns {boolean}
 */
function checkAccess(requiredRole) {
    const currentRole = localStorage.getItem('role');
    return currentRole === requiredRole;
}
