// --- SISTEMA DE VENTANAS ---
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
    });
});

function drag(e) {
    if (activeWindow) {
        activeWindow.style.left = `${e.clientX - offset.x}px`;
        activeWindow.style.top = `${e.clientY - offset.y}px`;
    }
}

// --- TERMINAL ---
const input = document.getElementById('command-input');
const history = document.getElementById('history');

function welcomeTerminal() {
    history.innerHTML = `
        <p class="text-slate-500 italic mb-2">DevOS Kernel v1.0.4 - Initialized</p>
        <p class="text-white font-bold uppercase tracking-widest">Escribe <span class="text-yellow-400 underline px-1">help</span> para ver los comandos disponibles.</p>
        <hr class="border-white/5 my-4">
    `;
}

const cmds = {
    'help': 'Comandos: shop, contact, run-automator, clear, about',
    'about': 'Portfolio OS diseñado para visualización de proyectos Python y Marketplace.',
    'contact': () => { openWindow('contact-window'); return 'Cargando directorio de contactos...'; },
    'shop': () => { openWindow('shop-window'); return 'Llamando a Shoppy.exe...'; },
    'run-automator': () => { openWindow('python-window'); runPythonScript(); return 'Iniciando conexión con DevMonitor...'; },
    'clear': () => { history.innerHTML = ''; return ''; }
};

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const c = input.value.toLowerCase().trim();
        history.innerHTML += `<p><span class="text-emerald-500">➜</span> ${c}</p>`;
        history.innerHTML += `<p class="text-slate-400 mb-4 ml-4">${typeof cmds[c] === 'function' ? cmds[c]() : (cmds[c] || 'Comando no reconocido')}</p>`;
        input.value = '';
        document.getElementById('terminal-scroll').scrollTop = history.scrollHeight;
    }
});

