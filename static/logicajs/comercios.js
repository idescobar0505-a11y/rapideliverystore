const DB = {
    // ==========================================
    // SECCIÓN RESTAURANTES (COMIDA)
    // ==========================================
    "Pollos Margara": { 
        name: "Pollos Margara", 
        type: "food", 
        lat: 15.403110063520096,  // <-- Aquí está la Latitud
        lon: -87.80519575586578, // <-- Aquí está la Longitud
        openTime: 10,
        closeTime: 22,
        img: "https://i.ibb.co/DgHfZTKg/495020344-1246832990781815-1346414209675895415-n.jpg", 
        cover: "https://i.ibb.co/NzjdqMy/pollo-frito-crujiente-plato-ensalada-zanahoria-1150-20212.avif", 
        menu: [
            // SECCIÓN: LO MÁS VENDIDO
            {
                n: "Pollo Pierna Completa", 
                p: 144, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "Deliciosa pierna de pollo frito crujiente, acompañada de tajadas de banano verde, ensalada de repollo y nuestro aderezo especial.", 
                img: "https://i.ibb.co/NzjdqMy/pollo-frito-crujiente-plato-ensalada-zanahoria-1150-20212.avif"
            },
            {
                n: "Media Orden Tacos", 
                p: 80, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "3 tacos flauta rellenos de pollo desmenuzado, cubiertos con salsa roja, queso rallado y repollo fresco.", 
                img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500"
            },
            
            // SECCIÓN: COMBOS FAMILIARES
            {
                n: "Doble Pierna c/ Tajadas", 
                p: 215, 
                offer: true, 
                oldP: 250, 
                category: "Combos Familiares 👨‍👩‍👧‍👦", 
                desc: "Para compartir: 2 piernas grandes, doble porción de tajadas, encurtido y salsas.", 
                img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"
            },
            {
                n: "Super Pack 4 Piezas", 
                p: 420, 
                category: "Combos Familiares 👨‍👩‍👧‍👦", 
                desc: "El banquete familiar: 4 piezas mixtas de pollo, tajadas familiares, ensalada y refresco de 1.5L.", 
                img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"
            },

            // SECCIÓN: INDIVIDUALES
            {
                n: "Pollo con Tajadas", 
                p: 145, 
                category: "Platos Individuales 🍗", 
                desc: "El clásico sampedrano: Pieza de pollo a elección con tajadas fritas al momento.", 
                img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"
            },
            {
                n: "Alitas BBQ (6 Unid)", 
                p: 160, 
                category: "Platos Individuales 🍗", 
                desc: "6 alitas bañadas en salsa barbacoa dulce, acompañadas de papas fritas.", 
                img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500"
            },

            // SECCIÓN: BEBIDAS
            {
                n: "Refresco Pepsi 1.5L", 
                p: 45, 
                category: "Bebidas 🥤", 
                desc: "Botella familiar de 1.5 Litros, bien fría.", 
                img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"
            },
            {
                n: "Té Lipton", 
                p: 32, 
                category: "Bebidas 🥤", 
                desc: "Té helado refrescante sabor limón.", 
                img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"
            }
        ] 
    },

"LaFonda": { 
        name: "La Fonda Mexican Food", 
        type: "food", 
        lat: 15.399761339212853, // <-- Latitud agregada
        lon: -87.80864239471,    // <-- Longitud agregada
        openTime: 10,
        closeTime: 22,
        img: "https://i.ibb.co/B5yTg59r/unnamed.png", 
        cover: "https://i.ibb.co/60btXXqZ/result-2.png", 
        menu: [
            // ... (aquí siguen los productos de La Fonda)
            // SECCIÓN: ESPECIALIDADES
            {
                n: "Gringas", 
                p: 198, 
                top: true, 
                category: "Especialidades 🔥", 
                desc: "Tortilla de harina gigante rellena de carne al pastor, queso derretido, piña y cilantro.", 
                img: "https://i.ibb.co/bRvdPZmm/result-1.png"
            },
            {
                n: "Fundido de res toreado", 
                p: 205, 
                category: "Especialidades 🔥", 
                desc: "Cazuela de queso fundido con trozos de res y chiles toreados, ideal para taquear.", 
                img: "https://i.ibb.co/V0DGYkVW/Whats-App-Image-2026-02-18-at-8-37-24-PM.jpg"
            },

            // SECCIÓN: TACOS
            {
                n: "Tacos de pollo/res", 
                p: 150, 
                offer: true, 
                oldP: 185, 
                category: "Tacos 🌮", 
                desc: "Orden de 3 tacos con tortilla de maíz, cebolla, cilantro y salsa verde o roja.", 
                img: "https://i.ibb.co/S4CN6HSd/Whats-App-Image-2026-02-18-at-8-37-24-PM-2.jpg"
            },
            {
                n: "Tacos birria res/pollo", 
                p: 187, 
                top: true, 
                category: "Tacos 🌮", 
                desc: "Los famosos tacos de birria doraditos con queso, acompañados de su consomé para chopear.", 
                img: "https://i.ibb.co/bRX0Mhsk/Whats-App-Image-2026-02-18-at-8-37-24-PM-1.jpg"
            },

            // SECCIÓN: BEBIDAS
            {
                n: "Refresco Pepsi", 
                p: 32, 
                category: "Bebidas 🥤", 
                desc: "Refresco personal de 500ml.", 
                img: "https://i.ibb.co/vCP01rDw/pepsib-7up-mirinda-970ml.jpg"
            }
        ] 
    },

"CafeteriaLaMoy": { 
        name: "Cafetería La Moy", 
        type: "food", 
        lat: 15.42223142313331,   // <-- Latitud
        lon: -87.79951751832331,  // <-- Longitud
        openTime: 6, // Abre a las 6:00 AM
        closeTime: 21, // Cierra a las 9:00 PM
        img: "https://i.ibb.co/YBL9RHXJ/301155313-595463825305179-2752405309081478991-n.png", 
        cover: "https://i.ibb.co/CKmK21F0/588563909-1443114540540099-8824867993839303086-n.jpg", 
        menu: [
            // ... (aquí van los productos de Cafetería La Moy)
            // ================== LO MÁS VENDIDO ==================
            {
                n: "Súper Desayuno Típico", 
                p: 119, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "Huevos al gusto, frijoles fritos, plátano maduro, queso, mantequilla, aguacate y tortillas de maíz recién hechas.", 
                img: "https://i.ibb.co/CKmK21F0/588563909-1443114540540099-8824867993839303086-n.jpg"
            },
            {
                n: "Baleada Súper Especial", 
                p: 55, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "Tortilla de harina grande con frijoles, mantequilla, queso, huevo picado, aguacATE, Choriso parillero.", 
                img: "https://i.ibb.co/v4DRRNLR/1464x918baleadas-hero-image-1464x920-c.jpg" // Foto ilustrativa de taco/baleada
            },

            // ================== BALEADAS ==================
            {
                n: " 5Pack Baleada Sencilla", 
                p: 139, 
                category: "🌯 Baleadas", 
                desc: " 5 Clásica tortillas de harina con frijoles fritos, queso rallado y mantequilla crema.", 
                img: "https://i.ibb.co/fYdFd3hJ/baleadas-hondurenas-800x534.webp"
            },
            {
                n: "Baleada con Huevo", 
                p: 30, 
                category: "🌯 Baleadas", 
                desc: "Frijoles, queso, mantequilla y huevo revuelto.", 
                img: "https://i.ibb.co/CpG5L5C4/que-son-las-baleadas-hondurenas-800x450.jpg"
            },

            // ================== ALMUERZOS Y ANTOJOS ==================
            {
                n: "Pollo Frito con Tajadas", 
                p: 130, 
                category: "🍛 Almuerzos", 
                desc: "Pollo chuco crujiente con tajadas de guineo verde, repollo, chismol y aderezo de la casa.", 
                img: "https://i.ibb.co/RkYJ6sVb/shutterstock-2287363777.webp"
            },
            {
                n: "Plato de Carne Asada", 
                p: 150, 
                offer: true, // Etiqueta roja de oferta
                category: "🍛 Almuerzos", 
                desc: "Carne de res marinada, arroz, frijoles, tajadas, queso y ensalada fresca.", 
                img: "https://i.ibb.co/bMkz1PT1/Carne-Asada-35.avif"
            },
            {
                n: "Orden de Pastelitos de Perro (3)", 
                p: 45, 
                category: "🍛 Almuerzos", 
                desc: "Tres pastelitos de maíz rellenos de carne y papa, servidos con repollo y salsa roja.", 
                img: "https://i.ibb.co/LdK5MytG/pastelitos-de-harina-de-maiz-web.jpg"
            },

            // ================== BEBIDAS ==================
            {
                n: "Café de Palo (Caliente)", 
                p: 25, 
                category: " Bebidas", 
                desc: "Delicioso café hondureño recién chorreado.", 
                img: "https://i.ibb.co/LdHLsHZ9/polvo-del-grano-de-caf-molido-y-taza-express-con-el-stov-103276918.webp"
            },
            {
                n: "Jugo Natural de Naranja", 
                p: 35, 
                category: " Bebidas", 
                desc: "Exprimido al instante, 100% natural sin azúcar añadida.", 
                img: "https://i.ibb.co/0pd6Gfz9/jugo-de-naranja-destacado.jpg"
            },
            {
                n: "Licuado de Banano con Leche", 
                p: 40, 
                category: "Bebidas", 
                desc: "Batido cremoso de banano, leche y un toque de vainilla.", 
                img: "https://i.ibb.co/XkGQ9BwS/Banana-Liquado-with-Vanilla-and-Cinammon.jpg"
            }
        ]
    },

    "LaFonda centro": { 
        name: "La Fonda Mexican Food", 
        type: "food", 
        lat: 15.399761339212853, // <-- Latitud agregada
        lon: -87.80864239471,    // <-- Longitud agregada
        openTime: 10,
        closeTime: 22,
        img: "https://i.ibb.co/B5yTg59r/unnamed.png", 
        cover: "https://i.ibb.co/60btXXqZ/result-2.png", 
        menu: [
            // ... (aquí siguen los productos de La Fonda)
            // SECCIÓN: ESPECIALIDADES
            {
                n: "Gringas", 
                p: 198, 
                top: true, 
                category: "Especialidades 🔥", 
                desc: "Tortilla de harina gigante rellena de carne al pastor, queso derretido, piña y cilantro.", 
                img: "https://i.ibb.co/bRvdPZmm/result-1.png"
            },
            {
                n: "Fundido de res toreado", 
                p: 205, 
                category: "Especialidades 🔥", 
                desc: "Cazuela de queso fundido con trozos de res y chiles toreados, ideal para taquear.", 
                img: "https://i.ibb.co/V0DGYkVW/Whats-App-Image-2026-02-18-at-8-37-24-PM.jpg"
            },

            // SECCIÓN: TACOS
            {
                n: "Tacos de pollo/res", 
                p: 150, 
                offer: true, 
                oldP: 185, 
                category: "Tacos 🌮", 
                desc: "Orden de 3 tacos con tortilla de maíz, cebolla, cilantro y salsa verde o roja.", 
                img: "https://i.ibb.co/S4CN6HSd/Whats-App-Image-2026-02-18-at-8-37-24-PM-2.jpg"
            },
            {
                n: "Tacos birria res/pollo", 
                p: 187, 
                top: true, 
                category: "Tacos 🌮", 
                desc: "Los famosos tacos de birria doraditos con queso, acompañados de su consomé para chopear.", 
                img: "https://i.ibb.co/bRX0Mhsk/Whats-App-Image-2026-02-18-at-8-37-24-PM-1.jpg"
            },

            // SECCIÓN: BEBIDAS
            {
                n: "Refresco Pepsi", 
                p: 32, 
                category: "Bebidas 🥤", 
                desc: "Refresco personal de 500ml.", 
                img: "https://i.ibb.co/vCP01rDw/pepsib-7up-mirinda-970ml.jpg"
            }
        ] 
    },

"BochasGrill": { 
        name: "Bochas Grill", 
        type: "food", 
        lat: 15.415508679553302,  // <-- Latitud (Zona Mall Megaplaza)
        lon: -87.80258060068132, // <-- Longitud (Zona Mall Megaplaza)
        openTime: 11, // Abre a las 11:00 AM
        closeTime: 22, // Cierra a las 10:00 PM
        img: "https://i.ibb.co/wZbLWjgX/FB-IMG-1771528888412.jpg", 
        cover: "https://i.ibb.co/N6wYFTkc/images-14.jpg", 
        menu: [
            // ================== LO MÁS VENDIDO ==================
            {
                n: "Parrillada Bochas (Para 2)", 
                p: 450, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "Deliciosa selección de carnes: res, cerdo, chorizo y pollo asado. Incluye frijoles, chismol, aguacate y tortillas.", 
                img: "https://i.ibb.co/bVRYtSC/images-12.jpg"
            },
            {
                n: "Hamburguesa Bochas Grill", 
                p: 160, 
                top: true, 
                category: "🔥 Lo Más Vendido", 
                desc: "Doble torta de res a la parrilla, queso derretido, tocino crujiente, vegetales frescos y papas fritas.", 
                img: "https://i.ibb.co/xq5t22t3/images-15.jpg"
            },

            // ================== CARNES Y CORTES ==================
            {
                n: "Churrasco Tradicional", 
                p: 220, 
                category: "🥩 Cortes a la Parrilla", 
                desc: "Corte de res suave y jugoso, bañado en chimichurri de la casa. Acompañado de tajadas, frijoles y ensalada.", 
                img: "https://i.ibb.co/7NVHyRFQ/images-11.jpg"
            },
            {
                n: "Costillas BBQ", 
                p: 280, 
                category: "🥩 Cortes a la Parrilla", 
                desc: "Costillas de cerdo ahumadas y bañadas en nuestra salsa BBQ secreta. Incluye papas fritas y ensalada de repollo.", 
                img: "https://ibb.co/4nNFL3H2"
            },

            // ================== ANTOJOS ==================
            {
                n: "Choripán Argentino", 
                p: 90, 
                category: "🌭 Antojos a la Parrilla", 
                desc: "Chorizo asado a la parrilla en pan artesanal, bañado en abundante salsa chimichurri.", 
                img: "https://ibb.co/chS6GWxg"
            }
        ]
    },

"PolloDaisy": { 
        name: "Pollo Daisy", 
        type: "food", 
        lat: 15.383262625326461,  // <-- Latitud (Zona Sur de El Progreso)
        lon: -87.81462563712762, // <-- Longitud
        openTime: 18,   
        closeTime: 23,
        img: "https://i.ibb.co/4whMtwcd/406378335-868866321909006-1813037319512314677-n.jpg", 
        cover: "https://i.ibb.co/TDg5QjG2/3365t8.jpg", 
        menu: [
            // ... (aquí van los productos de Pollo Daisy)
            // SECCIÓN: POLLOS
            {
                n: "Pollo con Tajada", 
                p: 120, 
                top: true, 
                category: "Pollos Tradicionales 🍗", 
                desc: "Pieza jugosa de pollo con tajadas de guineo verde, chismol y aderezo.", 
                img: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500"
            },
            {
                n: "Pierna Entera", 
                p: 145, 
                category: "Pollos Tradicionales 🍗", 
                desc: "Pierna y muslo unidos, fritos a la perfección con acompañamientos.", 
                img: "https://images.unsplash.com/photo-1587593810167-a6b219194084?w=500"
            },

            // SECCIÓN: OFERTAS
            {
                n: "Doble Pieza", 
                p: 242, 
                offer: true, 
                oldP: 270, 
                category: "Super Ofertas 🏷️", 
                desc: "Dos piezas grandes de pollo con doble porción de tajadas y ensalada.", 
                img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"
            },

            // SECCIÓN: CHULETAS
            {
                n: "Chuleta Ahumada", 
                p: 140, 
                top: true, 
                category: "Chuletas & Grill 🔥", 
                desc: "Chuleta de cerdo ahumada a la plancha, servida con tajadas y encurtido.", 
                img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"
            },

            // SECCIÓN: ALITAS
            {
                n: "8 Alitas Wing c/ Papas", 
                p: 217, 
                category: "Alitas & Snacks 🍟", 
                desc: "8 alitas crujientes bañadas en salsa, acompañadas de papas fritas.", 
                img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500"
            }
        ] 
    },

"TacoPollo": { 
        name: "Taco Pollo", 
        type: "food", 
        lat: 15.404459916878645,  // <-- Latitud (Ubicación Taco Pollo)
        lon: -87.80839486620776, // <-- Longitud (Ubicación Taco Pollo)
        openTime: 10,
        closeTime: 21,
        img: "https://i.ibb.co/ks2wMB6X/627526249-903663318872027-2578364798022424945-n.jpg", 
        cover: "https://i.ibb.co/v6zsyZXY/587911660-18539490805016681-8435351634239036068-n.jpg", 
        menu: [
            // ... (aquí van los productos de Taco Pollo)
            // SECCIÓN: COMBOS ECONÓMICOS
            {
                n: "Combo Económico (FRITO)", 
                p: 165, 
                top: true, 
                category: "Combos Económicos 🍗", 
                desc: "Incluye pollo frito, arroz, frijoles, ensalada y tortillas.", 
                img: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500"
            },
            {
                n: "Combo Económico (ROSTIZADO)", 
                p: 165, 
                offer: true, 
                oldP: 190, 
                category: "Combos Económicos 🍗", 
                desc: "Pollo rostizado jugoso con arroz, frijoles, ensalada y tortillas.", 
                img: "https://images.unsplash.com/photo-1598103442097-8b7400838f03?w=500"
            },

            // SECCIÓN: PERSONALES
            {
                n: "Combo Personal c/Papas", 
                p: 194, 
                top: true, 
                category: "Combos Personales 🍟", 
                desc: "Pieza de pollo, papas fritas, pan y bebida.", 
                img: "https://images.unsplash.com/photo-1625938145244-e4602955f30c?w=500"
            },

            // SECCIÓN: ANTOJITOS
            {
                n: "Orden Flautas de Pollo", 
                p: 153, 
                category: "Antojitos Mexicanos 🌮", 
                desc: "4 tacos dorados rellenos de pollo, con lechuga, crema y queso.", 
                img: "https://images.unsplash.com/photo-1563503593-6c8413697960?w=500"
            }
        ] 
    },

"PollosHermanos": { 
        name: "Pollos Los Hermanos", 
        type: "food", 
        lat: 15.38696073442692,  // <-- Latitud (Ubicación Pollos Los Hermanos)
        lon: -87.80312432592466, // <-- Longitud (Ubicación Pollos Los Hermanos)
        openTime: 10, 
        closeTime: 22,
        img: "https://i.ibb.co/8LKvRKQV/406865983-122109802256138003-7107381323655893602-n.jpg", 
        cover: "https://i.ibb.co/sJwbj2ph/469299488-122187411152138003-8692295308028148120-n.jpg", 
        menu: [
            // ... (aquí van los productos de Pollos Los Hermanos)
            // SECCIÓN: ESPECIALIDADES DE POLLO
            {
                n: "Pollo Frito Tradicional", 
                p: 120, 
                top: true, 
                category: "Especialidades de Pollo 🍗", 
                desc: "El sabor de siempre, pollo frito crujiente con papas o tajadas.", 
                img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"
            },
            
            // SECCIÓN: OFERTAS
            {
                n: "Medio Pollo Asado", 
                p: 180, 
                offer: true, 
                oldP: 200, 
                category: "Ofertas del Día 🏷️", 
                desc: "Medio pollo marinado y asado al carbón, con tortillas y salsas.", 
                img: "https://images.unsplash.com/photo-1598103442097-8b7400838f03?w=500"
            },
            
            // SECCIÓN: SNACKS Y COMPLEMENTOS
            {
                n: "Nuggets de Pollo", 
                p: 90, 
                category: "Snacks & Complementos 🍟", 
                desc: "6 piezas de nuggets de pechuga empanizados con papas fritas.", 
                img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"
            },
            {
                n: "Ensalada de Repollo", 
                p: 30, 
                category: "Snacks & Complementos 🍟", 
                desc: "Porción extra de nuestra ensalada de repollo fresca.", 
                img: "https://images.unsplash.com/photo-1625944525533-5c8f1dc70eb5?w=500"
            }
        ] 
    },

"PupuseriaJardines": { 
        name: "Pupusería Jardines y Más", 
        type: "food", 
        lat: 15.379693758205896,  // <-- Latitud (Ubicación Pupusería)
        lon: -87.8046558669632,   // <-- Longitud
        openTime: 16, 
        closeTime: 22,
        img: "https://i.ibb.co/tw7m2tWc/612504547-1202995108474561-3265309565558625506-n.jpg", 
        cover: "https://i.ibb.co/C50svR8f/560088101-1162864312487641-1732540168533900789-n.jpg", 
        menu: [
            // ... (aquí van los productos de Pupusería Jardines)
            // SECCIÓN: PUPUSAS
            {
                n: "Pupusa Quesillo", 
                p: 25, 
                top: true, 
                category: "Pupusas Recién Hechas 🫓", 
                desc: "Pupusa de maíz o arroz rellena de abundante quesillo derretido.", 
                img: "https://i.pinimg.com/550x/99/3c/6d/993c6d649cb6333f8139366e927c9803.jpg"
            },
            {
                n: "Pupusa Revuelta", 
                p: 30, 
                category: "Pupusas Recién Hechas 🫓", 
                desc: "La favorita: Rellena de chicharrón molido, frijoles y quesillo.", 
                img: "https://img.freepik.com/fotos-premium/pupusas-plato-tradicional-salvadoreno-hecho-harina-maiz-gruesa-rellena-queso-frijoles-carne_92242-1250.jpg"
            },
            {
                n: "Pupusa Loroco", 
                p: 35, 
                category: "Pupusas Recién Hechas 🫓", 
                desc: "Deliciosa mezcla de quesillo con flor de loroco picada.", 
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6s8R-lq34U6dGfXn6kGg2_iE5d7x7tH5d_g&s"
            },

            // SECCIÓN: BEBIDAS
            {
                n: "Horchata de Morro", 
                p: 40, 
                category: "Bebidas Típicas 🥤", 
                desc: "Vaso grande de horchata natural a base de morro y especias.", 
                img: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500"
            }
        ] 
    },

"BurgerKing": { 
        name: "Burger King", 
        type: "food", 
        lat: 15.403980241067325,  // <-- Latitud (Ubicación Burger King)
        lon: -87.81104488848317, // <-- Longitud (Ubicación Burger King)
        openTime: 10, 
        closeTime: 22,
        img: "https://i.ibb.co/8nN9Q4KJ/unnamed-1.png", 
        cover: "https://i.ibb.co/Tq21g46Y/FAMILY-BUNDLEVNP-a59cbd2.jpg", 
        menu: [
            // ... (aquí van los combos de Burger King)
            // SECCIÓN: HAMBURGUESAS A LA PARRILLA
            {
                n: "Whopper + Whopper", 
                p: 399, 
                top: true, 
                category: "Hamburguesas a la Parrilla 🍔", 
                desc: "Dos hamburguesas Whopper clásicas con carne a la parrilla, vegetales frescos y mayonesa.", 
                img: "https://i.ibb.co/NdY9wMLC/CP2-W-W-PET-compressed-85e51a6.jpg"
            },
            {
                n: "Whopper + King de pollo", 
                p: 394, 
                offer: true, 
                oldP: 220, 
                category: "Hamburguesas a la Parrilla 🍔", 
                desc: "Lo mejor de dos mundos: Una Whopper de res y una King de Pollo crujiente.", 
                img: "https://ibb.co/4nYd80dm"
            },
            {
                n: "Whopper + Whoper Jr", 
                p: 300, 
                offer: true, 
                oldP: 220, 
                category: "Hamburguesas a la Parrilla 🍔", 
                desc: "Una Whopper clásica para ti y una Jr para quien come menos.", 
                img: "https://ibb.co/DfhKWrLr"
            },

            // SECCIÓN: ESPECIALES
            {
                n: "Corona Box", 
                p: 404, 
                category: "ESPECIALES POR TIEMPO LIMITADO ⌛", 
                desc: "La caja completa: Hamburguesa, papas, nuggets y bebida.", 
                img: "https://i.ibb.co/YTdMJCfg/armado-Yuuju-corona-box-compressed-1f3eb41.jpg"
            },

            // SECCIÓN: COMPLEMENTOS
            {
                n: "Papas Fritas Medianas", 
                p: 69, 
                category: "Complementos 🍟", 
                desc: "Papas corte clásico, doraditas y saladas.", 
                img: "https://i.ibb.co/QvtLjZPg/papas-med-ddb3776.jpg"
            },
            {
                n: "Papas Fritas Grandes", 
                p: 80, 
                category: "Complementos 🍟", 
                desc: "Porción grande de papas fritas para compartir.", 
                img: "https://i.ibb.co/jZkTqhk7/papas-grag-219dd98.jpg"
            },
            // SECCIÓN: POSTRES
            {
                n: "Hersheys Pie", 
                p: 95, 
                category: "Postres & Helados 🍦", 
                desc: "Cremoso pastel de chocolate Hershey's con base crujiente.", 
                img: "https://i.ibb.co/99nk9n0n/HERSHEY-PIEVNP-951040e2-66610dad.jpg"
            }
        ] 
    },
    
"FarmaciaSiman": { 
        name: "Farmacia Simán", 
        type: "health", 
        lat: 15.399136876569015,  // <-- Latitud (Ubicación Farmacia Simán)
        lon: -87.80433936634132, // <-- Longitud (Ubicación Farmacia Simán)
        openTime: 8, 
        closeTime: 22,
        img: "https://i.ibb.co/wZv1XG3Q/unnamed.png", 
        cover: "https://i.ibb.co/N6r0jyzL/655cfa6b7cea5637135365.jpg", 
        menu: [
            // ... (aquí van los productos de Farmacia Simán)
            // SECCIÓN: ALIVIO Y BIENESTAR
            {
                n: "Panadol Extra Fuerte", 
                p: 45, 
                top: true, 
                category: "Alivio y Bienestar 💊", 
                desc: "Alivio efectivo para dolores de cabeza fuertes y fiebre.", 
                img: "https://www.farmaciasiman.com/wp-content/uploads/2021/04/PANADOL-EXTRA-FUERTE-SOBRE-X-2-TAB.jpg"
            },
            {
                n: "Gripexc Plus (Caja)", 
                p: 120, 
                offer: true, 
                oldP: 140, 
                category: "Alivio y Bienestar 💊", 
                desc: "Tratamiento completo para los síntomas de la gripe y congestión.", 
                img: "https://fischelcr.com/images/products/3773.jpg"
            },
            {
                n: "Jarabe para la Tos", 
                p: 145, 
                category: "Alivio y Bienestar 💊", 
                desc: "Expectorante para aliviar la tos seca y con flemas.", 
                img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500"
            },
            {
                n: "Pastillas para la Garganta", 
                p: 80, 
                category: "Alivio y Bienestar 💊", 
                desc: "Caramelos medicados para aliviar la irritación de garganta.", 
                img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"
            },

            // SECCIÓN: VITAMINAS Y CUIDADO
            {
                n: "Vitamina C 1000mg", 
                p: 180, 
                category: "Vitaminas y Defensas ✨", 
                desc: "Suplemento diario para fortalecer el sistema inmunológico.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            },
            {
                n: "Suero Oral Electrolit", 
                p: 65, 
                top: true, 
                category: "Vitaminas y Defensas ✨", 
                desc: "Hidratación médica inmediata, varios sabores.", 
                img: "https://images.unsplash.com/photo-1626955077227-2c91834164b4?w=500"
            },

            // SECCIÓN: HIGIENE Y PROTECCIÓN
            {
                n: "Alcohol Clínico", 
                p: 35, 
                category: "Higiene y Protección 🧼", 
                desc: "Alcohol etílico al 70% para desinfección de heridas y manos.", 
                img: "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?w=500"
            },
            {
                n: "Mascarillas (Pack 10)", 
                p: 50, 
                category: "Higiene y Protección 🧼", 
                desc: "Paquete de 10 mascarillas quirúrgicas desechables.", 
                img: "https://images.unsplash.com/photo-1584036561566-b93a50208c1c?w=500"
            }
        ] 
    },

"FarmaciaKielsa": { 
        name: "Farmacia Kielsa", 
        type: "health", 
        lat: 15.401562451748127,  // <-- Latitud (Ubicación Farmacia Kielsa)
        lon: -87.80783964901377, // <-- Longitud (Ubicación Farmacia Kielsa)
        openTime: 8, 
        closeTime: 22,
        img: "https://i.ibb.co/QvHTwKfF/306790147-210108801372055-946043080979242076-n.jpg", 
        cover: "https://i.ibb.co/TDCPM9GD/X0-At-G2i-We-Vnf-BSJh-P1w-If6-O7-C60-Ae5ne-Lx-SCFPF1.webp", 
        menu: [
            // ... (aquí van los productos de Farmacia Kielsa)
            // SECCIÓN: MEDICAMENTOS Y ALIVIO
            {
                n: "Tabcin Noche", 
                p: 12, 
                category: "Medicamentos y Alivio 💊", 
                desc: "Alivio multisíntomas de la gripe, fórmula nocturna.", 
                img: "https://farmaciasdelahorro.hn/wp-content/uploads/2021/06/Tabcin-Noche-Sobres.jpg"
            }, 
            {
                n: "Aspirina Forte (Sobre)", 
                p: 25, 
                category: "Medicamentos y Alivio 💊", 
                desc: "Analgésico potente para dolores de cabeza severos.", 
                img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500"
            }, 
            {
                n: "Pepto Bismol", 
                p: 110, 
                category: "Medicamentos y Alivio 💊", 
                desc: "Suspensión para aliviar acidez, indigestión y malestar estomacal.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            },
            {
                n: "Alka-Seltzer (Caja)", 
                p: 95, 
                category: "Medicamentos y Alivio 💊", 
                desc: "Tabletas efervescentes para el alivio rápido de la acidez.", 
                img: "https://images.unsplash.com/photo-1624454002302-36b824d7bd6a?w=500"
            }, 

            // SECCIÓN: CUIDADO PERSONAL
            {
                n: "Protector Solar", 
                p: 250, 
                category: "Cuidado Personal 🧴", 
                desc: "Bloqueador solar FPS 50+ resistente al agua.", 
                img: "https://images.unsplash.com/photo-1556228720-1987bad83354?w=500"
            }, 
            {
                n: "Repelente OFF", 
                p: 180, 
                category: "Cuidado Personal 🧴", 
                desc: "Spray repelente de insectos y mosquitos.", 
                img: "https://images.unsplash.com/photo-1629215049302-3c46006d644d?w=500"
            },

            // SECCIÓN: BEBÉ Y NUTRICIÓN
            {
                n: "Pañales Huggies (Paq)", 
                p: 320, 
                category: "Bebé y Nutrición 👶", 
                desc: "Pañales ultra absorbentes para mantener seco a tu bebé.", 
                img: "https://images.unsplash.com/photo-1565352161678-83138b327b40?w=500"
            }, 
            {
                n: "Leche Ensure", 
                p: 450, 
                category: "Bebé y Nutrición 👶", 
                desc: "Suplemento nutricional completo sabor vainilla.", 
                img: "https://images.unsplash.com/photo-1624519171295-8b3687313898?w=500"
            }
        ] 
    },

"FarmaciaAhorro": { 
        name: "Farmacia del Ahorro", 
        type: "health",
        lat: 15.40092115103926,  // <-- Latitud (Ubicación Farmacia del Ahorro)
        lon: -87.80821381723798, // <-- Longitud (Ubicación Farmacia del Ahorro)
        openTime: 8, closeTime: 21,
        img: "https://i.ibb.co/MvF8YTS/unnamed-1.png", 
        cover: "https://i.ibb.co/fV7Lq9SW/168524925-2859317481010422-3727704051689057288-n.png", 
        menu: [
            // ... (aquí van los productos de Farmacia del Ahorro)
            // SECCIÓN: MEDICAMENTOS GENÉRICOS
            {
                n: "Ibuprofeno Genérico", 
                p: 30, 
                category: "Medicamentos Genéricos 💊", 
                desc: "Antiinflamatorio y analgésico de 400mg.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            }, 
            {
                n: "Loratadina", 
                p: 45, 
                category: "Medicamentos Genéricos 💊", 
                desc: "Antialérgico efectivo, caja de 10 tabletas.", 
                img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500"
            }, 
            {
                n: "Omeprazol", 
                p: 55, 
                category: "Medicamentos Genéricos 💊", 
                desc: "Protector gástrico para gastritis y acidez.", 
                img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500"
            },
            {
                n: "Amoxicilina", 
                p: 80, 
                category: "Medicamentos Genéricos 💊", 
                desc: "Antibiótico de amplio espectro 500mg.", 
                img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500"
            }, 

            // SECCIÓN: PRIMEROS AUXILIOS Y ASEO
            {
                n: "Vendas Adhesivas", 
                p: 20, 
                category: "Primeros Auxilios & Aseo 🩹", 
                desc: "Curitas resistentes al agua, caja pequeña.", 
                img: "https://images.unsplash.com/photo-1616557457497-6c2e365672a9?w=500"
            }, 
            {
                n: "Agua Oxigenada", 
                p: 25, 
                category: "Primeros Auxilios & Aseo 🩹", 
                desc: "Solución antiséptica para limpieza de heridas.", 
                img: "https://images.unsplash.com/photo-1629054704770-96944e268a25?w=500"
            },
            {
                n: "Algodón", 
                p: 15, 
                category: "Primeros Auxilios & Aseo 🩹", 
                desc: "Bolsa de algodón absorbente esterilizado.", 
                img: "https://images.unsplash.com/photo-1611079830811-865dd4477b7f?w=500"
            }, 
            {
                n: "Jabón Antibacterial", 
                p: 40, 
                category: "Primeros Auxilios & Aseo 🩹", 
                desc: "Jabón en barra para protección contra bacterias.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            }
        ] 
    },

    "AmwayStore": { 
        name: "Tienda Amway", 
        type: "health",
        openTime: 9, closeTime: 18,
        img: "https://i.ibb.co/6JyhQy40/Logo-Amway-TM.jpg", 
        cover: "https://i.ibb.co/35XkhQz0/AMWAY-HOME-PRODUCT-LINE.jpg", 
        menu: [
            // SECCIÓN: CUIDADO BUCAL GLISTER
            {
                n: "Pasta Dental Glister (Grande)", 
                p: 180, 
                category: "Cuidado Bucal Glister ✨", 
                desc: "Pasta dental con fluoruro, ayuda a blanquear y proteger el esmalte.", 
                img: "https://images.unsplash.com/photo-1559599238-308793637427?w=500"
            }, 
            {
                n: "Pasta Dental Glister (Viaje)", 
                p: 90, 
                category: "Cuidado Bucal Glister ✨", 
                desc: "Versión compacta de 50g ideal para llevar a todos lados.", 
                img: "https://images.unsplash.com/photo-1559599238-308793637427?w=500"
            },
            {
                n: "Spray Refrescante Bucal", 
                p: 140, 
                category: "Cuidado Bucal Glister ✨", 
                desc: "Spray mentolado para aliento fresco al instante.", 
                img: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=500"
            }, 
            {
                n: "Enjuague Bucal Glister", 
                p: 350, 
                category: "Cuidado Bucal Glister ✨", 
                desc: "Fórmula concentrada anti-placa que rinde hasta 100 usos.", 
                img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
            },

            // SECCIÓN: NUTRICIÓN & VITAMINAS
            {
                n: "Doble X (Vitaminas)", 
                p: 1200, 
                category: "Nutrición Nutrilite 🌿", 
                desc: "El multivitamínico más completo con fitonutrientes esenciales.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            }, 
            {
                n: "Omega 3 Nutrilite", 
                p: 650, 
                category: "Nutrición Nutrilite 🌿", 
                desc: "Ácidos grasos esenciales para la salud cardiovascular.", 
                img: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500"
            },
            {
                n: "Proteína Vegetal", 
                p: 980, 
                category: "Nutrición Nutrilite 🌿", 
                desc: "Proteína en polvo 100% vegetal, sin sabor, para tus batidos.", 
                img: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500"
            }, 

            // SECCIÓN: HOGAR ECOLÓGICO
            {
                n: "LOC Limpiador Multiusos", 
                p: 420, 
                category: "Hogar Amway Home 🏠", 
                desc: "Limpiador concentrado biodegradable para todas las superficies.", 
                img: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500"
            }, 
            {
                n: "Detergente SA8", 
                p: 560, 
                category: "Hogar Amway Home 🏠", 
                desc: "Detergente líquido de alto rendimiento, cuida los colores.", 
                img: "https://images.unsplash.com/photo-1585830812416-a6c86bb14576?w=500"
            }
        ] 
    },

    // ==========================================
    // SECCIÓN SUPERMERCADOS (MERCADITO)
    // ==========================================
"LaColonia": { 
        name: "La Colonia", 
        type: "market", 
        lat: 15.399004994818132,  // <-- Latitud (Ubicación La Colonia)
        lon: -87.80501930627844, // <-- Longitud (Ubicación La Colonia)
        openTime: 7, closeTime: 21,
        img: "https://i.ibb.co/DD4fb94p/229817122-10158650202646731-1205782246077007659-n.jpg", 
        cover: "https://i.ibb.co/N69wfC0x/Supermercados-La-Colonia-Lider-en-Sostenibilidad-1-1024x1024.png", 
        menu: [
            // ... (aquí van los productos de supermercado)
            // SECCIÓN: GRANOS Y DESPENSA
            {
                n: "Arroz Progreso (Libra)", 
                p: 16, 
                top: true, 
                category: "Granos y Despensa 🍚", 
                desc: "Arroz blanco de grano entero, calidad premium.", 
                img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
            },
            {
                n: "Frijoles Rojos (Libra)", 
                p: 24, 
                category: "Granos y Despensa 🍚", 
                desc: "Frijol rojo de seda, suave y fresco.", 
                img: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500"
            },
            {
                n: "Harina La Rosa", 
                p: 18, 
                category: "Granos y Despensa 🍚", 
                desc: "Harina de maíz nixtamalizado para tortillas.", 
                img: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500"
            },
            {
                n: "Aceite Clover Brand", 
                p: 35, 
                category: "Granos y Despensa 🍚", 
                desc: "Aceite vegetal libre de colesterol, botella personal.", 
                img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500"
            },

            // SECCIÓN: LÁCTEOS Y HUEVOS
            {
                n: "Leche Ceteco (Bolsa)", 
                p: 110, 
                category: "Lácteos y Huevos 🥛", 
                desc: "Leche en polvo entera, bolsa económica.", 
                img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500"
            },
            {
                n: "Cartón Huevos (30 un)", 
                p: 145, 
                offer: true, 
                oldP: 160, 
                category: "Lácteos y Huevos 🥛", 
                desc: "Cartón de huevos medianos frescos de granja.", 
                img: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500"
            },

            // SECCIÓN: CARNES Y EMBUTIDOS
            {
                n: "Pollo Entero Norteño", 
                p: 140, 
                category: "Carnes y Embutidos 🍗", 
                desc: "Pollo fresco entero, sin menudos, listo para cocinar.", 
                img: "https://images.unsplash.com/photo-1587593810167-a6b219194084?w=500"
            },

            // SECCIÓN: ABARROTES Y OTROS
            {
                n: "Café El Indio", 
                p: 65, 
                category: "Abarrotes y Otros ☕", 
                desc: "Café molido de altura, aromático y fuerte.", 
                img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500"
            },
            {
                n: "Jabón Xtra (Pack 3)", 
                p: 95, 
                category: "Abarrotes y Otros 🧼", 
                desc: "Jabón de bola para lavar ropa, aroma floral.", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
            }
        ] 
    },

"SuperOcotepeque": { 
        name: "Super Ocotepeque", 
        type: "market", 
        lat: 15.404025493495775,  // <-- Latitud (Ubicación Super Ocotepeque)
        lon: -87.81199707231264, // <-- Longitud (Ubicación Super Ocotepeque)
        openTime: 7, closeTime: 19,
        img: "https://i.ibb.co/3ycstVMV/images-2.jpg", 
        cover: "https://i.ibb.co/2YYZTwYd/images-4.jpg", 
        menu: [
            // ... (aquí van los productos de supermercado)
            // SECCIÓN: GRANOS Y BÁSICOS
            {
                n: "Arroz Blanco (Libra)", 
                p: 14, 
                category: "Granos y Básicos 🍚", 
                desc: "Arroz suelto de buena calidad por libra.", 
                img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
            },
            {
                n: "Frijoles (Libra)", 
                p: 22, 
                category: "Granos y Básicos 🍚", 
                desc: "Frijoles nuevos de cosecha reciente, libra.", 
                img: "https://images.unsplash.com/photo-1551462147-37885acc36f1?w=500"
            },
            {
                n: "Azúcar (Libra)", 
                p: 11, 
                category: "Granos y Básicos 🍚", 
                desc: "Azúcar blanca refinada por libra.", 
                img: "https://images.unsplash.com/photo-1581441363689-1f3c8c414635?w=500"
            },

            // SECCIÓN: ABARROTES Y DESPENSA
            {
                n: "Espagueti (Paquete)", 
                p: 10, 
                top: true, 
                category: "Abarrotes y Despensa 🍝", 
                desc: "Pasta de espagueti de 200g.", 
                img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500"
            },
            {
                n: "Salsa de Tomate Natura", 
                p: 12, 
                category: "Abarrotes y Despensa 🍝", 
                desc: "Salsa de tomate tipo ranchera, doypack.", 
                img: "https://images.unsplash.com/photo-1622206151226-18ca2c958a41?w=500"
            },
            {
                n: "Manteca (Libra)", 
                p: 18, 
                category: "Abarrotes y Despensa 🍝", 
                desc: "Manteca vegetal blanca por libra.", 
                img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500"
            },
            {
                n: "Caja de Corn Flakes", 
                p: 65, 
                offer: true, 
                oldP: 80, 
                category: "Abarrotes y Despensa 🍝", 
                desc: "Hojuelas de maíz tostado, caja familiar.", 
                img: "https://images.unsplash.com/photo-1589155702128-4c173c38b1f1?w=500"
            },

            // SECCIÓN: HIGIENE Y HOGAR
            {
                n: "Papel Higiénico (Pack 4)", 
                p: 35, 
                category: "Higiene y Hogar 🧼", 
                desc: "Paquete de 4 rollos de papel doble hoja.", 
                img: "https://images.unsplash.com/photo-1584053677902-60fc8d12349e?w=500"
            }
        ] 
    },
    
"MaxiDespensa": { 
        name: "Maxi Despensa", 
        type: "market",
        lat: 15.40187922253445,  // <-- Latitud (Ubicación Maxi Despensa)
        lon: -87.81090809557239, // <-- Longitud (Ubicación Maxi Despensa)
        openTime: 7, closeTime: 20, 
        img: "https://i.ibb.co/39BbYz4d/Whats-App-Image-2026-02-16-at-6-23-04-PM.jpg", 
        cover: "https://i.ibb.co/Kzj3SXvB/Whats-App-Image-2026-02-16-at-6-23-01-PM.jpg", 
        menu: [
            // ... (aquí van los productos de Maxi Despensa)
            // SECCIÓN: FRUTAS Y VERDURAS
            {
                n: "Tomate (Libra)", 
                p: 15, 
                category: "Frutas y Verduras 🍎", 
                desc: "Tomate pera rojo y fresco.", 
                img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"
            },
            {
                n: "Cebolla (Libra)", 
                p: 18, 
                category: "Frutas y Verduras 🍎", 
                desc: "Cebolla amarilla importada.", 
                img: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500"
            },
            {
                n: "Papas (Libra)", 
                p: 12, 
                category: "Frutas y Verduras 🍎", 
                desc: "Papas lavadas listas para cocinar.", 
                img: "https://images.unsplash.com/photo-1518977676601-b53f82a6b696?w=500"
            },
            {
                n: "Plátano Maduro (Unidad)", 
                p: 6, 
                category: "Frutas y Verduras 🍎", 
                desc: "Plátano grande y dulce.", 
                img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500"
            },
            {
                n: "Sandía Entera", 
                p: 80, 
                category: "Frutas y Verduras 🍎", 
                desc: "Sandía roja y dulce, tamaño mediano.", 
                img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500"
            },

            // SECCIÓN: SNACKS Y OTROS
            {
                n: "Bolsa de Churros", 
                p: 45, 
                category: "Snacks y Abarrotes 🍿", 
                desc: "Bolsa grande de snacks variados para picar.", 
                img: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=500"
            }
        ] 
    },

"Bodega Umanzor": { 
        name: "Bodega Umanzor", 
        type: "market",
        lat: 15.399417448275093,  // <-- Latitud (Ubicación Super Umanzor)
        lon: -87.80606670844006, // <-- Longitud (Ubicación Super Umanzor)
        openTime: 7, 
        closeTime: 20, 
        img: "https://i.ibb.co/5xGrjKft/images-1.png", 
        cover: "https://i.ibb.co/PZD8kmws/images-5.jpg", 
        menu: [
            // ... (aquí van los productos de Super Umanzor)
            // SECCIÓN: FRUTAS Y VERDURAS
            {
                n: "Tomate (Libra)", 
                p: 15, 
                category: "Frutas y Verduras 🍎", 
                desc: "Tomate fresco de la huerta.", 
                img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"
            },
            {
                n: "Cebolla (Libra)", 
                p: 18, 
                category: "Frutas y Verduras 🍎", 
                desc: "Cebolla blanca fresca por libra.", 
                img: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?w=500"
            },
            {
                n: "Papas (Libra)", 
                p: 12, 
                category: "Frutas y Verduras 🍎", 
                desc: "Papas grandes especiales para freír.", 
                img: "https://images.unsplash.com/photo-1518977676601-b53f82a6b696?w=500"
            },
            {
                n: "Plátano Maduro (Unidad)", 
                p: 6, 
                category: "Frutas y Verduras 🍎", 
                desc: "Plátano maduro listo para freír.", 
                img: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500"
            },
            {
                n: "Sandía Entera", 
                p: 80, 
                category: "Frutas y Verduras 🍎", 
                desc: "Sandía grande y jugosa.", 
                img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500"
            },

            // SECCIÓN: SNACKS
            {
                n: "Bolsa de Churros", 
                p: 45, 
                category: "Snacks y Abarrotes 🍿", 
                desc: "Snacks salados para compartir.", 
                img: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=500"
            }
        ]
    }
};