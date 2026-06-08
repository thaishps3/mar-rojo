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
  { e:'🦀', n:'Cangrejo',    s:34 },
  { e:'🐟', n:'Pez',         s:32 },
  { e:'🐡', n:'Pez globo',   s:34 },
  { e:'🦑', n:'Calamar',     s:38 },
  { e:'🐬', n:'Delfín',      s:40 },
  { e:'🦈', n:'Tiburón',     s:44 },
  { e:'🐙', n:'Pulpo',       s:44 },
  { e:'🐋', n:'Ballena',     s:50 },
  { e:'🦭', n:'Foca',        s:38 },
  { e:'🦞', n:'Langosta',    s:34 },
  { e:'🐢', n:'Tortuga',     s:36 },
  { e:'🦐', n:'Gamba',       s:28 },
  /* Pez diablo — aparece raramente, da el doble de puntos */
  { e:'🐡', n:'Pez Diablo',  s:50, esBonus:true },
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
    vel:                 18,
    intervalo:           3800,
    maxObjetos:          3,
    rescates:            8,
    gruposNecesarios:    4,
    animalesDisp:        [0,1,2,10,11],           /* cangrejo, pez, pez globo, tortuga, gamba */
    basuraDisp:          [0,1,3,11,12],
    contenedoresActivos: ['amarillo','gris'],
    proporcionBasura:    .30,
  },
  {
    nombre:              'El camino se abre',
    vel:                 22,
    intervalo:           3400,
    maxObjetos:          3,
    rescates:            10,
    gruposNecesarios:    5,
    animalesDisp:        [0,1,2,3,9,10,11],       /* + calamar, langosta */
    basuraDisp:          [0,1,2,3,4,5,6,11,12,13],
    contenedoresActivos: ['amarillo','azul','gris'],
    proporcionBasura:    .35,
  },
  {
    nombre:              'Criaturas del abismo',
    vel:                 28,
    intervalo:           3000,
    maxObjetos:          4,
    rescates:            12,
    gruposNecesarios:    6,
    animalesDisp:        [0,1,2,3,4,7,9,10,11],   /* + delfín, ballena */
    basuraDisp:          [0,1,2,3,4,5,6,7,8,11,12,13],
    contenedoresActivos: ['amarillo','azul','verde','gris'],
    proporcionBasura:    .40,
  },
  {
    nombre:              'La gran prueba',
    vel:                 34,
    intervalo:           2600,
    maxObjetos:          4,
    rescates:            15,
    gruposNecesarios:    7,
    animalesDisp:        [0,1,2,3,4,5,6,7,8,9,10,11], /* todos */
    basuraDisp:          [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    contenedoresActivos: ['amarillo','azul','verde','marron','gris'],
    proporcionBasura:    .45,
  },
  {
    nombre:              'Paso final',
    vel:                 42,
    intervalo:           2200,
    maxObjetos:          5,
    rescates:            18,
    gruposNecesarios:    8,
    animalesDisp:        [0,1,2,3,4,5,6,7,8,9,10,11], /* todos */
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
  const ANIMALES_EXODO = ['🐪','🐎','🐐','🐑','🐕','🐈','🫏','🐂','🐓','🐔'];

  const ancho    = anchoDisponible || 400;

  /* Escala proporcional para PC: figuras más grandes en pantallas anchas.
     Base: 380px de arena (móvil). Máximo: 1.7× en pantallas grandes. */
  const escala   = Math.min(1.7, Math.max(1.0, ancho / 380));

  /* Paso entre figuras — calculado para que TODO el grupo quepa dentro
     del ancho disponible (la arena). Así nadie -ni los animales grandes-
     se sale sobre el mar en pantallas estrechas. */
  const PASO_MAX  = Math.round(18 * escala);
  const PASO_MIN  = 8;
  const pasoQueCabe = Math.floor((ancho - figW - 4) / Math.max(1, n - 1));
  const PASO      = Math.max(PASO_MIN, Math.min(PASO_MAX, pasoQueCabe));

  /* Tamaño de la figura SVG escalado */
  const figW = Math.round(28 * escala);
  const figH = Math.round(52 * escala);

  /* Mezclar generadores */
  const pool = [];
  while (pool.length < n) pool.push(...GENERADORES_FIGURAS);
  pool.sort(() => Math.random() - .5);

  /* Posiciones para animales: ~1 de cada 4, nunca en el primer lugar */
  /* Animales cada 3 figuras — siempre presentes, no aleatorios.
     El último animal es siempre el buey 🐂 */
  const posicionesAnimal = new Set();
  for (let i = 2; i < n; i += 3) posicionesAnimal.add(i);
  const posicionesArr   = [...posicionesAnimal];
  const posicionBuey    = posicionesArr[posicionesArr.length - 1]; /* último */

  /* Ancho total del grupo */
  const anchoTotal = (n - 1) * PASO + figW + 4;

  /* ── Personas primero ── */
  let htmlPersonas = '', pIdx = 0;
  for (let i = 0; i < n; i++) {
    if (!posicionesAnimal.has(i)) {
      const cls  = i % 2 === 0 ? 'figura' : 'figura figura-par';
      const gen  = pool[pIdx % pool.length];
      const esNino = gen === figNino;
      const top  = esNino ? `top:${Math.round(8*escala)}px` : 'top:0';
      /* Generar SVG y escalar con width/height CSS */
      const svgOriginal = gen();
      const svgEscalado = svgOriginal
        .replace(/width="(\d+)"/, `width="${figW}"`)
        .replace(/height="(\d+)"/, `height="${gen === figAnciano ? Math.round(56*escala) : figH}"`);
      htmlPersonas += `<div class="${cls}" style="left:${i*PASO}px;${top};z-index:2;position:absolute">${svgEscalado}</div>`;
      pIdx++;
    }
  }

  /* ── Animales después ── */
  let htmlAnimales = '';
  /* Altura de los animales grandes: van DETRÁS del pueblo (z-index 1) pero
     deben asomar por encima de las cabezas. Por eso son MÁS ALTOS que las
     personas (1.45× en móvil, hasta 1.7× en PC). El ancho se controla aparte
     para que no se salgan sobre el mar. */
  const multGrande = Math.min(1.7, Math.max(1.45, escala * 1.45));
  for (const i of posicionesAnimal) {
    const cls      = i % 2 === 0 ? 'figura' : 'figura figura-par';
    const emoji     = (i === posicionBuey)
      ? '🐂'
      : ANIMALES_EXODO.filter(a => a !== '🐂')[Math.floor(Math.random() * (ANIMALES_EXODO.length - 1))];
    const esGrande  = ['🐪','🐎','🐂'].includes(emoji);
    const esMediano = ['🫏','🐕','🐑','🐐'].includes(emoji);

    let size = Math.round(figH * (esGrande ? multGrande : esMediano ? .5 : .25));
    const zIdx = esGrande ? 1 : 3;

    /* Caballo y camello → SVG propio (≈1.7× más anchos que altos); resto → emoji */
    const svgAnimal = emoji === '🐎' ? 'caballo.svg' : emoji === '🐪' ? 'camello.svg' : null;
    let divW = svgAnimal ? Math.round(size * 1.7) : size;

    /* Ningún animal puede ser más ancho que la arena ni que el propio grupo:
       si lo fuera, se reduce para que quepa sobre la tierra. */
    const maxAnimalW = Math.max(24, Math.min(ancho - 12, anchoTotal));
    if (divW > maxAnimalW) {
      size = Math.round(size * (maxAnimalW / divW));
      divW = svgAnimal ? Math.round(size * 1.7) : size;
    }

    const top = Math.round(figH - size - 2);
    const offsetX = (Math.random() > .5 ? 3 : -2);

    /* Mantener el recuadro del animal DENTRO del grupo, nunca sobre el mar */
    let leftAnimal = i * PASO + offsetX;
    leftAnimal = Math.max(0, Math.min(leftAnimal, Math.max(0, anchoTotal - divW)));

    const contenido = svgAnimal
      ? `<img src="img/animales/${svgAnimal}" width="${divW}" height="${size}" style="object-fit:contain;display:block;">`
      : emoji;
    htmlAnimales += `<div class="${cls}" style="
      left:${leftAnimal}px;top:${top}px;
      width:${divW}px;height:${size}px;
      font-size:${size}px;line-height:1;
      overflow:visible;display:flex;align-items:flex-end;justify-content:center;
      z-index:${zIdx};position:absolute;
      filter:drop-shadow(0 2px 3px rgba(0,0,0,.4))">${contenido}</div>`;
  }

  return `<div style="position:relative;width:${anchoTotal}px;height:${figH+6}px">${htmlPersonas}${htmlAnimales}</div>`;
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
let audioActual = null;
let ultimaRuta  = null;

$('btn-sonido').onclick = () => {
  silenciado = !silenciado;
  $('btn-sonido').textContent = silenciado ? '🔇' : '🔊';
  if (silenciado) {
    detenerAmbiente();
    detenerVoz();
  } else {
    /* Reanudar la voz que estaba sonando antes de silenciar */
    if (ultimaRuta) reproducirAudio(ultimaRuta);
    if (estado.pantalla === 'game') iniciarAmbiente();
  }
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
  erroresNivel:     0,
  estrellasTotal:   0,
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
  { e:'🦀', tam:14 }, { e:'🦭', tam:18 }, { e:'🐡', tam:13 },
  { e:'🪸', tam:15 }, { e:'🐠', tam:18 }, { e:'🦈', tam:16 },
];

/* ============================================================
   FONDO DEL MAR — algas verdes ondulantes + corales naranjas
   Todos los elementos crecen desde y=altMax (fondo del SVG).
   ============================================================ */

function crearFondoMar() {
  ['zona-agua-izq', 'zona-agua-der'].forEach(zonaId => {
    const zona = $(zonaId);
    zona.querySelectorAll('.fondo-mar').forEach(e => e.remove());

    const rect   = zona.getBoundingClientRect();
    const ZW     = rect.width;
    const ZH     = rect.height;
    if (!ZW || !ZH) return;

    const altMax = Math.min(Math.round(ZH * .55), 155);
    const SVG_W  = 110;
    const mid    = SVG_W / 2;

    const FRONDAS = [
      { dx:-28, h:Math.round(altMax*.70), c:'#3aaa86', sc:'#1d6e52', d:3.2, del:0,   dir: 1 },
      { dx:-14, h:Math.round(altMax*.86), c:'#1d8a6a', sc:'#0a4835', d:3.9, del:.5,  dir:-1 },
      { dx:  0, h:altMax,                 c:'#136050', sc:'#062c22', d:4.4, del:1.0,  dir: 1 },
      { dx: 14, h:Math.round(altMax*.83), c:'#4db89a', sc:'#1a7060', d:3.5, del:1.5,  dir:-1 },
      { dx: 27, h:Math.round(altMax*.66), c:'#2a9878', sc:'#0d5040', d:2.8, del:.3,   dir: 1 },
    ];

    function buildGrupo(xCentro) {
      let inner = '';

      FRONDAS.forEach(f => {
        const cx = mid + f.dx;
        const a  = 12 * f.dir;
        const B  = altMax;
        const path = `M${cx},${B} C${cx-a},${B-Math.round(f.h*.28)} ${cx-a},${B-Math.round(f.h*.48)} ${cx},${B-Math.round(f.h*.5)} C${cx+a},${B-Math.round(f.h*.52)} ${cx+a},${B-Math.round(f.h*.82)} ${cx},${B-f.h}`;
        const a1 = (-4*f.dir).toFixed(1), a2 = (4*f.dir).toFixed(1);
        inner += `<g>
          <animateTransform attributeName="transform" type="rotate"
            values="${a1} ${cx} ${B};${a2} ${cx} ${B};${a1} ${cx} ${B}"
            dur="${f.d}s" begin="${f.del}s" repeatCount="indefinite"/>
          <path d="${path}" stroke="${f.c}" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="${path}" stroke="${f.sc}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".4"/>
        </g>`;
      });

      /* Coral naranja */
      const cc = mid - 42, hc = Math.round(altMax*.52), B = altMax;
      inner += `<g>
        <animateTransform attributeName="transform" type="rotate"
          values="-4 ${cc} ${B};4 ${cc} ${B};-4 ${cc} ${B}"
          dur="3s" begin=".4s" repeatCount="indefinite"/>
        <path d="M${cc},${B} L${cc},${B-Math.round(hc*.56)}" stroke="#d06420" stroke-width="5" stroke-linecap="round"/>
        <path d="M${cc},${B-Math.round(hc*.38)} Q${cc-16},${B-Math.round(hc*.58)} ${cc-22},${B-Math.round(hc*.78)}" stroke="#d06420" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M${cc},${B-Math.round(hc*.45)} Q${cc+16},${B-Math.round(hc*.63)} ${cc+20},${B-Math.round(hc*.82)}" stroke="#d06420" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="${cc-22}" cy="${B-Math.round(hc*.78)}" r="5" fill="#e88040"/>
        <circle cx="${cc+20}" cy="${B-Math.round(hc*.82)}" r="5" fill="#e88040"/>
        <circle cx="${cc-10}" cy="${B-Math.round(hc*.46)}" r="3" fill="#f09050"/>
      </g>`;

      const el = document.createElement('div');
      el.className = 'fondo-mar';
      el.style.cssText = `position:absolute;left:${Math.round(xCentro - SVG_W/2)}px;bottom:0;z-index:2;pointer-events:none;`;
      el.innerHTML = `<svg width="${SVG_W}" height="${altMax}" viewBox="0 0 ${SVG_W} ${altMax}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">${inner}</svg>`;
      zona.appendChild(el);
    }

    const num = ZW > 70 ? 2 : 1;
    for (let i = 0; i < num; i++) {
      buildGrupo((ZW / (num + 1)) * (i + 1));
    }
  });
}


function crearNadadores() {
  $('area-juego').querySelectorAll('.nadador,.burbuja,.fondo-mar').forEach(e => e.remove());

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
        /* Nado horizontal — emojis acuáticos miran a la derecha por defecto */
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
        /* Voltear cuando nada hacia la izquierda */
        if (!vaALaDerecha) el.style.transform = 'scaleX(-1)';
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
      if (n.svg) {
        el.innerHTML = n.fn(n.tam);
      } else {
        el.textContent = n.e;
      }
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
  estado.erroresNivel    = 0;
  estado.objetos         = [];
  estado.grupos          = [];
  estado.arrastre        = null;
  estado.activo          = true;
  estado.contadorId      = 0;
  colaAnimales           = []; /* reiniciar rotación de animales */

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
  /* Pequeño retraso para que el navegador renderice las zonas
     antes de medir con getBoundingClientRect */
  setTimeout(() => crearFondoMar(), 80);
  crearNadadores();
  iniciarGaviotas();
  iniciarSaltosCriatura();
  iniciarMedusas();
  iniciarTesoros();
  iniciarOstrasVida();
  iniciarBancosYFoca();
  iniciarCaballitos();

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

function iniciarJuego()   { estado.puntuacion = 0; estado.vidas = 3; estado.nivel = 0; estado.estrellasTotal = 0; iniciarNivel(); }
function siguienteNivel() { estado.nivel++; estado.nivel >= NIVELES.length ? mostrarVictoria() : iniciarNivel(); }

function detenerTodo() {
  estado.activo = false;
  cancelAnimationFrame(estado.idAnimacion);
  clearTimeout(estado.timerSpawn);
  clearInterval(estado.timerPeligro);
  limpiarResaltado();
  detenerGaviotas();
  detenerSaltosCriatura();
  detenerMedusas();
  detenerTesoros();
  detenerOstrasVida();
  detenerBancosYFoca();
  detenerCaballitos();
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
    /* Si el objeto está siendo arrastrado, ignorar colisión —
       el niño puede pasar sobre los israelitas sin penalización */
    if (estado.arrastre && estado.arrastre.id === obj.id) continue;

    const cObj = obj.y + obj.datos.s * .5;
    let cerca = false;
    for (const g of estado.grupos) {
      const cGrupo = g.y + 23;
      if (Math.abs(cObj - cGrupo) < COL) {
        if (obj.esBasura) {
          /* Basura que no se recogió a tiempo → desaparece sin penalizar */
          eliminarObjeto(obj);
        } else {
          /* Pez/animal no rescatado a tiempo → sí penaliza */
          manejarColision();
        }
        return;
      }
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

  /* En pantallas grandes (PC), escalar los objetos proporcionalmente.
     Base de diseño: 400px de arena. En PC puede ser el doble o más. */
  const escala   = Math.min(2.0, Math.max(1.0, z.anchoArena / 380));
  const tamano   = Math.round(datos.s * escala);

  const id = estado.contadorId++;
  const el = document.createElement('div');
  el.className  = 'criatura espera ' + (esBasura ? 'es-basura' : 'es-animal') + (datos.cls ? ' ' + datos.cls : '');
  el.dataset.cid = id;

  const marg = 16;
  const x = z.wl + marg + Math.random() * (z.anchoArena - tamano - marg*2);
  el.style.left = x + 'px'; el.style.top = y + 'px';

  el.innerHTML = `<span class="c-em" style="font-size:${tamano}px">${datos.e}</span>`
               + `<span class="c-lb">${datos.n}</span>`;

  const obj = { id, el, x, y, origenX:x, origenY:y, activo:true, datos, esBasura };
  estado.objetos.push(obj);
  $('area-juego').appendChild(el);
  el.addEventListener('pointerdown', e => iniciarArrastre(e, id), { passive:false });
  sndAparicion();
}

/* Cola de animales para evitar repeticiones — se rota barajando */
let colaAnimales = [];

/* Pez Diablo — pez de las profundidades con antena luminosa */
function svgPezDiablo(tam) {
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
    <!-- Halo pulsante del foco -->
    <circle cx="56" cy="9" r="13" fill="rgba(255,255,80,.22)">
      <animate attributeName="r" values="10;18;10" dur=".85s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".22;.55;.22" dur=".85s" repeatCount="indefinite"/>
    </circle>
    <!-- Foco bioluminiscente -->
    <circle cx="56" cy="9" r="5" fill="#ffff44">
      <animate attributeName="r" values="4;7;4" dur=".85s" repeatCount="indefinite"/>
    </circle>
    <!-- Antena -->
    <path d="M43,30 Q50,20 56,9" stroke="#666" stroke-width="2.5"
          fill="none" stroke-linecap="round"/>
    <!-- Aleta dorsal -->
    <path d="M22,30 Q34,16 46,30" fill="#1e1e1e" stroke="#333" stroke-width="2"/>
    <!-- Cuerpo negro ovalado -->
    <ellipse cx="38" cy="52" rx="33" ry="21" fill="#111"/>
    <!-- Textura cuerpo -->
    <ellipse cx="38" cy="52" rx="33" ry="21" fill="none"
             stroke="#2a2a2a" stroke-width="3" stroke-dasharray="4 6"/>
    <!-- Ojo amarillo-verde -->
    <circle cx="54" cy="46" r="7" fill="#88ff22"/>
    <circle cx="55" cy="45" r="3.5" fill="#000"/>
    <circle cx="56" cy="44" r="1.2" fill="#fff" opacity=".8"/>
    <!-- Boca -->
    <path d="M12,58 Q38,74 64,58" fill="#1a1a1a" stroke="#333" stroke-width="1.5"/>
    <!-- Dientes irregulares -->
    <path d="M16,58 L14,67 M24,61 L22,71 M34,63 L34,73
             M44,61 L46,71 M54,58 L56,67"
          stroke="#e0e0e0" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Aleta cola -->
    <path d="M5,46 Q-8,38 5,28 L12,38 Z" fill="#1a1a1a"/>
    <path d="M5,58 Q-8,66 5,76 L12,66 Z" fill="#1a1a1a"/>
    <!-- Aleta pectoral -->
    <path d="M30,66 Q20,75 16,68 L24,62 Z" fill="#222"/>
  </svg>`;
}

function aparecerAnimal() {
  const nv   = NIVELES[estado.nivel];
  const disp = nv.animalesDisp;

  /* 40% de probabilidad de aparecer el pez diablo */
  if (Math.random() < .40) {
    const idxDiablo = ANIMALES.findIndex(a => a.esBonus);
    crearObjeto(ANIMALES[idxDiablo], false);
    /* Reemplazar emoji con SVG del pez diablo */
    setTimeout(() => {
      const obj = estado.objetos[estado.objetos.length - 1];
      if (!obj) return;
      const span = obj.el.querySelector('.c-em');
      if (span) {
        span.style.fontSize = '';
        span.innerHTML = svgPezDiablo(parseInt(span.style.fontSize) || ANIMALES.find(a=>a.esBonus).s * 1.5);
      }
      obj.el.style.filter = 'drop-shadow(0 0 8px rgba(255,255,0,.7))';
    }, 30);
    return;
  }

  /* Rellenar y barajar la cola cuando se vacíe (solo animales normales) */
  if (colaAnimales.length === 0) {
    colaAnimales = [...disp].sort(() => Math.random() - .5);
  }
  const idx = colaAnimales.pop();
  crearObjeto(ANIMALES[idx], false);
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

  /* Pez diablo da el doble de puntos */
  const multiplicador = obj.datos.esBonus ? 2 : 1;
  const pts = 10 * (estado.nivel + 1) * multiplicador;
  estado.puntuacion += pts;

  $('val-puntos').textContent   = estado.puntuacion;
  $('val-animales').textContent = estado.animalesSalvados;
  flotarPuntos(cx - area.left, cy - area.top,
    obj.datos.esBonus ? `🔥 +${pts}` : `+${pts}`,
    obj.datos.esBonus ? 'pts-diablo' : 'pts-animal');
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
  estado.erroresNivel++;
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
    setTimeout(() => { detenerVoz(); $('go-pts').textContent = estado.puntuacion; mostrarPantalla('s-go'); }, 700);
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
    setTimeout(() => { detenerVoz(); $('go-pts').textContent = estado.puntuacion; mostrarPantalla('s-go'); }, 700);
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
  if (estado.rescatados >= NIVELES[estado.nivel].rescates) {
    setTimeout(() => {
      if (!estado.activo) return;
      /* Último nivel → victoria directa, sin pantalla de historia */
      if (estado.nivel >= NIVELES.length - 1) {
        detenerTodo(); detenerAmbiente(); detenerVoz();
        mostrarVictoria();
      } else {
        nivelCompleto();
      }
    }, 420);
  }
}


/* ============================================================
   NIVEL COMPLETO Y VICTORIA
   ============================================================ */
function nivelCompleto() {
  detenerTodo(); detenerAmbiente(); detenerVoz(); sndNivel();

  /* Calcular y acumular estrellas */
  const estrellas = calcularEstrellas(estado.erroresNivel);
  estado.estrellasTotal += estrellas;

  $('lu-pts').textContent = estado.puntuacion;
  mostrarEstrellas('lu-estrellas', estrellas, .4);
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

  /* Estrellas del último nivel */
  const estrellas = calcularEstrellas(estado.erroresNivel);
  estado.estrellasTotal += estrellas;

  /* Título según estrellas totales */
  const titulo = calcularTitulo(estado.estrellasTotal);

  /* Guardar récord */
  const esNuevo = guardarRecord(estado.puntuacion, estado.estrellasTotal, titulo.texto);

  $('win-pts').textContent = estado.puntuacion;

  /* Título del jugador */
  $('win-titulo-jugador').innerHTML =
    `<span class="titulo-emoji">${titulo.emoji}</span>${titulo.texto}`;

  /* Estrellas totales */
  mostrarEstrellas('win-estrellas-total', Math.min(estado.estrellasTotal, 3), .3);

  /* Mensaje de récord */
  const recEl = $('win-record');
  if (esNuevo && estado.puntuacion > 0) {
    recEl.className = 'win-record nuevo-record';
    recEl.textContent = '🎉 ¡Nuevo récord personal!';
  } else {
    const prev = cargarRecord();
    recEl.className = 'win-record';
    recEl.textContent = prev.puntos > 0
      ? `Récord anterior: ${prev.puntos} pts — ${'⭐'.repeat(prev.estrellas)}`
      : '';
  }

  mostrarPantalla('s-win');
  lanzarConfeti();
  setTimeout(() => reproducirAudio(AUDIO_NIVELES[AUDIO_NIVELES.length - 1]), 1000);
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



/* ── SONIDOS NATURALES — archivos MP3 reales ── */

const AUDIO_ANIMALES = {
  gaviota: 'audio/animales/gaviota.mp3',
  delfin:  'audio/animales/delfin.mp3',
  ballena: 'audio/animales/ballena.mp3',
  foca:    'audio/animales/foca.mp3',
};

function reproducirAnimal(tipo) {
  if (silenciado) return;
  const ruta = AUDIO_ANIMALES[tipo];
  if (!ruta) return;
  const a = new Audio(ruta);
  a.volume = tipo === 'ballena' ? 0.75 : 0.85;
  a.play().catch(() => {});
}

function sndGaviota()  { reproducirAnimal('gaviota'); }
function sndDelfin()   { reproducirAnimal('delfin');  }
function sndBallena()  { reproducirAnimal('ballena'); }

/* Lanza un salto de delfín o ballena desde una zona de agua */
/* Splash al caer una criatura al agua */
function sndSplashGrande(esGrande) {
  if (silenciado) return;
  const ctx = audio();
  const factor = esGrande ? 1.8 : 1.0;
  /* Impacto grave */
  [0, .05, .1].forEach((del, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime((320 - i*60) * (esGrande ? .6 : 1), ctx.currentTime + del);
    o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + del + .35);
    g.gain.setValueAtTime((.38 - i*.06) * factor, ctx.currentTime + del);
    g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + del + .42);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + del); o.stop(ctx.currentTime + del + .45);
  });
  /* Lluvia de gotas — ruido blanco filtrado */
  const dur = esGrande ? .9 : .5;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d   = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    const env = i < d.length * .1
      ? i / (d.length * .1)
      : Math.pow(1 - (i - d.length * .1) / (d.length * .9), 1.4);
    d[i] = (Math.random() * 2 - 1) * env;
  }
  const ns = ctx.createBufferSource(); ns.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
  bp.frequency.value = 1800; bp.Q.value = .6;
  const ng = ctx.createGain(); ng.gain.value = .28 * factor;
  ns.connect(bp); bp.connect(ng); ng.connect(ctx.destination); ns.start();
}

/* Crea el efecto visual de salpicadura grande en una posición del área de juego */
/* ============================================================
   SPLASH — Web Animations API (sin CSS variables, sin fallos)
   z-index:200 garantiza que esté por encima de todo
   ============================================================ */
function salpicaduraGrande(x, y, cantidad, esGigante) {
  const area    = $('area-juego');
  const EMOJIS  = ['💧','💦','💧','💦','💧'];
  const tamBase = esGigante ? 26 : 18;
  const distMax = esGigante ? 110 : 70;
  const dur     = esGigante ? 1000 : 720;

  /* ── Gotas en abanico, solo hacia arriba y lados ── */
  for (let i = 0; i < cantidad; i++) {
    /* Ángulos: semicírculo superior, de -175° a -5° */
    const angDeg = -175 + (i / Math.max(cantidad - 1, 1)) * 170
                        + (Math.random() - .5) * 20;
    const ang = angDeg * Math.PI / 180;
    const dist = (distMax * .5) + Math.random() * distMax;
    const tx   = Math.cos(ang) * dist;
    const ty   = Math.sin(ang) * dist;   /* negativo = sube */
    const tam  = tamBase + Math.random() * tamBase * .5;

    const el = document.createElement('div');
    el.textContent = EMOJIS[i % EMOJIS.length];
    el.style.cssText = `
      position:absolute;
      left:${x - tam / 2}px;
      top:${y - tam / 2}px;
      font-size:${tam}px;
      pointer-events:none;
      z-index:200;
    `;
    area.appendChild(el);

    el.animate(
      [
        { opacity: 1, transform: 'translate(0,0) scale(1)' },
        { opacity: 0, transform: `translate(${tx}px,${ty}px) scale(0.25)` }
      ],
      { duration: dur + Math.random() * 300, delay: i * 28,
        easing: 'ease-out', fill: 'forwards' }
    );
    setTimeout(() => el.remove(), dur + i * 28 + 500);
  }

  /* ── Columna central: 3 gotas que suben en línea ── */
  for (let j = 0; j < 3; j++) {
    const el2 = document.createElement('div');
    el2.textContent = '💦';
    el2.style.cssText = `
      position:absolute;
      left:${x + (j - 1) * 14 - 10}px;
      top:${y - 10}px;
      font-size:${(esGigante ? 28 : 18) - j * 3}px;
      pointer-events:none;
      z-index:200;
    `;
    area.appendChild(el2);
    el2.animate(
      [
        { opacity: 1, transform: 'translate(0,0) scale(1)' },
        { opacity: 0, transform: `translate(${(j-1)*10}px,${-(esGigante ? 90 : 55) - j*20}px) scale(0.2)` }
      ],
      { duration: dur + j * 80, delay: j * 40,
        easing: 'ease-out', fill: 'forwards' }
    );
    setTimeout(() => el2.remove(), dur + j * 80 + 400);
  }

  /* ── Aro de agua expansivo (div circular que se expande) ── */
  const ring = document.createElement('div');
  const ringSize = esGigante ? 80 : 50;
  ring.style.cssText = `
    position:absolute;
    left:${x - ringSize/2}px;
    top:${y - ringSize/2}px;
    width:${ringSize}px;
    height:${ringSize}px;
    border-radius:50%;
    border:${esGigante ? 4 : 2.5}px solid rgba(100,200,255,.85);
    pointer-events:none;
    z-index:199;
  `;
  area.appendChild(ring);
  ring.animate(
    [
      { opacity: .9, transform: 'scale(0.2)' },
      { opacity: 0,  transform: `scale(${esGigante ? 3.2 : 2.5})` }
    ],
    { duration: esGigante ? 900 : 650, easing: 'ease-out', fill: 'forwards' }
  );
  setTimeout(() => ring.remove(), 1000);

  /* ── Splash emoji central grande ── */
  const sp = document.createElement('div');
  sp.textContent = esGigante ? '🌊' : '💦';
  sp.style.cssText = `
    position:absolute;
    left:${x - (esGigante ? 30 : 18)}px;
    top:${y  - (esGigante ? 30 : 18)}px;
    font-size:${esGigante ? 3.5 : 2.2}em;
    pointer-events:none;
    z-index:200;
  `;
  area.appendChild(sp);
  sp.animate(
    [
      { opacity: 1, transform: 'scale(0.4) translateY(0)' },
      { opacity: 1, transform: `scale(1.6) translateY(-${esGigante ? 14 : 8}px)` },
      { opacity: 0, transform: `scale(0.9) translateY(-${esGigante ? 24 : 14}px)` }
    ],
    { duration: esGigante ? 750 : 550, easing: 'ease-out', fill: 'forwards' }
  );
  setTimeout(() => sp.remove(), 900);
}


/* ── GAVIOTAS — vuelan de vez en cuando con su sonido ── */

let timerGaviota = null;

function lanzarGaviota() {
  if (!estado.activo) return;
  const { H, W } = obtenerZonas();
  const vaALaDerecha = Math.random() > .5;

  /* Contenedor que solo hace el flip — NO anima */
  const contenedor = document.createElement('div');
  contenedor.style.cssText = `
    position:absolute; top:${H * .05 + Math.random() * H * .28}px;
    ${vaALaDerecha ? 'left:-40px' : 'right:-40px'};
    font-size:${18 + Math.random() * 10}px;
    z-index:35; pointer-events:none;
    transform: scaleX(${vaALaDerecha ? -1 : 1});
  `;

  /* Elemento interior que solo anima el movimiento horizontal */
  const el = document.createElement('div');
  el.textContent = '🕊️';
  el.style.cssText = `
    display:inline-block;
    --dir:${vaALaDerecha ? W + 60 : -(W + 60)}px;
  `;
  el.className = 'gaviota';
  const dur = 3.5 + Math.random() * 2;
  el.style.animationDuration = dur + 's';
  contenedor.appendChild(el);
  $('area-juego').appendChild(contenedor);
  /* Reproducir el graznido y cortarlo cuando la gaviota desaparezca */
  if (!silenciado) {
    const a1 = new Audio('audio/animales/gaviota.mp3');
    a1.volume = 0.75;
    a1.play().catch(() => {});
    const t2 = setTimeout(() => {
      if (!silenciado) {
        const a2 = new Audio('audio/animales/gaviota.mp3');
        a2.volume = 0.6;
        a2.play().catch(() => {});
        setTimeout(() => { a2.pause(); a2.currentTime = 0; }, (dur - 1.2) * 1000);
      }
    }, 1200);
    setTimeout(() => { a1.pause(); a1.currentTime = 0; clearTimeout(t2); }, dur * 1000);
  }

  setTimeout(() => contenedor.remove(), (dur + .5) * 1000);
}

function iniciarGaviotas() {
  clearTimeout(timerGaviota);
  function programar() {
    timerGaviota = setTimeout(() => {
      if (!estado.activo) return;
      /* Lanzar 3 gaviotas con pequeño desfase entre ellas */
      lanzarGaviota();
      setTimeout(() => { if (estado.activo) lanzarGaviota(); }, 800);
      setTimeout(() => { if (estado.activo) lanzarGaviota(); }, 1700);
      programar();
    }, 12000 + Math.random() * 13000);
  }
  programar();
}

function detenerGaviotas() {
  clearTimeout(timerGaviota);
  $('area-juego').querySelectorAll('.gaviota').forEach(e => e.remove());
}


function saltoCriatura(tipo) {
  if (!estado.activo) return;
  const { wl, wr, W, H } = obtenerZonas();

  const esBalena = tipo === 'ballena';
  const emoji    = esBalena ? '🐋' : '🐬';
  const tamano   = 52; /* delfín: 52px */
  const enIzq    = Math.random() > .5;

  /* Centro X dentro de la zona de agua — bien adentro */
  const zonaAncho = wl;
  const xBase  = enIzq
    ? zonaAncho * .25
    : wr + zonaAncho * .25;
  const xGotas = enIzq
    ? zonaAncho * .5
    : wr + zonaAncho * .5;

  /* Y de inicio: cerca del fondo pero DENTRO del área (overflow:hidden) */
  const yInicio = H - tamano - 4;

  if (esBalena) {
    /* ── BALLENA: salto majestuoso, emerge y cae con gran splash ── */
    const tamBallena = Math.min(100, Math.floor(Math.max(W, H) * .12));
    const altSaltoBallena = Math.floor(H * (.30 + Math.random() * .12));
    const yInicioB = H - tamBallena - 6;

    const elB = document.createElement('div');
    elB.style.cssText = `
      position:absolute;
      left:${xBase - tamBallena/2}px;
      top:${yInicioB}px;
      font-size:${tamBallena}px;
      z-index:36; pointer-events:none;
      --alto:${altSaltoBallena}px;
      animation: delfin-salto 2.4s cubic-bezier(.28,.05,.72,.95) forwards;
    `;
    elB.textContent = emoji;
    $('area-juego').appendChild(elB);
    sndBallena();
    /* Splash al salir — grande */
    salpicaduraGrande(xGotas, yInicioB + 10, 18, true);
    sndSplashGrande(true);
    /* Splash al volver — espectacular */
    setTimeout(() => {
      salpicaduraGrande(xGotas,      yInicioB + 10, 24, true);
      salpicaduraGrande(xGotas - 28, yInicioB + 18,  8, false);
      salpicaduraGrande(xGotas + 28, yInicioB + 18,  8, false);
      sndSplashGrande(true);
    }, 2100);
    setTimeout(() => elB.remove(), 3000);

  } else {
    /* ── DELFÍN: arco de salto bien visible ── */
    const altSalto = Math.floor(H * (.40 + Math.random() * .15));
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;
      left:${xBase - tamano/2}px;
      top:${yInicio}px;
      font-size:${tamano}px;
      z-index:36; pointer-events:none;
      --alto:${altSalto}px;
      animation: delfin-salto 1.8s cubic-bezier(.3,.05,.7,.95) forwards;
    `;
    el.textContent = emoji;
    $('area-juego').appendChild(el);
    salpicaduraGrande(xGotas, yInicio + 10, 12, false);
    sndSplashGrande(false);
    sndDelfin();
    /* Splash al volver */
    setTimeout(() => {
      salpicaduraGrande(xGotas, yInicio + 10, 16, false);
      sndSplashGrande(false);
    }, 1550);
    setTimeout(() => el.remove(), 2200);
  }
}

let timerSaltoCriatura = null;

function iniciarSaltosCriatura() {
  clearTimeout(timerSaltoCriatura);
  function programar() {
    timerSaltoCriatura = setTimeout(() => {
      if (!estado.activo) return;
      /* Ballena desde nivel 4, delfín en los anteriores */
      const tipo = (estado.nivel >= 3 && Math.random() > .5) ? 'ballena' : 'delfin';
      saltoCriatura(tipo);
      programar();
    }, 10000 + Math.random() * 10000);
  }
  programar();
}

function detenerSaltosCriatura() {
  clearTimeout(timerSaltoCriatura);
}


/* ============================================================
   MEDUSAS — suben del fondo cambiando de color con burbujas
   ============================================================ */

const COLORES_MEDUSA = [
  ['rgba(255,100,200,.85)', 'rgba(255,50,150,.6)'],
  ['rgba(100,180,255,.85)', 'rgba(50,120,255,.6)'],
  ['rgba(140,255,180,.85)', 'rgba(60,200,100,.6)'],
  ['rgba(220,140,255,.85)', 'rgba(160,60,220,.6)'],
  ['rgba(255,200,80,.85)',  'rgba(220,140,20,.6)'],
];

function sndBurbujeo() {
  if (silenciado) return;
  const ctx = audio();
  for (let i = 0; i < 6; i++) {
    const del = i * .18 + Math.random() * .08;
    setTimeout(() => {
      if (silenciado) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      const f = 300 + i * 80 + Math.random() * 60;
      o.frequency.setValueAtTime(f, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(f * 1.8, ctx.currentTime + .08);
      g.gain.setValueAtTime(.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .1);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + .12);
    }, del * 1000);
  }
}

function lanzarMedusa() {
  if (!estado.activo) return;
  const { wl, wr, H } = obtenerZonas();
  const enIzq = Math.random() > .5;
  const zonaW = wl;
  const xPos  = enIzq
    ? zonaW * (.15 + Math.random() * .6)
    : wr + zonaW * (.15 + Math.random() * .6);
  const tam = 48 + Math.random() * 22;
  const durSubida = 5500 + Math.random() * 4000;
  let colActual = Math.floor(Math.random() * COLORES_MEDUSA.length);
  const svgW = tam, svgH = tam * 1.5;
  const uid  = Date.now();

  const wrap = document.createElement('div');
  wrap.style.cssText = `position:absolute;left:${xPos-tam/2}px;top:${H}px;`
    + `width:${svgW}px;height:${svgH}px;pointer-events:none;z-index:13;`;

  function buildSVG(ci) {
    return `<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jg${uid}" cx="50%" cy="40%" r="55%">
          <stop offset="0%"   stop-color="${COLORES_MEDUSA[ci][0]}"/>
          <stop offset="100%" stop-color="${COLORES_MEDUSA[ci][1]}"/>
        </radialGradient>
      </defs>
      <ellipse cx="${svgW/2}" cy="${svgW*.38}" rx="${svgW*.46}" ry="${svgW*.36}"
               fill="url(#jg${uid})" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <ellipse cx="${svgW/2}" cy="${svgW*.3}"  rx="${svgW*.26}" ry="${svgW*.16}"
               fill="rgba(255,255,255,.18)"/>
      ${[.22,.38,.52,.68,.78].map((fx, idx) => {
        const dur = (.9 + idx*.12).toFixed(2);
        const amp = (6 + idx*2);
        return `<line x1="${svgW*fx}" y1="${svgW*.7}" x2="${svgW*(fx+(idx%2?.06:-.06))}" y2="${svgH*.97}"
          stroke="${COLORES_MEDUSA[ci][0]}" stroke-width="${1.5+idx*.2}" stroke-linecap="round" opacity=".85">
          <animateTransform attributeName="transform" type="rotate"
            values="0 ${svgW*fx} ${svgW*.7};${amp} ${svgW*fx} ${svgW*.7};-${amp} ${svgW*fx} ${svgW*.7};0 ${svgW*fx} ${svgW*.7}"
            dur="${dur}s" repeatCount="indefinite"/>
        </line>`;
      }).join('')}
    </svg>`;
  }
  wrap.innerHTML = buildSVG(colActual);
  $('area-juego').appendChild(wrap);

  const pasos = 130;
  let paso = 0;
  const intervalo = durSubida / pasos;
  const animId = setInterval(() => {
    if (!estado.activo || !wrap.parentNode) { clearInterval(animId); wrap.remove(); return; }
    paso++;
    const prog = paso / pasos;
    const y    = H - prog * (H + svgH + 20);
    const xOnd = xPos - tam/2 + Math.sin(prog * Math.PI * 7) * 14;
    const pulso = 1 + Math.sin(prog * Math.PI * 16) * .07;
    wrap.style.top       = y + 'px';
    wrap.style.left      = xOnd + 'px';
    wrap.style.transform = `scaleY(${pulso})`;
    /* Cambiar color cada ~20 pasos */
    if (paso % 20 === 0) {
      colActual = (colActual + 1) % COLORES_MEDUSA.length;
      wrap.innerHTML = buildSVG(colActual);
    }
    /* Burbujas con sonido */
    if (paso % 16 === 0) {
      sndBurbujeo();
      for (let b = 0; b < 4; b++) {
        const bel = document.createElement('div');
        const bsz = 5 + Math.random() * 8;
        bel.style.cssText = `position:absolute;`
          + `left:${xOnd + Math.random() * svgW}px;`
          + `top:${y + svgH * .5}px;`
          + `width:${bsz}px;height:${bsz}px;border-radius:50%;`
          + `background:rgba(255,255,255,.18);`
          + `border:1px solid rgba(255,255,255,.38);`
          + `pointer-events:none;z-index:17;`;
        $('area-juego').appendChild(bel);
        bel.animate(
          [{opacity:.75,transform:'translate(0,0) scale(1)'},
           {opacity:0, transform:`translate(${(Math.random()-.5)*22}px,${-(35+Math.random()*35)}px) scale(.25)`}],
          {duration:1100+Math.random()*500, easing:'ease-out', fill:'forwards'}
        );
        setTimeout(() => bel.remove(), 1700);
      }
    }
    if (paso >= pasos) { clearInterval(animId); wrap.remove(); }
  }, intervalo);
}

let timerMedusa = null;
function iniciarMedusas() {
  clearTimeout(timerMedusa);
  function prog() {
    timerMedusa = setTimeout(() => { if (estado.activo) { lanzarMedusa(); prog(); } },
      7000 + Math.random() * 9000);
  }
  prog();
}
function detenerMedusas() { clearTimeout(timerMedusa); }


/* ============================================================
   CAJAS DE TESORO — bonus, no bloquean el juego
   ============================================================ */

let timerTesoro = null;
const BONUS_TESORO = [50, 75, 100];

function sndTesoro() {
  if (silenciado) return;
  const ctx = audio();
  [523, 659, 784, 1047].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    const t = ctx.currentTime + i * .08;
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.28,t+.04);
    g.gain.exponentialRampToValueAtTime(.001,t+.28);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+.3);
  });
}

