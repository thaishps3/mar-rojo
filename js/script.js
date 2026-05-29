/* ============================================================
   El Mar Rojo — Juego Educativo
   Archivo : js/script.js
   ============================================================ */
'use strict';

const $ = id => document.getElementById(id);


/* ============================================================
   DATOS DEL JUEGO
   ============================================================ */

/* Los 5 contenedores de reciclaje con su color y descripción */
const CONTENEDORES = {
  amarillo: { id:'bin-amarillo', nombre:'Envases',      emoji:'🟡', color:'#f4c750' },
  azul:     { id:'bin-azul',     nombre:'Papel/Cartón', emoji:'🔵', color:'#50a0e8' },
  verde:    { id:'bin-verde',    nombre:'Vidrio',       emoji:'🟢', color:'#50d050' },
  marron:   { id:'bin-marron',   nombre:'Orgánico',     emoji:'🟤', color:'#c08050' },
  gris:     { id:'bin-gris',     nombre:'Resto',        emoji:'⚫', color:'#c0c0c0' },
};

/* Seres del mar — deben arrastrarse al AGUA */
const ANIMALES = [
  { e:'⭐', n:'Estrella de mar', s:32 },
  { e:'🐟', n:'Pez',            s:32 },
  { e:'🦑', n:'Calamar',        s:38 },
  { e:'🐬', n:'Delfín',         s:40 },
  { e:'🦈', n:'Tiburón',        s:44 },
  { e:'🐙', n:'Pulpo',          s:44 },
  { e:'🐋', n:'Ballena',        s:50 },
];

/* Objetos contaminantes — deben arrastrarse al CONTENEDOR CORRECTO
   Cada objeto tiene la propiedad "bin" indicando su contenedor. */
const BASURA = [
  /* 🟡 AMARILLO — envases de plástico y metal */
  { e:'🛍️', n:'Bolsa plástica',    s:30, bin:'amarillo' },
  { e:'🥤',  n:'Vaso plástico',     s:28, bin:'amarillo' },
  { e:'🧴',  n:'Botella plástico',  s:28, bin:'amarillo' },
  { e:'🥫',  n:'Lata',              s:28, bin:'amarillo' },
  /* 🔵 AZUL — papel y cartón */
  { e:'📦',  n:'Caja de cartón',    s:32, bin:'azul' },
  { e:'📰',  n:'Periódico',         s:30, bin:'azul' },
  { e:'🧃',  n:'Tetrabrik',         s:28, bin:'azul' },
  /* 🟢 VERDE — vidrio */
  { e:'🍾',  n:'Botella de vidrio', s:30, bin:'verde' },
  { e:'🫙',  n:'Frasco de vidrio',  s:28, bin:'verde' },
  /* 🟤 MARRÓN — residuos orgánicos del mar */
  { e:'🪸',  n:'Algas muertas',     s:30, bin:'marron' },
  { e:'🐚',  n:'Concha rota',       s:26, bin:'marron' },
  /* ⚫ GRIS — resto no reciclable */
  { e:'👟',  n:'Zapato',            s:30, bin:'gris' },
  { e:'🧦',  n:'Calcetín',          s:26, bin:'gris' },
  { e:'🎣',  n:'Caña de pesca',     s:30, bin:'gris' },
];

/* ============================================================
   CONFIGURACIÓN DE NIVELES
   contenedoresActivos: los bins visibles en ese nivel.
   basuraDisp: índices del array BASURA que pueden aparecer.

   Progresión pedagógica:
     Nivel 1: 🟡+⚫         → ¿Envase o resto?
     Nivel 2: 🟡+🔵+⚫      → + ¿Papel o cartón?
     Nivel 3: 🟡+🔵+🟢+⚫   → + ¿Plástico o vidrio? (distinción sutil)
     Nivel 4: los 5          → + ¿Orgánico?
     Nivel 5: los 5, máxima velocidad
   ============================================================ */
