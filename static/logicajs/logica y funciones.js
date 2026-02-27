/* --- SISTEMA DE CONTROL DE SESIÓN (REPARADO) --- */
const firebaseConfig = {
    apiKey: "AIzaSyDptMI7ftGRly3fteYQBZfQ-H7VDywc5Xo",
    authDomain: "rapydeliveryapp.firebaseapp.com",
    projectId: "rapydeliveryapp",
    storageBucket: "rapydeliveryapp.firebasestorage.app",
    messagingSenderId: "687803365242",
    appId: "1:687803365242:web:5fb21a2f5377a2b3da88c3",
    measurementId: "G-N83T3RPYJL"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const API_URL = "https://raiderelporgreso.onrender.com";

db.enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') console.log("Persistencia falló: Múltiples pestañas.");
        else if (err.code == 'unimplemented') console.log("El navegador no soporta persistencia.");
    });

let currentUser = null;
let userOrders = []; 
let currentRestaurantKey = null; 
let currentMenuFilter = 'all';

// --- FUNCIÓN DE ALERTA PRO ---
function showProError(msg, fields = []) {
    const modal = document.getElementById('pro-error-modal');
    const msgLabel = document.getElementById('pro-error-msg');
    
    if (msgLabel) msgLabel.innerText = msg;
    if (modal) modal.style.display = 'flex'; 
    
    fields.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.classList.add('input-error-shake');
            setTimeout(() => el.classList.remove('input-error-shake'), 500);
        }
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario detectado:", user.email);
        
        currentUser = {
            name: user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario'), 
            email: user.email,
            uid: user.uid
        };

        if (typeof validateSubscription === 'function') {
            validateSubscription(); 
        } else {
            isRapiPlusActive = localStorage.getItem('rapiPlus_' + user.uid) === 'true';
        }
        
        const welcome = document.getElementById('welcome-user');
        if(welcome) welcome.innerText = "Hola, " + currentUser.name;

        const profileName = document.getElementById('profile-name-display');
        const profileEmail = document.getElementById('profile-email-display');
        
        if (profileName) profileName.innerText = currentUser.name;
        if (profileEmail) profileEmail.innerText = currentUser.email;

        if(typeof loadOrdersFromFirebase === 'function') {
            loadOrdersFromFirebase(user.uid);
        }

        const currentView = document.querySelector('.view.active');
        if(currentView && currentView.id === 'view-login') {
            if (typeof navTo === "function") navTo('onboarding'); 
        } else if (!currentView || currentView.id === 'intro-screen') {
            if(typeof renderMerchants === "function") renderMerchants(); 
            if(typeof navTo === "function") navTo('home');
        }

    } else {
        console.log("No hay usuario activo.");
        currentUser = null;
        isRapiPlusActive = false; 
        if(typeof navTo === "function") navTo('login');
    }
});

function listenToOrders(uid) {
    db.collection('orders')
    .where('userId', '==', uid) 
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
        userOrders = [];
        snapshot.forEach((doc) => {
            userOrders.push(doc.data());
        });
        // REPARACIÓN: Llamar directamente al renderizado para evitar loops con initLoyalty
        if(typeof renderHistoryUI === "function") renderHistoryUI();
        if(typeof initLoyalty === 'function') initLoyalty();

    }, (error) => {
        console.error("Error Historial:", error);
    });
}