// --- PYTHON + MONITOR ---
function runPythonScript() {
    const out = document.getElementById('python-output');
    const logs = document.getElementById('mobile-logs');
    const eff = document.getElementById('efficiency-val');
    const graph = document.getElementById('mini-graph');
    const stat = document.getElementById('mobile-status');

    out.innerHTML = '<p class="text-blue-400">>>> Booting automated script...</p>';
    logs.innerHTML = '';

    const data = [
        { t: "Connecting to API", l: "API 200 OK", e: "25%" },
        { t: "Fetching Datasets", l: "Data Recieved", e: "55%" },
        { t: "Parsing JSON", l: "Structure Validated", e: "82%" },
        { t: "Syncing Device", l: "Live Link Established", e: "100%" }
    ];

    data.forEach((d, i) => {
        setTimeout(() => {
            out.innerHTML += `<p class="text-slate-300 ml-2 mt-1">● ${d.t}</p>`;
            eff.innerText = d.e;
            stat.innerText = "● ONLINE";
            stat.className = "text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold animate-pulse";
            
            const log = document.createElement('div');
            log.className = "log-entry";
            log.innerHTML = `<span>${d.l}</span><span class="text-blue-500">READY</span>`;
            logs.prepend(log);

            graph.children[i].style.height = d.e;
            graph.children[i].className = "bg-blue-500 w-full rounded-sm transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        }, (i + 1) * 800);
    });
}

// --- SHOPPY: CATÁLOGO Y PAGO ---
const products = [
    { id: 1, name: "Premium Keyboard", price: 125, img: "⌨️" },
    { id: 2, name: "Curved Monitor", price: 420, img: "🖥️" },
    { id: 3, name: "Wireless Mouse", price: 55, img: "🖱️" }
];
let cart = [];

function renderShop() {
    const content = document.getElementById('shop-content');
    content.innerHTML = `
        <div class="flex-1 overflow-y-auto p-8"><div class="grid grid-cols-2 gap-6" id="product-list"></div></div>
        <div class="w-80 bg-slate-50 border-l p-6 flex flex-col shadow-2xl">
            <h4 class="font-black text-xl mb-6">Tu Carrito</h4>
            <div id="cart-items" class="flex-1 space-y-3 overflow-y-auto text-sm"></div>
            <div class="border-t pt-6 mt-6">
                <div class="flex justify-between font-black text-2xl mb-6"><span>Total:</span><span class="text-blue-600">$${cart.reduce((s, p) => s + p.price, 0)}</span></div>
                <button onclick="showPaymentOptions()" class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95">CONTINUAR PAGO</button>
            </div>
        </div>
    `;
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="bg-white border p-6 rounded-[2rem] hover:shadow-2xl transition-all text-center group">
            <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">${p.img}</div>
            <h4 class="font-bold text-slate-800">${p.name}</h4>
            <p class="text-blue-600 font-black text-xl mt-1">$${p.price}</p>
            <button onclick="addToCart(${p.id})" class="mt-4 bg-slate-900 text-white w-full py-3 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all">AÑADIR</button>
        </div>
    `).join('');
    updateCartList();
}

function addToCart(id) {
    cart.push(products.find(p => p.id === id));
    updateCartList();
}

function updateCartList() {
    const box = document.getElementById('cart-items');
    if(!box) return;
    box.innerHTML = cart.length === 0 ? '<p class="text-slate-400 italic">No hay productos...</p>' : 
        cart.map((p, i) => `<div class="flex justify-between items-center bg-white p-3 border rounded-xl shadow-sm"><b>${p.name}</b><button class="text-red-500 font-bold" onclick="cart.splice(${i},1);updateCartList()">✕</button></div>`).join('');
}

function showPaymentOptions() {
    if(cart.length === 0) return alert("El carrito está vacío.");
    const content = document.getElementById('shop-content');
    content.innerHTML = `
        <div class="w-full p-10 overflow-y-auto animate-in fade-in">
            <button onclick="renderShop()" class="mb-6 text-blue-600 font-bold hover:underline">← Volver a la tienda</button>
            <h3 class="text-4xl font-black mb-10 text-center tracking-tighter italic">Selecciona el Pago</h3>
            
            <div class="grid grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
                <div onclick="renderSpecificForm('card')" class="pay-option"><span>💳</span><b class="text-[10px] mt-2">TARJETA</b></div>
                <div onclick="renderSpecificForm('paypal')" class="pay-option"><span>🅿️</span><b class="text-[10px] mt-2">PAYPAL</b></div>
                <div onclick="renderSpecificForm('apple')" class="pay-option"><span>🍎</span><b class="text-[10px] mt-2">APPLE PAY</b></div>
                <div onclick="renderSpecificForm('crypto')" class="pay-option"><span>₿</span><b class="text-[10px] mt-2">CRIPTO</b></div>
            </div>

            <div id="dynamic-form" class="max-w-md mx-auto bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <p class="text-slate-400 text-center italic">Selecciona una opción arriba para continuar</p>
            </div>
        </div>
    `;
}

function renderSpecificForm(type) {
    const form = document.getElementById('dynamic-form');
    if(type === 'card') {
        form.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-6"><b>Tarjeta de Crédito</b> <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Seguro</span></div>
                <div><label class="text-[9px] font-black text-slate-400 uppercase">Número de Tarjeta</label><input type="text" placeholder="**** **** **** 4242" class="payment-input"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[9px] font-black text-slate-400 uppercase">Vencimiento</label><input type="text" placeholder="12/28" class="payment-input"></div>
                    <div><label class="text-[9px] font-black text-slate-400 uppercase">CVC</label><input type="password" placeholder="***" class="payment-input"></div>
                </div>
                <button onclick="processOrder()" class="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-6">CONFIRMAR $${cart.reduce((s,p)=>s+p.price,0)}</button>
            </div>`;
    } else {
        form.innerHTML = `
            <div class="text-center py-6">
                <div class="text-4xl mb-4">${type === 'paypal' ? '🅿️' : type === 'apple' ? '🍎' : '₿'}</div>
                <p class="font-bold mb-6">Serás redirigido a la plataforma externa de ${type.toUpperCase()}</p>
                <button onclick="processOrder()" class="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl">LOG IN & PAGAR</button>
            </div>`;
    }
}

function processOrder() {
    const content = document.getElementById('shop-content');
    content.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center p-10 animate-in zoom-in-95">
            <div class="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-2xl">✓</div>
            <h3 class="text-4xl font-black italic">¡Orden Exitosa!</h3>
            <p class="text-slate-500 mt-2 mb-10">Tu pedido ha sido procesado por el sistema.</p>
            <button onclick="cart=[]; renderShop()" class="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">FINALIZAR</button>
        </div>
    `;
}

// Reloj e Inicio
setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }, 1000);
welcomeTerminal();
renderShop();