const NIVELES = [
  {
    nombre:              'El inicio del éxodo',
    vel:                 22,   /* muy lento — el niño aprende sin presión */
    intervalo:           5500,
    maxObjetos:          2,
    rescates:            5,
    gruposNecesarios:    3,
    animalesDisp:        [0,1],
    basuraDisp:          [0,1,3,11,12],
    contenedoresActivos: ['amarillo','gris'],
    proporcionBasura:    .25,
  },
  {
    nombre:              'El camino se abre',
    vel:                 34,   /* lento — suma el contenedor azul */
    intervalo:           4500,
    maxObjetos:          2,
    rescates:            7,
    gruposNecesarios:    4,
    animalesDisp:        [0,1,2,3],
    basuraDisp:          [0,1,2,3,4,5,6,11,12,13],
    contenedoresActivos: ['amarillo','azul','gris'],
    proporcionBasura:    .33,
  },
  {
    nombre:              'Criaturas del abismo',
    vel:                 50,   /* medio — el niño ya tiene confianza */
    intervalo:           3200,
    maxObjetos:          3,
    rescates:            10,
    gruposNecesarios:    5,
    animalesDisp:        [0,1,2,3,4],
    basuraDisp:          [0,1,2,3,4,5,6,7,8,11,12,13],
    contenedoresActivos: ['amarillo','azul','verde','gris'],
    proporcionBasura:    .40,
  },
  {
    nombre:              'La gran prueba',
    vel:                 78,   /* rápido — todos los contenedores */
    intervalo:           2200,
    maxObjetos:          3,
    rescates:            12,
    gruposNecesarios:    6,
    animalesDisp:        [0,1,2,3,4,5],
    basuraDisp:          [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    contenedoresActivos: ['amarillo','azul','verde','marron','gris'],
    proporcionBasura:    .45,
  },
  {
    nombre:              'Paso final',
    vel:                 110,  /* exigente — el reto final */
    intervalo:           1800,
    maxObjetos:          4,
    rescates:            14,
    gruposNecesarios:    7,
    animalesDisp:        [0,1,2,3,4,5,6],
    basuraDisp:          [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    contenedoresActivos: ['amarillo','azul','verde','marron','gris'],
    proporcionBasura:    .50,
  },
];

/* Historia bíblica que se narra al completar cada nivel */
const HISTORIAS = [
  {
    escena:     '🔥🌿',
    titulo:     'La llamada de Dios',
    texto:      'El pueblo de Israel vivía como esclavo en Egipto desde hacía 400 años. Dios escuchó sus llantos y llamó a Moisés desde una zarza que ardía sin quemarse. Le dijo: "Dile al Faraón que deje ir a mi pueblo."',
    cita:       '"He visto la aflicción de mi pueblo… y he descendido para librarlos de mano de los egipcios."',
    referencia: '— Éxodo 3:7-8',
  },
  {
    escena:     '🐎⚔️',
    titulo:     '¡El ejército del Faraón viene!',
    texto:      'El Faraón dejó ir al pueblo, pero luego se arrepintió. Reunió seiscientos carros de guerra y salió a perseguirlos. El pueblo vio el polvo de los caballos y tuvo mucho miedo.',
    cita:       '"El Faraón tomó seiscientos carros escogidos… y persiguió a los hijos de Israel."',
    referencia: '— Éxodo 14:7',
  },
  {
    escena:     '🌊✋',
    titulo:     '¡No tengáis miedo!',
    texto:      'Con el mar al frente y los soldados atrás, Moisés dijo: "¡No temáis! ¡El Señor peleará por vosotros!" Luego extendió su vara y Dios envió un viento poderoso que separó las aguas.',
    cita:       '"No temáis; estad firmes, y ved la salvación que el Señor hará hoy con vosotros."',
    referencia: '— Éxodo 14:13',
  },
  {
    escena:     '🚶‍♂️👨‍👩‍👧‍👦🚶‍♀️',
    titulo:     '¡El camino está libre!',
    texto:      'El pueblo de Israel caminó por el fondo del mar sobre tierra seca. A su derecha y a su izquierda el agua estaba como un muro. ¡Gracias a tu ayuda, el camino quedó limpio!',
    cita:       '"Y los hijos de Israel fueron por en medio del mar, en seco, teniendo el agua como muro a su derecha y a su izquierda."',
    referencia: '— Éxodo 14:22',
  },
];

const COLORES_CONFETI = ['#f4c750','#5dc8f0','#7ed86f','#f07860','#b090f8','#fff8e0','#80f0c0'];


/* ============================================================
   FIGURAS BÍBLICAS — SVG generado en JavaScript
   ============================================================ */
/* ============================================================
   FIGURAS BÍBLICAS CARTOON — 6 variantes expresivas
   Cabeza grande (1/3 del cuerpo), ojos con brillo,
   cuerpo redondeado, colores saturados.
   Cada función genera un SVG independiente.
   ============================================================ */

/* Hombre joven — túnica azul, turbante amarillo */
function figHombre1() {
  return `<svg width="28" height="52" viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="51" rx="9" ry="2.2" fill="rgba(0,0,0,0.2)"/>
<rect x="9" y="39" width="4.5" height="11" rx="2.2" fill="#c07828"/>
<rect x="14.5" y="39" width="4.5" height="11" rx="2.2" fill="#a86018"/>
<ellipse cx="11.2" cy="50" rx="4" ry="1.8" fill="#6a3810"/>
<ellipse cx="16.8" cy="50" rx="4" ry="1.8" fill="#6a3810"/>
<path d="M5 19 Q14 15 23 19 L23.5 41 Q14 45 4.5 41 Z" fill="#3a82d4"/>
<rect x="5" y="29" width="18" height="3" rx="1.5" fill="#1a5298"/>
<rect x="11" y="16" width="6" height="5" rx="2.5" fill="#e8a060"/>
<circle cx="14" cy="10" r="9" fill="#e8a060"/>
<circle cx="10.5" cy="9.5" r="2" fill="#fff"/><circle cx="17.5" cy="9.5" r="2" fill="#fff"/>
<circle cx="11" cy="9.8" r="1.2" fill="#2a1505"/><circle cx="18" cy="9.8" r="1.2" fill="#2a1505"/>
<circle cx="11.4" cy="9.2" r=".5" fill="#fff"/><circle cx="18.4" cy="9.2" r=".5" fill="#fff"/>
<path d="M9 7 Q11 6 13 7" stroke="#60300a" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M15 7 Q17 6 19 7" stroke="#60300a" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M11 13.5 Q14 15 17 13.5" stroke="#b07030" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M5 9.5 Q5 1.5 14 1 Q23 1.5 23 9.5" fill="#e8c030"/>
<ellipse cx="14" cy="9.5" rx="9" ry="3.5" fill="#f0d040"/>
<path d="M14 1 Q19 2.5 20.5 6" stroke="#c8a020" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<ellipse cx="3.5" cy="26" rx="3.2" ry="7.5" fill="#3a82d4" transform="rotate(-10,3.5,26)"/>
<ellipse cx="24.5" cy="26" rx="3.2" ry="7.5" fill="#3a82d4" transform="rotate(10,24.5,26)"/>
<circle cx="3" cy="33" r="2.8" fill="#e8a060"/>
<circle cx="25" cy="33" r="2.8" fill="#e8a060"/>
</svg>`;
}

/* Mujer — túnica rosa, velo crema */
function figMujer() {
  return `<svg width="28" height="52" viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="51" rx="9" ry="2.2" fill="rgba(0,0,0,0.2)"/>
<rect x="9" y="39" width="4.5" height="11" rx="2.2" fill="#d08060"/>
<rect x="14.5" y="39" width="4.5" height="11" rx="2.2" fill="#b86848"/>
<ellipse cx="11.2" cy="50" rx="4" ry="1.8" fill="#7a3818"/>
<ellipse cx="16.8" cy="50" rx="4" ry="1.8" fill="#7a3818"/>
<path d="M4 19 Q14 14 24 19 L24.5 42 Q14 46.5 3.5 42 Z" fill="#e06888"/>
<rect x="4" y="29" width="20" height="3" rx="1.5" fill="#b83860"/>
<rect x="11" y="16" width="6" height="5" rx="2.5" fill="#f0a870"/>
<circle cx="14" cy="10" r="9" fill="#f0a870"/>
<circle cx="10.5" cy="9.5" r="2" fill="#fff"/><circle cx="17.5" cy="9.5" r="2" fill="#fff"/>
<circle cx="11" cy="9.8" r="1.2" fill="#2a1505"/><circle cx="18" cy="9.8" r="1.2" fill="#2a1505"/>
<circle cx="11.4" cy="9.2" r=".5" fill="#fff"/><circle cx="18.4" cy="9.2" r=".5" fill="#fff"/>
<path d="M9.5 7.5 L9.8 6.3" stroke="#2a1505" stroke-width=".8"/>
<path d="M11 7 L11.2 5.8" stroke="#2a1505" stroke-width=".8"/>
<path d="M12.5 7.2 L12.8 6" stroke="#2a1505" stroke-width=".8"/>
<path d="M15.5 7.2 L15.2 6" stroke="#2a1505" stroke-width=".8"/>
<path d="M17 7 L16.8 5.8" stroke="#2a1505" stroke-width=".8"/>
<path d="M18.5 7.5 L18.2 6.3" stroke="#2a1505" stroke-width=".8"/>
<path d="M11 13.5 Q14 15 17 13.5" stroke="#b07030" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M5 9.5 Q5 1 14 0.8 Q23 1 23 9.5" fill="#f8e8d0"/>
<ellipse cx="14" cy="10" rx="9" ry="3.8" fill="#fef0e0"/>
<path d="M5 11 L3.5 22 Q5 25 6.5 22" fill="#4a2008"/>
<path d="M23 11 L24.5 22 Q23 25 21.5 22" fill="#4a2008"/>
<ellipse cx="3.5" cy="26" rx="3.2" ry="7.5" fill="#e06888" transform="rotate(-10,3.5,26)"/>
<ellipse cx="24.5" cy="26" rx="3.2" ry="7.5" fill="#e06888" transform="rotate(10,24.5,26)"/>
<circle cx="3" cy="33" r="2.8" fill="#f0a870"/>
<circle cx="25" cy="33" r="2.8" fill="#f0a870"/>
</svg>`;
}

/* Hombre adulto — túnica verde, turbante naranja */
function figHombre2() {
  return `<svg width="28" height="52" viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="51" rx="9" ry="2.2" fill="rgba(0,0,0,0.2)"/>
<rect x="9" y="39" width="4.5" height="11" rx="2.2" fill="#b87828"/>
<rect x="14.5" y="39" width="4.5" height="11" rx="2.2" fill="#9a6018"/>
<ellipse cx="11.2" cy="50" rx="4" ry="1.8" fill="#6a3810"/>
<ellipse cx="16.8" cy="50" rx="4" ry="1.8" fill="#6a3810"/>
<path d="M5 19 Q14 15 23 19 L23.5 41 Q14 45 4.5 41 Z" fill="#4a9858"/>
<rect x="5" y="29" width="18" height="3" rx="1.5" fill="#2a6838"/>
<rect x="11" y="16" width="6" height="5" rx="2.5" fill="#d89858"/>
<circle cx="14" cy="10" r="9" fill="#d89858"/>
<circle cx="10.5" cy="9.5" r="2" fill="#fff"/><circle cx="17.5" cy="9.5" r="2" fill="#fff"/>
<circle cx="11" cy="9.8" r="1.2" fill="#2a1505"/><circle cx="18" cy="9.8" r="1.2" fill="#2a1505"/>
<circle cx="11.4" cy="9.2" r=".5" fill="#fff"/><circle cx="18.4" cy="9.2" r=".5" fill="#fff"/>
<path d="M9 7 Q11 6 13 7" stroke="#60300a" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M15 7 Q17 6 19 7" stroke="#60300a" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M11 13.5 Q14 15 17 13.5" stroke="#b07030" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M5 9.5 Q5 1.5 14 1 Q23 1.5 23 9.5" fill="#e87820"/>
<ellipse cx="14" cy="9.5" rx="9" ry="3.5" fill="#f08828"/>
<path d="M14 1 Q19 2.5 20.5 6" stroke="#c06010" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<line x1="23" y1="18" x2="25.5" y2="51" stroke="#7a4820" stroke-width="2.8" stroke-linecap="round"/>
<circle cx="23" cy="17" r="2.2" fill="#8a5830"/>
<ellipse cx="3.5" cy="26" rx="3.2" ry="7.5" fill="#4a9858" transform="rotate(-10,3.5,26)"/>
<ellipse cx="24.5" cy="26" rx="3.2" ry="7.5" fill="#4a9858" transform="rotate(10,24.5,26)"/>
<circle cx="3" cy="33" r="2.8" fill="#d89858"/>
<circle cx="25" cy="33" r="2.8" fill="#d89858"/>
</svg>`;
}

/* Anciano — túnica blanca, barba, turbante blanco, báculo */
function figAnciano() {
  return `<svg width="28" height="56" viewBox="0 0 28 56" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="55" rx="9" ry="2.2" fill="rgba(0,0,0,0.2)"/>
<rect x="9" y="42" width="4.5" height="12" rx="2.2" fill="#b89060"/>
<rect x="14.5" y="42" width="4.5" height="12" rx="2.2" fill="#9a7848"/>
<ellipse cx="11.2" cy="54" rx="4" ry="1.8" fill="#6a4820"/>
<ellipse cx="16.8" cy="54" rx="4" ry="1.8" fill="#6a4820"/>
<path d="M5 20 Q14 16 23 20 L23.5 44 Q14 48 4.5 44 Z" fill="#f0ead8"/>
<rect x="5" y="30" width="18" height="3" rx="1.5" fill="#c8b888"/>
<rect x="11" y="17" width="6" height="5" rx="2.5" fill="#c89858"/>
<circle cx="14" cy="11" r="9" fill="#c89858"/>
<circle cx="10.5" cy="10.5" r="2" fill="#fff"/><circle cx="17.5" cy="10.5" r="2" fill="#fff"/>
<circle cx="11" cy="10.8" r="1.2" fill="#2a1505"/><circle cx="18" cy="10.8" r="1.2" fill="#2a1505"/>
<circle cx="11.4" cy="10.2" r=".45" fill="#fff"/><circle cx="18.4" cy="10.2" r=".45" fill="#fff"/>
<path d="M9 8.5 Q11 7 13 8.5" stroke="#e8e8e0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<path d="M15 8.5 Q17 7 19 8.5" stroke="#e8e8e0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
<path d="M10.5 15 Q14 16.5 17.5 15" stroke="#c07840" stroke-width="1" fill="none" stroke-linecap="round"/>
<ellipse cx="14" cy="18" rx="6" ry="4.5" fill="rgba(248,246,240,.95)"/>
<path d="M5 10.5 Q5 2 14 1.5 Q23 2 23 10.5" fill="#ece8d8"/>
<ellipse cx="14" cy="10.5" rx="9" ry="4" fill="#f5f2e8"/>
<line x1="23" y1="19" x2="25.5" y2="55" stroke="#7a4820" stroke-width="2.8" stroke-linecap="round"/>
<circle cx="23" cy="18" r="2.2" fill="#8a5830"/>
<ellipse cx="3.5" cy="28" rx="3.2" ry="7.5" fill="#f0ead8" transform="rotate(-12,3.5,28)"/>
<ellipse cx="20" cy="28" rx="3.2" ry="7.5" fill="#f0ead8" transform="rotate(6,20,28)"/>
<circle cx="3" cy="35" r="2.8" fill="#c89858"/>
<circle cx="20.5" cy="35" r="2.8" fill="#c89858"/>
</svg>`;
}

/* Niño/a — cuerpo pequeño, cabeza extra grande, pelo oscuro */
function figNino() {
  return `<svg width="22" height="44" viewBox="0 0 22 44" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="11" cy="43" rx="7" ry="1.8" fill="rgba(0,0,0,0.2)"/>
<rect x="6.5" y="32" width="3.8" height="10" rx="1.9" fill="#c88030"/>
<rect x="11.5" y="32" width="3.8" height="10" rx="1.9" fill="#a86818"/>
<ellipse cx="8.4" cy="42" rx="3.5" ry="1.6" fill="#6a3810"/>
<ellipse cx="13.4" cy="42" rx="3.5" ry="1.6" fill="#6a3810"/>
<path d="M3 16 Q11 12.5 19 16 L19.5 33 Q11 37 2.5 33 Z" fill="#e8c038"/>
<rect x="3" y="24" width="16" height="2.5" rx="1.2" fill="#c0a020"/>
<rect x="8.5" y="13.5" width="5" height="4.5" rx="2" fill="#f0c070"/>
<circle cx="11" cy="8" r="8.5" fill="#f0c070"/>
<circle cx="7.8" cy="7.5" r="2.3" fill="#fff"/><circle cx="14.2" cy="7.5" r="2.3" fill="#fff"/>
<circle cx="8.3" cy="7.8" r="1.4" fill="#2a1505"/><circle cx="14.7" cy="7.8" r="1.4" fill="#2a1505"/>
<circle cx="8.7" cy="7.2" r=".55" fill="#fff"/><circle cx="15.1" cy="7.2" r=".55" fill="#fff"/>
<path d="M7.5 5.2 Q11 4 14.5 5.2" stroke="#60300a" stroke-width=".9" fill="none" stroke-linecap="round"/>
<path d="M8.5 12 Q11 13.5 13.5 12" stroke="#b07030" stroke-width=".9" fill="none" stroke-linecap="round"/>
<path d="M3.5 8 Q3 0.5 11 0.2 Q19 0.5 18.5 8" fill="#3a1a08"/>
<ellipse cx="2.5" cy="22" rx="2.8" ry="6.5" fill="#e8c038" transform="rotate(-10,2.5,22)"/>
<ellipse cx="19.5" cy="22" rx="2.8" ry="6.5" fill="#e8c038" transform="rotate(10,19.5,22)"/>
<circle cx="2" cy="28" r="2.2" fill="#f0c070"/>
<circle cx="20" cy="28" r="2.2" fill="#f0c070"/>
</svg>`;
}

/* Mujer mayor — túnica morada, manto oscuro */
function figMujer2() {
  return `<svg width="28" height="52" viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="14" cy="51" rx="9" ry="2.2" fill="rgba(0,0,0,0.2)"/>
<rect x="9" y="39" width="4.5" height="11" rx="2.2" fill="#b87060"/>
<rect x="14.5" y="39" width="4.5" height="11" rx="2.2" fill="#9a5848"/>
<ellipse cx="11.2" cy="50" rx="4" ry="1.8" fill="#6a3020"/>
<ellipse cx="16.8" cy="50" rx="4" ry="1.8" fill="#6a3020"/>
<path d="M4 19 Q14 14 24 19 L24.5 42 Q14 46.5 3.5 42 Z" fill="#8858a8"/>
<rect x="4" y="29" width="20" height="3" rx="1.5" fill="#603878"/>
<rect x="11" y="16" width="6" height="5" rx="2.5" fill="#d89868"/>
<circle cx="14" cy="10" r="9" fill="#d89868"/>
<circle cx="10.5" cy="9.5" r="2" fill="#fff"/><circle cx="17.5" cy="9.5" r="2" fill="#fff"/>
<circle cx="11" cy="9.8" r="1.2" fill="#2a1505"/><circle cx="18" cy="9.8" r="1.2" fill="#2a1505"/>
<circle cx="11.4" cy="9.2" r=".5" fill="#fff"/><circle cx="18.4" cy="9.2" r=".5" fill="#fff"/>
<path d="M9.5 7.5 L9.8 6.3" stroke="#2a1505" stroke-width=".8"/>
<path d="M11 7 L11.2 5.8" stroke="#2a1505" stroke-width=".8"/>
<path d="M16.5 7.2 L16.2 6" stroke="#2a1505" stroke-width=".8"/>
<path d="M18 7.5 L17.8 6.3" stroke="#2a1505" stroke-width=".8"/>
<path d="M11 13.5 Q14 15 17 13.5" stroke="#b07030" stroke-width="1" fill="none" stroke-linecap="round"/>
<path d="M5 9.5 Q5 1 14 0.8 Q23 1 23 9.5" fill="#4a3060"/>
<ellipse cx="14" cy="10" rx="9" ry="3.8" fill="#5a3878"/>
<path d="M5 11 L3.5 22 Q5 25 6.5 22" fill="#2a1008"/>
<path d="M23 11 L24.5 22 Q23 25 21.5 22" fill="#2a1008"/>
<ellipse cx="3.5" cy="26" rx="3.2" ry="7.5" fill="#8858a8" transform="rotate(-10,3.5,26)"/>
<ellipse cx="24.5" cy="26" rx="3.2" ry="7.5" fill="#8858a8" transform="rotate(10,24.5,26)"/>
<circle cx="3" cy="33" r="2.8" fill="#d89868"/>
<circle cx="25" cy="33" r="2.8" fill="#d89868"/>
</svg>`;
}

/* Pool de funciones generadoras */
const GENERADORES_FIGURAS = [figHombre1, figMujer, figHombre2, figAnciano, figNino, figMujer2];

/* ── GENERADOR DE MULTITUD con animales visibles ── */
function generarMultitud(n, anchoDisponible) {
  const ANIMALES_EXODO = ['🐪','🐫','🐐','🐑','🐕','🐈','🫏','🐂'];

  /* Calcular el paso entre figuras:
     - En escritorio (arena ~400px+): paso=18 → figuras con espacio natural
     - En móvil (arena ~180px):       paso se comprime hasta 11
       para que las 14-20 figuras quepan sin desbordar */
  const PASO_MAX = 18;
  const PASO_MIN = 11;
  const margen   = 28;
  const ancho    = anchoDisponible || 400;
  const pasoIdeal = Math.floor((ancho - margen) / n);
  const PASO      = Math.max(PASO_MIN, Math.min(PASO_MAX, pasoIdeal));

  /* Mezclar generadores */
  const pool = [];
  while (pool.length < n) pool.push(...GENERADORES_FIGURAS);
  pool.sort(() => Math.random() - .5);

  /* Posiciones para animales: ~1 de cada 4, nunca en el primer lugar */
  const posicionesAnimal = new Set();
  const numAnimales = Math.max(1, Math.floor(n / 4));
  while (posicionesAnimal.size < numAnimales) {
    posicionesAnimal.add(1 + Math.floor(Math.random() * (n - 1)));
  }

  /* Ancho total del grupo */
  const anchoTotal = (n - 1) * PASO + 32;

  /* ── Personas primero (z-index 1) ── */
  let htmlPersonas = '', pIdx = 0;
  for (let i = 0; i < n; i++) {
    if (!posicionesAnimal.has(i)) {
      const cls = i % 2 === 0 ? 'figura' : 'figura figura-par';
      const gen = pool[pIdx % pool.length];
      /* figNino es más pequeña — ajustamos la posición vertical */
      const esNino = gen === figNino;
      const top    = esNino ? 'top:8px' : 'top:0';
      htmlPersonas += `<div class="${cls}" style="left:${i*PASO}px;${top};z-index:1;position:absolute">${gen()}</div>`;
      pIdx++;
    }
  }

  /* ── Animales después (z-index 3, siempre encima) ──
     Se colocan ligeramente por delante (top mayor) para
     simular que caminan a los pies del grupo */
  let htmlAnimales = '';
  for (const i of posicionesAnimal) {
    const cls   = i % 2 === 0 ? 'figura' : 'figura figura-par';
    const emoji = ANIMALES_EXODO[Math.floor(Math.random() * ANIMALES_EXODO.length)];
    const esGrande = ['🐪','🐫','🐂'].includes(emoji);
    const size  = esGrande ? 22 : 17;
    const top   = esGrande ? 14 : 24;
    /* desplazamiento horizontal ligero para que no quede exactamente detrás */
    const offsetX = (Math.random() > 0.5 ? 4 : -3);
    htmlAnimales += `<div class="${cls}" style="left:${i*PASO + offsetX}px;top:${top}px;font-size:${size}px;line-height:1;z-index:3;position:absolute;filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))">${emoji}</div>`;
  }

  return `<div style="position:relative;width:${anchoTotal}px;height:58px">${htmlPersonas}${htmlAnimales}</div>`;
}




/* ============================================================
   AUDIO — Web Audio API (sin archivos externos)
   ============================================================ */
let ctx = null, silenciado = false, nodoAmb = null, gananciaAmb = null;

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function iniciarAmbiente() {
  if (silenciado || nodoAmb) return;
  const a = audio(), sr = a.sampleRate;
  const buf = a.createBuffer(1, 4*sr, sr);
  const d = buf.getChannelData(0);
  let b = 0;
  for (let i = 0; i < d.length; i++) { b = (b + .02*(Math.random()*2-1))*.98; d[i] = b*12; }
  const src = a.createBufferSource(); src.buffer = buf; src.loop = true;
  const lp  = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 340;
  const lfo = a.createOscillator(); lfo.frequency.value = .18;
  const lg  = a.createGain(); lg.gain.value = 60;
  lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  gananciaAmb = a.createGain(); gananciaAmb.gain.value = 0;
  src.connect(lp); lp.connect(gananciaAmb); gananciaAmb.connect(a.destination);
  src.start(); gananciaAmb.gain.linearRampToValueAtTime(.14, a.currentTime + 2.5);
  nodoAmb = src;
}
function detenerAmbiente() {
  if (!nodoAmb) return;
  try {
    gananciaAmb.gain.linearRampToValueAtTime(0, ctx.currentTime + .8);
    setTimeout(() => { try { nodoAmb.stop(); } catch(e){} nodoAmb = null; gananciaAmb = null; }, 900);
  } catch(e) { nodoAmb = null; gananciaAmb = null; }
}

/* Salpicadura al rescatar un animal */
function sndSalpicadura() {
  if (silenciado) return; const a = audio();
  [0,.04,.08].forEach((del,i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(800-i*160, a.currentTime+del);
    o.frequency.exponentialRampToValueAtTime(80, a.currentTime+del+.35);
    g.gain.setValueAtTime(.32-i*.06, a.currentTime+del);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime+del+.38);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime+del); o.stop(a.currentTime+del+.4);
  });
}