/* --- HISTORIAL DE ÓRDENES (VERSIÓN PRO: POPPINS + ESTRELLAS + COMPLETADO) --- */
window.renderHistoryUI = function() {
    const container = document.getElementById('history-list');
    if (!container) return;

    if (!userOrders || userOrders.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:#9ca3af;">No hay pedidos aún.</div>`;
        return;
    }

    container.innerHTML = userOrders.map(o => {
        const storeName = o.storeName || 'Pedido Rapi';
        const dateStr = o.date || 'Hoy';
        const timeStr = o.time || '';
        const locationStr = o.loc || o.location || 'Sector Progreseño';
        const totalStr = o.totalStr || ('L ' + (o.total || 0));
        
        // CAMBIO SOLICITADO: Mostrar siempre como COMPLETADO o ENVIADO visualmente
        // Aunque internamente sea 'enviado', visualmente diremos 'EXITOSO' o 'COMPLETADO'
        const statusBadge = `<span style="background:#dcfce7; color:#15803d; font-size:0.7rem; padding:4px 8px; border-radius:6px; font-weight:800; border:1px solid #bbf7d0;">COMPLETADO ✅</span>`;

        const itemsDetail = o.summary || o.itemsSummary || 'Detalle no disponible';

        return `
        <div class="history-card-pro" style="background:white; border-radius:18px; padding:18px; margin-bottom:15px; border:1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <div style="background:#fff7ed; width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--rapi-orange); border:1px solid #fed7aa;">
                        <i class="fas fa-store"></i>
                    </div>
                    <div>
                        <b style="color:#1e293b; font-size:0.95rem; display:block;">${storeName}</b>
                        <small style="color:#94a3b8; font-weight:600; font-size:0.75rem;">${dateStr} • ${timeStr}</small>
                    </div>
                </div>
                ${statusBadge}
            </div>
            
            <div style="background:#f8fafc; padding:12px; border-radius:12px; margin-bottom:12px; border-left: 3px solid var(--rapi-orange);">
                <div class="hc-items-text">
                    ${itemsDetail}
                </div>
            </div>
            
            <div style="border-top:1px dashed #e2e8f0; margin-bottom:10px;"></div>
            
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:5px; color:#64748b; font-size:0.8rem;">
                    <i class="fas fa-map-marker-alt" style="color:#ef4444;"></i>
                    <span style="font-weight:600;">${locationStr}</span>
                </div>
                
                <div style="text-align:right;">
                    <div style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">Total Pagado</div>
                    <div style="display:flex; align-items:center;">
                        <b style="font-size:1.2rem; color:#1e293b;">${totalStr}</b>
                        <div class="price-stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
};
function initLoyalty() {
    // REPARACIÓN: Validación si userOrders no está definido
    const totalOrders = (userOrders && Array.isArray(userOrders)) ? userOrders.length : 0;
    const progress = totalOrders % 10;
    const isCelebrating = (totalOrders > 0 && progress === 0);
    
    const container = document.getElementById('loyalty-steps-container');
    const mainBox = document.getElementById('loyalty-box-main');
    if(!container) return;

    if (isCelebrating) {
        if(mainBox) mainBox.classList.add('loyalty-celebrate');
    } else {
        if(mainBox) mainBox.classList.remove('loyalty-celebrate');
    }

    container.innerHTML = '<div class="l-bar-bg"></div><div class="l-bar-fill" id="loyalty-bar-fill" style="width:0%;"></div>';
    
    for(let i=1; i<=10; i++) {
        const isGift = (i === 10);
        const filled = isCelebrating ? true : (i <= progress);
        container.innerHTML += `
            <div class="l-step ${filled ? 'filled' : ''} ${isGift ? 'gift' : ''}">
                ${isGift ? '<i class="fas fa-crown"></i>' : i}
            </div>`;
    }
    
    setTimeout(() => {
        const fill = document.getElementById('loyalty-bar-fill');
        if(fill) fill.style.width = isCelebrating ? '100%' : (progress * 10) + '%';
    }, 200);

    const countLabel = document.getElementById('loyalty-count');
    if(countLabel) countLabel.innerText = isCelebrating ? 10 : progress;

    // Ya no llamamos a renderHistoryUI() aquí para evitar recursión infinita
}

function saveOrderToFirebase(orderData) {
    return new Promise((resolve, reject) => {
        const user = firebase.auth().currentUser;
        // REPARACIÓN: Permitir guardar pedidos de invitados si se implementa lógica backend
        const userId = user ? user.uid : 'guest_user';
        const userEmail = user ? user.email : 'guest@rapidelivery.hn';

        const dataParaNube = {
            userId: userId, 
            userEmail: userEmail,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
            ...orderData
        };

        db.collection('orders').add(dataParaNube)
            .then((docRef) => {
                console.log("✅ GUARDADO EN LA NUBE EXITOSO. ID:", docRef.id);
                resolve(docRef.id);
            })
            .catch((error) => {
                console.error("❌ ERROR AL SUBIR A LA NUBE:", error);
                // Resolvemos aunque falle para no bloquear la app (el pedido va por WhatsApp igual)
                resolve(null); 
            });
    });
}

/* --- BASE DE DATOS DE SECTORES (REPARADA) --- */
const sectors = [
    // --- CASCO URBANO Y ALREDEDORES (Base L 80) ---
    {n:"Colonia Bendek", p:80}, {n:"Colonia Rodas Alvarado", p:80}, {n:"Colonia William Hall", p:80},
    {n:"Colonia Monte Fresco", p:80}, {n:"Colonia Mendieta", p:80}, {n:"Colonia 27 de Octubre", p:80},
    {n:"Colonia Dionisio", p:80}, {n:"Colonia San Jorge", p:80}, {n:"Colonia Primavera", p:80},
    {n:"Colonia Los Castaños", p:80}, {n:"Colonia La Alameda", p:80}, {n:"Colonia San Isidro", p:80},
    {n:"Colonia Anexo Melgar", p:80}, {n:"Colonia Anexo Suyapa", p:80}, {n:"Barrio Suyapa", p:80},
    {n:"Colonia Inva", p:80}, {n:"Colonia Pénjamo", p:80}, {n:"Colonia Moya", p:80},
    {n:"Colonia 17 de Julio", p:80}, {n:"Colonia 19 de Junio", p:80, r:true}, 
    {n:"Brisas del Salto", p:80, r:true}, {n:"Residencial Altos del Katan", p:80}, 
    {n:"Colonia Katan", p:80}, {n:"Barrio San Francisco", p:80}, 
    {n:"Colonia Llave en Mano", p:80, d:true}, {n:"Barrio Los Ángeles", p:80}, 
    {n:"Colonia Ramírez Reina", p:80, r:true}, {n:"Colonia Canadá", p:80, r:true}, 
    {n:"Colonia El Porvenir", p:80, r:true}, {n:"Colonia Cárcamo", p:80, r:true},
    {n:"Colonia Esperanza de Jesús", p:80}, {n:"Colonia 2 de Marzo", p:80, d:true}, 
    {n:"Colonia Mangandí", p:80, d:true}, {n:"Colonia La Jensy", p:80}, 
    {n:"Colonia La Emmanuel", p:80}, {n:"Colonia Kennedy", p:80}, {n:"Colonia La Berlín", p:80},
    {n:"Colonia 3 de Abril", p:80, d:true}, {n:"Colonia Citramedi", p:80, d:true}, 
    {n:"Colonia Covitral", p:80}, {n:"Colonia Suazo", p:80, r:true}, 
    {n:"Colonia Los Laureles", p:80, r:true}, {n:"Colonia Las Paredes", p:80, r:true}, 
    {n:"Barrio Montevideo", p:80}, {n:"Barrio San Miguel", p:80}, 
    {n:"Colonia Pulicarpo", p:80}, {n:"Colonia Centroamericana", p:80}, 
    {n:"Colonia San Martín", p:80}, {n:"Colonia 2 de Julio", p:80}, 
    {n:"Barrio Fátima", p:80}, {n:"Colonia Citraterco", p:80}, 
    {n:"Colonia Las Palmeras", p:80}, {n:"Palermo", p:80}, {n:"Santa Fe", p:80},
    {n:"Colonia La Alemania", p:80, r:true}, {n:"Colonia Marvin Reyes", p:80},
    {n:"Colonia Residencial El Progreso", p:80}, {n:"Colonia Fraternidad", p:80}, 
    {n:"Colonia Zona la Compañía", p:80}, {n:"Colonia 6 de Julio", p:80},

    // --- RESIDENCIALES Y ZONAS ESPECIALES (L 100 - L 140) ---
    {n:"Colonia La Democracia", p:100, d:true}, {n:"Residencial La Granja", p:100}, 
    {n:"Residencial Villas Belinda", p:100}, {n:"Residencial La Romana", p:100}, 
    {n:"Residencial La Perla", p:100}, {n:"Residencial Rosa Amanda", p:100},
    {n:"Residencial Villa Ángeles", p:100}, {n:"Residencial Los Ángeles", p:100}, 
    {n:"Residencial Ponderosa", p:100}, {n:"Colonia Omonita", p:120, d:true}, 
    {n:"Empacadora de Omonita", p:120}, {n:"Zip el Porvenir", p:120}, 
    {n:"Residencial Mónaco", p:120}, {n:"Aldea Camalote", p:120, d:true}, 
    {n:"Residencial Quinta de Santa Mónica", p:120}, {n:"Las 7", p:130, r:true},
    {n:"Residencial Las Orquídea", p:140}, {n:"La Maquila", p:140},

    // --- SALIDAS Y ALDEAS CERCANAS (L 150 - L 200) ---
    {n:"Quebrada Seca", p:150}, {n:"Quebrada de Yoro", p:150, r:true}, 
    {n:"Colonia Las Delicias", p:150}, {n:"Colonia Guadalupe", p:150}, 
    {n:"Colonia Camping", p:150}, {n:"El Bálsamo", p:200}, {n:"Guachilla", p:200}, 
    {n:"Aldea La Guacamaya", p:200}, {n:"Aldea La Sarrosa", p:200}, 
    {n:"Aldea Las Minas", p:200}, {n:"Aldea La Pita", p:200}, 
    {n:"Aldea Agua Blanca Sur", p:200}, {n:"Aldea Arena Blanca", p:200}, 
    {n:"Aldea Bella Aurora", p:200}, {n:"Aldea Cules", p:200},

    // --- ZONAS LEJANAS (L 250 - L 500) ---
    {n:"Toyos", p:250}, {n:"Guaimita", p:250, r:true}, {n:"La 36", p:250, r:true},
    {n:"Santa Rita", p:250}, {n:"Aldea Urraco Sur", p:250}, 
    {n:"Colonia Bellavista", p:250}, {n:"Mezapa", p:300, r:true}, 
    {n:"La Lima", p:300}, {n:"El Negrito", p:400}, {n:"Morazán", p:400}, 
    {n:"San Manuel", p:400}, {n:"San Pedro Sula", p:500}
];

/* --- LÓGICA DE FILTRADO (REPARADA) --- */
function filterSectors(v, context) {
    let resId = 'food-results';
    if (context === 'service') resId = 'service-results';
    if (context === 'address-book') resId = 'book-sector-results'; // Ahora sí reconoce el book
    
    const res = document.getElementById(resId);
    const h = new Date().getHours();

    if (!v || v.length < 1) { 
        if(res) res.style.display = 'none'; 
        return; 
    }

    const f = sectors.filter(s => s.n.toLowerCase().includes(v.toLowerCase()));

    if(res) {
        res.innerHTML = f.map(s => {
            let pClass = 'p-green';
            if (s.p >= 100) pClass = 'p-orange';
            if (s.p >= 200) pClass = 'p-red';

            const isRestricted = s.r === true;
            const closed = isRestricted && (h < 6 || h >= 19);
            const warningTag = isRestricted ? '<span class="zone-tag z-time"><i class="fas fa-clock"></i> 6am-7pm</span>' : '';
            const dangerTag = s.d ? '<span class="zone-tag" style="color:#c2410c; border-color:#c2410c; background:#fff7ed;">⚠️ Precaución</span>' : '';

            return `
            <div class="result-item" onclick="pickSector('${s.n}', '${context}')" style="opacity:${closed ? 0.6 : 1};">
                <div style="display:flex; flex-direction:column;">
                    <span>${s.n}</span>
                    <div style="margin-top:4px;">${warningTag} ${dangerTag}</div>
                </div>
                <span class="price-badge ${pClass}">${closed ? 'CERRADO' : 'L ' + s.p}</span>
            </div>`;
        }).join('');
        res.style.display = f.length ? 'block' : 'none';
    }
}

    /* --- 2. VARIABLES GLOBALES Y LÓGICA DE INICIO --- */
    
    let cart = [], deliveryFee = 0, discountActive = false, payMethod = 'Efectivo', bankSel = '', selectedSector = null;
    let isRapiPlusActive = false;  
    let currentServiceType = '', selectedComplaint = '';
    let currentTip = 0;
    let isPriority = false;
    let isNightModeActive = false; 
    let isCartMinimized = false;

    // --- INICIALIZACIÓN ---
    setTimeout(() => { 
        const intro = document.getElementById('intro-screen');
        if (intro) {
            intro.style.opacity = '0'; 
            setTimeout(() => { 
                intro.style.display = 'none'; 
            }, 600); 
        }
    }, 2500);

    window.onload = () => {
        // Ahora sí es seguro llamar a estas funciones porque DB ya existe
        if(typeof renderMerchants === "function") renderMerchants();
        if(typeof initAiSuggestion === "function") initAiSuggestion();
        if(typeof initNavParticles === "function") initNavParticles();
        if(typeof initHomeBgParticles === "function") initHomeBgParticles();
    }

    function loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch((error) => {
            alert("Error al iniciar con Google: " + error.message);
        });
    }

    window.logoutUser = function() {
        console.log("Intentando cerrar sesión...");
        auth.signOut().then(() => {
            currentUser = null;
            userOrders = [];
            isRapiPlusActive = false;
            window.location.reload();
        }).catch(() => {
            window.location.reload();
        });
    };

    function loadOrdersFromFirebase(uid) {
        db.collection('orders').where('userId', '==', uid).orderBy('timestamp', 'desc')
            .get().then((querySnapshot) => {
                userOrders = [];
                querySnapshot.forEach((doc) => {
                    userOrders.push(doc.data());
                });
                if(typeof initLoyalty === "function") initLoyalty();
            });
    }

    /* --- 3. LÓGICA DE SUGERENCIAS Y DEMÁS FUNCIONES --- */
    
    // --- LÓGICA DE IA FAKE (SUGERENCIAS POR HORA) ---
    function initAiSuggestion() {
        const h = new Date().getHours();
        const box = document.getElementById('ai-suggestion-box');
        const title = document.getElementById('ai-title');
        const desc = document.getElementById('ai-desc');
        const icon = document.querySelector('.ai-icon-pulse i');
        let query = "";

        if (!box) return;

        if (h >= 22 || h < 4) { 
            title.innerText = "Antojos Nocturnos 🌙";
            desc.innerText = "Ver menú económico y cenas.";
            icon.className = "fas fa-moon";
            isNightModeActive = true; 
            box.style.background = "linear-gradient(135deg, #1f1f1f 0%, #333 100%)";
            box.style.borderColor = "#555";
            title.style.color = "white";
        } 
        else if (h >= 6 && h < 11) {
            title.innerText = "¡Buenos días! ☕";
            desc.innerText = "¿Desayunamos? Baleadas o Típico.";
            icon.className = "fas fa-coffee";
            query = "Sampedrano"; 
        } else if (h >= 11 && h < 16) {
            title.innerText = "Hora del Almuerzo 🍗";
            desc.innerText = "Pollo Chuco, Carnes o Asados.";
            icon.className = "fas fa-drumstick-bite";
            query = "Pollo"; 
        } else if (h >= 16 && h < 22) {
            title.innerText = "¿Cenamos Rico? 🌮";
            desc.innerText = "Tacos, Burgers o Antojitos.";
            icon.className = "fas fa-utensils";
            query = "Burger"; 
        }

        if(!isNightModeActive) box.setAttribute('data-search', query);
    }

    function applyAiSuggestion() {
        const box = document.getElementById('ai-suggestion-box');
        box.style.transform = "scale(0.95)";
        setTimeout(() => box.style.transform = "scale(1)", 150);

        if (isNightModeActive) {
            if(typeof populateNightMenu === "function") populateNightMenu();
            navTo('view-night-mode');
            return;
        }
        const q = box.getAttribute('data-search');
        const input = document.querySelector('.home-search-input');
        input.value = q;
        if(typeof dynamicSearch === "function") dynamicSearch(q);
        setTimeout(() => { document.querySelector('.home-search-wrapper').scrollIntoView({behavior: 'smooth'}); }, 300);
    }

    function populateNightMenu() {
        const container = document.getElementById('night-list-container');
        container.innerHTML = '';
        
        let nightItems = [];
        for(let k in DB) {
            if(DB[k].type === 'food') {
                DB[k].menu.forEach(m => {
                    if(m.p <= 140) {
                        nightItems.push({ ...m, rest: DB[k].name, restId: k, img: m.img || DB[k].cover });
                    }
                });
            }
        }
        nightItems = nightItems.sort(() => 0.5 - Math.random()).slice(0, 10);

        nightItems.forEach((item, index) => {
            container.innerHTML += `
                <div class="night-list-item" style="animation-delay: ${index * 0.1}s">
                    <img src="${item.img}" style="width:50px; height:50px; border-radius:10px; object-fit:cover; background:white; padding:2px;">
                    <div style="flex:1;">
                        <div style="font-weight:700; color:#fff;">${item.n}</div>
                        <div style="font-size:0.75rem; color:#9ca3af;">${item.rest}</div>
                    </div>
                    <div class="night-price-tag">L ${item.p}</div>
                    <button onclick="updateItemQty('${item.n}', ${item.p}, '${item.rest}', 1, this)" style="background:#333; color:white; width:35px; height:35px; border-radius:10px; border:1px solid #555;"><i class="fas fa-plus"></i></button>
                </div>`;
        });
    }

    function initNavParticles() {
        const container = document.getElementById('nav-particles');
        if(!container) return;
        const icons = ['fa-motorcycle', 'fa-box', 'fa-hamburger', 'fa-pizza-slice', 'fa-star']; 
        container.innerHTML = ''; 
        for(let i=0; i<15; i++) {
            const p = document.createElement('i');
            p.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} nav-particle`;
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.fontSize = (0.5 + Math.random() * 0.7) + 'rem';
            container.appendChild(p);
        }
    }

    window.renderMerchants = function() {
        const cFood = document.getElementById('merchant-container');
        const cHealth = document.getElementById('health-container');
        const cMarket = document.getElementById('market-container'); 
        if (!cFood || !cHealth) return;
        
        cFood.innerHTML = ''; cHealth.innerHTML = ''; 
        if(cMarket) cMarket.innerHTML = '';
        
        for(let k in DB) {
            const m = DB[k];
            const html = `<div class="merchant-bubble" onclick="openRestaurant('${k}')"><img src="${m.img}" class="merchant-img ${m.type}"><span style="font-size:0.75rem; font-weight:700; color:#6b7280; margin-top:5px; text-align:center; line-height:1.2; max-width:85px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.name}</span></div>`;
            
            if(m.type === 'food') cFood.innerHTML += html;
            else if(m.type === 'health') cHealth.innerHTML += html;
            else if(m.type === 'market' && cMarket) cMarket.innerHTML += html;
        }

        // ¡AQUÍ ENCENDEMOS EL ALGORITMO!
        if (typeof renderSmartRecommendations === "function") {
            renderSmartRecommendations();
        }
    };

    window.scrollMerchants = function(type, dir) {
        const container = document.getElementById(type + '-container');
        if(container) container.scrollBy({ left: dir * 150, behavior: 'smooth' });
    };

    // --- 2. LÓGICA DE LA NUEVA VISTA: TODOS LOS COMERCIOS ---
    window.openAllMerchants = function(filter = 'all') {
        navTo('all-merchants');
        
        // Colorear el chip activo
        document.querySelectorAll('.store-filter').forEach(el => {
            el.classList.remove('active');
            if (el.getAttribute('onclick').includes(`'${filter}'`)) {
                el.classList.add('active');
            }
        });
        renderAllMerchantsList(filter);
    };

    window.filterAllStores = function(filter, btn) {
        document.querySelectorAll('.store-filter').forEach(el => el.classList.remove('active'));
        if(btn) btn.classList.add('active');
        renderAllMerchantsList(filter);
    };

    window.renderAllMerchantsList = function(filter) {
        const container = document.getElementById('all-merchants-list');
        if(!container) return;
        
        let html = '';
        for(let k in DB) {
            const m = DB[k];
            if (filter !== 'all' && m.type !== filter) continue;
            
            let badgeClass = 'food'; let badgeText = 'Restaurante'; let icon = 'fa-utensils';
            if (m.type === 'health') { badgeClass = 'health'; badgeText = 'Farmacia'; icon = 'fa-heartbeat'; }
            if (m.type === 'market') { badgeClass = 'market'; badgeText = 'Supermercado'; icon = 'fa-shopping-basket'; }
            
            html += `
            <div class="m-card-pro" onclick="openRestaurant('${k}')">
                <img src="${m.img}" class="m-card-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3188/3188120.png'">
                <div class="m-card-info">
                    <span class="m-badge ${badgeClass}"><i class="fas ${icon}"></i> ${badgeText}</span>
                    <div class="m-card-title">${m.name}</div>
                    <div style="font-size:0.8rem; color:#64748b; display:flex; align-items:center; gap:8px;">
                        <span><i class="fas fa-star" style="color:#f59e0b;"></i> Nuevo</span> 
                        <span><i class="fas fa-motorcycle" style="opacity:0.7;"></i> Rápido</span>
                    </div>
                </div>
                <div style="background:#f1f5f9; width:30px; height:30px; border-radius:50%; display:flex; justify-content:center; align-items:center;"><i class="fas fa-chevron-right" style="color:#94a3b8; font-size:0.8rem;"></i></div>
            </div>`;
        }
        container.innerHTML = html || '<div style="text-align:center; padding:40px; color:#9ca3af;"><i class="fas fa-store-slash" style="font-size:3rem; margin-bottom:10px; opacity:0.3;"></i><br>No hay comercios en esta categoría.</div>';
    };

    // --- 3. REVOLUCIÓN DEL MENÚ (AHORA POR CATEGORÍAS TIPO UBER EATS) ---
    window.renderMenuItems = function() {
        if (!currentRestaurantKey || !DB[currentRestaurantKey]) return;

        const d = DB[currentRestaurantKey];
        let items = d.menu || [];

        if (currentMenuFilter === 'top') items = items.filter(i => i.top);
        else if (currentMenuFilter === 'offers') items = items.filter(i => i.offer);

        const menuList = document.getElementById('menu-list');
        if (!menuList) return;

        if (items.length === 0) {
            menuList.innerHTML = '<div style="text-align:center; padding:40px; color:#9ca3af;"><i class="fas fa-box-open" style="font-size:3rem; margin-bottom:10px; opacity:0.3;"></i><br>Menú no disponible.</div>';
            return;
        }

        // Agrupar productos por la propiedad 'cat' (Ej: cat: "Bebidas")
        const categories = {};
        items.forEach(i => {
            const cat = i.cat || i.category || 'Menú Principal';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(i);
        });

        let finalHtml = '';
        const catKeys = Object.keys(categories);
        
        // Dibujar Barra de Navegación Flotante (Solo si hay más de 1 categoría y estamos viendo todo)
        if (catKeys.length > 1 && currentMenuFilter === 'all') {
            finalHtml += `<div class="menu-cat-nav hide-scrollbar">`;
            catKeys.forEach((cat, idx) => {
                const safeCatId = cat.replace(/[^a-zA-Z0-9]/g, '');
                finalHtml += `<button class="cat-nav-btn ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('cat-sec-${safeCatId}').scrollIntoView({behavior:'smooth', block:'start'}); document.querySelectorAll('.cat-nav-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">${cat}</button>`;
            });
            finalHtml += `</div>`;
        }

        // Dibujar Productos separados por Título de Categoría
        catKeys.forEach(cat => {
            const safeCatId = cat.replace(/[^a-zA-Z0-9]/g, '');
            
            // Título de la sección
            if (catKeys.length > 1 && currentMenuFilter === 'all') {
                finalHtml += `<h3 class="menu-cat-header" id="cat-sec-${safeCatId}">${cat}</h3>`;
            }

            finalHtml += categories[cat].map(i => {
                const count = typeof getCount === "function" ? getCount(i.n) : 0;
                const itemImg = i.img || d.cover;
                const safeId = i.n.replace(/[^a-zA-Z0-9]/g, '');
                
                // Formateo para evitar errores con nombres que tienen comillas
                const safeNameForFunc = i.n.replace(/'/g, "\\'");
                const safeRestForFunc = d.name.replace(/'/g, "\\'");
                
                let priceHtml = '';
                if (isRapiPlusActive) {
                    const discountedPrice = (i.p * 0.95).toFixed(2);
                    priceHtml = `
                        <div style="display:flex; flex-direction:column; margin-top:5px;">
                            <span style="text-decoration:line-through; color:#9ca3af; font-size:0.75rem;">L ${i.p}</span>
                            <span class="price-plus-active">L ${discountedPrice} <i class="fas fa-bolt" style="font-size:0.7rem;"></i></span>
                        </div>`;
                } else {
                    priceHtml = `
                        <div style="display:flex; align-items:center; margin-top:5px;">
                            <span style="color:var(--rapi-dark); font-weight:900;">L ${i.p}</span>
                            <span class="price-plus-teaser">-5% c/Plus</span>
                        </div>`;
                }

                const offerTag = i.offer ? `<span style="background:#ef4444; color:white; font-size:0.6rem; padding:3px 6px; border-radius:5px; font-weight:bold; margin-left:5px;">OFERTA</span>` : '';
                const topTag = i.top ? `<span style="color:#f59e0b; font-size:0.7rem; margin-left:5px; font-weight:800;"><i class="fas fa-fire"></i> Top</span>` : '';
                
                // Si tienes descripciones en la BD (i.desc), se verán aquí
                const descHtml = i.desc ? `<div style="font-size:0.8rem; color:#64748b; margin-top:3px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${i.desc}</div>` : '';

                return `
                <div class="item-row" id="row-${safeId}" style="transition: all 0.3s ease; align-items:flex-start; padding:15px; border-radius:20px; border:1px solid #f1f5f9;">
                    <img src="${itemImg}" class="prod-img-src" style="width:85px; height:85px; border-radius:15px; object-fit:cover; margin-right:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);" onerror="this.src='${d.cover}'">
                    <div style="flex:1;">
                        <div style="font-weight:800; color:#1e293b; font-size:1rem; line-height:1.2;">${i.n} ${offerTag} ${topTag}</div>
                        ${descHtml}
                        ${priceHtml}
                    </div>
                    <div class="qty-control" style="align-self:flex-end;">
                        <button class="qty-btn sub" onclick="updateItemQty('${safeNameForFunc}', ${i.p}, '${safeRestForFunc}', -1, this)" style="display:${count > 0 ? 'flex' : 'none'};"><i class="fas fa-minus"></i></button>
                        <div class="qty-val" id="qty-${safeId}" style="display:${count > 0 ? 'block' : 'none'};">${count}</div>
                        <button class="qty-btn add" onclick="updateItemQty('${safeNameForFunc}', ${i.p}, '${safeRestForFunc}', 1, this)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>`;
            }).join('');
        });

        menuList.innerHTML = finalHtml;
    };

    function dynamicSearch(val) {
        const res = document.getElementById('dynamic-results');
        const wrapper = document.querySelector('.home-search-wrapper');

        if (!res) return;

        // SI NO HAY TEXTO O ES MUY CORTO
        if(!val || val.length < 2) { 
            res.classList.remove('show'); 
            setTimeout(()=> {
                res.style.display='none';
                if(wrapper) wrapper.style.zIndex = "1000"; 
            }, 300); 
            return; 
        }
        
        if(wrapper) wrapper.style.zIndex = "99999"; 

        res.style.display = 'block';
        setTimeout(()=>res.classList.add('show'), 10);

        if (typeof DB === 'undefined') return;

        const matches = Object.keys(DB).filter(k => DB[k].name.toLowerCase().includes(val.toLowerCase()));
        
        if(matches.length === 0) {
            res.innerHTML = '<div style="padding:15px; text-align:center; color:#9ca3af;">No encontramos resultados 😢</div>';
        } else {
            res.innerHTML = matches.map(k => `
                <div class="d-res-item" onclick="openRestaurant('${k}')">
                    <img src="${DB[k].img}" class="d-res-img">
                    <div>
                        <div style="font-weight:700; color:#374151;">${DB[k].name}</div>
                        <div style="font-size:0.75rem; color:#9ca3af;">${DB[k].type === 'food' ? 'Restaurante' : 'Salud / Farmacia'}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    function navTo(id) {
        const targetId = id.startsWith('view-') ? id : 'view-' + id;
        const targetView = document.getElementById(targetId);
        const navBar = document.getElementById('main-nav');

        if (!targetView) return;

        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
            v.style.opacity = '0';
        });

        targetView.style.display = 'block';
        setTimeout(() => {
            targetView.classList.add('active');
            targetView.style.opacity = '1';
        }, 10);

        if (id === 'home' || id === 'view-home') {
            if(typeof renderMerchants === "function") renderMerchants();
            if(typeof initAiSuggestion === "function") initAiSuggestion();
            if (navBar) navBar.style.transform = "translateY(0)";
        }
        
        if (id === 'checkout') {
            if(typeof renderCart === "function") renderCart();
        }
        
        if (id === 'history') {
            if(typeof initLoyalty === "function") initLoyalty();
        }

        if (id === 'login' || id === 'onboarding') {
            if (navBar) navBar.style.transform = "translateY(100px)";
        }

        if(typeof updateNavBar === "function") updateNavBar(id);
        
        // REPARACIÓN CRÍTICA: Restaurar la visibilidad del carrito flotante
        if(typeof updateMiniCart === "function") updateMiniCart();
    }

/* --- NAVEGACIÓN Y CONTROL DE NAVBAR (REPARADA AL 100%) --- */
window.updateNavBar = function(id) {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const viewId = id.replace('view-', '');
    
    // Lista de las ÚNICAS vistas donde la barra debe estar visible
    const showNavViews = ['home', 'history', 'profile'];

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    if (!showNavViews.includes(viewId)) {
        // La ocultamos con animación y luego la APAGAMOS por completo (display:none)
        // para que al hacer scroll en el menú nunca vuelva a aparecer.
        nav.style.transform = "translateY(150px)";
        setTimeout(() => { nav.style.display = 'none'; }, 300);
    } else {
        // La volvemos a encender cuando regresas al Home o Perfil
        nav.style.display = 'flex';
        setTimeout(() => { nav.style.transform = "translateY(0)"; }, 10);
        
        if (viewId === 'home' && navItems[0]) navItems[0].classList.add('active');
        if (viewId === 'history' && navItems[1]) navItems[1].classList.add('active');
        if (viewId === 'profile' && navItems[3]) navItems[3].classList.add('active');
    }
}

    /* --- LÓGICA DE RESTAURANTE INTERACTIVO (REPARADO) --- */
    window.openRestaurant = function(k) {
        if (!k || !DB[k]) return navTo('home'); // REPARACIÓN: Seguridad contra llaves nulas

        currentRestaurantKey = k;
        currentMenuFilter = 'all';

        const searchRes = document.getElementById('dynamic-results');
        const searchWrapper = document.querySelector('.home-search-wrapper');
        
        if (searchRes) {
            searchRes.classList.remove('show');
            setTimeout(() => searchRes.style.display = 'none', 300);
        }
        
        // REPARACIÓN: Devolver el z-index a la normalidad al entrar al restaurante
        if (searchWrapper) searchWrapper.style.zIndex = "1000";
        
        const searchInput = document.querySelector('.home-search-input');
        if (searchInput) searchInput.value = '';

        const d = DB[k];
        const restTitle = document.getElementById('rest-title');
        const restCover = document.getElementById('rest-cover');
        const restLogo = document.getElementById('rest-logo-img');

        if (restTitle) restTitle.innerText = d.name;
        if (restCover) restCover.style.backgroundImage = `url(${d.cover})`;
        if (restLogo) restLogo.src = d.img;

        const filterContainer = document.getElementById('menu-filters-container');
        if (filterContainer) {
            filterContainer.innerHTML = `
                <div class="menu-filter-chip active" onclick="filterMenu('all', this)"><i class="fas fa-utensils"></i>Menú</div>
                <div class="menu-filter-chip" onclick="filterMenu('top', this)"><i class="fas fa-fire"></i>Más vendidos</div>
                <div class="menu-filter-chip" onclick="filterMenu('offers', this)"><i class="fas fa-tag"></i>Ofertas</div>
            `;
        }

        renderMenuItems();
        navTo('restaurant');
    }

    /* --- RENDER DE MENÚ (REPARADO) --- */
    function renderMenuItems() {
        // REPARACIÓN: Validación de seguridad para evitar crash
        if (!currentRestaurantKey || !DB[currentRestaurantKey]) return;

        const d = DB[currentRestaurantKey];
        let items = d.menu || [];

        if (currentMenuFilter === 'top') items = items.filter(i => i.top);
        else if (currentMenuFilter === 'offers') items = items.filter(i => i.offer);

        const menuList = document.getElementById('menu-list');
        if (!menuList) return;

        if (items.length === 0) {
            menuList.innerHTML = '<div style="text-align:center; padding:30px; color:#9ca3af;">No hay productos disponibles aquí.</div>';
            return;
        }

        menuList.innerHTML = items.map(i => {
            const count = typeof getCount === "function" ? getCount(i.n) : 0;
            const itemImg = i.img || d.cover;
            
            // REPARACIÓN: Limpieza de ID más profunda para evitar caracteres prohibidos
            const safeId = i.n.replace(/[^a-zA-Z0-9]/g, '');
            
            let priceHtml = '';
            if (isRapiPlusActive) {
                const discountedPrice = (i.p * 0.95).toFixed(2);
                priceHtml = `
                    <div style="display:flex; flex-direction:column;">
                        <span style="text-decoration:line-through; color:#9ca3af; font-size:0.75rem;">L ${i.p}</span>
                        <span class="price-plus-active">L ${discountedPrice} <i class="fas fa-bolt" style="font-size:0.7rem;"></i></span>
                    </div>`;
            } else {
                priceHtml = `
                    <div style="display:flex; align-items:center;">
                        <span style="color:var(--rapi-dark); font-weight:800;">L ${i.p}</span>
                        <span class="price-plus-teaser">-5% c/Plus</span>
                    </div>`;
            }

            const offerTag = i.offer ? `<span style="background:#ef4444; color:white; font-size:0.6rem; padding:2px 5px; border-radius:5px; font-weight:bold; margin-left:5px;">OFERTA</span>` : '';
            const topTag = i.top ? `<span style="color:#f59e0b; font-size:0.7rem; margin-left:5px;"><i class="fas fa-fire"></i> Top</span>` : '';

            return `
            <div class="item-row" id="row-${safeId}" style="transition: all 0.3s ease;">
                <img src="${itemImg}" class="prod-img-src" style="width:70px; height:70px; border-radius:12px; object-fit:cover; margin-right:15px; box-shadow:0 4px 10px rgba(0,0,0,0.05);" onerror="this.src='${d.cover}'">
                <div style="flex:1;">
                    <div style="font-weight:800; color:#374151; font-size:0.95rem; line-height:1.2; margin-bottom:5px;">${i.n} ${offerTag} ${topTag}</div>
                    ${priceHtml}
                </div>
                <div class="qty-control">
                    <button class="qty-btn sub" onclick="updateItemQty('${i.n}', ${i.p}, '${d.name}', -1, this)" style="display:${count > 0 ? 'flex' : 'none'}"><i class="fas fa-minus"></i></button>
                    <div class="qty-val" id="qty-${safeId}" style="display:${count > 0 ? 'block' : 'none'}">${count}</div>
                    <button class="qty-btn add" onclick="updateItemQty('${i.n}', ${i.p}, '${d.name}', 1, this)"><i class="fas fa-plus"></i></button>
                </div>
            </div>`;
        }).join('');
    }

function getCount(name) { return cart.filter(i => i.n === name).length; }

    /* --- LÓGICA DE CARRITO: REGLA DE 1 SOLO COMERCIO --- */
let pendingItem = null; // Guarda el producto temporalmente si hay choque de tiendas

window.updateItemQty = function(n, p, s, change, btn) {
    if (change > 0) {
        // VALIDACIÓN: ¿Está intentando pedir de otro restaurante?
        if (cart.length > 0 && cart[0].s !== s) {
            pendingItem = { n, p, s, btn }; // Guardamos lo que quería añadir
            const modal = document.getElementById('clear-cart-modal');
            const msg = document.getElementById('clear-cart-msg');
            if(msg) msg.innerHTML = `Ya tienes productos de <b>${cart[0].s}</b>. Por políticas de entrega, solo puedes pedir de un local a la vez. <br><br>¿Deseas vaciar tu carrito actual para pedir de <b>${s}</b>?`;
            if(modal) modal.style.display = 'flex';
            return; // Bloqueamos la acción hasta que responda
        }

        // Si es del mismo restaurante, añadimos normal
        cart.push({ n, p, s });
        if (btn) {
            const row = btn.closest('.item-row') || btn.closest('.night-list-item');
            const img = row ? row.querySelector('img') : null;
            if (img && typeof flyToCart === "function") flyToCart(img);
        }
    } else {
        const idx = cart.findIndex(i => i.n === n);
        if (idx > -1) cart.splice(idx, 1);
    }
    
    refreshQtyUI(n);
}

// Acción si el cliente decide vaciar el carrito
window.confirmClearCart = function() {
    // 1. Borramos visualmente los números del restaurante viejo
    cart.forEach(item => {
        const safeName = item.n.replace(/[^a-zA-Z0-9]/g, '');
        const qtyEl = document.getElementById(`qty-${safeName}`);
        const subBtn = document.querySelector(`#row-${safeName} .qty-btn.sub`);
        if(qtyEl) { qtyEl.innerText = '0'; qtyEl.style.display = 'none'; }
        if(subBtn) { subBtn.style.display = 'none'; }
    });

    // 2. Vaciamos el código
    cart = [];
    
    // 3. Añadimos el nuevo producto que estaba esperando
    if(pendingItem) {
        cart.push({ n: pendingItem.n, p: pendingItem.p, s: pendingItem.s });
        refreshQtyUI(pendingItem.n);
    }

    document.getElementById('clear-cart-modal').style.display = 'none';
    pendingItem = null;
}

// Función auxiliar para repintar los números
function refreshQtyUI(n) {
    const count = getCount(n);
    const safeName = n.replace(/[^a-zA-Z0-9]/g, ''); // Limpieza exacta
    
    const qtyEl = document.getElementById(`qty-${safeName}`);
    const subBtn = document.querySelector(`#row-${safeName} .qty-btn.sub`);

    if (qtyEl) {
        qtyEl.innerText = count;
        qtyEl.style.display = count > 0 ? 'block' : 'none';
    }
    if (subBtn) {
        subBtn.style.display = count > 0 ? 'flex' : 'none';
    }
    
    const checkoutView = document.getElementById('view-checkout');
    if (checkoutView && checkoutView.classList.contains('active')) {
        if (typeof renderCart === "function") renderCart();
    }
    if (typeof updateMiniCart === "function") updateMiniCart();
}

window.updateMiniCart = function() {
    const miniCart = document.getElementById('mini-cart');
    const badge = document.getElementById('badge');
    const miniTotal = document.getElementById('mini-total');

    if (!miniCart) return;

    if (cart.length === 0) {
        miniCart.classList.remove('visible');
        if(badge) badge.classList.remove('show');
        return;
    }

    const t = cart.reduce((a, b) => a + b.p, 0);
    if(miniTotal) miniTotal.innerText = "L " + t.toFixed(2);
    
    if(badge) {
        badge.innerText = cart.length;
        badge.classList.add('show');
    }

    const activeViewEl = document.querySelector('.view.active');
    const activeView = activeViewEl ? activeViewEl.id : '';

    // ¡LA MAGIA!: El mini carrito SOLO sale en la vista del restaurante
    if (activeView === 'view-restaurant') {
        miniCart.classList.add('visible');
    } else {
        miniCart.classList.remove('visible');
    }
};

window.toggleCartSize = function(e) { 
    // Ya no se usa la burbuja, así que si esto se llama por accidente, nos manda al checkout
    navTo('checkout'); 
}

    function pickSector(n, context) {
        const s = sectors.find(x => x.n === n);
        if (!s) return; 

        const h = new Date().getHours();
        if (s.r === true && (h < 6 || h >= 19)) {
            const timeModal = document.getElementById('time-error-screen');
            if(timeModal) timeModal.style.display = 'flex';
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            return;
        }

        if (context === 'food') {
            selectedSector = s;
            const sectorInput = document.getElementById('sector-input');
            const foodRes = document.getElementById('food-results');
            
            if(sectorInput) sectorInput.value = n;
            if(foodRes) foodRes.style.display = 'none';
            
            deliveryFee = s.p;

            const alert = document.getElementById('zone-alert');
            if(alert) {
                alert.style.display = 'none';
                if (s.d || s.r) {
                    alert.style.display = 'block';
                    alert.className = s.d ? 'warning-tag danger' : 'warning-tag';
                    alert.innerText = s.r ? "⚠️ ZONA CON HORARIO: Solo entregamos hasta las 6:59 PM." : "⚠️ ZONA DE PRECAUCIÓN: Ten dinero exacto.";
                }
            }
            if(typeof updateTotals === "function") updateTotals();
        } else if (context === 'service') {
            const servInput = document.getElementById('input-sector');
            const servPrice = document.getElementById('service-price');
            const servRes = document.getElementById('service-results');
            
            if(servInput) servInput.value = n;
            if(servPrice) servPrice.innerText = "Costo Estimado Envío: L " + s.p;
            if(servRes) servRes.style.display = 'none';
        } else if (context === 'address-book') { // REPARACIÓN: Esto llenará la colonia en Mis Direcciones
            const bookInput = document.getElementById('new-addr-sector');
            const bookRes = document.getElementById('book-sector-results');
            if (bookInput) bookInput.value = n;
            if (bookRes) bookRes.style.display = 'none';
        }
    }

    window.renderCart = function() {
        const c = document.getElementById('cart-list');
        if (!c) return;

        if (cart.length === 0) {
            c.innerHTML = '<div style="text-align:center; padding:20px; color:#9ca3af;">Tu carrito está vacío</div>';
            if(typeof updateTotals === "function") updateTotals();
            return;
        }

        const groups = {};
        cart.forEach(item => {
            if (!groups[item.n]) groups[item.n] = { ...item, count: 0, total: 0 };
            groups[item.n].count++;
            groups[item.n].total += item.p;
        });

        c.innerHTML = Object.values(groups).map(g => `
        <div class="invoice-row" style="align-items:center; margin-bottom:15px; border-bottom:1px solid #f3f4f6; padding-bottom:10px;">
            <div style="flex:1;">
                <div style="font-weight:700; color:#374151;">
                    <span style="color:var(--rapi-orange);">${g.count}x</span> ${g.n}
                </div>
                <div style="font-size:0.8rem; color:#9ca3af;">${g.s}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                <b style="color:var(--rapi-dark);">L ${g.total.toFixed(2)}</b>
                <div class="qty-control" style="background:#fff; border:1px solid #e5e7eb;">
                    <button class="qty-btn sub" onclick="updateItemQty('${g.n}', ${g.p}, '${g.s}', -1, this)" style="width:28px; height:28px;"><i class="fas fa-minus"></i></button>
                    <button class="qty-btn add" onclick="updateItemQty('${g.n}', ${g.p}, '${g.s}', 1, this)" style="width:28px; height:28px;"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>`).join('');
        
        if(typeof updateTotals === "function") updateTotals();
    };

/* --- LÓGICA DE DESCUENTOS Y TOTALES (REPARADA) --- */
    function toggleDiscount() {
        const d = new Date().getDay();
        // 5 = Viernes, 6 = Sábado
        if (d !== 5 && d !== 6) {
            if (typeof openModal === "function") {
                openModal('fas fa-calendar-times', 'Solo Fines de Semana', 'El descuento del 10% en envío solo aplica Viernes y Sábados.', '#ef4444');
            }
            return;
        }
        discountActive = !discountActive;
        const discBtn = document.getElementById('discount-btn');
        if (discBtn) discBtn.classList.toggle('active');
        updateTotals();
    }

    function updateTotals() {
        if (!cart) return;
        const sub = cart.reduce((a, b) => a + b.p, 0);
        
        // 1. CALCULAR DESCUENTOS REALES
        let productDiscount = 0;
        if (isRapiPlusActive) productDiscount = sub * 0.05;

        const completedOrders = (userOrders && userOrders.length) ? userOrders.length : 0;
        const isFreeDelivery = completedOrders > 0 && completedOrders % 10 === 0;
        let finalDeliveryFee = deliveryFee || 0;

        if (isFreeDelivery) {
            finalDeliveryFee = 0;
        } else if (isRapiPlusActive) {
            finalDeliveryFee = finalDeliveryFee * 0.5; // 50% OFF REAL
        } else if (discountActive) {
            finalDeliveryFee = finalDeliveryFee * 0.9;
        }

        const priorityCost = isPriority ? 12 : 0;
        const total = Math.max(0, (sub - productDiscount) + finalDeliveryFee + priorityCost + (currentTip || 0));

        // 2. ACTUALIZAR UI BÁSICA
        const elSub = document.getElementById('lbl-sub');
        if(elSub) elSub.innerText = "L " + sub.toFixed(2);
        
        const invoiceContainer = document.getElementById('checkout-summary-container');
        
        // Limpiar filas dinámicas previas (Reparación: Selector más preciso)
        const oldRowPlus = document.getElementById('row-plus-discount');
        if (oldRowPlus) oldRowPlus.remove();
        const oldRowMissed = document.getElementById('row-missed-savings');
        if (oldRowMissed) oldRowMissed.remove();

        // 3. LOGICA PLUS ACTIVO vs INACTIVO
        if (invoiceContainer) {
            if (isRapiPlusActive) {
                if (sub > 0) {
                    const div = document.createElement('div');
                    div.id = 'row-plus-discount';
                    div.className = 'invoice-row';
                    div.style.color = '#2563eb';
                    div.style.fontWeight = '700';
                    div.innerHTML = `<span><i class="fas fa-crown"></i> Desc. Plus (5%)</span><b>- L ${productDiscount.toFixed(2)}</b>`;
                    // Reparación: Insertar siempre después del subtotal (primer hijo)
                    if (invoiceContainer.firstChild) {
                        invoiceContainer.insertBefore(div, invoiceContainer.children[1]);
                    }
                }
            } else if (finalDeliveryFee > 0 && !isFreeDelivery) {
                // MOSTRAR LO QUE SE PIERDE (MARKETING)
                const potentialShippingSave = (deliveryFee || 0) * 0.5;
                const div = document.createElement('div');
                div.id = 'row-missed-savings';
                div.className = 'missed-savings-box';
                div.onclick = function() { navTo('rapi-plus'); };
                div.innerHTML = `
                    <div><i class="fas fa-info-circle"></i> Ahorra <b>L ${potentialShippingSave.toFixed(2)}</b> en envío con Plus</div>
                    <div style="font-weight:800; text-decoration:underline; margin-top:2px;">¡Actívalo aquí!</div>
                `;
                const totalSection = document.querySelector('.total-section');
                if(totalSection) invoiceContainer.insertBefore(div, totalSection);
            }
        }

        const shipLabel = document.getElementById('lbl-ship');
        if(shipLabel) {
            if (isFreeDelivery) {
                shipLabel.innerHTML = `<span style="text-decoration:line-through; color:#9ca3af;">L ${deliveryFee}</span> <span style="color:#10b981;">GRATIS</span>`;
            } else if (isRapiPlusActive) {
                shipLabel.innerHTML = `<span style="text-decoration:line-through; color:#9ca3af;">L ${deliveryFee}</span> <span style="color:#2563eb; font-weight:900;">L ${finalDeliveryFee.toFixed(2)}</span>`;
            } else {
                shipLabel.innerText = "L " + finalDeliveryFee.toFixed(2);
            }
        }

        const elTotal = document.getElementById('lbl-total');
        if(elTotal) elTotal.innerText = "L " + total.toFixed(2);
        
        // Reparación: Pasar el total calculado directamente para evitar errores de lectura del DOM
        calcChange(total); 
    }

// --- LÓGICA DE PAGOS Y BANCOS PRO (COMPLETA Y REPARADA) ---

// --- LÓGICA DE PAGOS Y BANCOS PRO (ACTUALIZADA PARA TARJETAS) ---
window.setPayment = function(m, el) {
    payMethod = m;
    
    // AQUÍ ESTÁ EL CAMBIO DE CLASE A "payment-card-pro"
    document.querySelectorAll('.payment-card-pro').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    
    const cashBox = document.getElementById('cash-box');
    const transferBox = document.getElementById('transfer-flow-box');
    const txtFinal = document.getElementById('txt-final-order');
    
    if(cashBox) cashBox.style.display = m === 'Efectivo' ? 'block' : 'none';
    if(transferBox) transferBox.style.display = m === 'Transferencia' ? 'block' : 'none';
    
    if(txtFinal) {
        txtFinal.innerText = m === 'Efectivo' ? "CONFIRMAR EN WHATSAPP" : "PROCESAR ORDEN";
    }
    
    if (m === 'Tarjeta' && typeof openModal === "function") {
        openModal('fas fa-credit-card', 'En Construcción', 'Estamos trabajando para aceptar tarjetas directamente en la app. Por favor usa Efectivo o Transferencia por ahora.', 'var(--rapi-orange)');
        setPayment('Efectivo', document.querySelector('.payment-card-pro')); 
    }
};

window.selectBank = function(b, el) {
    bankSel = b; 
    document.querySelectorAll('.bank-pro-btn').forEach(x => x.classList.remove('active'));
    if(el) el.classList.add('active');
};

window.requestPaymentData = function() {
    if(!bankSel) {
        return showProError("Selecciona el banco que deseas utilizar.", []);
    }

    const radar = document.getElementById('payment-radar-screen');
    const bName = document.getElementById('radar-bank-name');
    
    if(bName) bName.innerText = bankSel;
    if(radar) radar.style.display = 'flex';

    // Total a pagar
    const elTotal = document.getElementById('lbl-total');
    const totalTxt = elTotal ? elTotal.innerText : "L 0.00";
    const userName = currentUser ? currentUser.name : 'Invitado';

    const msg = `🏦 *SOLICITUD DE CUENTA*\n👤 *Cliente:* ${userName}\n💰 *Monto a pagar:* ${totalTxt}\n🏦 *Banco preferido:* ${bankSel}\n\nHola, quiero hacer el pago de mi pedido. ¿Me brindan el número de cuenta y el Token de validación?`;

    setTimeout(() => {
        // Apagamos el radar
        if(radar) radar.style.display = 'none';
        
        // ¡MAGIA!: Regresamos al usuario automáticamente al Checkout
        navTo('checkout');
        
        // Hacemos que la pantalla baje directo a donde se pone el Token
        setTimeout(() => {
            const tokenInput = document.getElementById('payment-token');
            if(tokenInput) {
                tokenInput.scrollIntoView({behavior: 'smooth', block: 'center'});
                // Efecto visual para que sepa dónde escribir
                tokenInput.style.boxShadow = "0 0 15px rgba(16, 185, 129, 0.5)";
                setTimeout(() => { tokenInput.style.boxShadow = "none"; }, 2000);
            }
        }, 500);

        // Abrimos WhatsApp
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    }, 2500); 
};

// 4. TOKENS VÁLIDOS PARA TRANSFERENCIAS
const validTransferTokens = [
    "PAGADO-20020", "PAGADO-30030", "PAGADO-40040", 
    "PAGADO-50050", "PAGADO-70070", "PAGADO-80080",
    "RAPI-112233", "RAPI-998877"
];

    function calcChange(forcedTotal = null) {
        if (payMethod !== 'Efectivo') return;
        
        const cashInput = document.getElementById('cash-input');
        const changeLabel = document.getElementById('lbl-change');
        if (!cashInput || !changeLabel) return;

        const val = parseFloat(cashInput.value) || 0;
        
        // Reparación: Usar el total pasado por el motor de cálculos o leer el del DOM
        let total = 0;
        if (forcedTotal !== null) {
            total = forcedTotal;
        } else {
            const elTotal = document.getElementById('lbl-total');
            total = elTotal ? parseFloat(elTotal.innerText.replace('L ', '')) : 0;
        }

        if (val > 0) {
            const change = val - total;
            changeLabel.innerText = change >= 0 ? "L " + change.toFixed(2) : "Falta dinero";
            changeLabel.style.color = change >= 0 ? "#10b981" : "#ef4444";
        } else {
            changeLabel.innerText = "L 0.00";
        }
    }

/* --- LÓGICA DE SOPORTE UBER EATS STYLE (REPARADA) --- */

// Preguntas Frecuentes (Acordeón)
window.toggleFaq = function(el) {
    const answer = el.nextElementSibling;
    const icon = el.querySelector('i');
    if (answer && answer.classList.contains('open')) {
        answer.classList.remove('open');
        if(icon) icon.style.transform = 'rotate(0deg)';
    } else if(answer) {
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-item i').forEach(i => i.style.transform = 'rotate(0deg)');
        answer.classList.add('open');
        if(icon) icon.style.transform = 'rotate(180deg)';
    }
}

let activeComplaintType = '';

// Abrir Modal Deslizante con Reglas
window.openSupportFlow = function(title, logicType) {
    activeComplaintType = title;
    const titleEl = document.getElementById('sheet-support-title');
    const textEl = document.getElementById('sheet-complaint-text');
    const rulesContainer = document.getElementById('sheet-support-rules');

    if(titleEl) titleEl.innerText = title;
    if(textEl) textEl.value = '';
    if(rulesContainer) {
        rulesContainer.innerHTML = ''; 
        if (logicType === 'demora') {
            rulesContainer.innerHTML = `
                <div class="rule-alert">
                    <i class="fas fa-exclamation-triangle" style="margin-top:2px;"></i>
                    <div><b>Regla de 12 Minutos:</b> Por favor, contacta a soporte únicamente si tu pedido ha superado <b>12 minutos</b> adicionales al tiempo máximo estimado de entrega.</div>
                </div>`;
        } else if (logicType === 'calidad') {
            rulesContainer.innerHTML = `
                <div class="rule-alert danger">
                    <i class="fas fa-camera" style="margin-top:2px;"></i>
                    <div><b>Requisito Obligatorio:</b> Para proceder con un reclamo de calidad o mal estado, debes enviarle al agente una <b>Foto del producto junto a su factura original</b>.</div>
                </div>`;
        }
    }

    const overlay = document.getElementById('support-modal-overlay');
    if(overlay) overlay.style.display = 'block';
    
    setTimeout(() => {
        const sheet = document.getElementById('support-bottom-sheet');
        if(sheet) sheet.classList.add('show');
    }, 10);
}

// Cerrar Modal
window.closeSupportFlow = function(e) {
    if(e && typeof e.preventDefault === 'function') e.preventDefault();
    const sheet = document.getElementById('support-bottom-sheet');
    const overlay = document.getElementById('support-modal-overlay');

    if(sheet) sheet.classList.remove('show');
    setTimeout(() => {
        if(overlay) overlay.style.display = 'none';
    }, 300);
}

// Enviar a WhatsApp Formateado
window.sendProComplaint = function() {
    const detailEl = document.getElementById('sheet-complaint-text');
    const detail = detailEl ? detailEl.value : "";
    const name = currentUser ? currentUser.name : 'Invitado';
    const msg = `🆘 *SOPORTE RAPI*\n👤 *Usuario:* ${name}\n⚠️ *Tipo de Reclamo:* ${activeComplaintType}\n📝 *Detalle:* ${detail || "Sin detalles adicionales"}`;
    
    closeSupportFlow();
    window.open(`https://wa.me/50493655523?text=${encodeURIComponent(msg)}`, '_blank');
}

function openServiceForm(type) {
    currentServiceType = type;
    const t = document.getElementById('form-title');
    const d = document.getElementById('form-desc');
    const l1 = document.getElementById('lbl-what');
    const l2 = document.getElementById('lbl-name');
    const priceEl = document.getElementById('service-price');

    document.querySelectorAll('#view-service-form input, #view-service-form textarea').forEach(i => i.value = '');
    if(priceEl) priceEl.innerText = '';

    if (type === 'envio') {
        if(t) t.innerText = "📦 Realizar Envío";
        if(d) d.innerText = "Llevamos tu paquete seguro.";
        if(l1) l1.innerText = "¿Qué vas a enviar?";
        if(l2) l2.innerText = "Nombre de quien recibe";
    } else {
        if(t) t.innerText = "⚡ Encomienda";
        if(d) d.innerText = "Compras, trámites, recoger.";
        if(l1) l1.innerText = "¿Qué debemos hacer?";
        if(l2) l2.innerText = "Nombre del Contacto / Lugar";
    }
    navTo('view-service-form');
}

function sendServiceOrder() {
    const fields = ['input-what', 'input-sector', 'input-name', 'input-phone', 'input-address'];
    let hasError = false;
    
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
            el.classList.add('error-shake');
            setTimeout(() => el.classList.remove('error-shake'), 500);
            hasError = true;
        }
    });

    if (hasError) return;

    const what = document.getElementById('input-what').value;
    const sector = document.getElementById('input-sector').value;
    const price = document.getElementById('service-price') ? document.getElementById('service-price').innerText : "Precio a convenir";
    const nameRec = document.getElementById('input-name').value;
    const phone = document.getElementById('input-phone').value;
    const addr = document.getElementById('input-address').value;
    const clientName = currentUser ? currentUser.name : 'Invitado';

    const msg = `🚀 *RAPI DELIVERY - ${currentServiceType.toUpperCase()}*\n👤 *Cliente:* ${clientName}\n📝 *DETALLE:* ${what}\n📍 *ZONA:* ${sector}\n💵 *${price}*\n👤 *CONTACTO:* ${nameRec}\n📱 *TEL:* ${phone}\n🏠 *UBICACIÓN:* ${addr}`;
    
    window.open(`https://wa.me/50493655523?text=${encodeURIComponent(msg)}`, '_blank');
}

