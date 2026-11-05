# AGENTS.md

Guia para cualquier agente de IA que trabaje en este repositorio (Antigravity, Gemini CLI, Claude Code, Codex, etc.).
Leela completa antes de tocar codigo.

## 1. Proyecto

Portafolio web personal de un desarrollador Full Stack, estudiante/egresado de la UTN Facultad Regional San Rafael (Mendoza, Argentina).

Objetivos del sitio:
- Presentar quien soy y mi formacion.
- Mostrar las tecnologias que uso, agrupadas por categoria.
- Mostrar mis proyectos reales tomados de GitHub, con stack, descripcion, link al repo y demo.
- Ofrecer un formulario de contacto funcional.

Datos que el agente NO debe inventar (usar los placeholders hasta que el usuario los complete):
- GITHUB_USER: `Lautaro-404`
- NOMBRE: `Lautaro Ponzina`
- EMAIL_CONTACTO: `ponzinalautaro6@gmail.com`
- LINKEDIN: `https://www.linkedin.com/in/lautaro-ponzina-90878932a/`

## 2. Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS.
- Animacion: Motion (`motion`, ex Framer Motion). GSAP solo si el usuario lo pide.
- Backend: funcion serverless en `/api/contact` (Vercel) o Express si el usuario lo prefiere. Sin servidor propio salvo necesidad.
- Datos de proyectos: JSON generado en build desde la API de GitHub (ver seccion 5).
- Despliegue: Vercel (alternativa: Netlify).
- Gestor de paquetes: `npm`. No mezclar con yarn/pnpm.

## 3. Skills y reglas de diseno (TASTE SKILL)

Para TODO trabajo de interfaz (componentes, layouts, estilos, animaciones) usar la skill `design-taste-frontend` del repo `Leonxlnx/taste-skill`.

Instalacion (una sola vez):

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Reglas:
- Antes de escribir UI, leer el `SKILL.md` de la skill y seguirlo estrictamente.
- Evitar el aspecto generico de plantilla de IA: nada de gradientes violeta por defecto, tarjetas identicas en grilla de tres, ni textos de relleno tipo "Lorem ipsum".
- Dials (ajustables por el usuario, escala 1-10):
  - `DESIGN_VARIANCE`: 7
  - `MOTION_INTENSITY`: 5
  - `VISUAL_DENSITY`: 4
- Si el usuario pide un redisenio de algo ya existente, usar tambien la skill `redesign-existing-projects` del mismo repo.
- No usar emojis en codigo, comentarios, commits ni textos del sitio.
- Respetar `prefers-reduced-motion`: toda animacion debe poder desactivarse.
- La skill es guia de diseno; no reemplaza accesibilidad ni los requisitos de este archivo. Si hay conflicto, gana la seccion 7 (Accesibilidad).

## 4. Estructura esperada

```
.
├── AGENTS.md
├── public/
├── scripts/
│   └── fetch-github.mjs        # genera src/data/projects.json
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── TechStack.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectCard.tsx
│   │   └── Contact.tsx
│   ├── data/
│   │   ├── projects.json       # GENERADO, no editar a mano
│   │   ├── projects.overrides.json  # ediciones manuales (titulo, demo, destacado)
│   │   └── tech.ts             # tecnologias curadas por categoria
│   ├── lib/
│   └── main.tsx
├── api/
│   └── contact.ts              # endpoint del formulario
├── .env.example
└── package.json
```

## 5. Proyectos desde GitHub

Fuente de verdad: GitHub CLI (`gh`), ya autenticado en la maquina del usuario.

Flujo:
1. `scripts/fetch-github.mjs` ejecuta `gh api users/$GITHUB_USER/repos --paginate` y, por cada repo, `gh api repos/$GITHUB_USER/<repo>/languages`.
2. Filtra: sin forks, sin archivados, sin el repo del propio portafolio. Si algun repo tiene el topic `portfolio`, solo se incluyen esos.
3. Por repo guarda: `name`, `description`, `html_url`, `homepage` (demo), `topics`, `languages` (con porcentajes), `stargazers_count`, `pushed_at`.
4. Mezcla el resultado con `src/data/projects.overrides.json` (titulo bonito, descripcion corregida, `featured: true`, orden, captura de pantalla).
5. Escribe `src/data/projects.json`.