/* Reciclaje correcto — arpegio ascendente alegre */
function sndReciclaje() {
  if (silenciado) return; const a = audio();
  [440, 554, 659, 880].forEach((f,i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    const t = a.currentTime + i*.07;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.22,t+.04);
    g.gain.exponentialRampToValueAtTime(.001,t+.28);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+.3);
  });
}

/* Contenedor incorrecto — dos pitidos graves */
function sndError() {
  if (silenciado) return; const a = audio();
  [0,.13].forEach(del => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 160;
    g.gain.setValueAtTime(.22, a.currentTime+del);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime+del+.11);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime+del); o.stop(a.currentTime+del+.13);
  });
}

/* Alerta de peligro — pitido breve */
function sndPeligro() {
  if (silenciado) return; const a = audio();
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'sawtooth'; o.frequency.value = 340;
  g.gain.setValueAtTime(.15, a.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, a.currentTime+.11);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+.13);
}

/* Colisión — sonido de impacto grave */
function sndColision() {
  if (silenciado) return; const a = audio();
  [0,.06,.12,.18].forEach((del,i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(180-i*30, a.currentTime+del);
    o.frequency.exponentialRampToValueAtTime(40, a.currentTime+del+.18);
    g.gain.setValueAtTime(.28, a.currentTime+del);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime+del+.2);
    o.connect(g); g.connect(a.destination);
    o.start(a.currentTime+del); o.stop(a.currentTime+del+.22);
  });
}