/* --- NUEVA VERSIÓN: ENVIAR PEDIDO A RENDER (SIN WHATSAPP Y CON TRACKING) --- */
async function sendOrder() {
    if (cart.length === 0) return showProError("Tu carrito está vacío 🛒", []);
    if (!selectedSector) return showProError("Selecciona tu colonia 📍", ['sector-input']);
    
    const dirInput = document.getElementById('address-input');
    const dir = dirInput ? dirInput.value : "";
    if (!dir || dir.length < 5) return showProError("Escribe una dirección detallada 🏠", ['address-input']);

    // 1. OBTENER DATOS DEL COMERCIO Y PRODUCTOS
    const commerceName = cart.length > 0 ? cart[0].s : 'Pedido Rapi';

    const groups = {};
    cart.forEach(item => {
        if (!groups[item.n]) groups[item.n] = { ...item, count: 0 };
        groups[item.n].count++;
    });

    let productosTexto = Object.keys(groups).map(name => `${groups[name].count}x ${name}`).join(', ');
    
    let payDetails = payMethod;
    if (payMethod === 'Efectivo') {
        const cashInput = document.getElementById('cash-input');
        const billete = (cashInput && cashInput.value) ? cashInput.value : 'Exacto';
        payDetails += ` (L ${billete})`;
    }

    const totalLabel = document.getElementById('lbl-total');
    const totalTxt = totalLabel ? totalLabel.innerText : "L 0.00";
    const totalNum = parseFloat(totalTxt.replace('L ', ''));

    const userName = currentUser ? currentUser.name : 'Invitado';
    
    const phoneInput = document.getElementById('phone-input');
    const phone = (phoneInput && phoneInput.value) ? phoneInput.value : '00000000';

    // CORRECCIÓN: Usar las variables globales reales de tu función captureGPS()
    const lat = window.currentLat || 15.4006; 
    const lon = window.currentLon || -87.8097;

    // --- GUARDADO LOCAL PARA EL HISTORIAL DEL PERFIL ---
    const orderData = {
        date: new Date().toLocaleDateString('es-HN', { day: '2-digit', month: 'short', year: 'numeric' }),
        fullDate: new Date(),
        time: new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }),
        total: totalNum,
        totalStr: totalTxt,
        itemsSummary: productosTexto, 
        storeName: commerceName,
        loc: selectedSector.n,
        location: selectedSector.n, 
        fullAddress: dir,
        method: payMethod,
        status: 'enviado',
        userId: currentUser ? currentUser.uid : 'guest'
    };

    if (Array.isArray(userOrders)) {
        userOrders.unshift({...orderData}); 
        if (typeof initLoyalty === "function") initLoyalty();
    }
    
    if (typeof saveOrderToFirebase === "function") {
        saveOrderToFirebase(orderData).catch(e => console.error(e));
    }

    // ==============================================================
    // 2. ENVIAR A LA NUBE Y ABRIR TRACKING
    // ==============================================================
    try {
        if (typeof Swal !== 'undefined') {
            Swal.fire({ title: 'Enviando orden al local...', text: 'Conectando con los Riders', allowOutsideClick: false, didOpen: () => { Swal.showLoading() }});
        }

        const respuesta = await fetch("https://raiderelporgreso.onrender.com/api/pedidos", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente: userName,
                direccion: selectedSector.n, 
                referencia: `${dir} [Pago: ${payDetails}]`, 
                telefono: phone,
                tienda: commerceName,
                productos: productosTexto,
                total: totalNum,
                lat: lat,
                lon: lon
            })
        });

        const data = await respuesta.json();
        
        if (data.status === "success") {
            if (typeof Swal !== 'undefined') Swal.close();
            
            // Cerrar el modal del carrito
            const cartModal = document.getElementById('cart-modal');
            if (cartModal) cartModal.classList.remove('active');
            
            // CORRECCIÓN: Limpiar carrito usando tus funciones reales
            cart = [];
            if (typeof renderCart === 'function') renderCart();
            if (typeof updateMiniCart === 'function') updateMiniCart();

            // Lanzar Tracking
            if (typeof TrackingEngine !== 'undefined') {
                TrackingEngine.start(data.id, lat, lon, commerceName);
            }
            
        } else {
            if (typeof Swal !== 'undefined') Swal.fire('Error', 'No se pudo procesar tu orden.', 'error');
        }

    } catch (error) {
        console.error("❌ Error de servidor:", error);
        if (typeof Swal !== 'undefined') Swal.fire('Sin conexión', 'Error al conectar con los repartidores.', 'error');
    }
}

    // --- DIAPOSITIVAS (Slider) ---
    let currentSlideIndex = 1;

    window.nextSlide = function() {
        const total = 3; 
        if(currentSlideIndex < total) {
            const curSlide = document.getElementById(`slide-${currentSlideIndex}`);
            const curDot = document.getElementById(`dot-${currentSlideIndex}`);
            if(curSlide) curSlide.classList.remove('active');
            if(curDot) curDot.classList.remove('active');
            
            currentSlideIndex++;
            
            const nextSlideEl = document.getElementById(`slide-${currentSlideIndex}`);
            const nextDotEl = document.getElementById(`dot-${currentSlideIndex}`);
            if(nextSlideEl) nextSlideEl.classList.add('active');
            if(nextDotEl) nextDotEl.classList.add('active');

            if(currentSlideIndex === total) {
                const btn = document.getElementById('btn-slide-action');
                if(btn) {
                    btn.innerHTML = 'EMPEZAR <i class="fas fa-check"></i>';
                    btn.style.background = "var(--rapi-orange)";
                }
            }
        } else {
            navTo('home');
            // ¡MAGIA!: Arranca el tour justo después de las diapositivas
            setTimeout(() => { startRapiTour(false); }, 500);
        }
    };

    function initHomeBgParticles() {
        const container = document.getElementById('bg-particles-box');
        if(!container) return;
        const icons = ['fa-motorcycle', 'fa-box-open', 'fa-map-marker-alt', 'fa-pizza-slice', 'fa-hamburger', 'fa-circle']; 
        container.innerHTML = ''; 
        for(let i=0; i<20; i++) {
            const p = document.createElement('i');
            p.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} bg-particle`;
            p.style.left = Math.random() * 95 + '%';
            p.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
            p.style.animationDuration = (15 + Math.random() * 15) + 's';
            p.style.animationDelay = -(Math.random() * 20) + 's'; 
            container.appendChild(p);
        }
    }

    /* --- LÓGICA DE RAPI PLUS WHATSAPP Y LOCAL STORAGE --- */
    window.requestRapiPlusWA = function() {
        const msg = `💎 *SOLICITUD RAPI PLUS*\n👤 *Usuario:* ${currentUser ? currentUser.name : 'Invitado'}\nQuiero suscribirme a Rapi Plus por L 110.00 al mes. ¿A qué cuenta transfiero para activarlo?`;
        window.open(`https://wa.me/50493655523?text=${encodeURIComponent(msg)}`, '_blank');
    }

    /* --- LISTA DE TOKENS (CÓDIGOS) AUTORIZADOS --- */
    const validTokens = [
        "ACTIVO-32323", 
        "ACTIVO-84729", 
        "ACTIVO-59201", 
        "ACTIVO-10485", 
        "ACTIVO-77392",
        "ACTIVO-46102", 
        "ACTIVO-92048", 
        "ACTIVO-63819", 
        "ACTIVO-25940", 
        "ACTIVO-51837"
    ];

    /* --- ACTIVAR SUSCRIPCIÓN CON TOKEN (NUEVO SISTEMA) --- */
    window.activateRapiPlus = function() {
        if (!currentUser || currentUser.uid.startsWith('guest_')) {
            if (typeof showProError === "function") {
                showProError("Debes registrarte o iniciar sesión para activar Rapi Plus.", []);
            }
            navTo('login');
            return;
        }

        // 1. Obtener y limpiar el texto ingresado
        const tokenInput = document.getElementById('plus-token-input');
        const tokenValue = tokenInput ? tokenInput.value.trim().toUpperCase() : "";

        if (!tokenValue) {
            return showProError("Por favor ingresa tu código de activación.", ['plus-token-input']);
        }

        // 2. Verificar si el código existe en nuestra lista
        if (!validTokens.includes(tokenValue)) {
            return showProError("El código ingresado no existe o es incorrecto.", ['plus-token-input']);
        }

        // 3. Verificar si el código ya fue usado localmente
        const usedTokens = JSON.parse(localStorage.getItem('usedTokensRapi') || '[]');
        if (usedTokens.includes(tokenValue)) {
            return showProError("Este código ya fue utilizado anteriormente.", ['plus-token-input']);
        }

        // 4. Si todo es correcto, activamos la suscripción
        const duracion = 30 * 24 * 60 * 60 * 1000; 
        const fechaVencimiento = Date.now() + duracion;

        // Guardamos los datos
        localStorage.setItem('rapiPlus_Expiry_' + currentUser.uid, fechaVencimiento);
        
        // Marcamos el código como usado
        usedTokens.push(tokenValue);
        localStorage.setItem('usedTokensRapi', JSON.stringify(usedTokens));
        
        isRapiPlusActive = true; 
        
        if (typeof validateSubscription === "function") validateSubscription();
        
        const successScreen = document.getElementById('success-anim-screen');
        if (successScreen) {
            document.getElementById('success-anim-title').innerText = "¡Código Aceptado!";
            document.getElementById('success-anim-desc').innerText = "Tu membresía Rapi Plus está activa por 30 días.";
            successScreen.style.display = 'flex';
        }
        
        // Limpiar el cuadro de texto
        if (tokenInput) tokenInput.value = '';

        setTimeout(() => {
            if (successScreen) successScreen.style.display = 'none';
            navTo('home'); 
            if (typeof updateTotals === "function") updateTotals(); 
        }, 2500);
    }