Scripts de `package.json`:
- `"fetch:github": "node scripts/fetch-github.mjs"`
- `"prebuild": "npm run fetch:github"`

Reglas:
- Nunca llamar a la API de GitHub desde el navegador del visitante (limites de uso y lentitud). Solo en build.
- Si `gh` falla o no hay red, conservar el `projects.json` anterior y avisar; no dejar el sitio vacio.
- Las tecnologias mostradas en cada proyecto salen de `languages` + `topics`, mapeadas a iconos en `src/data/tech.ts`.
- Cada tarjeta muestra: titulo, descripcion corta, badges de tecnologias, link al repo y link a demo si existe.

## 6. Seccion de tecnologias

- Se define a mano en `src/data/tech.ts`, agrupada: Frontend, Backend, Bases de datos, Herramientas/DevOps, IA y agentes.
- Ademas, el sitio puede mostrar un resumen automatico de lenguajes mas usados calculado desde `projects.json`.
- Solo listar tecnologias que el usuario realmente usa. Preguntar ante la duda.

## 7. Accesibilidad, rendimiento y SEO

- HTML semantico (`header`, `nav`, `main`, `section`, `footer`), un solo `h1`.
- Contraste AA como minimo, foco visible, navegacion completa con teclado.
- Imagenes con `alt`, formato WebP/AVIF, `loading="lazy"` salvo la primera pantalla.
- Responsive mobile-first; probar 360px, 768px y 1280px.
- Modo oscuro y claro con `prefers-color-scheme`.
- Meta tags, Open Graph, `lang="es"`, `sitemap.xml`.
- Objetivo Lighthouse: 90+ en las cuatro categorias.

## 8. Backend de contacto

- Endpoint `POST /api/contact` con validacion de `name`, `email`, `message` (longitud y formato).
- Proteccion basica contra spam (campo honeypot y limite de envios por IP).
- Envio por Resend o Nodemailer. Claves SOLO en variables de entorno.
- Responder siempre JSON con estado claro; el frontend muestra exito y error.

## 9. Seguridad

- Prohibido commitear secretos. Mantener `.env` en `.gitignore` y documentar variables en `.env.example`.
- No ejecutar comandos destructivos (`rm -rf`, `git push --force`, `git reset --hard`) sin pedir confirmacion.
- No publicar ni desplegar a produccion sin confirmacion explicita del usuario.
- Revisar dependencias nuevas antes de instalarlas; preferir paquetes mantenidos y conocidos.

## 10. Forma de trabajo del agente

1. Antes de implementar, mostrar un plan breve (artifact de plan en Antigravity) y esperar aprobacion si el cambio es grande.
2. Trabajar por etapas pequenas, una por vez, con un commit por etapa.
3. Verificar en el navegador (browser subagent) que el resultado se vea bien en movil y escritorio antes de dar la tarea por terminada.
4. Correr `npm run lint` y `npm run build` antes de cada commit.
5. Si falta un dato (nombre, usuario, textos), preguntar en lugar de inventar.
6. Textos del sitio en espanol rioplatense, tono profesional y cercano, sin exageraciones ni frases de marketing vacias.

## 11. Commits

Formato Conventional Commits, en espanol o ingles pero consistente:
- `feat: agrega seccion de proyectos`
- `fix: corrige overflow horizontal en movil`
- `chore: actualiza dependencias`
- `docs: actualiza AGENTS.md`

## 12. CLIs disponibles

El agente puede usar cualquier CLI instalado, con estos usos preferidos:

| CLI | Uso |
|---|---|
| `gh` | Leer repos y lenguajes, crear el repo del portafolio, abrir PRs |
| `git` | Control de versiones, un commit por etapa |
| `npm` / `npx` | Dependencias, scripts, instalar skills |
| `vercel` o `netlify` | Despliegue (solo con confirmacion) |
| `lighthouse` (via `npx`) | Auditoria de rendimiento y accesibilidad |
| `playwright` (via `npx`) | Capturas de pantalla de los proyectos y pruebas basicas |

## 13. Definicion de terminado

Una tarea esta terminada cuando:
- Compila sin errores ni warnings relevantes.
- Se ve bien en movil y escritorio, en modo claro y oscuro.
- Cumple la seccion 7.
- No hay secretos ni datos inventados.
- Hay un commit claro con el cambio.