/* Fanfarria al completar un nivel */
function sndNivel() {
  if (silenciado) return; const a = audio();
  [523,659,784,1047].forEach((f,i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    const t = a.currentTime + i*.12;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.28,t+.05);
    g.gain.exponentialRampToValueAtTime(.001,t+.38);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+.4);
  });
}

/* Aplausos sintetizados — ráfagas de ruido cortas y rítmicas */
function sndAplausos() {
  if (silenciado) return;
  const a = audio();
  /* 18 palmadas distribuidas en 3 segundos */
  const patron = [
    0, .12, .24,          /* tres palmadas rápidas */
    .55, .67, .79,        /* otras tres */
    1.05, 1.17, 1.29,     /* otras tres */
    1.5, 1.58, 1.66, 1.74,/* cuatro más rápidas — crescendo */
    1.95, 2.05, 2.15,
    2.4, 2.52,
  ];
  patron.forEach((t, i) => {
    const inicio = a.currentTime + t;
    /* Ruido blanco recortado = palmada */
    const frames = Math.floor(a.sampleRate * .068);
    const buf    = a.createBuffer(1, frames, a.sampleRate);
    const d      = buf.getChannelData(0);
    for (let j = 0; j < frames; j++) {
      /* envolvente: ataque rápido, caída suave */
      const env = j < frames * .1
        ? j / (frames * .1)
        : Math.pow(1 - (j - frames * .1) / (frames * .9), 1.8);
      d[j] = (Math.random() * 2 - 1) * env;
    }
    const src = a.createBufferSource(); src.buffer = buf;
    /* Filtro de paso de banda para timbre de palmada */
    const bp  = a.createBiquadFilter();
    bp.type   = 'bandpass';
    bp.frequency.value = 1200 + Math.random() * 400;
    bp.Q.value = .8;
    const g   = a.createGain();
    /* Volumen crece hacia el final — crowd crescendo */
    const vol = .28 + i / patron.length * .38;
    g.gain.setValueAtTime(vol, inicio);
    g.gain.exponentialRampToValueAtTime(.001, inicio + .1);
    src.connect(bp); bp.connect(g); g.connect(a.destination);
    src.start(inicio); src.stop(inicio + .12);
  });
}

/* Fanfarria triunfal — trompeta sintetizada + redoble de tambor */
function sndFanfarria() {
  if (silenciado) return;
  const a = audio();

  /* ── Melodía de trompeta (onda de sierra + filtro) ── */
  const melodia = [
    /* tiempo, frecuencia, duración, volumen */
    [0,     523, .18, .35],  /* Do  */
    [.19,   523, .12, .30],  /* Do  */
    [.33,   784, .28, .40],  /* Sol */
    [.63,   659, .18, .32],  /* Mi  */
    [.83,   784, .18, .32],  /* Sol */
    [1.03,  880, .45, .45],  /* La  — primer clímax */
    [1.52,  784, .15, .28],
    [1.69,  880, .15, .28],
    [1.86, 1047, .55, .50],  /* Do alta — segundo clímax */
    [2.45,  880, .20, .35],
    [2.67,  784, .20, .30],
    [2.9,   880, .15, .28],
    [3.07, 1047, .18, .40],
    [3.27, 1175, .85, .55],  /* Re alta — fanfarria final */
  ];

  melodia.forEach(([t, freq, dur, vol]) => {
    const o  = a.createOscillator();
    const g  = a.createGain();
    const lp = a.createBiquadFilter();
    o.type   = 'sawtooth';
    o.frequency.setValueAtTime(freq, a.currentTime + t);
    /* vibrato ligero */
    const lfo = a.createOscillator();
    const lg  = a.createGain();
    lfo.frequency.value = 6; lg.gain.value = 4;
    lfo.connect(lg); lg.connect(o.frequency);
    lfo.start(a.currentTime + t);
    lfo.stop(a.currentTime + t + dur + .05);
    /* filtro de paso bajo para suavizar la sierra */
    lp.type = 'lowpass'; lp.frequency.value = 2200;
    /* envolvente ADSR */
    const ini = a.currentTime + t;
    g.gain.setValueAtTime(0, ini);
    g.gain.linearRampToValueAtTime(vol, ini + .04);   /* ataque */
    g.gain.linearRampToValueAtTime(vol * .75, ini + .12); /* decay */
    g.gain.setValueAtTime(vol * .75, ini + dur - .06);
    g.gain.linearRampToValueAtTime(.001, ini + dur);  /* release */
    o.connect(lp); lp.connect(g); g.connect(a.destination);
    o.start(ini); o.stop(ini + dur + .05);
  });

  /* ── Redoble de tambor ── */
  const golpes = [
    [0, .55], [.33, .4], [.63, .4], [1.03, .5],
    [1.52, .4], [1.86, .55], [2.45, .4], [3.07, .5], [3.27, .7],
  ];
  golpes.forEach(([t, vol]) => {
    const ini = a.currentTime + t;
    const frames = Math.floor(a.sampleRate * .055);
    const buf    = a.createBuffer(1, frames, a.sampleRate);
    const d      = buf.getChannelData(0);
    for (let j = 0; j < frames; j++) {
      const env = Math.pow(1 - j / frames, 2.5);
      d[j] = (Math.random() * 2 - 1) * env;
    }
    const src = a.createBufferSource(); src.buffer = buf;
    const lp  = a.createBiquadFilter();
    lp.type   = 'lowpass'; lp.frequency.value = 280;
    /* tono grave de tambor */
    const o   = a.createOscillator();
    const og  = a.createGain();
    o.frequency.setValueAtTime(120, ini);
    o.frequency.exponentialRampToValueAtTime(55, ini + .055);
    og.gain.setValueAtTime(vol * .6, ini);
    og.gain.exponentialRampToValueAtTime(.001, ini + .07);
    o.connect(og); og.connect(a.destination);
    o.start(ini); o.stop(ini + .08);
    const ng  = a.createGain();
    ng.gain.setValueAtTime(vol * .45, ini);
    ng.gain.exponentialRampToValueAtTime(.001, ini + .06);
    src.connect(lp); lp.connect(ng); ng.connect(a.destination);
    src.start(ini); src.stop(ini + .07);
  });
}