function spawnTesoro() {
  if (!estado.activo) return;
  const z   = obtenerZonas();
  const x   = z.wl + 20 + Math.random() * (z.anchoArena - 54);
  const y   = z.H * .15 + Math.random() * (z.H * .62);
  const pts = BONUS_TESORO[Math.floor(Math.random() * BONUS_TESORO.length)];

  const el = document.createElement('div');
  el.className = 'tesoro';
  el.innerHTML = `<span class="tesoro-ico">🦪</span><span class="tesoro-pts">+${pts} 🫧</span>`;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;z-index:19;cursor:pointer;`
    + `display:flex;flex-direction:column;align-items:center;gap:2px;`;
  $('area-juego').appendChild(el);

  /* Auto-desaparece a los 8s */
  const autoTimer = setTimeout(() => {
    if (!el.parentNode) return;
    el.animate([{opacity:1},{opacity:0}],{duration:380,fill:'forwards'});
    setTimeout(() => el.remove(), 380);
  }, 8000);

  /* Toque del jugador */
  el.addEventListener('pointerdown', e => {
    e.stopPropagation();
    clearTimeout(autoTimer);
    sndTesoro();
    estado.puntuacion += pts;
    $('val-puntos').textContent = estado.puntuacion;
    const pf = document.createElement('div');
    pf.className = 'pts-flotantes pts-tesoro';
    pf.textContent = `+${pts} 🫧`;
    pf.style.cssText = `left:${x}px;top:${y-10}px;`;
    $('area-juego').appendChild(pf);
    setTimeout(() => pf.remove(), 1300);
    el.animate(
      [{transform:'scale(1)',opacity:1},{transform:'scale(2.4)',opacity:0}],
      {duration:320,easing:'ease-out',fill:'forwards'}
    );
    setTimeout(() => el.remove(), 330);
  }, {once:true});

  programarTesoro();
}

function programarTesoro() {
  clearTimeout(timerTesoro);
  timerTesoro = setTimeout(() => { if (estado.activo) spawnTesoro(); },
    8000 + Math.random() * 10000);
}

function iniciarTesoros() { programarTesoro(); }
function detenerTesoros() {
  clearTimeout(timerTesoro);
  $('area-juego').querySelectorAll('.tesoro,.ostra-vida').forEach(e => e.remove());
}


/* ============================================================
   OSTRA DE VIDA — aparece en la arena y regala una vida extra
   ============================================================ */

let timerOstraVida = null;

function sndVidaExtra() {
  if (silenciado) return;
  const ctx = audio();
  /* Melodía ascendente brillante — ¡premio! */
  [440, 554, 659, 880, 1047].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    const t = ctx.currentTime + i * .1;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.3, t + .04);
    g.gain.exponentialRampToValueAtTime(.001, t + .35);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + .38);
  });
}

function spawnOstraVida() {
  if (!estado.activo) return;
  /* Solo aparece si el jugador tiene menos de 3 vidas */
  if (estado.vidas >= 3) { programarOstraVida(); return; }

  const z = obtenerZonas();
  const x = z.wl + 20 + Math.random() * (z.anchoArena - 54);
  const y = z.H * .15 + Math.random() * (z.H * .62);

  const el = document.createElement('div');
  el.className = 'ostra-vida';
  el.innerHTML = `<span class="ostra-ico">🦪</span><span class="ostra-lbl">❤️</span>`;
  el.style.cssText = `
    position:absolute; left:${x}px; top:${y}px;
    z-index:19; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:2px;
    animation: ostra-pulso 1s ease-in-out infinite;
  `;
  $('area-juego').appendChild(el);

  /* Auto-desaparece a los 6 segundos */
  const autoTimer = setTimeout(() => {
    if (!el.parentNode) return;
    el.animate([{opacity:1},{opacity:0}], {duration:380, fill:'forwards'});
    setTimeout(() => el.remove(), 380);
  }, 6000);

  el.addEventListener('pointerdown', e => {
    e.stopPropagation();
    clearTimeout(autoTimer);
    sndVidaExtra();
    estado.vidas = Math.min(estado.vidas + 1, 3);
    $('val-vidas').textContent = '❤️'.repeat(estado.vidas);
    /* Efecto visual */
    const pf = document.createElement('div');
    pf.className = 'pts-flotantes';
    pf.textContent = '❤️ +1 vida';
    pf.style.cssText = `left:${x}px; top:${y - 10}px; color:#ff6b8a;`;
    $('area-juego').appendChild(pf);
    setTimeout(() => pf.remove(), 1400);
    el.animate(
      [{transform:'scale(1)', opacity:1},
       {transform:'scale(2.4)', opacity:0}],
      {duration:340, easing:'ease-out', fill:'forwards'}
    );
    setTimeout(() => el.remove(), 350);
  }, {once: true});

  programarOstraVida();
}