/* --- VALIDAR SUSCRIPCIÓN Y ACTUALIZAR UI (REPARADA) --- */
    function validateSubscription() {
        if (!currentUser) return;

        const storedExpiry = localStorage.getItem('rapiPlus_Expiry_' + currentUser.uid);
        const salesView = document.getElementById('plus-sales-view');
        const activeView = document.getElementById('plus-active-view');
        const plusAnimText = document.querySelector('.plus-anim-text');

        if(plusAnimText) plusAnimText.innerHTML = "PLUS";

        if (!storedExpiry) {
            isRapiPlusActive = false;
            if(salesView && activeView) {
                salesView.style.display = 'block';
                activeView.style.display = 'none';
            }
            return;
        }

        const expiryTime = parseInt(storedExpiry);
        const now = Date.now();
        const diffTime = expiryTime - now;
        
        // REPARACIÓN: Usamos Math.max para evitar números negativos en la UI antes de borrar
        const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        if (diffTime <= 0) { // REPARACIÓN: Basamos la lógica en el tiempo exacto, no solo en los días
            isRapiPlusActive = false;
            localStorage.removeItem('rapiPlus_Expiry_' + currentUser.uid);
            
            // REPARACIÓN: Verificamos si el modal existe antes de llamar para evitar errores
            if (typeof openModal === "function") {
                openModal('fas fa-history', 'Suscripción Vencida', 'Tu Rapi Plus ha terminado. ¡Renueva para seguir ahorrando!', '#ef4444');
            }
            
            if(salesView && activeView) {
                salesView.style.display = 'block';
                activeView.style.display = 'none';
            }

            // REPARACIÓN: Forzar actualización de totales para quitar descuentos Plus
            if (typeof updateTotals === "function") updateTotals();
            
        } else {
            isRapiPlusActive = true;
            
            if(salesView && activeView) {
                salesView.style.display = 'none';
                activeView.style.display = 'block';
            }

            const dateObj = new Date(expiryTime);
            const options = { day: 'numeric', month: 'short' };
            
            const numEl = document.getElementById('days-left-num');
            const dateEl = document.getElementById('expiry-date-txt');
            const barEl = document.getElementById('days-progress-bar');

            if(numEl) numEl.innerText = daysLeft;
            if(dateEl) dateEl.innerText = dateObj.toLocaleDateString('es-ES', options);
            
            const percentage = (daysLeft / 30) * 100;
            if(barEl) barEl.style.width = percentage + '%';

            // REPARACIÓN: Asegurar que si se activa, los precios del carrito se actualicen
            if (typeof updateTotals === "function") updateTotals();
        }
    }

