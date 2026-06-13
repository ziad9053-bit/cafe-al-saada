/**
 * شريط سفلي ثابت: رئيسية | ساخن | بارد | حلى | سلة
 * يُخفى تلقائياً في صفحة السلة (body.cart-page)
 */
(function initBottomNav() {
    if (document.body.classList.contains("cart-page")) return;

    const pathLower = window.location.pathname.toLowerCase();
    const isInSubFolder = pathLower.includes("/front-end/") || pathLower.includes("/admin-panel/");
    const isInFrontend = pathLower.includes("/front-end/");

    const homeHref = isInSubFolder ? "../index.html" : "./index.html";
    const menuBase = isInFrontend ? "./menu.html" : (isInSubFolder ? "../Front-end/menu.html" : "./Front-end/menu.html");
    const cartHref = isInFrontend ? "./cart.html" : (isInSubFolder ? "../Front-end/cart.html" : "./Front-end/cart.html");
    const trackHref = isInFrontend ? "./tracking.html" : (isInSubFolder ? "../Front-end/tracking.html" : "./Front-end/tracking.html");

    const params = new URLSearchParams(window.location.search);
    const currentCat = params.get("cat");
    const isHome =
        !pathLower.includes("menu.html") &&
        !pathLower.includes("cart.html");

    // جلب آخر طلب محفوظ لربط زر التتبع
    const lastOrderId = localStorage.getItem("lastOrderId");
    const trackUrl = lastOrderId ? `${trackHref}?orderId=${encodeURIComponent(lastOrderId)}` : trackHref;
    const isTracking = pathLower.includes("tracking.html");

    const activeClass = "font-bold text-amber-400";
    const activeStyle = "filter: drop-shadow(0 0 8px rgba(232,184,74,0.6));";
    const idleClass = "text-amber-600/60 hover:text-amber-500/80 transition-colors";
    const idleStyle = "";
    const whiteStyle = "text-white/40";

    const nav = document.createElement("nav");
    nav.id = "app-bottom-nav";
    nav.className =
        "fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-md border-t border-amber-500/30 px-2 py-3 flex justify-around items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]";

    const svgHome = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`;
    const svgHot = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>`;
    const svgCold = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 10.5b5 5 0 01-5-5m-5 5v1m-5-1a5 5 0 015-5m-5 5H4.5m15 0h-2.5m-5 5a5 5 0 015 5m-5-5v1m-5-1a5 5 0 015 5m-5-5H4.5m10 0H14.5" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15M4.5 12h15M7.5 7.5l9 9m-9 0l9-9" /></svg>`;
    const svgDessert = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>`;
    const svgTrack = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>`;
    const svgCart = `<svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" /></svg>`;

    nav.innerHTML = `
        <a href="${homeHref}" class="flex flex-col items-center gap-0.5 text-[11px] ${isHome && !currentCat ? activeClass : idleClass}" style="${isHome && !currentCat ? activeStyle : idleStyle}" data-nav="home">
            ${svgHome}<span>الرئيسية</span>
        </a>
        <a href="${menuBase}?cat=hot" class="flex flex-col items-center gap-0.5 text-[11px] ${currentCat === "hot" ? activeClass : idleClass}" style="${currentCat === "hot" ? activeStyle : idleStyle}" data-nav="hot">
            ${svgHot}<span>ساخن</span>
        </a>
        <a href="${menuBase}?cat=cold" class="flex flex-col items-center gap-0.5 text-[11px] ${currentCat === "cold" ? activeClass : idleClass}" style="${currentCat === "cold" ? activeStyle : idleStyle}" data-nav="cold">
            ${svgCold}<span>بارد</span>
        </a>
        <a href="${menuBase}?cat=dessert" class="flex flex-col items-center gap-0.5 text-[11px] ${currentCat === "dessert" ? activeClass : idleClass}" style="${currentCat === "dessert" ? activeStyle : idleStyle}" data-nav="dessert">
            ${svgDessert}<span>حلى</span>
        </a>
        <a href="${trackUrl}" id="nav-track-link" class="relative flex flex-col items-center gap-0.5 text-[11px] ${isTracking ? activeClass : (lastOrderId ? idleClass : whiteStyle)}" style="${isTracking ? activeStyle : (lastOrderId ? idleStyle : '')}" data-nav="track">
            <div id="order-status-indicator" class="absolute -top-2 left-0 w-full flex justify-center gap-0.5 h-1.5"></div>
            ${svgTrack}<span>طلبي</span>
        </a>
        <a href="${cartHref}" class="relative flex flex-col items-center gap-0.5 text-[11px] ${pathLower.includes("cart.html") ? activeClass : idleClass}" style="${pathLower.includes("cart.html") ? activeStyle : idleStyle}" data-nav="cart">
            ${svgCart}<span>السلة</span>
            <span id="cart-badge" class="absolute -top-1 -left-1 bg-amber-500 text-black text-[10px] font-bold rounded-full min-w-[1.2rem] h-[1.2rem] flex items-center justify-center px-1 shadow-[0_0_10px_rgba(232,184,74,0.5)]">0</span>
        </a>
    `;

    document.body.appendChild(nav);
    document.body.classList.add("has-bottom-nav");

    function updateCartBadge() {
        const badge = document.getElementById("cart-badge");
        if (!badge) return;
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((s, i) => s + (parseInt(i.quantity) || 0), 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? "flex" : "none";
        } catch {
            badge.textContent = "0";
        }
    }

    async function monitorOrderStatus() {
        if (!lastOrderId) return;
        const client = typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
        if (!client) return;

        const updateDots = (status) => {
            const el = document.getElementById("order-status-indicator");
            if (!el) return;
            
            let color = "";
            if (status === "pending") color = "#f5d76e"; // ذهبي - عند اتمام الطلب
            else if (status === "preparing" || status === "ready") color = "#22C55E"; // أخضر - عند التجهيز
            
            if (color) {
                el.innerHTML = `
                    <div class="w-1.5 h-1.5 rounded-sm" style="background-color:${color};box-shadow:0 0 5px ${color}"></div>
                    <div class="w-1.5 h-1.5 rounded-sm" style="background-color:${color};box-shadow:0 0 5px ${color}"></div>
                    <div class="w-1.5 h-1.5 rounded-sm" style="background-color:${color};box-shadow:0 0 5px ${color}"></div>
                `;
            } else {
                el.innerHTML = "";
            }
        };

        const { data } = await client.from("orders").select("status").eq("id", lastOrderId).maybeSingle();
        if (data) updateDots(data.status);

        client.channel(`nav_order_status`).on('postgres_changes', {
            event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${lastOrderId}`
        }, payload => updateDots(payload.new.status)).subscribe();
    }

    updateCartBadge();
    window.addEventListener("storage", updateCartBadge);
    window.updateCartBadge = updateCartBadge;

    window.addEventListener("supabaseReady", monitorOrderStatus);
    if (typeof window.getSupabaseClient === "function" && window.getSupabaseClient()) monitorOrderStatus();
})();
