/**
 * لوحة العامل:
 * طلب جديد → فتح (قيد التجهيز) → تم التجهيز → خانة الاستلام → تم الاستلام → مسلّم
 */

let activeOrderId = null;
let timerInterval = null;
let timerStartedAt = null;
let knownOrderIds = new Set();
let firstLoad = true;
let ordersCache = [];
const LOCAL_PREP_KEY = "kitchen_local_preparing";

function getClient() {
    return typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
}

function parseItems(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [];
    } catch {
        return [];
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatElapsed(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playNewOrderSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.2].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 660;
            gain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.25);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.25);
        });
    } catch (_) {}
}

function hideRlsBanner() {
    document.getElementById("rls-warning")?.classList.add("hidden");
}

function showRlsBanner() {
    document.getElementById("rls-warning")?.classList.remove("hidden");
}

function getLocalPreparingMap() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_PREP_KEY) || "{}");
    } catch {
        return {};
    }
}

function setLocalPreparing(order) {
    const map = getLocalPreparingMap();
    map[order.id] = { startedAt: Date.now(), order };
    localStorage.setItem(LOCAL_PREP_KEY, JSON.stringify(map));
}

function clearLocalPreparing(orderId) {
    const map = getLocalPreparingMap();
    delete map[orderId];
    localStorage.setItem(LOCAL_PREP_KEY, JSON.stringify(map));
}

function mergeWithLocalPreparing(orders) {
    const map = getLocalPreparingMap();
    return orders.map((o) => {
        if (o.status === "pending" && map[o.id]) {
            return {
                ...o,
                status: "preparing",
                preparing_started_at: new Date(map[o.id].startedAt).toISOString(),
            };
        }
        return o;
    });
}

/** إغلاق البطاقة المفتوحة بعد أي إجراء */
function closeActive() {
    activeOrderId = null;
    localStorage.removeItem("kitchen_active_order");
    stopTimer();
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerStartedAt = null;
}

function startTimerDisplay(order) {
    stopTimer();
    const el = document.getElementById("order-timer");
    if (!el) return;

    const stored = localStorage.getItem(`kitchen_timer_${order.id}`);
    const started = order.preparing_started_at
        ? new Date(order.preparing_started_at).getTime()
        : stored
          ? parseInt(stored, 10)
          : Date.now();
    if (!stored) localStorage.setItem(`kitchen_timer_${order.id}`, String(started));
    timerStartedAt = started;

    const tick = () => {
        el.textContent = formatElapsed(Date.now() - timerStartedAt);
    };
    tick();
    timerInterval = setInterval(tick, 1000);
}

function renderItemsList(items) {
    if (!items.length) return '<li class="text-zinc-500">لا توجد أصناف</li>';
    return items
        .map(
            (item) => `
        <li class="flex justify-between text-sm text-amber-100">
            <span>${escapeHtml(item.name || "صنف")} × ${item.quantity || 1}</span>
            <span class="text-amber-500">${(parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)} ر.س</span>
        </li>`
        )
        .join("");
}