function programarOstraVida() {
  clearTimeout(timerOstraVida);
  /* Aparece cada 20-35 segundos */
  timerOstraVida = setTimeout(() => {
    if (estado.activo) spawnOstraVida();
  }, 20000 + Math.random() * 15000);
}

function iniciarOstrasVida()  { programarOstraVida(); }
function detenerOstrasVida() {
  clearTimeout(timerOstraVida);
  $('area-juego').querySelectorAll('.ostra-vida').forEach(e => e.remove());
}


/* ============================================================
   BANCO DE PECES + FOCA
   El banco nada en formación. Desde el nivel 3, la foca
   aparece, los peces se dispersan y suena foca.mp3
   ============================================================ */

let timerBancoPeces  = null;
let timerFoca        = null;
let audioFoca        = null; /* referencia para parar el sonido al cambiar nivel */
const bancosActivos  = []; /* referencia a los grupos de peces en pantalla */

function crearBancoPeces(zonaId, offsetX, anchoZ, H) {
  /* Formación en V: pez líder + dos filas detrás */
  const FORMACION = [
    {dx: 0,   dy: 0},
    {dx:-16,  dy:12}, {dx: 16,  dy:12},
    {dx:-30,  dy:24}, {dx: 30,  dy:24},
    {dx:-14,  dy:28}, {dx: 14,  dy:28},
    {dx: 0,   dy:32},
  ];
  const yPos       = H * .18 + Math.random() * H * .55;
  const vaADerecha = Math.random() > .5;
  const dur        = 7 + Math.random() * 5; /* segundos para cruzar la zona */
  const tam        = 12 + Math.random() * 5;

  const grupo = document.createElement('div');
  grupo.className = 'banco-peces';
  grupo.style.cssText = `
    position:absolute;
    top:${yPos}px;
    left:${vaADerecha ? offsetX - 60 : offsetX + anchoZ + 20}px;
    pointer-events:none; z-index:12;
    width:80px; height:60px;
  `;

  FORMACION.forEach(({dx, dy}) => {
    const pez = document.createElement('span');
    pez.textContent = '🐟';
    /* 🐟 mira a la izquierda por defecto.
       --sx se usa en la animación pez-oscila para mantener la dirección. */
    pez.style.cssText = `
      position:absolute;
      left:${vaADerecha ? dx + 30 : 50 - dx}px;
      top:${dy}px;
      font-size:${tam}px;
      display:inline-block;
      --sx:${vaADerecha ? -1 : 1};
    `;
    grupo.appendChild(pez);
  });

  $('area-juego').appendChild(grupo);

  /* Animación de cruce */
  const distancia = anchoZ + 140;
  const dx        = vaADerecha ? distancia : -distancia;
  grupo.animate(
    [{ transform:'translateX(0)' }, { transform:`translateX(${dx}px)` }],
    { duration: dur * 1000, easing:'linear', fill:'forwards' }
  );

  const ref = { el: grupo, y: yPos, x: offsetX + anchoZ / 2, dispersado: false };
  bancosActivos.push(ref);
  setTimeout(() => {
    grupo.remove();
    const idx = bancosActivos.indexOf(ref);
    if (idx !== -1) bancosActivos.splice(idx, 1);
  }, dur * 1000 + 200);
}