/* Melodía de victoria simple (se mantiene para el nivel completo) */
function sndVictoria() {
  if (silenciado) return; const a = audio();
  [523,659,784,880,784,880,1047].forEach((f,i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    const t = a.currentTime + i*.16;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.28,t+.05);
    g.gain.exponentialRampToValueAtTime(.001,t+.32);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+.35);
  });
}

/* Aparición de nuevo objeto */
function sndAparicion() {
  if (silenciado) return; const a = audio();
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(200, a.currentTime);
  o.frequency.exponentialRampToValueAtTime(440, a.currentTime+.11);
  g.gain.setValueAtTime(.14, a.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, a.currentTime+.14);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+.15);
}

/* Bip al sumar puntos */
function sndPuntos() {
  if (silenciado) return; const a = audio();
  const o = a.createOscillator(), g = a.createGain();
  o.type = 'sine'; o.frequency.value = 1100;
  g.gain.setValueAtTime(.1, a.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, a.currentTime+.1);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime+.12);
}

/* Botón de silencio */
$('btn-sonido').onclick = () => {
  silenciado = !silenciado;
  $('btn-sonido').textContent = silenciado ? '🔇' : '🔊';
  if (silenciado) detenerAmbiente();
  else if (estado.pantalla === 'game') iniciarAmbiente();
};


/* ============================================================
   ESTADO DEL JUEGO
   ============================================================ */
const estado = {
  pantalla:         'inicio',
  nivel:            0,
  puntuacion:       0,
  vidas:            3,
  rescatados:       0,     /* total de aciertos en el nivel (animales + basura) */
  animalesSalvados: 0,
  basuraRetirada:   0,
  gruposCruzados:   0,
  objetos:          [],
  grupos:           [],
  arrastre:         null,
  timerSpawn:       null,
  idAnimacion:      null,
  ultimoFrame:      0,
  activo:           false,
  contadorId:       0,
  timerPeligro:     null,
};


/* ============================================================
   GESTIÓN DE PANTALLAS
   ============================================================ */
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculta'));
  $(id).classList.remove('oculta');
  estado.pantalla = id.replace('s-','');
}


/* ============================================================
   ZONAS Y BINS
   ============================================================ */
function obtenerZonas() {
  const r = $('area-juego').getBoundingClientRect();
  return { r, wl: r.width*.25, wr: r.width*.75, anchoArena: r.width*.5, W: r.width, H: r.height };
}

/* Devuelve el id del bin (amarillo/azul…) si la posición cae sobre él, o null */
function binBajoCursor(cx, cy) {
  const M = 22; /* margen de tolerancia en píxeles */
  for (const binId of NIVELES[estado.nivel].contenedoresActivos) {
    const el = $('bin-' + binId);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (cx >= r.left-M && cx <= r.right+M && cy >= r.top-M && cy <= r.bottom+M)
      return binId;
  }
  return null;
}


/* ============================================================
   RESALTADO DE ZONAS AL ARRASTRAR
   ============================================================ */
function resaltarDestino(obj) {
  limpiarResaltado();
  const nv = NIVELES[estado.nivel];
  if (!obj.esBasura) {
    /* Animal → resaltar el agua (verde) y oscurecer bins */
    $('zona-agua-izq').classList.add('dz-bien');
    $('zona-agua-der').classList.add('dz-bien');
    nv.contenedoresActivos.forEach(id => $('bin-'+id).classList.add('dz-mal'));
  } else {
    /* Basura → resaltar el bin correcto (verde) y el resto (rojo) */
    nv.contenedoresActivos.forEach(id => {
      $('bin-'+id).classList.add(id === obj.datos.bin ? 'dz-bien' : 'dz-mal');
    });
    $('zona-agua-izq').classList.add('dz-mal');
    $('zona-agua-der').classList.add('dz-mal');
  }
}

function limpiarResaltado() {
  ['zona-agua-izq','zona-agua-der'].forEach(id => $(id).classList.remove('dz-bien','dz-mal'));
  Object.keys(CONTENEDORES).forEach(id => {
    const el = $('bin-'+id);
    if (el) el.classList.remove('dz-bien','dz-mal');
  });
}


/* ============================================================
   MENSAJE DE RETROALIMENTACIÓN
   ============================================================ */
let timerMensaje = null;
function mostrarMensaje(texto, color = '#fff') {
  clearTimeout(timerMensaje);
  const el = $('mensaje');
  el.textContent = texto;
  el.style.borderColor = color;
  el.classList.remove('visible');
  void el.offsetWidth;
  el.classList.add('visible');
  timerMensaje = setTimeout(() => el.classList.remove('visible'), 2000);
}


/* ============================================================
   CONTENEDORES: ACTIVAR Y BANNER DE NUEVO BIN
   ============================================================ */
function activarBins(nivel) {
  /* Ocultar todos */
  Object.keys(CONTENEDORES).forEach(id => $('bin-'+id).classList.remove('activo'));
  /* Mostrar solo los del nivel */
  NIVELES[nivel].contenedoresActivos.forEach(id => $('bin-'+id).classList.add('activo'));
}

function mostrarBannerNuevoBin() {
  if (estado.nivel === 0) return;
  const binsAhora   = NIVELES[estado.nivel].contenedoresActivos;
  const binsAntes   = NIVELES[estado.nivel - 1].contenedoresActivos;
  const nuevos      = binsAhora.filter(b => !binsAntes.includes(b));
  if (nuevos.length === 0) return;

  const contenido = nuevos.map(id => {
    const c = CONTENEDORES[id];
    return `<span class="banner-pastilla">${c.emoji} ${c.nombre}</span>`;
  }).join('');
  $('banner-bin-contenido').innerHTML = contenido;

  const banner = $('banner-bin');
  banner.classList.remove('visible');
  void banner.offsetWidth;
  banner.classList.add('visible');
  setTimeout(() => banner.classList.remove('visible'), 3500);
}


/* ============================================================
   ANIMALES NADANDO EN EL MAR
   Se crean al iniciar el nivel y permanecen durante el juego.
   ============================================================ */

const NADADORES = [
  { e:'🐠', tam:16 }, { e:'🐡', tam:16 }, { e:'🐟', tam:14 },
  { e:'🦈', tam:20 }, { e:'🐙', tam:18 }, { e:'🦑', tam:16 },
  { e:'🐬', tam:20 }, { e:'🐋', tam:24 }, { e:'🦞', tam:14 },
  { e:'🐚', tam:13 }, { e:'🦀', tam:14 }, { e:'⭐', tam:13 },
  { e:'🪸', tam:15 }, { e:'🦭', tam:19 }, { e:'🐊', tam:18 },
];

function crearNadadores() {
  /* Limpiar nadadores previos */
  $('area-juego').querySelectorAll('.nadador,.burbuja').forEach(e => e.remove());

  const { H } = obtenerZonas();

  /* Crear nadadores en la zona izquierda y derecha */
  ['zona-agua-izq','zona-agua-der'].forEach(zonaId => {
    const zona   = $(zonaId);
    const rect   = zona.getBoundingClientRect();
    const anchoZ = rect.width;
    const area   = $('area-juego').getBoundingClientRect();
    const offsetX = rect.left - area.left;

    /* 6-8 nadadores por zona */
    const cantidad = 6 + Math.floor(Math.random() * 3);
    const usados   = new Set();

    for (let i = 0; i < cantidad; i++) {
      /* Elegir animal sin repetir demasiado */
      let idx;
      do { idx = Math.floor(Math.random() * NADADORES.length); }
      while (usados.has(idx) && usados.size < NADADORES.length);
      usados.add(idx);
      const n = NADADORES[idx];

      const el = document.createElement('div');
      el.className = 'nadador';

      const y    = H * .08 + Math.random() * (H * .82);
      const dur  = 6 + Math.random() * 10;
      const del  = Math.random() * -12; /* retraso negativo → ya en progreso */

      /* Alterna entre nado horizontal y flotación */
      if (Math.random() > 0.3) {
        /* Nado horizontal */
        const vaALaDerecha = Math.random() > 0.5;
        el.classList.add(vaALaDerecha ? 'nada-der' : 'nada-izq');
        el.style.cssText = `
          left: ${offsetX + (vaALaDerecha ? 0 : anchoZ - n.tam)}px;
          top: ${y}px;
          font-size: ${n.tam}px;
          --dur: ${dur}s;
          --del: ${del}s;
          --ancho: ${anchoZ}px;
        `;
      } else {
        /* Flotación suave en un punto fijo */
        el.classList.add('flota');
        el.style.cssText = `
          left: ${offsetX + 4 + Math.random() * (anchoZ - n.tam - 8)}px;
          top: ${y}px;
          font-size: ${n.tam}px;
          --dur: ${3 + Math.random() * 3}s;
          --del: ${del}s;
        `;
      }
      el.textContent = n.e;
      $('area-juego').appendChild(el);
    }

    /* 4-6 burbujas por zona */
    for (let b = 0; b < 4 + Math.floor(Math.random() * 3); b++) {
      const bel  = document.createElement('div');
      bel.className = 'burbuja';
      const tam  = 4 + Math.random() * 7;
      const bx   = offsetX + 4 + Math.random() * (anchoZ - 12);
      const by   = H * .2  + Math.random() * (H * .7);
      const bdur = 3 + Math.random() * 4;
      const bdel = Math.random() * -6;
      bel.style.cssText = `
        left:${bx}px; top:${by}px;
        width:${tam}px; height:${tam}px;
        --dur:${bdur}s; --del:${bdel}s;
        --dist:${-(60 + Math.random()*80)}px;
      `;
      $('area-juego').appendChild(bel);
    }
  });
}


