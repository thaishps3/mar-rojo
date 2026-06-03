# 🌊 El Mar Rojo — Juego Educativo

Juego interactivo para niños de 6 a 12 años basado en el relato bíblico del Éxodo (capítulo 14). El jugador ayuda al pueblo de Israel a cruzar el Mar Rojo mientras aprende a reciclar correctamente.

---

## 🎮 ¿Cómo se juega?

Moisés ha extendido su vara y Dios ha abierto el mar. En la arena aparecen **animales del mar** y **objetos contaminantes** mezclados. El jugador debe:

- **Arrastrar los animales** → hacia el agua (zonas azules a los lados)
- **Arrastrar la basura** → hacia el contenedor de reciclaje correcto

Si un objeto no se retira a tiempo y el pueblo de Israel choca con él, el mar comienza a cerrarse y se pierde una vida.

---

## 📚 Objetivo educativo

El juego trabaja dos valores simultáneamente:

### ✝️ Fe cristiana
Al completar cada nivel, se narra un fragmento del relato bíblico del Éxodo con lenguaje sencillo y citas textuales de la Biblia (Éxodo 3, 14).

### ♻️ Educación ambiental
El jugador aprende a clasificar residuos en los **5 contenedores de reciclaje** reales usados en España:

| Contenedor | Qué va dentro |
|---|---|
| 🟡 **Amarillo** — Envases | Bolsas, vasos y botellas de plástico, latas |
| 🔵 **Azul** — Papel y cartón | Cajas, periódicos, tetrabriks |
| 🟢 **Verde** — Vidrio | Botellas y frascos de vidrio |
| 🟤 **Marrón** — Orgánico | Algas muertas, conchas rotas |
| ⚫ **Gris** — Resto | Zapatos, calcetines, cañas de pesca |

---

## 🗺️ Progresión por niveles

| Nivel | Nombre | Contenedores activos | Historia bíblica narrada |
|---|---|---|---|
| 1 | El inicio del éxodo | 🟡 + ⚫ | La llamada de Dios — zarza ardiente |
| 2 | El camino se abre | 🟡 + 🔵 + ⚫ | El ejército del Faraón persigue al pueblo |
| 3 | Criaturas del abismo | 🟡 + 🔵 + 🟢 + ⚫ | Moisés levanta la vara — "¡No temáis!" |
| 4 | La gran prueba | Los 5 contenedores | El pueblo camina en seco entre muros de agua |
| 5 | Paso final | Los 5 contenedores | Israel cruza y queda libre |

Los contenedores se introducen progresivamente para que el niño aprenda uno a uno antes de enfrentarse a todos.

---

## ✨ Características

- 🧙‍♂️ **Moisés narrador** — explica las reglas con voz sintetizada antes de empezar
- 👨‍👩‍👧‍👦 **Multitud bíblica** — figuras SVG con estilo cartoon: hombres, mujeres, niños, ancianos
- 🐪 **Animales del éxodo** — camellos, cabras, ovejas, burros, perros y bueyes acompañan al pueblo
- 🐠 **Mar animado** — animales nadando, olas onduladas y burbujas en las zonas de agua
- 🔊 **Sonido 100% sintetizado** — océano ambiente, salpicaduras, fanfarria y aplausos generados con Web Audio API sin archivos externos
- 📖 **Historia por capítulos** — relato bíblico con citas textuales entre niveles
- 📱 **Responsive** — funciona en móvil, tablet y escritorio
- 🏆 **Sistema de puntuación y vidas** — 3 vidas, puntos por nivel

---

## 🗂️ Estructura del proyecto

```
el-mar-rojo/
├── index.html        ← Estructura HTML
├── css/
│   └── style.css     ← Diseño visual y animaciones
├── js/
│   └── script.js     ← Lógica del juego
└── README.md
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Para qué se usa |
|---|---|
| **HTML5** | Estructura y semántica |
| **CSS3** | Animaciones, diseño responsive, olas SVG |
| **JavaScript (ES6)** | Lógica del juego, físicas, colisiones |
| **Web Audio API** | Todos los sonidos, generados matemáticamente |
| **Web Speech API** | Voz de Moisés en las instrucciones |
| **SVG** | Figuras bíblicas dibujadas en código |

No se utilizan librerías externas. El juego funciona con un solo archivo HTML, un CSS y un JS.

---

## 🚀 Cómo ejecutar el juego

### Opción 1 — Directamente en GitHub Pages
Visita: `https://thaishps3.github.io/mar-rojo/`

### Opción 2 — En local
1. Clona o descarga el repositorio
2. Abre `index.html` en cualquier navegador moderno
3. ¡A jugar!

No requiere servidor, instalación ni conexión a internet (excepto para la fuente de Google Fonts).

---
## Créditos
### Delfin:
Sound Effect by <a href="https://pixabay.com/es/users/sondangsirait419-44635360/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=220055">Sondang Sirait</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=220055">Pixabay</a>

### Ballena:
Sound Effect by <a href="https://pixabay.com/es/users/dragon-studio-38165424/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382729">DRAGON-STUDIO</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=382729">Pixabay</a>

### gaviota:
Sound Effect by <a href="https://pixabay.com/es/users/jonathanslattermusic-54702892/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=486871">Jonathan Slatter</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=486871">Pixabay</a>

### foca:
Sound Effect by <a href="https://pixabay.com/es/users/u_w4utmqapnm-37408805/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=154201">u_w4utmqapnm</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=154201">Pixabay</a>

### Olas del mar

Sound Effect by <a href="https://pixabay.com/es/users/kokoreli777-39793239/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=169411">michael koreli</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=169411">Pixabay</a>


### Imagenes

Imagen de <a href="https://pixabay.com/es/users/yamu_jay-44818947/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8975999">kp yamu Jayanath</a> en <a href="https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8975999">Pixabay</a>

## 📖 Referencias bíblicas

- **Éxodo 3:7-8** — La llamada de Dios a Moisés
- **Éxodo 14:7** — El ejército del Faraón
- **Éxodo 14:13** — "No temáis, estad firmes"
- **Éxodo 14:22** — El pueblo cruza en seco
- **Éxodo 14:30** — "Así salvó el Señor aquel día a Israel"

---

## 👩‍💻 Autora

Desarrollado como proyecto educativo de desarrollo web.

---

*"Y los hijos de Israel fueron por en medio del mar, en seco, teniendo el agua como muro a su derecha y a su izquierda." — Éxodo 14:22*