function dispersarBanco(banco) {
  if (banco.dispersado) return;
  banco.dispersado = true;
  const peces = banco.el.querySelectorAll('span');
  peces.forEach((pez, i) => {
    const angulo = (i / peces.length) * Math.PI * 2;
    const dist   = 40 + Math.random() * 60;
    pez.animate(
      [
        { opacity:1, transform:`scaleX(${pez.style.transform.includes('-1') ? -1 : 1})` },
        { opacity:0, transform:`translate(${Math.cos(angulo)*dist}px, ${Math.sin(angulo)*dist}px) scale(.3)` }
      ],
      { duration: 600 + Math.random()*300, easing:'ease-out', fill:'forwards' }
    );
  });
  setTimeout(() => {
    banco.el.remove();
    const idx = bancosActivos.indexOf(banco);
    if (idx !== -1) bancosActivos.splice(idx, 1);
  }, 1000);
}

function lanzarFoca() {
  if (!estado.activo || estado.nivel < 2) return;
  const { wl, wr, H } = obtenerZonas();

  /* Zona aleatoria — izquierda o derecha */
  const enIzq  = Math.random() > .5;
  const zonaW  = wl;
  /* X dentro de la zona de agua */
  const xFoca  = enIzq
    ? zonaW  * (.15 + Math.random() * .65)
    : wr + zonaW * (.15 + Math.random() * .65);

  const tamFoca = 52;
  const durSeg  = 5 + Math.random() * 3; /* segundos subiendo */

  const el = document.createElement('div');
  el.style.cssText = `
    position:absolute;
    left:${xFoca - tamFoca / 2}px;
    top:${H}px;
    font-size:${tamFoca}px;
    z-index:22; pointer-events:none;
  `;
  el.textContent = '🦭';
  $('area-juego').appendChild(el);

  /* Animar de abajo a arriba, ondulando levemente */
  const totalSubida = H + tamFoca + 20;
  el.animate(
    [
      { transform: 'translateY(0px)    translateX(0px)' },
      { transform: `translateY(${-totalSubida * .33}px) translateX(8px)`  },
      { transform: `translateY(${-totalSubida * .66}px) translateX(-8px)` },
      { transform: `translateY(${-totalSubida}px)       translateX(0px)`  },
    ],
    { duration: durSeg * 1000, easing: 'ease-in-out', fill: 'forwards' }
  );

  /* Sonido cuando lleva ~1s subiendo */
  setTimeout(() => {
    if (!silenciado) {
      const a = new Audio('audio/animales/foca.mp3');
      audioFoca = a;
      a.volume = 0.85;
      a.play().catch(() => {});
      setTimeout(() => { if (audioFoca === a) { a.pause(); a.currentTime = 0; audioFoca = null; } }, (durSeg - 1) * 1000);
    }
  }, 1000);

  /* Cada 200ms comprobar si pasa cerca de un banco de peces */
  const checkId = setInterval(() => {
    if (!estado.activo) { clearInterval(checkId); return; }
    const fr  = el.getBoundingClientRect();
    const fcx = fr.left + fr.width  / 2;
    const fcy = fr.top  + fr.height / 2;
    bancosActivos.forEach(banco => {
      if (banco.dispersado) return;
      const br  = banco.el.getBoundingClientRect();
      const bcx = br.left + br.width  / 2;
      const bcy = br.top  + br.height / 2;
      if (Math.hypot(fcx - bcx, fcy - bcy) < 110) dispersarBanco(banco);
    });
  }, 200);

  setTimeout(() => { clearInterval(checkId); el.remove(); }, (durSeg + .5) * 1000);
}