/* ============================================================
   INICIAR NIVEL
   ============================================================ */
function iniciarNivel() {
  const nv = NIVELES[estado.nivel];

  estado.rescatados      = 0;
  estado.animalesSalvados = 0;
  estado.basuraRetirada  = 0;
  estado.gruposCruzados  = 0;
  estado.objetos         = [];
  estado.grupos          = [];
  estado.arrastre        = null;
  estado.activo          = true;
  estado.contadorId      = 0;

  $('area-juego').querySelectorAll('.criatura,.grupo-pueblo,.salpicadura,.pts-flotantes,.gota,.eco-burst,.nadador,.burbuja').forEach(e => e.remove());
  $('mensaje').classList.remove('visible');

  $('val-nivel').textContent    = estado.nivel + 1;
  $('val-puntos').textContent   = estado.puntuacion;
  $('val-vidas').textContent    = '❤️'.repeat(estado.vidas);
  $('val-animales').textContent = '0';
  $('val-reciclado').textContent= '0';
  $('barra-prog').style.width   = '0%';
  $('etiqueta-nivel').textContent = nv.nombre;

  activarBins(estado.nivel);
  mostrarPantalla('s-game');
  iniciarAmbiente();
  crearNadadores();

  /* Banner de nuevos bins (~1s después de que se vea la pantalla) */
  setTimeout(() => mostrarBannerNuevoBin(), 900);

  /* Temporizador de pitido de peligro */
  clearInterval(estado.timerPeligro);
  estado.timerPeligro = setInterval(() => {
    if (!estado.activo) return;
    const { H } = obtenerZonas();
    const ZONA = H * .3;
    for (const obj of estado.objetos) {
      if (!obj.activo) continue;
      for (const g of estado.grupos) {
        const dy = obj.y + obj.datos.s*.5 - (g.y + 23);
        if (dy > -5 && dy < ZONA) { sndPeligro(); return; }
      }
    }
  }, 620);

  setTimeout(() => { if (estado.activo) apareceGrupo(); }, 1200);
  programarApparicion();
  estado.ultimoFrame = performance.now();
  estado.idAnimacion = requestAnimationFrame(bucle);
}

function iniciarJuego()   { estado.puntuacion = 0; estado.vidas = 3; estado.nivel = 0; iniciarNivel(); }
function siguienteNivel() { estado.nivel++; estado.nivel >= NIVELES.length ? mostrarVictoria() : iniciarNivel(); }

function detenerTodo() {
  estado.activo = false;
  cancelAnimationFrame(estado.idAnimacion);
  clearTimeout(estado.timerSpawn);
  clearInterval(estado.timerPeligro);
  limpiarResaltado();
}


/* ============================================================
   BUCLE PRINCIPAL (~60 fps)
   ============================================================ */
function bucle(ts) {
  if (!estado.activo) return;
  const dt = Math.min((ts - estado.ultimoFrame) / 1000, .12);
  estado.ultimoFrame = ts;

  const nv = NIVELES[estado.nivel];
  const { H } = obtenerZonas();

  /* Mover grupos hacia abajo */
  for (let i = estado.grupos.length - 1; i >= 0; i--) {
    const g = estado.grupos[i];
    g.y += nv.vel * dt;
    g.el.style.top = g.y + 'px';
    if (g.y > H + 60) {
      g.el.remove(); estado.grupos.splice(i, 1); estado.gruposCruzados++;
      setTimeout(() => { if (estado.activo) apareceGrupo(); }, 500);
    }
  }

  /* Colisión y peligro */
  const COL  = 34;
  const DANG = H * .28;
  let hayPeligro = false;

  for (const obj of estado.objetos) {
    if (!obj.activo) continue;
    const cObj = obj.y + obj.datos.s * .5;
    let cerca = false;
    for (const g of estado.grupos) {
      const cGrupo = g.y + 23;
      if (Math.abs(cObj - cGrupo) < COL) { manejarColision(); return; }
      if (cObj > cGrupo - 4 && cObj - cGrupo < DANG) cerca = true;
    }
    obj.el.classList.toggle('peligro', cerca);
    if (cerca) hayPeligro = true;
  }
  $('carril-marcha').style.background = hayPeligro ? 'rgba(255,70,50,.18)' : 'rgba(220,175,60,.2)';
  $('barra-prog').style.width = Math.min(estado.rescatados / nv.rescates * 100, 100) + '%';

  estado.idAnimacion = requestAnimationFrame(bucle);
}


/* ============================================================
   APARICIÓN DE OBJETOS
   ============================================================ */
function programarApparicion() {
  clearTimeout(estado.timerSpawn);
  const nv = NIVELES[estado.nivel];
  estado.timerSpawn = setTimeout(() => {
    if (!estado.activo) return;
    const enPantalla = estado.objetos.filter(o => o.activo).length;
    if (enPantalla < nv.maxObjetos && estado.rescatados + enPantalla < nv.rescates) {
      Math.random() < nv.proporcionBasura ? aparecerBasura() : aparecerAnimal();
    }
    programarApparicion();
  }, nv.intervalo * (0.78 + Math.random() * .44));
}

/* Posición Y segura: lejos de las personas Y de la zona de bins */
function posicionSegura(zona, tam) {
  const MARG = 95, minY = zona.H * .14, maxY = zona.H * .72;
  for (let intento = 0; intento < 18; intento++) {
    const y   = minY + Math.random() * (maxY - minY);
    const mid = y + tam * .5;
    let libre = true;
    for (const g of estado.grupos) {
      if (Math.abs(mid - (g.y + 23)) < MARG) { libre = false; break; }
    }
    if (libre) return y;
  }
  return null;
}

function crearObjeto(datos, esBasura) {
  const z = obtenerZonas();
  const y = posicionSegura(z, datos.s);
  if (y === null) return;

  const id = estado.contadorId++;
  const el = document.createElement('div');
  el.className  = 'criatura espera ' + (esBasura ? 'es-basura' : 'es-animal');
  el.dataset.cid = id;

  const marg = 16;
  const x = z.wl + marg + Math.random() * (z.anchoArena - datos.s - marg*2);
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.innerHTML  = `<span class="c-em" style="font-size:${datos.s}px">${datos.e}</span>`
                + `<span class="c-lb">${datos.n}</span>`;

  const obj = { id, el, x, y, origenX:x, origenY:y, activo:true, datos, esBasura };
  estado.objetos.push(obj);
  $('area-juego').appendChild(el);
  el.addEventListener('pointerdown', e => iniciarArrastre(e, id), { passive:false });
  sndAparicion();
}

function aparecerAnimal() {
  const nv = NIVELES[estado.nivel];
  crearObjeto(ANIMALES[nv.animalesDisp[Math.floor(Math.random()*nv.animalesDisp.length)]], false);
}
function aparecerBasura() {
  const nv = NIVELES[estado.nivel];
  crearObjeto(BASURA[nv.basuraDisp[Math.floor(Math.random()*nv.basuraDisp.length)]], true);
}

function apareceGrupo() {
  if (!estado.activo) return;
  const nv = NIVELES[estado.nivel];
  if (estado.gruposCruzados + estado.grupos.length >= nv.gruposNecesarios) return;

  const el = document.createElement('div');
  el.className = 'grupo-pueblo';

  /* Siempre 14-20 figuras. En pantallas estrechas se comprime
     el espacio entre ellas en lugar de reducir la cantidad. */
  const n = 14 + Math.floor(Math.random() * 7);
  const { anchoArena } = obtenerZonas();
  el.innerHTML = generarMultitud(n, anchoArena);
  el.style.top = '-68px';
  estado.grupos.push({ el, y: -68 });
  $('area-juego').appendChild(el);
}


/* ============================================================
   ARRASTRE (Pointer Events)
   ============================================================ */
function iniciarArrastre(e, id) {
  e.preventDefault(); e.stopPropagation();
  const obj = estado.objetos.find(o => o.id === id);
  if (!obj || !obj.activo) return;

  const rect = obj.el.getBoundingClientRect();
  estado.arrastre = { id, ox: e.clientX - rect.left, oy: e.clientY - rect.top };
  obj.el.setPointerCapture(e.pointerId);
  obj.el.classList.remove('espera');
  obj.el.classList.add('arrastrando');
  resaltarDestino(obj);

  obj.el.addEventListener('pointermove',   moverArrastre);
  obj.el.addEventListener('pointerup',     soltarArrastre);
  obj.el.addEventListener('pointercancel', soltarArrastre);
}

function moverArrastre(e) {
  if (!estado.arrastre) return; e.preventDefault();
  const obj = estado.objetos.find(o => o.id === estado.arrastre.id);
  if (!obj) return;
  const area = $('area-juego').getBoundingClientRect();
  obj.x = e.clientX - area.left - estado.arrastre.ox;
  obj.y = e.clientY - area.top  - estado.arrastre.oy;
  obj.el.style.left = obj.x + 'px'; obj.el.style.top = obj.y + 'px';
}

