// --- SISTEMA BASE ---
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win.classList.contains('active')) {
        win.classList.add('active');
        win.style.left = `${(window.innerWidth/2) - (win.offsetWidth/2)}px`;
        win.style.top = `${(window.innerHeight/2) - (win.offsetHeight/2)}px`;
    }
    focusWindow(win);
}

function closeWindow(id) { document.getElementById(id).classList.remove('active'); }
function focusWindow(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
    win.style.zIndex = "50";
}

let activeWindow = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.window-header').forEach(header => {
    header.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        activeWindow = header.parentElement;
        focusWindow(activeWindow);
        const rect = activeWindow.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', () => activeWindow = null);
        e.preventDefault();
    });
});

function drag(e) {
    if (activeWindow) {
        activeWindow.style.left = `${e.clientX - offset.x}px`;
        activeWindow.style.top = `${e.clientY - offset.y}px`;
    }
}

// --- PYTHON + MONITOR ---
function runPythonScript() {
    const output = document.getElementById('python-output');
    const mobileLogs = document.getElementById('mobile-logs');
    const efficiency = document.getElementById('efficiency-val');
    const graph = document.getElementById('mini-graph');
    const status = document.getElementById('mobile-status');

    output.innerHTML = '<p class="text-blue-400">>>> Inyectando código en tiempo real...</p>';
    mobileLogs.innerHTML = '';

    const data = [
        { t: "[OK] Conectando a DB", l: "Database Connected", e: "32%" },
        { t: "[OK] Procesando Arrays", l: "Arrays Processed", e: "64%" },
        { t: "[INFO] Optimizando Memoria", l: "Memory Optimized", e: "88%" },
        { t: ">>> COMPLETO", l: "Final Sync OK", e: "99.2%" }
    ];

    data.forEach((item, i) => {
        setTimeout(() => {
            output.innerHTML += `<p class="mt-1 text-slate-300">${item.t}</p>`;
            efficiency.innerText = item.e;
            status.innerHTML = '● ACTIVE';
            status.className = "text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold animate-pulse";
            
            const div = document.createElement('div');
            div.className = "log-entry";
            div.innerHTML = `<span>${item.l}</span><span class="text-blue-400">LIVE</span>`;
            mobileLogs.prepend(div);

            graph.children[i].style.height = item.e;
            graph.children[i].className = "bg-blue-500 w-full rounded-sm transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]";
        }, (i + 1) * 800);
    });
}

// --- SHOPPY: CATÁLOGO Y PAGO ---
const products = [
    { id: 1, name: "Mechanical Keyboard", price: 120, img: "⌨️" },
    { id: 2, name: "UltraWide Monitor", price: 450, img: "🖥️" },
    { id: 3, name: "Ergonomic Mouse", price: 60, img: "🖱️" }
];
let cart = [];

function renderShop() {
    const content = document.getElementById('shop-content');
    content.innerHTML = `
        <div class="flex-1 overflow-y-auto p-8"><div class="grid grid-cols-2 gap-6" id="product-list"></div></div>
        <div class="w-80 bg-slate-50 border-l p-6 flex flex-col">
            <h4 class="font-bold mb-4">🛒 Carrito</h4>
            <div id="cart-items" class="flex-1 space-y-3 overflow-y-auto"></div>
            <div class="border-t pt-4 mt-4">
                <div class="flex justify-between font-black text-2xl mb-4"><span>Total:</span><span id="cart-total" class="text-orange-600">$0.00</span></div>
                <button onclick="showPaymentMethods()" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl active:scale-95 transition-all">PAGAR</button>
            </div>
        </div>
    `;
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="border p-6 rounded-3xl hover:border-orange-500 transition-all text-center">
            <div class="text-5xl mb-4">${p.img}</div>
            <h4 class="font-bold">${p.name}</h4>
            <p class="text-orange-600 font-black text-xl">$${p.price}</p>
            <button onclick="addToCart(${p.id})" class="mt-4 bg-slate-100 hover:bg-orange-500 hover:text-white w-full py-2 rounded-xl text-xs font-bold transition-all">AÑADIR</button>
        </div>
    `).join('');
    updateCart();
}

function addToCart(id) {
    cart.push(products.find(x => x.id === id));
    updateCart();
}

function updateCart() {
    const box = document.getElementById('cart-items');
    if(!box) return;
    box.innerHTML = cart.length === 0 ? '<p class="text-slate-400 italic">Vacio</p>' : 
        cart.map((p, i) => `<div class="flex justify-between bg-white p-2 border rounded-lg"><span>${p.name}</span><button onclick="cart.splice(${i},1);updateCart()">✕</button></div>`).join('');
    document.getElementById('cart-total').innerText = `$${cart.reduce((s, p) => s + p.price, 0)}`;
}

function showPaymentMethods() {
    if(cart.length === 0) return alert("Carrito vacío");
    document.getElementById('shop-content').innerHTML = `
        <div class="w-full p-10 text-center">
            <button onclick="renderShop()" class="mb-6 text-slate-400 hover:text-black font-bold">← VOLVER</button>
            <h3 class="text-3xl font-black mb-10 italic">Métodos de Pago</h3>
            <div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                <button onclick="paymentSuccess('Visa')" class="pay-method-btn"><span class="text-2xl">💳</span><b>Tarjeta</b></button>
                <button onclick="paymentSuccess('PayPal')" class="pay-method-btn"><span class="text-2xl">🅿️</span><b>PayPal</b></button>
                <button onclick="paymentSuccess('Crypto')" class="pay-method-btn"><span class="text-2xl">₿</span><b>Crypto</b></button>
                <button onclick="paymentSuccess('Apple')" class="pay-method-btn"><span class="text-2xl">🍎</span><b>Apple Pay</b></button>
            </div>
        </div>
    `;
}

function paymentSuccess(m) {
    document.getElementById('shop-content').innerHTML = `
        <div class="w-full flex flex-col items-center justify-center p-10">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">✓</div>
            <h3 class="text-2xl font-black">¡Gracias por tu compra!</h3>
            <p class="text-slate-500 mt-2">Pagado con ${m}</p>
            <button onclick="cart=[]; renderShop()" class="mt-8 bg-black text-white px-6 py-2 rounded-lg font-bold">Cerrar</button>
        </div>
    `;
}

// --- TERMINAL & RELOJ ---
const input = document.getElementById('command-input');
const history = document.getElementById('history');
const cmds = {
    'help': 'Comandos: shop, contact, run-automator, clear',
    'contact': () => { openWindow('contact-window'); return 'Abriendo contactos...'; },
    'shop': () => { openWindow('shop-window'); return 'Abriendo marketplace...'; },
    'run-automator': () => { openWindow('python-window'); runPythonScript(); return 'Iniciando...'; },
    'clear': () => { history.innerHTML = ''; return ''; }
};

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const c = input.value.toLowerCase();
        history.innerHTML += `<p><span class="text-emerald-500">➜</span> ${c}</p>`;
        history.innerHTML += `<p class="text-slate-400 mb-2">${typeof cmds[c] === 'function' ? cmds[c]() : (cmds[c] || 'Comando no encontrado')}</p>`;
        input.value = '';
        document.getElementById('terminal-scroll').scrollTop = history.scrollHeight;
    }
});

setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000);
renderShop();