function iniciarBancosYFoca() {
  /* Bancos de peces: aparecen cada 8-14s */
  clearTimeout(timerBancoPeces);
  function programarBanco() {
    timerBancoPeces = setTimeout(() => {
      if (!estado.activo) return;
      const { wl, wr, H } = obtenerZonas();
      /* Crear en zona izquierda o derecha */
      const enIzq = Math.random() > .5;
      crearBancoPeces(
        enIzq ? 'zona-agua-izq' : 'zona-agua-der',
        enIzq ? 0 : wr,
        wl, H
      );
      programarBanco();
    }, 8000 + Math.random() * 6000);
  }
  programarBanco();

  /* Foca: solo desde nivel 3, cada 18-30s */
  clearTimeout(timerFoca);
  if (estado.nivel >= 2) {
    function programarFoca() {
      timerFoca = setTimeout(() => {
        if (!estado.activo) return;
        lanzarFoca();
        programarFoca();
      }, 18000 + Math.random() * 12000);
    }
    programarFoca();
  }
}

/* Caballito de mar: SVG vertical que sube del fondo */
function svgCaballitoMar(px) {
  const w = Math.round(px * .6), h = px;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- cola enroscada -->
    <path d="M${w*.5},${h*.98} Q${w*.85},${h*.9} ${w*.8},${h*.75} Q${w*.75},${h*.6} ${w*.5},${h*.62}"
          fill="none" stroke="#c06030" stroke-width="${w*.14}" stroke-linecap="round"/>
    <!-- cuerpo -->
    <ellipse cx="${w*.45}" cy="${h*.52}" rx="${w*.28}" ry="${h*.2}" fill="#e08040"/>
    <!-- pecho -->
    <ellipse cx="${w*.38}" cy="${h*.44}" rx="${w*.22}" ry="${h*.14}" fill="#e89050"/>
    <!-- cuello -->
    <rect x="${w*.3}" y="${h*.28}" width="${w*.25}" height="${h*.18}" rx="${w*.1}" fill="#e08040"/>
    <!-- cabeza -->
    <ellipse cx="${w*.35}" cy="${h*.22}" rx="${w*.22}" ry="${h*.15}" fill="#e08040"/>
    <!-- hocico largo -->
    <path d="M${w*.15},${h*.22} L${w*.04},${h*.18}" stroke="#c06030" stroke-width="${w*.1}" stroke-linecap="round"/>
    <!-- ojo -->
    <circle cx="${w*.27}" cy="${h*.19}" r="${w*.07}" fill="#fff"/>
    <circle cx="${w*.27}" cy="${h*.19}" r="${w*.04}" fill="#1a1a2e"/>
    <!-- cresta dorsal -->
    <path d="M${w*.55},${h*.3} Q${w*.72},${h*.22} ${w*.68},${h*.45} Q${w*.62},${h*.55} ${w*.55},${h*.52}"
          fill="#d07030" opacity=".7"/>
    <!-- aleta pectoral -->
    <ellipse cx="${w*.62}" cy="${h*.46}" rx="${w*.14}" ry="${h*.07}" fill="#e89050" opacity=".8"
             transform="rotate(-20,${w*.62},${h*.46})"/>
  </svg>`;
}

function lanzarCaballitoMar() {
  if (!estado.activo) return;
  const { wl, wr, H } = obtenerZonas();

  /* Caballitos solo en zonas de agua */
  const enIzq  = Math.random() > .5;
  const zonaW  = wl;
  const x      = enIzq
    ? 4 + Math.random() * (zonaW - 30)
    : wr + 4 + Math.random() * (zonaW - 30);
  const tam    = 32 + Math.random() * 16;
  const durSeg = 6 + Math.random() * 5;

  const el = document.createElement('div');
  el.style.cssText = `
    position:absolute; left:${x}px; top:${H}px;
    z-index:14; pointer-events:none;
    ${Math.random() > .5 ? 'transform:scaleX(-1)' : ''};
  `;
  el.innerHTML = svgCaballitoMar(tam);
  $('area-juego').appendChild(el);

  el.animate(
    [
      { transform: `${el.style.transform || ''} translateY(0) translateX(0)` },
      { transform: `${el.style.transform || ''} translateY(${-H*.35}px) translateX(${(Math.random()-.5)*20}px)` },
      { transform: `${el.style.transform || ''} translateY(${-H*.7}px)  translateX(${(Math.random()-.5)*20}px)` },
      { transform: `${el.style.transform || ''} translateY(${-(H+tam+10)}px) translateX(0)` },
    ],
    { duration: durSeg * 1000, easing: 'ease-in-out', fill: 'forwards' }
  );

  setTimeout(() => el.remove(), (durSeg + .5) * 1000);
}

let timerCaballito = null;
function iniciarCaballitos() {
  clearTimeout(timerCaballito);
  function programar() {
    timerCaballito = setTimeout(() => {
      if (estado.activo) { lanzarCaballitoMar(); programar(); }
    }, 10000 + Math.random() * 12000);
  }
  programar();
}
function detenerCaballitos() {
  clearTimeout(timerCaballito);
}

function detenerBancosYFoca() {
  clearTimeout(timerBancoPeces);
  clearTimeout(timerFoca);
  if (audioFoca) { audioFoca.pause(); audioFoca.currentTime = 0; audioFoca = null; }
  $('area-juego').querySelectorAll('.banco-peces').forEach(e => e.remove());
  bancosActivos.length = 0;
}


/* ============================================================
   VOZ DE MOISÉS — Archivos MP3 (ElevenLabs)
   Estructura esperada:
     audio/instrucciones/moises-0.mp3 … moises-7.mp3
     audio/niveles/nivel-1.mp3 … nivel-4.mp3
     audio/niveles/nivel-5-victoria.mp3
   La voz usa la misma variable `silenciado` que el resto
   del juego — el botón 🔊 del HUD lo controla todo.
   ============================================================ */

/* Reproduce un archivo MP3. Respeta el botón de silencio global. */
function reproducirAudio(ruta, alTerminar) {
  detenerVoz();
  ultimaRuta = ruta;
  if (silenciado) {
    if (alTerminar) setTimeout(alTerminar, 200);
    return;
  }
  const a = new Audio(ruta);
  audioActual = a;
  a.onended  = () => { audioActual = null; if (alTerminar) alTerminar(); };
  a.onerror  = () => { audioActual = null; if (alTerminar) setTimeout(alTerminar, 200); };
  a.play().catch(() => { audioActual = null; if (alTerminar) setTimeout(alTerminar, 200); });
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

  /* Texto del botón "Anterior" — en el paso 0 muestra "Inicio" */
  $('btn-anterior').textContent = pasoActual === 0 ? '← Inicio' : '◀ Anterior';

  /* Texto del botón Siguiente en el último paso */
  $('btn-paso-sig').textContent =
    indice === PASOS_INSTRUCCION.length - 1 ? '¡Empecemos! 🌊' : 'Siguiente ▶';

  /* Reproducir el MP3 correspondiente */
  detenerVoz();
  reproducirAudio(AUDIO_INSTRUCCIONES[indice]);
}

function iniciarInstrucciones() {
  pasoActual = 0;
  mostrarPantalla('s-instrucciones');
  setTimeout(() => mostrarPasoInstruccion(0), 400);
}

/* Siguiente paso */
$('btn-paso-sig').onclick = () => {
  detenerVoz();
  if (pasoActual < PASOS_INSTRUCCION.length - 1) {
    mostrarPasoInstruccion(pasoActual + 1);
  } else {
    iniciarApertura();
  }
};

/* Paso anterior — en paso 0 vuelve al inicio */
$('btn-anterior').onclick = () => {
  detenerVoz();
  if (pasoActual === 0) {
    mostrarPantalla('s-start');
  } else {
    mostrarPasoInstruccion(pasoActual - 1);
  }
};

/* Repetir instrucción actual */
$('btn-repetir').onclick = () => {
  detenerVoz();
  reproducirAudio(AUDIO_INSTRUCCIONES[pasoActual]);
};

/* Saltar todas las instrucciones */
$('btn-saltar').onclick = () => {
  detenerVoz();
  iniciarApertura();
};


/* ============================================================
   BOTONES Y ARRANQUE
   ============================================================ */
/* ============================================================
   PANTALLA APERTURA — El Mar Rojo se abre
   Secuencia:
     0s   → Voz de Moisés (moises-abre-mar.mp3)
     2.5s → Sonido olas (olas-del-mar.mp3) + mar se abre
     5.5s → Solo Moisés aparece sobre la arena
     8.5s → Instrucciones
   ============================================================ */

function apCriarNadadores(contenedor, wallW, H) {
  const LISTA = [
    { e:'🐠',t:16 },{ e:'🐟',t:14 },{ e:'🐡',t:16 },
    { e:'🦑',t:15 },{ e:'🐬',t:18 },{ e:'🦞',t:13 },
    { e:'🦀',t:13 },{ e:'🦭',t:16 },{ e:'🐠',t:12 },
  ];
  const cantidad = Math.max(6, Math.floor(wallW / 38));

  for (let i = 0; i < cantidad; i++) {
    const n    = LISTA[i % LISTA.length];
    const el   = document.createElement('div');
    el.className = 'ap-nadador';
    const vaADer = Math.random() > .5;
    const y      = H * .05 + Math.random() * H * .88;
    const durMs  = (14 + Math.random() * 14) * 1000;  /* 14-28s — nado suave */
    const delMs  = -(Math.random() * durMs);
    const fs     = Math.round(n.t * Math.min(1.3, wallW / 190));
    const dist   = wallW + fs * 2 + 20;

    el.style.cssText = `top:${y}px; left:0; font-size:${fs}px;`;
    el.textContent   = n.e;

    if (Math.random() > .25) {
      /* 🐟 faces LEFT by default.
         Going RIGHT: scaleX(-1) flips it. With scaleX(-1),
         translateX(+N) moves visually LEFT so we negate. */
      const sx    = vaADer ? -1 : 1;
      const startX = vaADer ?  (fs + 10)       : (wallW + fs + 10);
      const endX   = vaADer ? -(wallW + fs + 10) : -(fs + 10);

      el.animate(
        [
          { transform:`scaleX(${sx}) translateX(${startX}px)`, opacity:0 },
          { transform:`scaleX(${sx}) translateX(${startX}px)`, opacity:1, offset:0.05 },
          { transform:`scaleX(${sx}) translateX(${endX}px)`,   opacity:1, offset:0.90 },
          { transform:`scaleX(${sx}) translateX(${endX}px)`,   opacity:0 },
        ],
        { duration:durMs, delay:delMs, iterations:Infinity, easing:'linear' }
      );
    } else {
      el.classList.add('flota');
      el.style.left = `${fs + Math.random() * (wallW - fs * 2)}px`;
      el.style.setProperty('--dur', `${3 + Math.random() * 3}s`);
      el.style.setProperty('--del', `${delMs/1000}s`);
    }
    contenedor.appendChild(el);
  }

  for (let b = 0; b < 10; b++) {
    const bel = document.createElement('div');
    bel.className = 'ap-burbuja';
    const tam = 3 + Math.random() * 7;
    const dur = 3 + Math.random() * 4;
    bel.style.cssText = `
      left:${Math.random() * wallW}px;
      top:${H * .1 + Math.random() * H * .85}px;
      width:${tam}px; height:${tam}px;
      --dur:${dur}s; --del:${-(Math.random() * dur)}s;
      --dist:${-(50 + Math.random() * 70)}px;
    `;
    contenedor.appendChild(bel);
  }
}

const RECORD_KEY = 'marRojo_record';

function cargarRecord() {
  try { return JSON.parse(localStorage.getItem(RECORD_KEY)) || { puntos:0, estrellas:0, titulo:'' }; }
  catch { return { puntos:0, estrellas:0, titulo:'' }; }
}

function guardarRecord(puntos, estrellas, titulo) {
  const prev = cargarRecord();
  const esNuevo = estrellas > prev.estrellas ||
    (estrellas === prev.estrellas && puntos > prev.puntos);
  if (esNuevo) localStorage.setItem(RECORD_KEY, JSON.stringify({ puntos, estrellas, titulo }));
  return esNuevo;
}

function calcularEstrellas(errores) {
  if (errores === 0) return 3;
  if (errores <= 2)  return 2;
  return 1;
}

function calcularTitulo(totalEstrellas) {
  if (totalEstrellas === 15) return { texto:'¡Campeón del Éxodo!',   emoji:'🏆' };
  if (totalEstrellas >= 11)  return { texto:'Héroe de Israel',        emoji:'⚔️' };
  if (totalEstrellas >= 6)   return { texto:'Guardián del Mar Rojo',  emoji:'🌊' };
  return                            { texto:'Aprendiz del Éxodo',     emoji:'📜' };
}

function mostrarEstrellas(contenedorId, cantidad, delay) {
  const el = $(contenedorId);
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('span');
    s.className = 'estrella-item' + (i < cantidad ? '' : ' vacia');
    s.style.setProperty('--del', `${delay + i * .18}s`);
    s.textContent = '⭐';
    el.appendChild(s);
  }
}

function mostrarRecordInicio() {
  const rec = cargarRecord();
  const el  = $('start-record');
  if (!rec.puntos && !rec.estrellas) { el.classList.add('oculto'); return; }
  el.classList.remove('oculto');
  el.innerHTML = `Mejor: ${'⭐'.repeat(rec.estrellas)} &nbsp;|&nbsp; ${rec.puntos} pts`;
  if (rec.titulo) el.innerHTML += `<br>${rec.titulo}`;
}



function salpicarPantalla(onCubierto) {
  /* Contenedor — cristal empañado: blur fuerte en el fondo */
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9997;pointer-events:none;
    background:rgba(25,90,190,.12);
    backdrop-filter:blur(7px) brightness(.88) saturate(1.25);
    -webkit-backdrop-filter:blur(7px) brightness(.88) saturate(1.25);
  `;
  document.body.appendChild(overlay);

  /* Función que crea una gota — reutilizada para distintos tamaños */
  function crearGota(minTam, maxTam, opacityFactor) {
    const gota = document.createElement('div');
    const tam  = minTam + Math.random() * (maxTam - minTam);
    const alto = tam * (.78 + Math.random() * .44);
    const x    = Math.random() * 97;
    const y    = Math.random() * 92;
    const del  = Math.random() * 160;

    gota.style.cssText = `
      position:absolute;
      left:${x}vw; top:${y}vh;
      width:${tam}px; height:${alto}px;
      border-radius:50%;
      background:radial-gradient(
        ellipse at 36% 30%,
        rgba(255,255,255,${.92 * opacityFactor})  0%,
        rgba(225,242,255,${.78 * opacityFactor}) 10%,
        rgba(160,210,245,${.60 * opacityFactor}) 28%,
        rgba(70,140,220,${.66 * opacityFactor})  55%,
        rgba(20,65,155,${.86 * opacityFactor})   82%,
        rgba(10,40,120,${.90 * opacityFactor})  100%
      );
      box-shadow:
        inset  2px  3px  5px rgba(255,255,255,${.62 * opacityFactor}),
        inset -1px -2px  4px rgba(0,30,100,${.42 * opacityFactor}),
        0 2px 7px rgba(0,0,0,${.30 * opacityFactor});
      backdrop-filter:blur(${tam > 20 ? 3.5 : 1.5}px) brightness(1.06);
      -webkit-backdrop-filter:blur(${tam > 20 ? 3.5 : 1.5}px) brightness(1.06);
      transform:scale(0); opacity:0;
    `;
    overlay.appendChild(gota);

    gota.animate([
      { transform:'scale(0)',    opacity:0 },
      { transform:'scale(1.12)', opacity:1, offset:.30 },
      { transform:'scale(1)',    opacity:1, offset:.45 },
      { transform:'scale(1)',    opacity:1, offset:.75 },
      { transform:'scale(.95)', opacity:0 },
    ], { duration:1500 + Math.random()*300, delay:del,
         fill:'forwards', easing:'ease-out' });
  }

  /* Gotas grandes y medianas */
  const totalGrandes = 55 + Math.floor(Math.random() * 25);
  for (let i = 0; i < totalGrandes; i++) crearGota(14, 65, 1);

  /* Micro-gotas — más densas, más transparentes, como en la imagen */
  const totalMicro = 80 + Math.floor(Math.random() * 40);
  for (let i = 0; i < totalMicro; i++) crearGota(3, 13, .75);

  /* La pantalla queda cubierta de gotas a los ~650 ms. En ese instante
     avisamos para que el juego se cargue DETRÁS de las gotas; así, cuando
     se disuelven, ya se ve el juego y nunca se vuelve a ver la apertura. */
  if (typeof onCubierto === 'function') setTimeout(onCubierto, 650);

  /* Las gotas se disuelven y dejan ver lo que hay debajo (ya el juego) */
  overlay.animate(
    [{ opacity:1 },{ opacity:0 }],
    { duration:650, delay:950, fill:'forwards' }
  );
  setTimeout(() => overlay.remove(), 1650);
}