function renderOrderCard(order, type) {
    const items = parseItems(order.items);
    const table = escapeHtml(order.table_no ?? "—");
    const code = escapeHtml(order.order_code || "—");

    if (type === "active") {
        return `
        <div class="rounded-2xl border-2 border-amber-500 bg-zinc-900 p-5 shadow-lg">
            <div class="flex justify-between items-start gap-3 mb-3">
                <div>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-black mb-2">قيد التجهيز</span>
                    <h2 class="text-2xl font-bold text-amber-400">طاولة ${table}</h2>
                    <p class="text-zinc-500 text-sm mt-1">كود: ${code}</p>
                </div>
                <div class="text-center">
                    <p class="text-xs text-zinc-500 mb-1">المؤقت</p>
                    <p id="order-timer" class="text-3xl font-mono font-bold text-amber-400">00:00</p>
                </div>
            </div>
            <ul class="my-4 space-y-2 border-y border-amber-800/30 py-3">${renderItemsList(items)}</ul>
            <button type="button" onclick="markAsReady('${order.id}')"
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg">
                تم التجهيز ✓
            </button>
        </div>`;
    }

    if (type === "pickup") {
        return `
        <div class="p-4 rounded-xl border border-emerald-700/40 bg-emerald-950/30">
            <div class="flex justify-between items-center mb-2">
                <span class="text-emerald-400 font-bold">📦 جاهز للاستلام</span>
                <span class="text-zinc-400 text-sm">طاولة ${table}</span>
            </div>
            <p class="text-zinc-500 text-xs mb-2">${code}</p>
            <ul class="mb-3 space-y-1">${renderItemsList(items)}</ul>
            <button type="button" onclick="markAsPickedUp('${order.id}')"
                class="w-full bg-amber-600 hover:bg-amber-500 text-black py-3 rounded-xl font-bold">
                تم الاستلام ✓
            </button>
        </div>`;
    }

    return `
    <div class="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50 opacity-80">
        <div class="flex justify-between text-sm">
            <span class="text-zinc-500">✓ مسلّم</span>
            <span class="text-zinc-400">طاولة ${table} · ${code}</span>
        </div>
    </div>`;
}

async function loadOrders() {
    const container = document.getElementById("orders-container");
    if (!container) return;

    const client = getClient();
    if (!client) return;

    const [activeRes, deliveredRes] = await Promise.all([
        client
            .from("orders")
            .select("*")
            .in("status", ["pending", "preparing", "ready"])
            .order("created_at", { ascending: true }),
        client
            .from("orders")
            .select("*")
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(12),
    ]);

    if (activeRes.error) {
        container.innerHTML =
            '<p class="text-red-400 text-center p-8">تعذر تحميل الطلبات</p>';
        return;
    }

    let orders = Array.isArray(activeRes.data) ? activeRes.data : [];
    ordersCache = orders.filter((o) => o.status === "pending");
    orders = mergeWithLocalPreparing(orders);

    if (!firstLoad) {
        orders.forEach((o) => {
            if (o.status === "pending" && !knownOrderIds.has(o.id)) playNewOrderSound();
        });
    }
    orders.forEach((o) => knownOrderIds.add(o.id));
    firstLoad = false;

    const pendingList = orders.filter((o) => o.status === "pending");
    const activeOrder =
        activeOrderId && orders.find((o) => o.id === activeOrderId && o.status === "preparing");
    const pickupList = orders.filter((o) => o.status === "ready");
    const deliveredList = Array.isArray(deliveredRes.data) ? deliveredRes.data : [];

    if (!activeOrder && activeOrderId) closeActive();

    let html = "";

    if (activeOrder) {
        html += renderOrderCard(activeOrder, "active");
    }

    if (pendingList.length > 0) {
        html += `<div class="mt-4 space-y-2">
            <h3 class="text-amber-500/80 text-sm font-bold">طلبات جديدة — اضغط لفتح</h3>`;
        html += pendingList
            .map(
                (o) => `
            <button type="button" onclick="openOrder('${o.id}')"
                class="w-full text-right p-4 rounded-xl border border-amber-700/40 bg-zinc-950 hover:border-amber-500 transition ${activeOrderId ? "" : "animate-pulse"}">
                <div class="flex justify-between">
                    <span class="text-amber-400 font-bold">🆕 طلب جديد</span>
                    <span class="text-zinc-400 text-sm">طاولة ${escapeHtml(o.table_no ?? "—")}</span>
                </div>
            </button>`
            )
            .join("");
        html += `</div>`;
    }

    html += `<div class="mt-6 space-y-2">
        <h3 class="text-emerald-500 text-sm font-bold">خانة الاستلام</h3>`;
    if (pickupList.length === 0) {
        html += '<p class="text-zinc-600 text-sm text-center py-4 border border-zinc-800 rounded-xl">لا طلبات للاستلام</p>';
    } else {
        html += pickupList.map((o) => renderOrderCard(o, "pickup")).join("");
    }
    html += `</div>`;

    html += `<div class="mt-6 space-y-2">
        <h3 class="text-zinc-500 text-sm font-bold">الطلبات المسلّمة</h3>`;
    if (deliveredList.length === 0) {
        html += '<p class="text-zinc-700 text-sm text-center py-3">لا توجد طلبات مسلّمة بعد</p>';
    } else {
        html += deliveredList.map((o) => renderOrderCard(o, "delivered")).join("");
    }
    html += `</div>`;

    if (!activeOrder && pendingList.length === 0 && pickupList.length === 0 && deliveredList.length === 0) {
        html = '<p class="text-zinc-500 text-center p-10 rounded-2xl bg-zinc-900 border border-amber-800/30">لا توجد طلبات</p>';
    }

    container.innerHTML = html;
    if (activeOrder) startTimerDisplay(activeOrder);
    else stopTimer();
}