/* --- LÓGICA DE UBICACIÓN INTERNACIONAL (REPARADA) --- */
    const locationsDB = {
        "hn": ["El Progreso, Yoro"]
        
    };

    window.updateCities = function() {
        const country = document.getElementById('country-select').value;
        const citySelect = document.getElementById('city-select');
        const cityBox = document.getElementById('city-box');
        
        // REPARACIÓN: Limpiar valor anterior para obligar a nueva selección
        citySelect.innerHTML = '<option value="" disabled selected>Selecciona tu Ciudad</option>';
        citySelect.value = ""; 
        
        if (locationsDB[country]) {
            locationsDB[country].forEach(city => {
                const opt = document.createElement('option');
                opt.value = city;
                opt.innerText = city;
                citySelect.appendChild(opt);
            });
            // Activar la caja de ciudad
            citySelect.disabled = false;
            cityBox.style.opacity = "1";
            cityBox.style.pointerEvents = "auto";
        }
        
        checkReadyStatus(); // Actualiza visualmente al limpiar
    }

    window.checkReadyStatus = function() {
        const countrySelect = document.getElementById('country-select');
        const citySelect = document.getElementById('city-select');
        
        const country = countrySelect ? countrySelect.value : null;
        const city = citySelect ? citySelect.value : null;
        
        const msgBox = document.getElementById('ready-msg-box');
        const btns = document.getElementById('auth-buttons-container');
        const hero = document.getElementById('hero-text-box');
        
        // REPARACIÓN: Validación estricta de valores no vacíos
        if (country && country !== "" && city && city !== "") {
            msgBox.style.display = 'block';
            btns.style.display = 'block';
            if(hero) hero.style.display = 'none';
        } else {
            msgBox.style.display = 'none';
            btns.style.display = 'none';
            if(hero) hero.style.display = 'block';
        }
    }

    /* --- TRAMPA DEL BOTÓN FACEBOOK (REPARADA) --- */
    window.fakeFacebookLogin = function() {
        const btn = document.getElementById('btn-fb');
        if (!btn || btn.disabled) return; // REPARACIÓN: Evita doble clic accidental

        const originalHtml = btn.innerHTML;
        
        // 1. Estado de Carga
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Conectando...';
        btn.style.opacity = '0.8';
        btn.disabled = true;

        setTimeout(() => {
            // 2. Estado de Error
            btn.innerHTML = '<i class="fas fa-times-circle"></i> Mejor inicia con Google';
            btn.style.background = '#ef4444'; 
            btn.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.4)';
            
            // REPARACIÓN: Verificación de función antes de llamar
            if (typeof showProError === "function") {
                showProError("Facebook no está disponible para inicio de sesión por el momento. Usa Google, es más rápido. 🚀", []);
            } else {
                alert("Facebook no disponible. Por favor usa Google.");
            }
            
            setTimeout(() => {
                // 3. Volver a la normalidad
                if (btn) { // REPARACIÓN: Verificar que el elemento siga existiendo en el DOM
                    btn.innerHTML = originalHtml;
                    btn.style.background = '#1877F2';
                    btn.style.boxShadow = '0 10px 25px rgba(24, 119, 242, 0.4)';
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }
            }, 3000);

        }, 1500); 
    }

/* ===========================================================
   REPARACIÓN DE LÓGICA: PAGOS, PRIORIDAD, PROPINA E HISTORIAL
   =========================================================== */