/* Espuma estática ondulada — curvas blancas sin animación */
function apCriarEspuma(foamDiv) {
  foamDiv.innerHTML = `
    <svg viewBox="0 0 28 600" preserveAspectRatio="none"
         style="position:absolute;top:0;left:0;width:100%;height:100%"
         xmlns="http://www.w3.org/2000/svg">
      <!-- Onda principal -->
      <path d="M14,0 C4,18 24,36 14,54 C4,72 24,90 14,108 C4,126 24,144 14,162
               C4,180 24,198 14,216 C4,234 24,252 14,270 C4,288 24,306 14,324
               C4,342 24,360 14,378 C4,396 24,414 14,432 C4,450 24,468 14,486
               C4,504 24,522 14,540 C4,558 24,576 14,600"
            stroke="rgba(255,255,255,.82)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- Onda secundaria -->
      <path d="M21,0 C13,15 26,30 20,45 C14,60 26,75 20,90 C14,105 26,120 20,135
               C14,150 26,165 20,180 C14,195 26,210 20,225 C14,240 26,255 20,270
               C14,285 26,300 20,315 C14,330 26,345 20,360 C14,375 26,390 20,405
               C14,420 26,435 20,450 C14,465 26,480 20,495 C14,510 26,525 20,540"
            stroke="rgba(255,255,255,.38)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- Relleno semitransparente -->
      <path d="M14,0 C4,18 24,36 14,54 C4,72 24,90 14,108 C4,126 24,144 14,162
               C4,180 24,198 14,216 C4,234 24,252 14,270 C4,288 24,306 14,324
               C4,342 24,360 14,378 C4,396 24,414 14,432 C4,450 24,468 14,486
               C4,504 24,522 14,540 C4,558 24,576 14,600 L28,600 L28,0 Z"
            fill="rgba(255,255,255,.12)"/>
    </svg>`;
}