async function updateOrder(orderId, payload, expectedStatus) {
    const client = getClient();
    if (!client) return { ok: false, error: "غير متصل" };

    let q = client.from("orders").update(payload).eq("id", orderId).select();
    if (expectedStatus) q = q.eq("status", expectedStatus);

    const { data, error } = await q;
    if (!error && data && data.length > 0) {
        hideRlsBanner();
        return { ok: true, data };
    }
    return { ok: false, error: error?.message || "لم يُحدَّث الطلب (تحقق من صلاحيات Supabase)" };
}

async function openOrder(orderId) {
    const client = getClient();
    if (!client) return alert("النظام غير متصل");

    const order = ordersCache.find((o) => o.id === orderId) || { id: orderId };
    const payload = { status: "preparing", preparing_started_at: new Date().toISOString() };

    let result = await updateOrder(orderId, payload, "pending");

    if (!result.ok && /preparing_started_at/i.test(result.error || "")) {
        result = await updateOrder(orderId, { status: "preparing" }, "pending");
    }

    if (!result.ok) {
        setLocalPreparing(order);
        showRlsBanner();
    } else {
        clearLocalPreparing(orderId);
        hideRlsBanner();
    }

    activeOrderId = orderId;
    localStorage.setItem("kitchen_active_order", orderId);
    await loadOrders();
}

/** تم التجهيز → خانة الاستلام + QR أخضر للزبون */
async function markAsReady(orderId) {
    const client = getClient();
    if (!client) return alert("النظام غير متصل");

    let result = await updateOrder(orderId, { status: "ready" }, "preparing");
    if (!result.ok) {
        result = await updateOrder(orderId, { status: "ready" }, null);
    }

    if (!result.ok) {
        showRlsBanner();
        return alert("تعذر الحفظ: " + result.error);
    }

    clearLocalPreparing(orderId);
    localStorage.removeItem(`kitchen_timer_${orderId}`);
    closeActive();
    await loadOrders();
}

/** تم الاستلام → الطلبات المسلّمة */
async function markAsPickedUp(orderId) {
    const client = getClient();
    if (!client) return alert("النظام غير متصل");

    const result = await updateOrder(orderId, { status: "completed" }, "ready");
    if (!result.ok) {
        showRlsBanner();
        return alert("تعذر الحفظ: " + result.error);
    }

    closeActive();
    await loadOrders();
}

function setupRealtime() {
    const client = getClient();
    if (!client) return;
    client
        .channel("kitchen_orders_live")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => loadOrders())
        .subscribe();
}

async function testRlsOnStart() {
    const client = getClient();
    if (!client) return;
    const { data } = await client.from("orders").select("id").limit(1);
    if (data?.length) hideRlsBanner();
}

function startKitchen() {
    closeActive();
    testRlsOnStart();
    loadOrders();
    setupRealtime();
}

window.openOrder = openOrder;
window.markAsReady = markAsReady;
window.markAsPickedUp = markAsPickedUp;

window.addEventListener("DOMContentLoaded", () => {
    if (getClient()) startKitchen();
    window.addEventListener("supabaseReady", startKitchen);
    setInterval(loadOrders, 20000);
});
