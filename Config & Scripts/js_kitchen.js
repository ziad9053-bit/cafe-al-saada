/**
 * لوحة العامل: طلب جديد → فتح → قيد التجهيز + مؤقت → تم التجهيز → إشعار الزبون
 */

let activeOrderId = null;
let timerInterval = null;
let timerStartedAt = null;
let knownOrderIds = new Set();
let firstLoad = true;

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

async function loadOrders() {
    const container = document.getElementById("orders-container");
    if (!container) return;

    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return;

    const { data, error } = await supabaseClient
        .from("orders")
        .select("*")
        .in("status", ["pending", "preparing"])
        .order("created_at", { ascending: true });

    if (error) {
        console.error("خطأ جلب الطلبات:", error);
        container.innerHTML =
            '<p class="text-red-400 text-center p-8 rounded-xl bg-zinc-900 border border-red-800">تعذر تحميل الطلبات</p>';
        return;
    }

    const orders = Array.isArray(data) ? data : [];

    if (!firstLoad) {
        orders.forEach((o) => {
            if (o.status === "pending" && !knownOrderIds.has(o.id)) {
                playNewOrderSound();
            }
        });
    }
    orders.forEach((o) => knownOrderIds.add(o.id));
    firstLoad = false;

    if (orders.length === 0) {
        activeOrderId = null;
        stopTimer();
        container.innerHTML =
            '<p class="text-zinc-500 text-center p-10 rounded-2xl bg-zinc-900 border border-amber-800/30">لا توجد طلبات حالياً</p>';
        return;
    }

    const preparing = orders.find((o) => o.id === activeOrderId && o.status === "preparing");
    if (!preparing && activeOrderId) {
        const stillThere = orders.some((o) => o.id === activeOrderId);
        if (!stillThere) activeOrderId = null;
    }
    if (!activeOrderId) {
        const auto = orders.find((o) => o.status === "preparing");
        if (auto) activeOrderId = auto.id;
    }

    const pendingList = orders.filter((o) => o.status === "pending");
    const activeOrder = orders.find((o) => o.id === activeOrderId && o.status === "preparing");

    let html = "";

    if (activeOrder) {
        const items = parseItems(activeOrder.items);
        html += `
        <div class="rounded-2xl border-2 border-amber-500 bg-zinc-900 p-5 shadow-lg shadow-amber-900/20">
            <div class="flex justify-between items-start gap-3 mb-3">
                <div>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-black mb-2">قيد التجهيز</span>
                    <h2 class="text-2xl font-bold text-amber-400">طاولة ${escapeHtml(activeOrder.table_no ?? "—")}</h2>
                    <p class="text-zinc-500 text-sm mt-1">كود: ${escapeHtml(activeOrder.order_code || "—")}</p>
                </div>
                <div class="text-center">
                    <p class="text-xs text-zinc-500 mb-1">المؤقت</p>
                    <p id="order-timer" class="text-3xl font-mono font-bold text-amber-400">00:00</p>
                </div>
            </div>
            <ul class="my-4 space-y-2 border-t border-b border-amber-800/30 py-3">
                ${items.length
                    ? items
                          .map(
                              (item) => `
                    <li class="flex justify-between text-amber-100">
                        <span>${escapeHtml(item.name || "صنف")} × ${item.quantity || 1}</span>
                        <span class="text-amber-500">${(parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)} ر.س</span>
                    </li>`
                          )
                          .join("")
                    : '<li class="text-zinc-500">لا توجد أصناف</li>'}
            </ul>
            <button type="button" onclick="markAsDone('${activeOrder.id}')"
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg">
                تم التجهيز ✓
            </button>
        </div>`;
    }

    if (pendingList.length > 0) {
        html += `<div class="mt-4 space-y-3">
            <h3 class="text-amber-500/80 text-sm font-bold px-1">طلبات جديدة — اضغط لفتح</h3>`;
        html += pendingList
            .map(
                (order) => `
            <button type="button" onclick="openOrder('${order.id}')"
                class="w-full text-right p-4 rounded-xl border border-amber-700/40 bg-zinc-950 hover:border-amber-500 hover:bg-zinc-900 transition animate-pulse">
                <div class="flex justify-between items-center">
                    <span class="text-amber-400 font-bold">🆕 طلب جديد</span>
                    <span class="text-zinc-400 text-sm">طاولة ${escapeHtml(order.table_no ?? "—")}</span>
                </div>
                <p class="text-zinc-500 text-xs mt-1">${escapeHtml(order.order_code || "")}</p>
            </button>`
            )
            .join("");
        html += `</div>`;
    }

    container.innerHTML = html;

    if (activeOrder) {
        startTimerDisplay(activeOrder);
    } else {
        stopTimer();
    }
}

/** العامل يضغط على طلب جديد → يفتح ويصبح قيد التجهيز */
async function openOrder(orderId) {
    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return alert("النظام غير متصل");

    const payload = {
        status: "preparing",
        preparing_started_at: new Date().toISOString(),
    };

    let { error } = await supabaseClient
        .from("orders")
        .update(payload)
        .eq("id", orderId)
        .eq("status", "pending");

    if (error && /preparing_started_at/i.test(error.message || "")) {
        ({ error } = await supabaseClient
            .from("orders")
            .update({ status: "preparing" })
            .eq("id", orderId)
            .eq("status", "pending"));
    }

    if (error) {
        console.error(error);
        alert("تعذر فتح الطلب: " + error.message);
        return;
    }

    activeOrderId = orderId;
    localStorage.setItem("kitchen_active_order", orderId);
    await loadOrders();
}

/** تم التجهيز → الزبون يرى QR أخضر */
async function markAsDone(orderId) {
    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return alert("النظام غير متصل");

    const btn = event?.target;
    if (btn) {
        btn.disabled = true;
        btn.textContent = "جاري الإرسال...";
    }

    const { error } = await supabaseClient
        .from("orders")
        .update({ status: "completed" })
        .eq("id", orderId);

    if (error) {
        console.error("خطأ التحديث:", error);
        alert("فشل تحديث الطلب.");
        if (btn) {
            btn.disabled = false;
            btn.textContent = "تم التجهيز ✓";
        }
        return;
    }

    if (activeOrderId === orderId) activeOrderId = null;
    localStorage.removeItem("kitchen_active_order");
    localStorage.removeItem(`kitchen_timer_${orderId}`);
    stopTimer();
    await loadOrders();
}

function setupRealtime() {
    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return;

    supabaseClient
        .channel("kitchen_orders_live")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => {
                loadOrders();
            }
        )
        .subscribe();
}

function startKitchen() {
    const saved = localStorage.getItem("kitchen_active_order");
    if (saved) activeOrderId = saved;
    loadOrders();
    setupRealtime();
}

window.openOrder = openOrder;
window.markAsDone = markAsDone;

window.addEventListener("DOMContentLoaded", () => {
    if (window.getSupabaseClient?.()) startKitchen();
    window.addEventListener("supabaseReady", startKitchen);
    setInterval(loadOrders, 30000);
});