function apCriarAlgas(contenedor, wallW, H) {
  const altMax = Math.min(Math.round(H * .42), 130);
  const SVG_W  = 100, mid = SVG_W / 2;
  const FRONDAS = [
    { dx:-22, h:Math.round(altMax*.72), c:'#3aaa86', sc:'#1d6e52', d:3.2, del:0,   dir: 1 },
    { dx: -8, h:Math.round(altMax*.88), c:'#1d8a6a', sc:'#0a4835', d:3.9, del:.5,  dir:-1 },
    { dx:  6, h:altMax,                 c:'#136050', sc:'#062c22', d:4.4, del:1.0,  dir: 1 },
    { dx: 20, h:Math.round(altMax*.80), c:'#4db89a', sc:'#1a7060', d:3.5, del:1.5,  dir:-1 },
  ];
  const B = altMax;
  const numGrupos = Math.max(1, Math.floor(wallW / 110));

  for (let g = 0; g < numGrupos; g++) {
    const xC = (wallW / (numGrupos + 1)) * (g + 1);
    let inner = '';
    FRONDAS.forEach(f => {
      const cx = mid + f.dx;
      const a  = 11 * f.dir;
      const path = `M${cx},${B} C${cx-a},${B-Math.round(f.h*.28)} ${cx-a},${B-Math.round(f.h*.48)} ${cx},${B-Math.round(f.h*.5)} C${cx+a},${B-Math.round(f.h*.52)} ${cx+a},${B-Math.round(f.h*.82)} ${cx},${B-f.h}`;
      const a1 = (-4*f.dir).toFixed(1), a2 = (4*f.dir).toFixed(1);
      inner += `<g><animateTransform attributeName="transform" type="rotate" values="${a1} ${cx} ${B};${a2} ${cx} ${B};${a1} ${cx} ${B}" dur="${f.d}s" begin="${f.del}s" repeatCount="indefinite"/>
        <path d="${path}" stroke="${f.c}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="${path}" stroke="${f.sc}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".4"/>
      </g>`;
    });
    /* coral naranja */
    const cc = mid - 34, hc = Math.round(altMax*.50);
    inner += `<g><animateTransform attributeName="transform" type="rotate" values="-4 ${cc} ${B};4 ${cc} ${B};-4 ${cc} ${B}" dur="3s" begin=".4s" repeatCount="indefinite"/>
      <path d="M${cc},${B} L${cc},${B-Math.round(hc*.56)}" stroke="#d06420" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M${cc},${B-Math.round(hc*.38)} Q${cc-13},${B-Math.round(hc*.58)} ${cc-18},${B-Math.round(hc*.78)}" stroke="#d06420" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M${cc},${B-Math.round(hc*.45)} Q${cc+13},${B-Math.round(hc*.63)} ${cc+17},${B-Math.round(hc*.82)}" stroke="#d06420" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="${cc-18}" cy="${B-Math.round(hc*.78)}" r="4" fill="#e88040"/>
      <circle cx="${cc+17}" cy="${B-Math.round(hc*.82)}" r="4" fill="#e88040"/>
    </g>`;

    const wrap = document.createElement('div');
    wrap.style.cssText = `position:absolute;left:${Math.round(xC-SVG_W/2)}px;bottom:0;pointer-events:none;`;
    wrap.innerHTML = `<svg width="${SVG_W}" height="${altMax}" viewBox="0 0 ${SVG_W} ${altMax}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">${inner}</svg>`;
    contenedor.appendChild(wrap);
  }
}