// 1. REPARACIÓN BOTÓN PRIORIDAD
function togglePriority() {
    isPriority = !isPriority;
    const box = document.querySelector('.priority-box');
    const timeText = document.getElementById('delivery-time-text');
    
    if (box) box.classList.toggle('active');
    
    if (timeText) {
        timeText.innerText = isPriority 
            ? "⚡ ¡Entrega Flash! (10-15 min)" 
            : "Entrega estimada: 25min - 45min";
    }
    
    // Vibración para confirmar
    if (navigator.vibrate) navigator.vibrate(40);
    
    updateTotals();
}

// 2. REPARACIÓN BOTONES DE PROPINA
function selectTip(amount, btn, isCustom = false) {
    currentTip = parseFloat(amount) || 0;
    
    // Actualizar visualmente los botones
    if (!isCustom) {
        document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
    }
    
    // Animación del Rider (Carita)
    const face = document.getElementById('rider-face');
    const stars = document.getElementById('stars-anim');
    
    if (face && stars) {
        face.className = 'rider-img'; // Reset
        stars.classList.remove('show');
        
        if (currentTip >= 34) {
            face.classList.add('super-happy');
            stars.classList.add('show');
        } else if (currentTip >= 14) {
            face.classList.add('happy');
        }
    }
    
    updateTotals();
}


// 4. REPARACIÓN CÁLCULO DE TOTALES (El motor que hace que todo funcione)
function updateTotals() {
    if (!cart) return;

    // A. Sumar productos
    const sub = cart.reduce((a, b) => a + b.p, 0);
    
    // B. Calcular Descuentos
    let productDiscount = 0;
    if (isRapiPlusActive) productDiscount = sub * 0.05;

    // C. Calcular Envío
    const completedOrders = (userOrders && userOrders.length) ? userOrders.length : 0;
    const isFreeDelivery = completedOrders > 0 && completedOrders % 10 === 0;
    let finalDeliveryFee = deliveryFee || 0;

    if (isFreeDelivery) {
        finalDeliveryFee = 0;
    } else if (isRapiPlusActive) {
        finalDeliveryFee = finalDeliveryFee * 0.5; 
    } else if (discountActive) {
        finalDeliveryFee = finalDeliveryFee * 0.9;
    }

    // D. Costos Extra
    const priorityCost = isPriority ? 12 : 0;
    
    // E. TOTAL FINAL
    const total = Math.max(0, (sub - productDiscount) + finalDeliveryFee + priorityCost + (currentTip || 0));

    // --- ACTUALIZAR PANTALLA (DOM) ---
    
    // 1. Subtotal
    const elSub = document.getElementById('lbl-sub');
    if(elSub) elSub.innerText = "L " + sub.toFixed(2);
    
    // 2. Envío
    const shipLabel = document.getElementById('lbl-ship');
    if(shipLabel) {
        if (isFreeDelivery) shipLabel.innerHTML = `<span style="text-decoration:line-through; color:#9ca3af;">L ${deliveryFee}</span> <span style="color:#10b981;">GRATIS</span>`;
        else if (isRapiPlusActive) shipLabel.innerHTML = `<span style="text-decoration:line-through; color:#9ca3af;">L ${deliveryFee}</span> <span style="color:#2563eb; font-weight:900;">L ${finalDeliveryFee.toFixed(2)}</span>`;
        else shipLabel.innerText = "L " + finalDeliveryFee.toFixed(2);
    }

    // 3. Filas Ocultas (Prioridad, Propina, Descuento Plus)
    const rowPriority = document.getElementById('row-priority');
    if(rowPriority) rowPriority.style.display = isPriority ? 'flex' : 'none';
    
    const rowTip = document.getElementById('row-tip');
    const lblTip = document.getElementById('lbl-tip');
    if(rowTip && lblTip) {
        rowTip.style.display = currentTip > 0 ? 'flex' : 'none';
        lblTip.innerText = "L " + currentTip.toFixed(2);
    }

    // 4. Total Grande
    const elTotal = document.getElementById('lbl-total');
    if(elTotal) elTotal.innerText = "L " + total.toFixed(2);
    
    // 5. Actualizar cambio si está en efectivo
    calcChange(total); 
}