function soltarArrastre(e) {
  if (!estado.arrastre) return;
  const obj = estado.objetos.find(o => o.id === estado.arrastre.id);

  obj.el.removeEventListener('pointermove',   moverArrastre);
  obj.el.removeEventListener('pointerup',     soltarArrastre);
  obj.el.removeEventListener('pointercancel', soltarArrastre);
  obj.el.classList.remove('arrastrando');
  limpiarResaltado();

  const { r, wl, wr } = obtenerZonas();
  const cayoEnAgua = (e.clientX - r.left) < wl || (e.clientX - r.left) > wr;
  const binSoltado = binBajoCursor(e.clientX, e.clientY);

  if (binSoltado !== null) {
    /* Soltado sobre un bin */
    if (obj.esBasura) {
      binSoltado === obj.datos.bin
        ? reciclarBasura(obj, binSoltado)
        : lugarIncorrecto(obj, 'bin-incorrecto', CONTENEDORES[obj.datos.bin]);
    } else {
      lugarIncorrecto(obj, 'animal-bin', null);
    }
  } else if (cayoEnAgua) {
    !obj.esBasura
      ? rescatarAnimal(obj, e.clientX, e.clientY)
      : lugarIncorrecto(obj, 'basura-agua', null);
  } else {
    devolverAlOrigen(obj);
  }
  estado.arrastre = null;
}


/* ============================================================
   ACCIONES
   ============================================================ */

/* Devolver al sitio original si se suelta en zona neutral */
function devolverAlOrigen(obj) {
  obj.el.style.transition = 'left .24s ease, top .24s ease';
  obj.el.style.left = obj.origenX + 'px'; obj.el.style.top = obj.origenY + 'px';
  obj.x = obj.origenX; obj.y = obj.origenY;
  setTimeout(() => { obj.el.style.transition = ''; obj.el.classList.add('espera'); }, 260);
}

/* Animal rescatado correctamente → al agua */
function rescatarAnimal(obj, cx, cy) {
  eliminarObjeto(obj);
  const area = $('area-juego').getBoundingClientRect();
  crearEfectoSalpicadura(cx - area.left, cy - area.top, '💦');
  sndSalpicadura();
  estado.rescatados++; estado.animalesSalvados++;
  const pts = 10 * (estado.nivel + 1); estado.puntuacion += pts;
  $('val-puntos').textContent   = estado.puntuacion;
  $('val-animales').textContent = estado.animalesSalvados;
  flotarPuntos(cx - area.left, cy - area.top, '+'+pts, 'pts-animal');
  sndPuntos();
  comprobarNivelCompleto();
}

/* Basura reciclada correctamente → al bin */
function reciclarBasura(obj, binId) {
  eliminarObjeto(obj);
  const area  = $('area-juego').getBoundingClientRect();
  const bRect = $('bin-'+binId).getBoundingClientRect();
  const bx = bRect.left + bRect.width/2  - area.left;
  const by = bRect.top  + bRect.height/2 - area.top;

  /* Animación del bin */
  const binEl = $('bin-'+binId);
  binEl.classList.add('recibiendo');
  setTimeout(() => binEl.classList.remove('recibiendo'), 500);

  /* Efecto visual */
  ['♻️','✅'].forEach((em, i) => {
    const el = document.createElement('div');
    el.className = 'eco-burst'; el.textContent = em;
    el.style.cssText = `left:${bx-12+i*14}px;top:${by-16}px;animation-delay:${i*.1}s`;
    $('area-juego').appendChild(el);
    setTimeout(() => el.remove(), 800);
  });

  sndReciclaje();
  estado.rescatados++; estado.basuraRetirada++;
  const pts = 10 * (estado.nivel + 1); estado.puntuacion += pts;
  $('val-puntos').textContent    = estado.puntuacion;
  $('val-reciclado').textContent = estado.basuraRetirada;
  flotarPuntos(bx, by - 22, '+'+pts, 'pts-basura');
  sndPuntos();
  comprobarNivelCompleto();
}

/* Soltar en lugar incorrecto → perder vida + mensaje educativo */
function lugarIncorrecto(obj, razon, binCorrecto) {
  devolverAlOrigen(obj);
  sndError();
  estado.vidas--;
  $('val-vidas').textContent = '❤️'.repeat(Math.max(0, estado.vidas));
  const flash = $('destello-vida');
  flash.classList.remove('visible'); void flash.offsetWidth; flash.classList.add('visible');

  let msg, color;
  if (razon === 'bin-incorrecto') {
    msg   = `¡Eso va en el ${binCorrecto.emoji} ${binCorrecto.nombre}!`;
    color = binCorrecto.color;
  } else if (razon === 'animal-bin') {
    msg = '¡Los animales van al mar! 🌊'; color = '#5dc8f0';
  } else {
    msg = '¡No contamines el mar! 🌊♻️'; color = '#f4a040';
  }
  mostrarMensaje(msg, color);

  if (estado.vidas <= 0)
    setTimeout(() => { $('go-pts').textContent = estado.puntuacion; mostrarPantalla('s-go'); }, 700);
}

/* Colisión del pueblo con un objeto */
function manejarColision() {
  detenerTodo(); detenerAmbiente();
  estado.vidas--;
  $('val-vidas').textContent = '❤️'.repeat(Math.max(0, estado.vidas));
  sndColision();
  const flash = $('destello-vida');
  flash.classList.remove('visible'); void flash.offsetWidth; flash.classList.add('visible');
  $('wrap').animate(
    [{transform:'translate(0,0)'},{transform:'translate(-10px,3px)'},
     {transform:'translate(10px,-3px)'},{transform:'translate(-8px,2px)'},
     {transform:'translate(8px,-2px)'},{transform:'translate(0,0)'}],
    { duration:480, easing:'ease-out' }
  );
  if (estado.vidas <= 0) {
    setTimeout(() => { $('go-pts').textContent = estado.puntuacion; mostrarPantalla('s-go'); }, 700);
  } else {
    setTimeout(() => { if (!estado.activo) iniciarNivel(); }, 960);
  }
}


/* ============================================================
   FUNCIONES AUXILIARES
   ============================================================ */
function eliminarObjeto(obj) {
  obj.activo = false;
  obj.el.style.transition = 'opacity .2s, transform .2s';
  obj.el.style.opacity = '0'; obj.el.style.transform = 'scale(.15) rotate(20deg)';
  setTimeout(() => obj.el.remove(), 240);
  estado.objetos = estado.objetos.filter(o => o.id !== obj.id);
}

function crearEfectoSalpicadura(sx, sy, emoji) {
  const sp = document.createElement('div');
  sp.className = 'salpicadura'; sp.textContent = emoji;
  sp.style.cssText = `left:${sx-18}px;top:${sy-18}px`;
  $('area-juego').appendChild(sp); setTimeout(() => sp.remove(), 850);
  for (let i = 0; i < 5; i++) {
    const a = (i/5)*Math.PI*2;
    const dr = document.createElement('div');
    dr.className = 'gota'; dr.textContent = '💧';
    dr.style.cssText = `left:${sx-10}px;top:${sy-10}px;`
      + `--tx:${Math.cos(a)*54}px;--ty:${Math.sin(a)*40-30}px;`
      + `--dur:${.5+Math.random()*.28}s;animation-delay:${i*.04}s`;
    $('area-juego').appendChild(dr); setTimeout(() => dr.remove(), 950);
  }
}

function flotarPuntos(sx, sy, txt, cls) {
  const el = document.createElement('div');
  el.className = 'pts-flotantes ' + cls; el.textContent = txt;
  el.style.cssText = `left:${sx-16}px;top:${sy-22}px`;
  $('area-juego').appendChild(el); setTimeout(() => el.remove(), 1250);
}

function comprobarNivelCompleto() {
  if (estado.rescatados >= NIVELES[estado.nivel].rescates)
    setTimeout(() => { if (estado.activo) nivelCompleto(); }, 420);
}


/* ============================================================
   NIVEL COMPLETO Y VICTORIA
   ============================================================ */
function nivelCompleto() {
  detenerTodo(); detenerAmbiente(); detenerVoz(); sndNivel();

  $('lu-pts').textContent = estado.puntuacion;
  const hist = HISTORIAS[Math.min(estado.nivel, HISTORIAS.length - 1)];
  $('lu-escena').textContent = hist.escena;
  $('lu-titulo').textContent = hist.titulo;
  $('lu-texto').textContent  = hist.texto;
  $('lu-cita').textContent   = hist.cita;
  $('lu-ref').textContent    = hist.referencia;

  ['lu-escena','lu-titulo','lu-texto','lu-cita','lu-ref'].forEach(id => {
    const el = $(id); el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  });

  const nivelSig   = estado.nivel + 1;
  const divProx    = $('proximos-bins');
  if (nivelSig < NIVELES.length) {
    const binsProx    = NIVELES[nivelSig].contenedoresActivos;
    const binsActuales = NIVELES[estado.nivel].contenedoresActivos;
    const nuevos      = binsProx.filter(b => !binsActuales.includes(b));
    $('pb-lista').innerHTML = binsProx.map(id => {
      const c = CONTENEDORES[id];
      const esNuevo = nuevos.includes(id);
      return `<span class="bin-pastilla${esNuevo ? ' nuevo' : ''}">${c.emoji} ${c.nombre}${esNuevo ? ' ✨' : ''}</span>`;
    }).join('');
    divProx.style.display = 'block';
  } else {
    divProx.style.display = 'none';
  }

  mostrarPantalla('s-lu');

  /* Reproducir la narración del nivel con un pequeño retraso
     para que el niño vea primero la pantalla de celebración */
  setTimeout(() => {
    reproducirAudio(AUDIO_NIVELES[Math.min(estado.nivel, AUDIO_NIVELES.length - 2)]);
  }, 800);
}

