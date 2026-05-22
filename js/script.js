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
    vel:                 50,
    intervalo:           4000,
    maxObjetos:          2,
    rescates:            5,
    gruposNecesarios:    3,
    animalesDisp:        [0,1],
    basuraDisp:          [0,1,3,11,12],          /* bolsa, vaso, lata + zapato, calcetín */
    contenedoresActivos: ['amarillo','gris'],
    proporcionBasura:    .25,
  },
  {
    nombre:              'El camino se abre',
    vel:                 68,
    intervalo:           3200,
    maxObjetos:          2,
    rescates:            7,
    gruposNecesarios:    4,
    animalesDisp:        [0,1,2,3],
    basuraDisp:          [0,1,2,3,4,5,6,11,12,13], /* + papel/cartón + caña */
    contenedoresActivos: ['amarillo','azul','gris'],
    proporcionBasura:    .33,
  },
  {
    nombre:              'Criaturas del abismo',
    vel:                 90,
    intervalo:           2500,
    maxObjetos:          3,
    rescates:            10,
    gruposNecesarios:    5,
    animalesDisp:        [0,1,2,3,4],
    basuraDisp:          [0,1,2,3,4,5,6,7,8,11,12,13], /* + vidrio */
    contenedoresActivos: ['amarillo','azul','verde','gris'],
    proporcionBasura:    .40,
  },
  {
    nombre:              'La gran prueba',
    vel:                 118,
    intervalo:           2000,
    maxObjetos:          3,
    rescates:            12,
    gruposNecesarios:    6,
    animalesDisp:        [0,1,2,3,4,5],
    basuraDisp:          [0,1,2,3,4,5,6,7,8,9,10,11,12,13], /* todos */
    contenedoresActivos: ['amarillo','azul','verde','marron','gris'],
    proporcionBasura:    .45,
  },
  {
    nombre:              'Paso final',
    vel:                 148,
    intervalo:           1650,
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
const FIGURAS_CFG = [
  { r:'#c09050',t:'#e8d080',tb:'#ccb050',s:'#d4a070',b:'#6a4020',baculo:false,barba:false,mujer:false },
  { r:'#7090b2',t:'#f0eee0',tb:'#d0c8a8',s:'#c88860',b:'#3a5060',baculo:false,barba:false,mujer:true  },
  { r:'#a06040',t:'#d4a840',tb:'#b89030',s:'#d09060',b:'#602018',baculo:true, barba:false,mujer:false },
  { r:'#f0e8d0',t:'#f8f4e8',tb:'#d8cc98',s:'#c89060',b:'#a08050',baculo:true, barba:true, mujer:false },
  { r:'#8a9868',t:'#e0d480',tb:'#c4b858',s:'#e0b880',b:'#586040',baculo:false,barba:false,mujer:false },
  { r:'#907898',t:'#e8def8',tb:'#c0b0d8',s:'#d4a878',b:'#403858',baculo:false,barba:false,mujer:false },
];

function figuraSVG(c) {
  const rL = c.mujer ? 4.5 : 5.5, rR = 22 - rL;
  return `<svg width="22" height="46" viewBox="0 0 22 46" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="11" cy="45" rx="8" ry="2.5" fill="rgba(0,0,0,0.18)"/>
<path d="M${rL} 14 Q11 12.5 ${rR} 14 L${rR+1.5} 44 L${rL-1.5} 44 Z" fill="${c.r}"/>
<path d="M11 12.5 L10 21 L11 25 L12 21 Z" fill="rgba(0,0,0,0.07)"/>
<rect x="${rL-1}" y="23" width="${rR-rL+2}" height="2.3" rx="1.1" fill="${c.b}" opacity="0.88"/>
<path d="M${rL} 17 L${rL-4.5} 31" stroke="${c.r}" stroke-width="5" stroke-linecap="round"/>
<path d="M${rR} 17 L${rR+4.5} 31" stroke="${c.r}" stroke-width="5" stroke-linecap="round"/>
<rect x="9.5" y="12" width="3" height="4" rx="1.5" fill="${c.s}"/>
<circle cx="11" cy="8.5" r="5.5" fill="${c.s}"/>
${c.mujer
  ? `<ellipse cx="11" cy="5" rx="6.5" ry="3.5" fill="${c.t}"/><rect x="4.5" y="5" width="13" height="5.5" rx="1" fill="${c.t}" opacity="0.82"/><path d="M4.5 7 L3.5 15.5" stroke="${c.t}" stroke-width="2.8" stroke-linecap="round"/>`
  : `<ellipse cx="11" cy="4.5" rx="6.5" ry="4" fill="${c.t}"/><rect x="4.5" y="6.5" width="13" height="2" rx="1" fill="${c.tb}"/>`}
${c.barba  ? `<ellipse cx="11" cy="13.5" rx="3.5" ry="2.5" fill="rgba(245,240,225,0.8)"/>` : ''}
${c.baculo ? `<line x1="19.5" y1="13" x2="21" y2="44" stroke="#7a5030" stroke-width="2.3" stroke-linecap="round"/>` : ''}
<ellipse cx="7.5" cy="44" rx="3.5" ry="1.9" fill="${c.b}"/>
<ellipse cx="14.5" cy="44" rx="3.5" ry="1.9" fill="${c.b}"/>
</svg>`;
}

function generarMultitud(n) {
  const ANIMALES_EXODO = ['🐪','🐫','🐐','🐑','🐕','🐈','🫏','🐂'];
  const PASO = 15;

  const pool = [];
  while (pool.length < n) pool.push(...FIGURAS_CFG);
  pool.sort(() => Math.random() - .5);

  /* Decidimos qué posiciones llevarán un animal */
  const posicionesAnimal = new Set();
  const numAnimales = Math.max(1, Math.floor(n / 4));
  while (posicionesAnimal.size < numAnimales) {
    posicionesAnimal.add(Math.floor(Math.random() * n));
  }

  const anchoTotal = (n - 1) * PASO + 28;

  /* Primero pintamos TODAS las figuras humanas */
  let htmlPersonas = '';
  let personaIdx = 0;
  for (let i = 0; i < n; i++) {
    if (!posicionesAnimal.has(i)) {
      const cls = i % 2 === 0 ? 'figura' : 'figura figura-par';
      htmlPersonas += `<div class="${cls}" style="left:${i*PASO}px;z-index:1">${figuraSVG(pool[personaIdx % pool.length])}</div>`;
      personaIdx++;
    }
  }

  /* Después pintamos los ANIMALES encima (z-index mayor, se ven siempre) */
  let htmlAnimales = '';
  for (const i of posicionesAnimal) {
    const cls   = i % 2 === 0 ? 'figura' : 'figura figura-par';
    const emoji = ANIMALES_EXODO[Math.floor(Math.random() * ANIMALES_EXODO.length)];
    const esGrande = emoji === '🐪' || emoji === '🐫' || emoji === '🐂';
    const estilo = esGrande
      ? `left:${i*PASO-2}px;font-size:19px;top:10px;z-index:2;line-height:1`
      : `left:${i*PASO-1}px;font-size:15px;top:19px;z-index:2;line-height:1`;
    htmlAnimales += `<div class="${cls}" style="${estilo}" title="${emoji}">${emoji}</div>`;
  }

  return `<div style="position:relative;width:${anchoTotal}px;height:46px">${htmlPersonas}${htmlAnimales}</div>`;
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

/* Melodía de victoria */
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

  $('area-juego').querySelectorAll('.criatura,.grupo-pueblo,.salpicadura,.pts-flotantes,.gota,.eco-burst').forEach(e => e.remove());
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
  el.innerHTML = generarMultitud(8 + Math.floor(Math.random()*5));
  el.style.top = '-65px';
  estado.grupos.push({ el, y:-65 });
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

  /* Reiniciar animaciones en cascada */
  ['lu-escena','lu-titulo','lu-texto','lu-cita','lu-ref'].forEach(id => {
    const el = $(id); el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  });

  /* Mostrar contenedores del próximo nivel con los nuevos destacados */
  const nivelSig = estado.nivel + 1;
  const divProx  = $('proximos-bins');
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
}

function mostrarVictoria() {
  detenerAmbiente(); sndVictoria();
  $('win-pts').textContent = estado.puntuacion;
  mostrarPantalla('s-win');
  lanzarConfeti();
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

let vozActiva = true;       /* el niño puede silenciar la voz */
let utteranceActual = null; /* referencia para cancelar si se avanza */

/* Comprueba si el navegador soporta síntesis de voz */
const hayVoz = 'speechSynthesis' in window;

/* Habla un texto en español */
function hablar(texto, alTerminar) {
  if (!hayVoz || !vozActiva) {
    if (alTerminar) setTimeout(alTerminar, 200);
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang  = 'es-ES';
  u.rate  = 0.88;   /* un poco más lento para niños */
  u.pitch = 1.05;
  /* Intentar usar una voz en español si está disponible */
  const voces = window.speechSynthesis.getVoices();
  const vozEs = voces.find(v => v.lang.startsWith('es'));
  if (vozEs) u.voice = vozEs;
  if (alTerminar) u.onend = alTerminar;
  utteranceActual = u;
  window.speechSynthesis.speak(u);
}

function detenerVoz() {
  if (hayVoz) window.speechSynthesis.cancel();
}

/* ─── Pasos de instrucción ─── */
const PASOS_INSTRUCCION = [
  {
    tipo:     'intro',
    icono:    '👋',
    titulo:   '¡Hola, pequeño ayudante!',
    objetos:  [],
    discurso: 'Soy Moisés. Dios ha abierto el Mar Rojo para que mi pueblo pueda cruzar. Pero hay mucha basura en la arena. ¡Necesito tu ayuda para reciclarla correctamente!',
  },
  {
    tipo:     'animal',
    icono:    '🐠🌊',
    titulo:   'Animales al mar',
    objetos:  ['⭐ Estrellas','🐟 Peces','🦑 Calamares','🐬 Delfines','🦈 Tiburones','🐙 Pulpos','🐋 Ballenas'],
    discurso: 'Primero: los animales del mar deben volver al agua. Arrástralos hacia los lados, donde ves el mar azul.',
  },
  {
    tipo:     'amarillo',
    icono:    '🟡',
    titulo:   'Contenedor Amarillo — Envases',
    objetos:  ['🛍️ Bolsas','🥤 Vasos plástico','🧴 Botellas plástico','🥫 Latas'],
    discurso: 'El contenedor amarillo es para envases: bolsas y botellas de plástico, y latas de metal.',
  },
  {
    tipo:     'azul',
    icono:    '🔵',
    titulo:   'Contenedor Azul — Papel y Cartón',
    objetos:  ['📦 Cajas','📰 Periódicos','🧃 Tetrabriks'],
    discurso: 'El contenedor azul es para papel y cartón: cajas, periódicos y envases de cartón como los tetrabriks.',
  },
  {
    tipo:     'verde',
    icono:    '🟢',
    titulo:   'Contenedor Verde — Vidrio',
    objetos:  ['🍾 Botellas vidrio','🫙 Frascos vidrio'],
    discurso: 'El contenedor verde es solo para vidrio: botellas y frascos de vidrio. ¡Cuidado, no confundas con el plástico!',
  },
  {
    tipo:     'marron',
    icono:    '🟤',
    titulo:   'Contenedor Marrón — Orgánico',
    objetos:  ['🪸 Algas muertas','🐚 Conchas rotas'],
    discurso: 'El contenedor marrón es para residuos orgánicos del mar: algas muertas y conchas rotas. La naturaleza los recicla.',
  },
  {
    tipo:     'gris',
    icono:    '⚫',
    titulo:   'Contenedor Gris — Resto',
    objetos:  ['👟 Zapatos','🧦 Calcetines','🎣 Cañas de pesca'],
    discurso: 'El contenedor gris es para lo que no se puede reciclar: ropa vieja, zapatos y cañas de pesca.',
  },
  {
    tipo:     'fin',
    icono:    '✅',
    titulo:   '¡Ya lo sabes todo!',
    objetos:  [],
    discurso: '¡Perfecto! Recuerda: animales al mar, y basura al contenedor correcto. Si te equivocas, ¡pierdes una vida! ¡Buena suerte!',
  },
];

let pasoActual = 0;

function mostrarPasoInstruccion(indice) {
  const paso = PASOS_INSTRUCCION[indice];
  pasoActual  = indice;

  /* Actualizar bocadillo de Moisés */
  const bocText = $('bocadillo-texto');
  bocText.style.opacity = '0';
  setTimeout(() => {
    bocText.textContent = paso.discurso;
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

  /* Color de la tarjeta según tipo */
  tarjeta.className = paso.tipo;

  /* Actualizar puntos de progreso */
  const total = PASOS_INSTRUCCION.length;
  $('pasos-dots').innerHTML = PASOS_INSTRUCCION.map((_, i) =>
    `<div class="dot ${i < indice ? 'completado' : i === indice ? 'activo' : ''}"></div>`
  ).join('');

  /* Cambiar botón del último paso */
  const btnSig = $('btn-paso-sig');
  btnSig.textContent = indice === total - 1 ? '¡Empecemos! 🌊' : 'Siguiente ▶';

  /* Hablar */
  detenerVoz();
  hablar(paso.discurso);
}

function iniciarInstrucciones() {
  pasoActual = 0;
  /* Mostrar/ocultar el control de voz según soporte */
  $('ctrl-voz').style.display = hayVoz ? 'flex' : 'none';
  $('btn-voz').className = vozActiva ? '' : 'silenciado';
  $('btn-voz').textContent = vozActiva ? '🔊 Voz activada' : '🔇 Voz desactivada';
  mostrarPantalla('s-instrucciones');
  /* Pequeño retraso para que las voces del navegador se carguen */
  setTimeout(() => mostrarPasoInstruccion(0), 400);
}

/* Avanzar al siguiente paso */
$('btn-paso-sig').onclick = () => {
  detenerVoz();
  if (pasoActual < PASOS_INSTRUCCION.length - 1) {
    mostrarPasoInstruccion(pasoActual + 1);
  } else {
    /* Último paso — empezar el juego */
    detenerVoz();
    iniciarJuego();
  }
};

/* Saltar todas las instrucciones */
$('btn-saltar').onclick = () => {
  detenerVoz();
  iniciarJuego();
};

/* Activar/desactivar la voz */
$('btn-voz').onclick = () => {
  vozActiva = !vozActiva;
  $('btn-voz').className   = vozActiva ? '' : 'silenciado';
  $('btn-voz').textContent = vozActiva ? '🔊 Voz activada' : '🔇 Voz desactivada';
  if (!vozActiva) detenerVoz();
  else hablar(PASOS_INSTRUCCION[pasoActual].discurso);
};


/* ============================================================
   BOTONES Y ARRANQUE
   ============================================================ */
$('btn-inicio').onclick        = () => iniciarInstrucciones();
$('btn-reiniciar').onclick     = () => { detenerVoz(); detenerTodo(); estado.puntuacion=0; estado.vidas=3; estado.nivel=0; iniciarNivel(); };
$('btn-siguiente').onclick     = () => siguienteNivel();
$('btn-nueva-partida').onclick = () => iniciarInstrucciones();

mostrarPantalla('s-start');