// 5. REPARACIÓN DEL HISTORIAL (Con todos los detalles que pediste)
function renderHistoryUI() {
    const container = document.getElementById('history-list');
    if(!container) return;

    if (!userOrders || userOrders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px 20px;">
                <i class="fas fa-receipt" style="font-size:3.5rem; color:#e2e8f0; margin-bottom:15px;"></i>
                <p style="color:#94a3b8; font-weight:600;">No tienes pedidos registrados todavía.</p>
            </div>`;
        return;
    }

    container.innerHTML = userOrders.map(o => {
        // Datos seguros
        const storeName = o.storeName || 'Pedido Rapi';
        const dateStr = o.date || 'Fecha desconocida';
        const timeStr = o.time || '';
        const locationStr = o.loc || o.location || 'Ubicación pendiente';
        const totalStr = o.totalStr || ('L ' + (o.total || 0));
        
        // Estado y color
        const status = o.status ? o.status.toLowerCase() : 'enviado';
        const isCompleted = status === 'entregado' || status === 'completado';
        const statusBadge = isCompleted 
            ? `<span class="hc-status st-done">ENTREGADO</span>` 
            : `<span class="hc-status st-pending">EN PROCESO</span>`;

        // Resumen de productos
        const itemsDetail = o.summary || o.itemsSummary || 'Detalle no disponible';

        return `
        <div class="history-card-pro">
            <div class="hc-header">
                <div class="hc-date-box">
                    <div style="background:#fff7ed; width:45px; height:45px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:var(--rapi-orange); border:1px solid #fed7aa;">
                        <i class="fas fa-store-alt" style="font-size:1.2rem;"></i>
                    </div>
                    <div>
                        <h4 style="margin:0; font-size:1rem; color:#1f2937; font-weight:800;">${storeName}</h4>
                        <div style="font-size:0.75rem; color:#6b7280; font-weight:500; margin-top:2px;">
                            <i class="far fa-calendar-alt"></i> ${dateStr} &nbsp; <i class="far fa-clock"></i> ${timeStr}
                        </div>
                    </div>
                </div>
                ${statusBadge}
            </div>
            
            <div class="hc-body" style="border-left: 3px solid var(--rapi-orange);">
                <div class="hc-items-text" style="font-family:monospace; color:#4b5563; font-size:0.85rem;">
                    ${itemsDetail}
                </div>
            </div>
            
            <div class="hc-divider"></div>
            
            <div class="hc-footer">
                <div class="hc-info-col">
                    <div class="hc-info-item">
                        <i class="fas fa-map-marker-alt" style="color:#ef4444;"></i>
                        <span style="font-weight:700; color:#374151;">${locationStr}</span>
                    </div>
                </div>
                <div class="hc-total-col">
                    <span class="hc-total-label">Total Pagado</span>
                    <span class="hc-total-val" style="font-size:1.4rem;">${totalStr}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

/* ===========================================================
   REPARACIÓN QUIRÚRGICA: ANUNCIO PLUS Y GUARDADO DE HISTORIAL
   =========================================================== */

// 1. UPDATE TOTALES (Con el anuncio de Marketing recuperado)
window.updateTotals = function() {
    if (!cart) return;
    
    // Cálculos matemáticos
    const sub = cart.reduce((a, b) => a + b.p, 0);
    
    // Lógica Rapi Plus
    let productDiscount = 0;
    let finalDeliveryFee = (typeof deliveryFee !== 'undefined') ? deliveryFee : 0;
    
    // Si es Plus: 5% descuento en productos y 50% en envío
    if (isRapiPlusActive) {
        productDiscount = sub * 0.05;
        finalDeliveryFee = finalDeliveryFee * 0.5;
    } else if (discountActive) {
        // Descuento fin de semana si no es Plus
        finalDeliveryFee = finalDeliveryFee * 0.9;
    }

    const priorityCost = isPriority ? 12 : 0;
    const tipVal = currentTip || 0;
    const total = Math.max(0, sub - productDiscount + finalDeliveryFee + priorityCost + tipVal);

    // --- ACTUALIZACIÓN VISUAL DEL DOM ---

    // A. Textos básicos
    if(document.getElementById('lbl-sub')) document.getElementById('lbl-sub').innerText = "L " + sub.toFixed(2);
    
    // B. Etiqueta de envío (tachada si es gratis/plus)
    const shipLabel = document.getElementById('lbl-ship');
    if (shipLabel) {
        if (isRapiPlusActive) {
            shipLabel.innerHTML = `<span style="text-decoration:line-through; color:#9ca3af; font-size:0.8rem;">L ${deliveryFee}</span> <span style="color:#2563eb; font-weight:900;">L ${finalDeliveryFee.toFixed(2)}</span>`;
        } else {
            shipLabel.innerText = "L " + finalDeliveryFee.toFixed(2);
        }
    }

    // C. El Total Grande
    if(document.getElementById('lbl-total')) document.getElementById('lbl-total').innerText = "L " + total.toFixed(2);
    
    // D. Filas Extra (Prioridad, Propina)
    const rowPrio = document.getElementById('row-priority');
    if(rowPrio) rowPrio.style.display = isPriority ? 'flex' : 'none';
    
    const rowTip = document.getElementById('row-tip');
    if(rowTip) {
        rowTip.style.display = tipVal > 0 ? 'flex' : 'none';
        if(document.getElementById('lbl-tip')) document.getElementById('lbl-tip').innerText = "L " + tipVal.toFixed(2);
    }

    // E. LÓGICA DE MARKETING (EL ANUNCIO QUE FALTABA)
    const container = document.getElementById('checkout-summary-container');
    const oldMsg = document.getElementById('row-missed-savings');
    if (oldMsg) oldMsg.remove(); // Limpiar previo

    // Si NO es Plus y hay costo de envío -> Mostrar anuncio
    if (!isRapiPlusActive && deliveryFee > 0 && container) {
        const ahorroPotencial = deliveryFee * 0.5; // 50% de ahorro
        
        const div = document.createElement('div');
        div.id = 'row-missed-savings';
        div.className = 'missed-savings-box';
        div.onclick = function() { navTo('rapi-plus'); }; // Llevar a comprar Plus
        div.innerHTML = `
            <div><i class="fas fa-info-circle"></i> Ahorra <b>L ${ahorroPotencial.toFixed(2)}</b> en este envío con Plus</div>
            <div style="font-weight:800; text-decoration:underline; margin-top:2px;">¡Actívalo aquí!</div>
        `;
        
        // Insertar ANTES del Total
        const totalSection = document.querySelector('.total-section');
        if (totalSection) {
            container.insertBefore(div, totalSection);
        }
    }

    // F. Actualizar cambio (Efectivo)
    if (typeof calcChange === 'function') calcChange(total);
};

// 3. FINALIZAR PEDIDO (Limpieza y Redirección)
window.finalizeOrder = function(url) {
    // Limpiar carrito
    cart = [];
    isPriority = false;
    currentTip = 0;
    
    // Actualizar UI del carrito (poner en 0)
    if (typeof updateMiniCart === "function") updateMiniCart();
    if (typeof renderCart === "function") renderCart();
    
    // Renderizar Historial actualizado (IMPORTANTE)
    if (typeof renderHistoryUI === "function") renderHistoryUI();
    if (typeof initLoyalty === "function") initLoyalty();

    // Quitar radar
    const radar = document.getElementById('radar');
    if (radar) radar.style.display = 'none';
    
    // Navegar al historial y luego abrir WhatsApp
    navTo('history');
    
    // Redirigir a WhatsApp
    window.location.href = url;
};

/* ===========================================================
   REPARACIÓN FINAL: CARGA DE HISTORIAL Y BOTÓN "OTRO"
   =========================================================== */

// 1. REPARACIÓN BOTÓN "OTRO" (PROPINA)
window.openTipModal = function() {
    const input = document.getElementById('input-custom-tip');
    if(input) input.value = ''; // Limpiar valor previo
    
    const modal = document.getElementById('tip-modal');
    if(modal) modal.style.display = 'flex'; // Mostrar modal
};

window.confirmCustomTip = function() {
    const input = document.getElementById('input-custom-tip');
    const val = parseFloat(input.value);

    // Validación mínima
    if (!val || val < 1) { 
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 500);
        return;
    }

    // Guardar propina custom
    currentTip = val;
    
    // Cerrar modal
    document.getElementById('tip-modal').style.display = 'none';
    
    // Quitar selección de los botones predefinidos (L14, L23, etc)
    document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
    
    // Actualizar totales con el nuevo monto
    if (typeof updateTotals === "function") updateTotals();

    // Mostrar agradecimiento
    const screen = document.getElementById('success-anim-screen');
    if(screen) {
        document.getElementById('success-anim-title').innerText = "¡Gracias!";
        document.getElementById('success-anim-desc').innerText = "Tu apoyo motiva a nuestros Riders.";
        screen.style.display = 'flex';
        setTimeout(() => { screen.style.display = 'none'; }, 2000);
    }
};

// 2. REPARACIÓN CARGA DE HISTORIAL AL INICIAR (Para que se vea sin pedir)
window.loadOrdersFromFirebase = function(uid) {
    console.log("Cargando historial desde la nube...");
    
    // Carga inicial rápida
    db.collection('orders')
        .where('userId', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(20) // Limitamos a 20 para que cargue rápido
        .get()
        .then((querySnapshot) => {
            userOrders = [];
            querySnapshot.forEach((doc) => {
                userOrders.push(doc.data());
            });
            
            // ¡ESTO ES LO IMPORTANTE! Forzar el pintado inmediato
            // Así el cliente ve sus pedidos anteriores al entrar
            if (typeof renderHistoryUI === "function") renderHistoryUI();
            if (typeof initLoyalty === "function") initLoyalty();
        })
        .catch((error) => {
            console.error("Error cargando historial:", error);
        });
};

// 3. FORZAR CARGA AL DETECTAR SESIÓN
// Esto asegura que si recargas la página, el historial vuelva a aparecer
auth.onAuthStateChanged((user) => {
    if (user) {
        // Cargar historial en cuanto Firebase confirme el usuario
        loadOrdersFromFirebase(user.uid);
        
        // Llenar datos de perfil
        if(document.getElementById('profile-name-display')) {
            document.getElementById('profile-name-display').innerText = user.displayName || user.email.split('@')[0];
        }
        if(document.getElementById('profile-email-display')) {
            document.getElementById('profile-email-display').innerText = user.email;
        }
    }
});

    /* --- FUNCIÓN PARA OMITIR INICIO DE SESIÓN (MODO INVITADO) --- */
window.skipLogin = function() {
    console.log("Iniciando como Invitado...");
    
    // Creamos un usuario temporal para que la app no dé errores al generar pedidos
    currentUser = {
        name: "Invitado",
        email: "invitado@rapidelivery.hn",
        uid: "guest_" + Math.floor(Math.random() * 1000000)
    };
    
    isRapiPlusActive = false; 

    // Actualizamos los textos de la interfaz con el nuevo "usuario"
    const welcome = document.getElementById('welcome-user');
    if(welcome) welcome.innerText = "Hola, " + currentUser.name;

    const profileName = document.getElementById('profile-name-display');
    const profileEmail = document.getElementById('profile-email-display');
    
    if (profileName) profileName.innerText = currentUser.name;
    if (profileEmail) profileEmail.innerText = "Modo Exploración (Sin registrar)";

    // Vaciamos el historial por si quedó algo guardado en la sesión anterior
    userOrders = [];
    if(typeof renderHistoryUI === "function") renderHistoryUI();
    if(typeof initLoyalty === "function") initLoyalty();

    // Renderizamos las tiendas y mandamos al home
    if(typeof renderMerchants === "function") renderMerchants(); 
    navTo('onboarding');
};

/* =======================================================
   LOGICA PRO: VISTAS DEL PERFIL Y DIRECCIONES
========================================================== */
const waNumber = "50493655523"; // Tu número de WhatsApp central

/* --- 1. SUGERENCIAS --- */
window.selectSuggType = function(el, type) {
    document.querySelectorAll('.sugg-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('sugg-type-input').value = type;
};

window.sendSuggestion = function() {
    const type = document.getElementById('sugg-type-input').value;
    const text = document.getElementById('sugg-text').value;
    if(!text) return showProError("Por favor, describe tu sugerencia.", ['sugg-text']);
    
    const user = currentUser ? currentUser.name : 'Invitado';
    const msg = `💡 *BUZÓN DE SUGERENCIAS*\n👤 *Usuario:* ${user}\n🏷️ *Categoría:* ${type}\n📝 *Mensaje:* ${text}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
};

/* --- 2. AFILIAR NEGOCIO --- */
window.sendBusinessRegistration = function() {
    const name = document.getElementById('bus-name').value;
    const owner = document.getElementById('bus-owner').value;
    const phone = document.getElementById('bus-phone').value;
    const type = document.getElementById('bus-type').value;

    if(!name || !owner || !phone) return showProError("Por favor llena los datos principales.", ['bus-name', 'bus-owner', 'bus-phone']);
    
    const msg = `🏪 *SOLICITUD DE AFILIACIÓN*\n\n*Comercio:* ${name}\n*Propietario:* ${owner}\n*Teléfono:* ${phone}\n*Rubro:* ${type || 'No especificado'}\n\n¡Me gustaría registrar mi negocio en Rapi Delivery!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
};

/* --- 3. TRABAJA CON NOSOTROS --- */
window.sendJobApplication = function() {
    const name = document.getElementById('job-name').value;
    const age = document.getElementById('job-age').value;
    const vehicle = document.getElementById('job-vehicle').value;

    if(!name || !age) return showProError("Por favor ingresa tu nombre y edad.", ['job-name', 'job-age']);
    
    const msg = `🛵 *SOLICITUD DE RIDER*\n\n*Nombre:* ${name}\n*Edad:* ${age} años\n*Vehículo:* ${vehicle}\n\n¡Quiero formar parte del equipo de Rapi Delivery!`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
};

/* --- 4. SISTEMA INTELIGENTE DE DIRECCIONES (REPARADO) --- */
let savedAddresses = [];

window.loadAddresses = function() {
    const uid = currentUser ? currentUser.uid : 'guest';
    const data = localStorage.getItem('rapi_addr_' + uid);
    if(data) savedAddresses = JSON.parse(data);
    else savedAddresses = [];
    renderAddressesUI();
    renderCheckoutChips();
};

window.toggleAddAddressForm = function(show) {
    const form = document.getElementById('add-address-form-box');
    const btn = document.getElementById('btn-show-add-form');
    if(show) {
        form.style.display = 'block';
        if(btn) btn.style.display = 'none';
    } else {
        form.style.display = 'none';
        if(btn) btn.style.display = 'flex';
    }
};

// BUSCA Y REEMPLAZA ESTA FUNCIÓN COMPLETA
window.saveNewAddress = function() {
    const name = document.getElementById('new-addr-name').value;
    const sector = document.getElementById('new-addr-sector').value;
    const phone = document.getElementById('new-addr-phone').value;
    const detail = document.getElementById('new-addr-detail').value;
    const coords = document.getElementById('new-addr-coords') ? document.getElementById('new-addr-coords').value : ''; // Nuevo dato

    if(!name || !sector || !detail) return showProError("Llena el nombre, colonia y detalle.", ['new-addr-name', 'new-addr-sector', 'new-addr-detail']);
    
    // Guardamos todos los datos (AHORA CON GPS)
    savedAddresses.push({ label: name, sector: sector, phone: phone, detail: detail, coords: coords });
    
    const uid = currentUser ? currentUser.uid : 'guest';
    localStorage.setItem('rapi_addr_' + uid, JSON.stringify(savedAddresses));
    
    // Limpiar inputs
    document.getElementById('new-addr-name').value = '';
    document.getElementById('new-addr-sector').value = '';
    document.getElementById('new-addr-phone').value = '';
    document.getElementById('new-addr-detail').value = '';
    if(document.getElementById('new-addr-coords')) document.getElementById('new-addr-coords').value = '';
    
    // Resetear botón GPS
    const btnGps = document.getElementById('btn-gps-book');
    if(btnGps) {
        btnGps.classList.remove('success');
        btnGps.innerHTML = '<i class="fas fa-crosshairs"></i> Capturar Coordenadas';
    }

    toggleAddAddressForm(false);
    loadAddresses();
    
    if(typeof openModal === "function") {
        openModal('fas fa-check-circle', '¡Guardado!', 'Tu dirección se ha guardado correctamente.', '#10b981');
    }
};

window.deleteAddress = function(index) {
    savedAddresses.splice(index, 1);
    const uid = currentUser ? currentUser.uid : 'guest';
    localStorage.setItem('rapi_addr_' + uid, JSON.stringify(savedAddresses));
    loadAddresses();
};

window.applyAddressFromBook = function(index) {
    applyAddressByIndex(index, null);
    if (typeof navTo === 'function') navTo('checkout');
};

function renderAddressesUI() {
    const list = document.getElementById('saved-addresses-list');
    if(!list) return;
    if(savedAddresses.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:30px; color:#9ca3af; background:white; border-radius:20px; border:1px dashed #cbd5e1;"><i class="fas fa-map-marked-alt" style="font-size:2.5rem; margin-bottom:10px; opacity:0.3;"></i><br>No tienes direcciones guardadas.</div>`;
        return;
    }
    
    // REPARACIÓN: Agregamos onclick="applyAddressFromBook(${i})" a toda la tarjeta
    list.innerHTML = savedAddresses.map((a, i) => `
        <div class="addr-card" style="background:white; border:1px solid #e2e8f0; padding:18px; border-radius:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 5px 15px rgba(0,0,0,0.02); cursor:pointer; transition:0.2s;" onclick="applyAddressFromBook(${i})">
            <div>
                <b style="color:#1e293b; font-size:1.05rem; display:block; margin-bottom:5px;"><i class="fas fa-star" style="color:var(--rapi-orange); font-size:0.8rem; margin-right:5px;"></i> ${a.label}</b>
                <div style="font-size:0.85rem; color:#64748b; margin-bottom:3px;"><i class="fas fa-map-pin" style="margin-right:8px; opacity:0.7;"></i>${a.sector}</div>
                <div style="font-size:0.85rem; color:#64748b; margin-bottom:3px;"><i class="fas fa-home" style="margin-right:6px; opacity:0.7;"></i>${a.detail.replace(/\n/g, ' ')}</div>
                ${a.phone ? `<div style="font-size:0.85rem; color:#64748b;"><i class="fas fa-phone" style="margin-right:7px; opacity:0.7;"></i>${a.phone}</div>` : ''}
            </div>
            <button onclick="event.stopPropagation(); deleteAddress(${i})" style="background:#fee2e2; color:#ef4444; border:none; width:40px; height:40px; border-radius:12px; cursor:pointer; transition:0.2s;"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}

// FIX PRINCIPAL: Usamos el Índice (i) para evitar que los saltos de línea rompan el botón
function renderCheckoutChips() {
    const container = document.getElementById('checkout-address-chips');
    if(!container) return;
    container.innerHTML = savedAddresses.map((a, i) => `
        <div class="addr-chip" onclick="applyAddressByIndex(${i}, this)">
            <i class="fas fa-map-marker-alt" style="margin-right:5px; opacity:0.7;"></i>${a.label}
        </div>
    `).join('');
}

// BUSCA Y REEMPLAZA ESTA FUNCIÓN COMPLETA
window.applyAddressByIndex = function(index, el) {
    const a = savedAddresses[index];
    if(!a) return;

    const addrInput = document.getElementById('address-input');
    const phoneInput = document.getElementById('checkout-phone-input');
    const coordsInput = document.getElementById('checkout-coords'); // Nuevo Input
    const btnGps = document.getElementById('btn-gps-checkout');     // Botón para darle estilo

    // Pegamos todos los datos
    if(addrInput) addrInput.value = a.detail;
    if(phoneInput && a.phone) phoneInput.value = a.phone;
    
    // Si la dirección guardada tiene GPS, la pegamos y ponemos el botón en verde
    if (coordsInput) {
        if (a.coords) {
            coordsInput.value = a.coords;
            if (btnGps) {
                btnGps.classList.add('success');
                btnGps.innerHTML = '<i class="fas fa-check-circle"></i> GPS Cargado de Libreta';
            }
        } else {
            coordsInput.value = '';
            if (btnGps) {
                btnGps.classList.add('success');
                btnGps.innerHTML = '<i class="fas fa-check-circle maps-icon"></i> <span>Ubicación cargada</span>';
            }
        }
    }
    
    if(a.sector && typeof pickSector === 'function') {
        pickSector(a.sector, 'food');
    }

    document.querySelectorAll('.addr-chip').forEach(c => c.classList.remove('active'));
    if(el) el.classList.add('active');
};

/* --- 5. NAVEGACIÓN SECUNDARIA DEL PERFIL --- */
window.abrirSeccionPlus = function() {
    if(typeof validateSubscription === "function") validateSubscription();
    navTo('rapi-plus'); 
};
window.openAddressBook = function() {
    if(typeof loadAddresses === "function") loadAddresses();
    navTo('address-book'); 
};

/* --- 6. MOTOR DE TUTORIAL INTERACTIVO (APP TOUR) --- */
let tourSteps = [
    {
        view: 'home',
        selector: '.home-search-wrapper',
        title: '🔍 Buscador Inteligente',
        desc: 'Escribe aquí tu antojo o el nombre de un restaurante. ¡Te lo encontramos al instante!'
    },
    {
        view: 'home',
        selector: '#main-nav',
        title: '📱 Navegación Rápida',
        desc: 'Usa esta barra para moverte entre el Inicio, tu Historial, tu Carrito y tu Perfil personal.'
    },
    {
        view: 'profile',
        selector: '.plus-blue-card',
        title: '💎 Membresía Rapi Plus',
        desc: 'Actívala aquí para tener envíos a mitad de precio, prioridad VIP y descuentos en comida.'
    },
    {
        view: 'profile',
        selector: 'div[onclick="openAddressBook()"]', 
        title: '📍 Mis Direcciones',
        desc: 'Guarda tus ubicaciones frecuentes para pedir tu comida en 1 solo clic la próxima vez.'
    }
];

let currentTourIndex = 0;

window.startRapiTour = function(force = false) {
    const hasSeen = localStorage.getItem('rapi_tour_seen');
    if (hasSeen && !force) return; // Si ya lo vio y no lo están forzando del perfil, se sale.

    currentTourIndex = 0;
    const overlay = document.getElementById('tour-overlay');
    if (overlay) overlay.style.display = 'block';
    
    showTourStep();
};

window.showTourStep = function() {
    if (currentTourIndex >= tourSteps.length) {
        endTour();
        return;
    }

    const step = tourSteps[currentTourIndex];
    navTo(step.view); // El sistema viaja automáticamente a la pantalla correcta

    // Esperar a que la pantalla cargue para buscar el botón
    setTimeout(() => {
        let target = document.querySelector(step.selector);

        if (!target) {
            console.warn('Saltando paso, no se encontró:', step.selector);
            nextTourStep(); 
            return;
        }

        // Posicionar el "Foco" sobre el elemento
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            const rect = target.getBoundingClientRect();
            const focusEl = document.getElementById('tour-focus');
            const tooltipEl = document.getElementById('tour-tooltip');
            const padding = 8; // Borde respirable
            
            focusEl.style.top = (rect.top - padding) + 'px';
            focusEl.style.left = (rect.left - padding) + 'px';
            focusEl.style.width = (rect.width + padding * 2) + 'px';
            focusEl.style.height = (rect.height + padding * 2) + 'px';

            // Actualizar textos
            document.getElementById('tour-title').innerText = step.title;
            document.getElementById('tour-desc').innerText = step.desc;
            
            // Decidir si el mensaje va arriba o abajo del foco
            if (rect.bottom > window.innerHeight / 2) {
                tooltipEl.style.top = (rect.top - padding - tooltipEl.offsetHeight - 15) + 'px';
            } else {
                tooltipEl.style.top = (rect.bottom + padding + 15) + 'px';
            }
            tooltipEl.style.left = '50%';
            tooltipEl.style.transform = 'translateX(-50%) translateY(0)';
            tooltipEl.style.opacity = '1';

            // Botón de Siguiente/Terminar
            const btnTxt = document.getElementById('tour-btn-txt');
            if (currentTourIndex === tourSteps.length - 1) {
                btnTxt.innerText = '¡Empezar a pedir!';
            } else {
                btnTxt.innerText = 'Siguiente';
            }
        }, 300); // Tiempo para que el scroll termine
    }, 300); // Tiempo para que cambie la vista
};

window.nextTourStep = function() {
    const tooltipEl = document.getElementById('tour-tooltip');
    tooltipEl.style.opacity = '0'; // Efecto de ocultar suavemente
    setTimeout(() => {
        currentTourIndex++;
        showTourStep();
    }, 200);
};

window.endTour = function() {
    const overlay = document.getElementById('tour-overlay');
    if (overlay) overlay.style.display = 'none';
    localStorage.setItem('rapi_tour_seen', 'true'); // Guardar que ya lo vio
    navTo('home'); 
};

/* =======================================================
   REPARACIONES CRÍTICAS: FILTROS Y CHECKOUT (AL 100%)
========================================================== */

// --- 1. HACER FUNCIONAR LOS FILTROS DEL MENÚ (Más Vendidos, Ofertas, Todo) ---
window.filterMenu = function(filter, el) {
    currentMenuFilter = filter;
    
    // Actualizar los colores del botón seleccionado
    document.querySelectorAll('.menu-filter-chip').forEach(c => c.classList.remove('active'));
    if(el) el.classList.add('active');
    
    // Volver a renderizar los productos con el filtro aplicado
    if (typeof renderMenuItems === 'function') {
        renderMenuItems();
    }
};

// --- 2. HACER FUNCIONAR EL BOTÓN ATRÁS DEL CHECKOUT ---
window.attemptExitCheckout = function() {
    const modal = document.getElementById('exit-checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        // Respaldo de seguridad por si el modal falla
        if (currentRestaurantKey) navTo('restaurant');
        else navTo('home');
    }
};

window.confirmExitCheckout = function() {
    const modal = document.getElementById('exit-checkout-modal');
    if (modal) modal.style.display = 'none';
    
    // Regresar al restaurante si hay uno seleccionado
    if (currentRestaurantKey && typeof DB !== 'undefined' && DB[currentRestaurantKey]) {
        navTo('restaurant');
    } else {
        navTo('home');
    }
};

/* =======================================================
   ALGORITMO INTELIGENTE DE RECOMENDACIONES PRO (ACTUALIZADO)
========================================================== */

window.renderSmartRecommendations = function() {
    const container = document.getElementById('smart-recommendations-container');
    if(!container || typeof DB === 'undefined') return;

    const hour = new Date().getHours();
    let timeContext = "Antojos para ti";
    let timeIcon = "fa-star";
    let foodKeywords = [];

    // 1. IDENTIFICAR CONTEXTO POR HORA
    if (hour >= 5 && hour < 11) {
        timeContext = "Buenos días ☀️"; timeIcon = "fa-coffee";
        foodKeywords = ['desayuno', 'baleada', 'cafe', 'café', 'pancake', 'huevo', 'pan'];
    } else if (hour >= 11 && hour < 17) {
        timeContext = "Hora de Almorzar 🍽️"; timeIcon = "fa-utensils";
        foodKeywords = ['almuerzo', 'pollo', 'carne', 'taco', 'sopa', 'combo', 'chuleta', 'arroz'];
    } else {
        timeContext = "Para esta noche 🌙"; timeIcon = "fa-moon";
        foodKeywords = ['pizza', 'hamburguesa', 'burger', 'cena', 'taco', 'sushi', 'alitas'];
    }

    function extractItems(type, keywords, limit, tagText, tagClass) {
        let pool = [];
        for(let k in DB) {
            const store = DB[k];
            if (store.type === type && store.menu) {
                store.menu.forEach(item => {
                    let match = false;
                    if (keywords.length === 0) match = true; 
                    else {
                        const itemName = (item.n || "").toLowerCase();
                        const itemCat = (item.cat || item.category || "").toLowerCase();
                        match = keywords.some(kw => itemName.includes(kw) || itemCat.includes(kw));
                    }
                    if(match && item.p > 0) { 
                        pool.push({
                            ...item,
                            storeName: store.name,
                            storeKey: k,
                            img: item.img || store.cover,
                            tag: tagText,
                            tagClass: tagClass
                        });
                    }
                });
            }
        }
        pool.sort(() => 0.5 - Math.random());
        return pool.slice(0, limit);
    }

    // TEXTOS MÁS PROFESIONALES (Se eliminó lo "infantil")
    let foodItems = extractItems('food', foodKeywords, 3, '💎 Selección Premium', '');
    if(foodItems.length < 3) { 
        const fallback = extractItems('food', [], 3 - foodItems.length, '🔥 Tendencia', '');
        foodItems = foodItems.concat(fallback);
    }

    let healthItems = extractItems('health', ['pastilla', 'dolor', 'panadol', 'gripa', 'vitamina', 'jarabe'], 1, '💊 Salud Rápida', 'health');
    if(!healthItems.length) healthItems = extractItems('health', [], 1, '💊 Cuidado Personal', 'health');

    let marketItems = extractItems('market', ['leche', 'pan', 'huevo', 'cereal', 'snack', 'agua', 'soda'], 1, '🛒 Básico de Casa', 'market');
    if(!marketItems.length) marketItems = extractItems('market', [], 1, '🛒 Super Express', 'market');

    const suggestions = [...foodItems, ...healthItems, ...marketItems];
    if(suggestions.length === 0) return; 

    let html = `
        <h3 class="smart-header"><i class="fas ${timeIcon}"></i> ${timeContext}</h3>
        <div class="smart-reco-scroll">
    `;

    suggestions.forEach(item => {
        const safeName = item.n.replace(/'/g, "\\'");
        const safeRest = item.storeName.replace(/'/g, "\\'");
        const timeEstimate = (item.tagClass === 'health' || item.tagClass === 'market') ? '15 - 20 min' : '20 - 30 min';
        
        html += `
            <div class="smart-card">
                <div class="smart-img-container" onclick="quickAddSmart('${safeName}', ${item.p}, '${safeRest}')">
                    <img src="${item.img}" class="smart-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3188/3188120.png'">
                    <div class="smart-tag ${item.tagClass}">${item.tag}</div>
                </div>
                <div class="smart-title" onclick="quickAddSmart('${safeName}', ${item.p}, '${safeRest}')">${item.n}</div>
                <div class="smart-store"><i class="fas fa-store"></i> ${item.storeName}</div>
                
                <div class="smart-delivery-time">
                    <i class="fas fa-motorcycle"></i> Llega de ${timeEstimate}
                </div>

                <div class="smart-price-row">
                    <div class="smart-price">L ${item.p}</div>
                    <button class="smart-add-btn" onclick="quickAddSmart('${safeName}', ${item.p}, '${safeRest}')"><i class="fas fa-plus"></i></button>
                </div>
                
                <button class="smart-see-more-btn" onclick="openRestaurant('${item.storeKey}')">
                    Ver menú del local <i class="fas fa-arrow-right" style="color:var(--rapi-orange);"></i>
                </button>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
};

// 5. FUNCIÓN DE AÑADIR DIRECTO AL CARRITO (Texto Limpio)
window.quickAddSmart = function(name, price, storeName) {
    updateItemQty(name, price, storeName, 1, null);
    if(cart.length > 0 && cart[0].s === storeName) {
        if(typeof openModal === "function") {
            openModal('fas fa-cart-plus', '¡Añadido!', name + ' se agregó a tu orden.', '#10b981');
        }
        if(typeof updateMiniCart === "function") updateMiniCart();
    }
};

/* =======================================================
   NUEVO: SERVICIOS LOGÍSTICOS DIRECTO AL CHECKOUT
========================================================== */
window.addLogisticsService = function(type) {
    const storeName = "Logística Rapi";
    const itemName = type === 'envio' ? "📦 Servicio de Envío" : "⚡ Encomienda / Trámite";
    const price = 0; // El costo será la tarifa de entrega de la colonia seleccionada

    // Usamos la función maestra que respeta la regla de 1 solo comercio a la vez
    updateItemQty(itemName, price, storeName, 1, null);

    // Si se agregó correctamente (si no saltó la alerta de vaciar carrito)
    if (cart.length > 0 && cart[0].s === storeName) {
        
        // Cambiamos temporalmente el texto de la caja de dirección en el Checkout
        // para que el cliente sepa que ahí debe explicar su encargo.
        const addrInput = document.getElementById('address-input');
        if(addrInput) {
            addrInput.placeholder = type === 'envio' 
                ? "Ej: Recoger paquete en Bo. Cabañas y llevarlo a Palermo..." 
                : "Ej: Comprar pastillas en Farmacia Kielsa y traerlas a casa...";
        }

        // Navegamos al Checkout automáticamente
        navTo('checkout');
        
        // Pequeño aviso guía
        if(typeof openModal === "function") {
            openModal(
                'fas fa-motorcycle', 
                '¡Servicio Agregado!', 
                'Selecciona tu colonia para ver la tarifa. Usa el cuadro "Dirección Exacta" para darnos los detalles del encargo.', 
                'var(--rapi-orange)'
            );
        }
    }
};

/* =======================================================
   SISTEMA DE GPS EN TIEMPO REAL (MODO INVISIBLE PRO)
========================================================== */
window.captureGPS = function(context) {
    const btnId = context === 'checkout' ? 'btn-gps-checkout' : 'btn-gps-book';
    const btn = document.getElementById(btnId);
    
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin maps-icon" style="color:#1a73e8;"></i> <span>Buscando satélite...</span>';
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const cleanCoords = `${lat}, ${lng}`; 
                
                if (context === 'checkout') {
                    const input = document.getElementById('checkout-coords');
                    if(input) input.value = cleanCoords;
                } else if (context === 'address-book') {
                    const input = document.getElementById('new-addr-coords');
                    if(input) input.value = cleanCoords;
                }
                
                // Efecto de éxito en el botón
                if (btn) {
                    btn.classList.add('success');
                    btn.innerHTML = '<i class="fas fa-check-circle maps-icon"></i> <span>¡Ubicación fijada!</span>';
                }
            },
            (error) => {
                // Restablecer botón en caso de error
                if (btn) {
                    btn.classList.remove('success');
                    btn.innerHTML = '<i class="fas fa-map-marker-alt maps-icon"></i> <span>Reintentar ubicación</span>';
                }

                let msg = "No pudimos obtener tu ubicación.";
                if (error.code === 1) msg = "Debes permitir el acceso a tu ubicación en el navegador para continuar.";
                if (error.code === 2) msg = "La señal del GPS es débil. Intenta salir al aire libre.";
                if (error.code === 3) msg = "Se agotó el tiempo buscando tu GPS. Intenta de nuevo.";
                
                showProError(msg, []);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 } 
        );
    } else {
        showProError("Tu celular o navegador no soporta esta función de GPS.", []);
    }
};

// ================= MOTOR DE TRACKING PRO (GOOGLE MAPS + UPSELLING PREMIUM) =================
const TrackingEngine = {
    orderId: null,
    pollInterval: null,
    map: null,
    markerRider: null,
    markerCustomer: null,
    audioAlert: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'),
    isMinimized: false,

    restore() {
        const savedData = localStorage.getItem('rapi_active_tracking');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.start(data.id, data.lat, data.lon, data.store, true);
        }
    },

    start(orderId, customerLat, customerLon, storeName, isRestore = false) {
        this.orderId = orderId;
        this.isMinimized = false;
        
        if (!isRestore) {
            localStorage.setItem('rapi_active_tracking', JSON.stringify({
                id: orderId, lat: customerLat, lon: customerLon, store: storeName
            }));
        }

        const widget = document.getElementById('floating-tracking-widget');
        if(widget) widget.classList.remove('show');

        this.maximize(); 

        // ================= MAGIA DE GOOGLE MAPS =================
        if (!this.map) {
            this.map = L.map('tracking-map', { zoomControl: false }).setView([customerLat, customerLon], 15);
            
            // Usamos los servidores oficiales de Google Maps (Estilo Calles)
            L.tileLayer('https://mt1.google.com/vt/lyrs=m&hl=es&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: '© Google Maps'
            }).addTo(this.map);
            
            const userIcon = L.divIcon({ className: 'custom-marker', html: `<div style="background:var(--success); width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>` });
            this.markerCustomer = L.marker([customerLat, customerLon], { icon: userIcon }).addTo(this.map);
        } else {
            this.map.setView([customerLat, customerLon], 15);
        }

        setTimeout(() => { if (this.map) this.map.invalidateSize(); }, 400);
        
        // Cargar las nuevas tarjetas Premium
        this.populateUpselling();

        if(this.pollInterval) clearInterval(this.pollInterval);
        this.checkStatus();
        this.pollInterval = setInterval(() => this.checkStatus(), 5000);
    },

    minimize() {
        this.isMinimized = true;
        const viewTracking = document.getElementById('view-tracking');
        const widget = document.getElementById('floating-tracking-widget');
        const navBar = document.getElementById('main-nav');
        
        if (viewTracking) {
            viewTracking.style.transform = 'translateY(100%)';
            setTimeout(() => { viewTracking.style.display = 'none'; }, 400);
        }
        if (widget) widget.classList.add('show');
        if (navBar) navBar.style.transform = "translateY(0)";
        if (navigator.vibrate) navigator.vibrate(50);
    },

    maximize() {
        this.isMinimized = false;
        const viewTracking = document.getElementById('view-tracking');
        const widget = document.getElementById('floating-tracking-widget');
        const navBar = document.getElementById('main-nav');
        
        if (widget) widget.classList.remove('show');
        if (viewTracking) {
            viewTracking.style.display = 'flex';
            setTimeout(() => { viewTracking.style.transform = 'translateY(0)'; }, 50);
        }
        if (navBar) navBar.style.transform = "translateY(150px)";
        
        setTimeout(() => { if (this.map) this.map.invalidateSize(); }, 400);
        if (navigator.vibrate) navigator.vibrate(50);
    },

    async checkStatus() {
        try {
            // Lógica de progreso INTACTA
            const res = await fetch('https://raiderelporgreso.onrender.com/api/pedidos');
            const data = await res.json();
            
            const myOrder = data.data.find(o => o.id === this.orderId);

            if (!myOrder) {
                this.triggerDelivered(); 
            } else {
                let step = 1; let title = "Buscando Rider..."; let sub = "Confirmando orden con el local.";
                
                if (myOrder.rider_id) {
                    if (myOrder.status === 'aceptado') {
                        step = 1; title = "¡Rider Asignado!"; sub = "Va en camino al restaurante.";
                    } else if (myOrder.status === 'en_local') {
                        step = 2; title = "Rider en el Local"; sub = "Esperando que preparen tu pedido.";
                    } else if (myOrder.status === 'en_camino') {
                        step = 3; title = "¡Rider en Camino!"; sub = "Prepárate para salir a recibirlo.";
                        this.simulateRiderMovement();
                    }
                }
                this.updateUI(step, title, sub, myOrder.rider_id);
            }
        } catch (error) { console.error("Error Tracking:", error); }
    },

    updateUI(step, title, sub, riderName = null) {
        document.getElementById('tracking-main-title').textContent = title;
        document.getElementById('tracking-sub-title').textContent = sub;
        
        const fwTitle = document.getElementById('fw-title');
        if(fwTitle) fwTitle.textContent = title;

        if (riderName) {
            document.getElementById('rider-info-card').style.display = 'flex';
            document.getElementById('tracking-rider-name').textContent = "Rider #" + riderName.substring(0,4).toUpperCase();
        }

        const steps = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')];
        steps.forEach(s => { if(s) s.classList.remove('active', 'pulsing'); });

        if (step >= 1 && steps[0]) steps[0].classList.add('active');
        if (step >= 2 && steps[1]) steps[1].classList.add('active');
        if (step >= 3 && steps[2]) steps[2].classList.add('active', 'pulsing');
        
        const fwIcon = document.getElementById('fw-icon-motor');
        if (fwIcon) {
            if (step === 3) fwIcon.className = "fas fa-motorcycle fa-bounce text-green";
            else fwIcon.className = "fas fa-motorcycle";
        }
    },

    triggerDelivered() {
        clearInterval(this.pollInterval);
        localStorage.removeItem('rapi_active_tracking'); 
        
        const widget = document.getElementById('floating-tracking-widget');
        if(widget) widget.classList.remove('show');

        const viewTracking = document.getElementById('view-tracking');
        if(viewTracking) viewTracking.style.opacity = '0';
        
        setTimeout(() => {
            if(viewTracking) viewTracking.style.display = 'none';
            const ratingModal = document.getElementById('rating-modal');
            if(ratingModal) ratingModal.style.display = 'flex';
        }, 400);
    },

    simulateRiderMovement() {
        if (!this.alertPlayed) {
            this.audioAlert.play().catch(e => {}); 
            if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 500]);
            this.alertPlayed = true;
        }
    },

    // ================= NUEVAS TARJETAS PREMIUM =================
    populateUpselling() {
        const container = document.getElementById('upsell-carousel');
        if (!container || typeof DB === 'undefined') return;
        container.innerHTML = '';
        
        const allItems = [];
        for (let k in DB) { if (DB[k].menu) allItems.push(...DB[k].menu); }
        const shuffled = allItems.sort(() => 0.5 - Math.random()).slice(0, 6); 
        
        shuffled.forEach(item => {
            container.innerHTML += `
                <div class="upsell-card-pro" onclick="alert('Esta función se activará en tu próxima compra')">
                    <img src="${item.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}" class="upsell-img-pro" loading="lazy">
                    <div class="upsell-info-pro">
                        <h5 class="upsell-title-pro">${item.n}</h5>
                        <p class="upsell-price-pro">L ${item.p.toFixed(2)}</p>
                    </div>
                    <button class="upsell-add-btn"><i class="fas fa-plus"></i></button>
                </div>`;
        });
    },

    rate(stars) {
        document.querySelectorAll('.rating-star').forEach((el, i) => {
            el.classList.toggle('active', i < stars);
        });
        setTimeout(() => this.closeRating(), 800);
    },

    closeRating() {
        document.getElementById('rating-modal').style.display = 'none';
        window.location.reload(); 
    }
};

// ================= ACTIVADOR DE MEMORIA =================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        TrackingEngine.restore();
    }, 1500); 
});