function mostrarVictoria() {
  detenerAmbiente(); detenerVoz();
  sndFanfarria();
  setTimeout(() => sndAplausos(), 300);
  setTimeout(() => { if (!silenciado) sndAplausos(); }, 3200);
  $('win-pts').textContent = estado.puntuacion;
  mostrarPantalla('s-win');
  lanzarConfeti();
  /* Narración de victoria — Moisés despide al jugador */
  setTimeout(() => {
    reproducirAudio(AUDIO_NIVELES[AUDIO_NIVELES.length - 1]);
  }, 1000);
}

function lanzarConfeti() {
  const W = window.innerWidth;
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const el  = document.createElement('div');
      el.className = 'confeti';
      const col = COLORES_CONFETI[Math.floor(Math.random()*COLORES_CONFETI.length)];
      const x0  = Math.random()*W, xf = (Math.random()-.5)*140;
      const dur = 1.9+Math.random()*1.5, del = Math.random()*.7;
      const w   = 7+Math.random()*9, h = 7+Math.random()*9;
      const r   = Math.random()>.5 ? 720 : -720;
      el.style.cssText = `left:${x0}px;top:-14px;background:${col};`
        + `width:${w}px;height:${h}px;`
        + `border-radius:${Math.random()>.5?'50%':'3px'};`
        + `--d:${dur}s;--del:${del}s;--xf:${xf}px;--r:${r}deg`;
      $('s-win').appendChild(el);
      setTimeout(() => el.remove(), (dur+del+.5)*1000);
    }, i*55);
  }
}


/* ============================================================
   INSTRUCCIONES DE MOISÉS — Web Speech API
   ============================================================ */

/* ============================================================
   VOZ DE MOISÉS — Archivos MP3 (ElevenLabs)
   Estructura esperada:
     audio/instrucciones/moises-0.mp3 … moises-7.mp3
     audio/niveles/nivel-1.mp3 … nivel-4.mp3
     audio/niveles/nivel-5-victoria.mp3
   ============================================================ */

let vozActiva  = true;
let audioActual = null; /* elemento <audio> en reproducción */

/* Reproduce un archivo MP3. Si la voz está silenciada, no hace nada.
   alTerminar (opcional) se llama cuando el audio acaba o si está silenciado. */
function reproducirAudio(ruta, alTerminar) {
  detenerVoz();
  if (!vozActiva) {
    if (alTerminar) setTimeout(alTerminar, 200);
    return;
  }
  const a = new Audio(ruta);
  audioActual = a;
  a.onended  = () => { audioActual = null; if (alTerminar) alTerminar(); };
  a.onerror  = () => {
    /* Si el archivo no existe, continúa sin audio */
    audioActual = null;
    if (alTerminar) setTimeout(alTerminar, 200);
  };
  a.play().catch(() => {
    /* El navegador bloqueó la reproducción automática — continúa sin audio */
    audioActual = null;
    if (alTerminar) setTimeout(alTerminar, 200);
  });
}

/* Detiene el audio en reproducción */
function detenerVoz() {
  if (audioActual) {
    audioActual.pause();
    audioActual.currentTime = 0;
    audioActual = null;
  }
}

/* Rutas de los archivos de instrucciones (un MP3 por paso) */
const AUDIO_INSTRUCCIONES = [
  'audio/instrucciones/moises-0.mp3',
  'audio/instrucciones/moises-1.mp3',
  'audio/instrucciones/moises-2.mp3',
  'audio/instrucciones/moises-3.mp3',
  'audio/instrucciones/moises-4.mp3',
  'audio/instrucciones/moises-5.mp3',
  'audio/instrucciones/moises-6.mp3',
  'audio/instrucciones/moises-7.mp3',
];

/* Rutas de los audios de nivel (índice 0 = nivel 1, etc.) */
const AUDIO_NIVELES = [
  'audio/niveles/nivel-1.mp3',
  'audio/niveles/nivel-2.mp3',
  'audio/niveles/nivel-3.mp3',
  'audio/niveles/nivel-4.mp3',
  'audio/niveles/nivel-5-victoria.mp3',
];

/* ─── Pasos de instrucción ─── */
const PASOS_INSTRUCCION = [
  {
    tipo:    'intro',
    icono:   '👋',
    titulo:  '¡Hola, pequeño ayudante!',
    objetos: [],
  },
  {
    tipo:    'animal',
    icono:   '🐠🌊',
    titulo:  'Animales al mar',
    objetos: ['⭐ Estrellas','🐟 Peces','🦑 Calamares','🐬 Delfines','🦈 Tiburones','🐙 Pulpos','🐋 Ballenas'],
  },
  {
    tipo:    'amarillo',
    icono:   '🟡',
    titulo:  'Contenedor Amarillo — Envases',
    objetos: ['🛍️ Bolsas','🥤 Vasos plástico','🧴 Botellas plástico','🥫 Latas'],
  },
  {
    tipo:    'azul',
    icono:   '🔵',
    titulo:  'Contenedor Azul — Papel y Cartón',
    objetos: ['📦 Cajas','📰 Periódicos','🧃 Tetrabriks'],
  },
  {
    tipo:    'verde',
    icono:   '🟢',
    titulo:  'Contenedor Verde — Vidrio',
    objetos: ['🍾 Botellas vidrio','🫙 Frascos vidrio'],
  },
  {
    tipo:    'marron',
    icono:   '🟤',
    titulo:  'Contenedor Marrón — Orgánico',
    objetos: ['🪸 Algas muertas','🐚 Conchas rotas'],
  },
  {
    tipo:    'gris',
    icono:   '⚫',
    titulo:  'Contenedor Gris — Resto',
    objetos: ['👟 Zapatos','🧦 Calcetines','🎣 Cañas de pesca'],
  },
  {
    tipo:    'fin',
    icono:   '✅',
    titulo:  '¡Ya lo sabes todo!',
    objetos: [],
  },
];

let pasoActual = 0;

function mostrarPasoInstruccion(indice) {
  const paso = PASOS_INSTRUCCION[indice];
  pasoActual  = indice;

  /* Actualizar bocadillo */
  const bocText = $('bocadillo-texto');
  bocText.style.opacity = '0';
  setTimeout(() => {
    bocText.textContent = paso.titulo;
    bocText.style.transition = 'opacity .35s';
    bocText.style.opacity = '1';
  }, 150);

  /* Actualizar tarjeta del bin */
  const tarjeta = $('paso-bin');
  tarjeta.className = 'paso-bin-anim';
  void tarjeta.offsetWidth;
  $('paso-bin-icono').textContent = paso.icono;
  $('paso-bin-icono').style.animation = 'none';
  void $('paso-bin-icono').offsetWidth;
  $('paso-bin-icono').style.animation = '';
  $('paso-bin-nombre').textContent = paso.titulo;
  $('paso-bin-objetos').innerHTML = paso.objetos.map((o, i) =>
    `<span class="obj-pastilla" style="animation-delay:${i*.07}s">${o}</span>`
  ).join('');
  tarjeta.className = paso.tipo;

  /* Puntos de progreso */
  $('pasos-dots').innerHTML = PASOS_INSTRUCCION.map((_, i) =>
    `<div class="dot ${i < indice ? 'completado' : i === indice ? 'activo' : ''}"></div>`
  ).join('');

  /* Texto del botón en el último paso */
  $('btn-paso-sig').textContent =
    indice === PASOS_INSTRUCCION.length - 1 ? '¡Empecemos! 🌊' : 'Siguiente ▶';

  /* Reproducir el MP3 correspondiente */
  detenerVoz();
  reproducirAudio(AUDIO_INSTRUCCIONES[indice]);
}

function iniciarInstrucciones() {
  pasoActual = 0;
  $('ctrl-voz').style.display = 'flex';
  $('btn-voz').className  = vozActiva ? '' : 'silenciado';
  $('btn-voz').textContent = vozActiva ? '🔊 Voz activada' : '🔇 Voz desactivada';
  mostrarPantalla('s-instrucciones');
  setTimeout(() => mostrarPasoInstruccion(0), 400);
}

/* Siguiente paso */
$('btn-paso-sig').onclick = () => {
  detenerVoz();
  if (pasoActual < PASOS_INSTRUCCION.length - 1) {
    mostrarPasoInstruccion(pasoActual + 1);
  } else {
    iniciarJuego();
  }
};

/* Saltar instrucciones */
$('btn-saltar').onclick = () => {
  detenerVoz();
  iniciarJuego();
};

/* Silenciar / activar voz */
$('btn-voz').onclick = () => {
  vozActiva = !vozActiva;
  $('btn-voz').className   = vozActiva ? '' : 'silenciado';
  $('btn-voz').textContent = vozActiva ? '🔊 Voz activada' : '🔇 Voz desactivada';
  if (!vozActiva) {
    detenerVoz();
  } else {
    reproducirAudio(AUDIO_INSTRUCCIONES[pasoActual]);
  }
};


/* ============================================================
   BOTONES Y ARRANQUE
   ============================================================ */
$('btn-inicio').onclick        = () => iniciarInstrucciones();
$('btn-reiniciar').onclick     = () => { detenerVoz(); detenerTodo(); estado.puntuacion=0; estado.vidas=3; estado.nivel=0; iniciarNivel(); };
$('btn-siguiente').onclick     = () => siguienteNivel();
$('btn-nueva-partida').onclick = () => iniciarInstrucciones();

mostrarPantalla('s-start');