let apAudioOlas = null;

function iniciarApertura() {
  mostrarPantalla('s-apertura');

  const W  = $('s-apertura').offsetWidth  || window.innerWidth;
  const H  = $('s-apertura').offsetHeight || window.innerHeight;
  const wW = Math.floor(W / 2);

  /* Limpiar estado anterior */
  ['ap-ola-izq','ap-ola-der'].forEach(id => {
    const pared = $(id);
    pared.classList.remove('ap-abierto');
    pared.querySelector('.ap-criaturas').innerHTML = '';
    pared.querySelector('.ap-algas').innerHTML     = '';
  });
  $('ap-israelitas').innerHTML = '';
  $('ap-moises').innerHTML     = '';
  if (apAudioOlas) { apAudioOlas.pause(); apAudioOlas = null; }

  /* ── Israelitas e israelitas aparecen INMEDIATAMENTE en la tierra ── */
  setTimeout(() => {
    const tierra = $('ap-tierra');
    const tH     = tierra.offsetHeight || Math.round(H * .22);
    const tW     = W;

    /* Multitud usando el mismo generador del juego */
    const n = 14 + Math.floor(Math.random() * 7);
    $('ap-israelitas').innerHTML = generarMultitud(n, tW - 40);

    /* Moisés — más grande que el resto, con vara y aura dorada */
    const escala = Math.min(2.0, tH / 60);
    const mW = Math.round(28 * escala), mH = Math.round(56 * escala);
    /* figAnciano ya tiene báculo — solo escalamos más grande */
    $('ap-moises').innerHTML = figAnciano()
      .replace(/width="28"/, `width="${mW}"`)
      .replace(/height="56"/, `height="${mH}"`);
  }, 80);

  /* ── Criaturas y algas en las paredes de agua ── */
  setTimeout(() => {
    ['ap-ola-izq','ap-ola-der'].forEach(id => {
      const pared = $(id);
      apCriarNadadores(pared.querySelector('.ap-criaturas'), wW, Math.round(H * .78));
      apCriarAlgas(pared.querySelector('.ap-algas'), wW, Math.round(H * .78));
      /* espuma manejada por CSS */
    });
  }, 100);

  /* ── Voz de Moisés — el mar se abre cuando termina ── */
  const vozMoises = new Audio('audio/apertura/moises-abre-mar.mp3');
  let marAbierto  = false;

  function abrirMar() {
    if (marAbierto) return;
    marAbierto = true;

    /* Sonido de olas */
    apAudioOlas = new Audio('audio/apertura/olas-del-mar.mp3');
    apAudioOlas.volume = 0.8;
    if (!silenciado) apAudioOlas.play().catch(() => {});

    /* Mar se abre + la pantalla se cubre de gotas */
    $('ap-ola-izq').classList.add('ap-abierto');
    $('ap-ola-der').classList.add('ap-abierto');

    /* En cuanto las gotas cubren la pantalla (~650 ms) arranca el juego
       POR DETRÁS; al disolverse las gotas ya se ve el juego, no la apertura. */
    salpicarPantalla(() => {
      if (apAudioOlas) { apAudioOlas.pause(); apAudioOlas = null; }
      iniciarJuego();
    });
  }

  if (!silenciado) {
    vozMoises.volume = 1.0;
    vozMoises.onended = () => abrirMar();
    vozMoises.onerror = () => setTimeout(abrirMar, 500);
    vozMoises.play().catch(() => setTimeout(abrirMar, 5000));
  } else {
    setTimeout(abrirMar, 800);
  }
}

$('btn-inicio').onclick = () => iniciarInstrucciones();
mostrarRecordInicio();
$('btn-reiniciar').onclick     = () => { detenerVoz(); detenerTodo(); estado.puntuacion=0; estado.vidas=3; estado.nivel=0; iniciarNivel(); };
$('btn-siguiente').onclick     = () => { detenerVoz(); siguienteNivel(); };
$('btn-nueva-partida').onclick = () => { detenerVoz(); iniciarInstrucciones(); };

mostrarPantalla('s-start');
