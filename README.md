# Portafolio Web — Lautaro Ponzina

Portafolio web personal de **Lautaro Ponzina**, desarrollador Full Stack formado en la **UTN Facultad Regional San Rafael** (Mendoza, Argentina).

## Stack Técnico

- **Frontend**: React 19 + TypeScript + Vite 8 + Tailwind CSS 4.
- **Datos de Proyectos**: Sincronizados en tiempo de compilación desde la API de GitHub mediante `scripts/fetch-github.mjs` y combinados con `src/data/projects.overrides.json`.
- **Contacto**: Serverless Function en `POST /api/contact` (Vercel) con validación compartida entre cliente y servidor, protección anti-spam (honeypot + rate-limit por IP), validación de origen y envío transaccional mediante Resend.

## Comandos Disponibles

```bash
# Servidor de desarrollo local (incluye middleware local en /api/contact)
npm run dev

# Sincronizar repositorios y estadísticas de lenguajes desde GitHub CLI (gh)
npm run fetch:github

# Ejecutar pruebas unitarias de la API de contacto y validaciones del cliente
npm run test:api
npm run test:client

# Verificación estática con ESLint y compilación de producción
npm run lint
npm run build
```

## Variables de Entorno

Copiá `.env.example` a `.env` para configurar el entorno local o las variables del proyecto en Vercel:

| Variable | Descripción |
|---|---|
| `GITHUB_USER` | Usuario de GitHub consultado en build (`Lautaro-404`) |
| `RESEND_API_KEY` | Clave de API de Resend para `POST /api/contact` |
| `CONTACT_EMAIL` | Correo de destino de las consultas (`ponzinalautaro6@gmail.com`) |
| `RESEND_FROM_EMAIL` | Remitente verificado en Resend (`onboarding@resend.dev` en pruebas) |
| `ALLOWED_ORIGIN` | Orígenes adicionales habilitados para CORS en `/api/contact` |

## Actualización Automática de Proyectos (GitHub Actions + Vercel)

El repositorio incluye el workflow [weekly-redeploy.yml](file:///.github/workflows/weekly-redeploy.yml) que ejecuta una reconstrucción programada para mantener actualizados los repositorios y porcentajes de lenguajes mostrados en el portafolio sin intervención manual.

- **Frecuencia programada:** Todos los lunes a las 12:00 UTC (09:00 ART) mediante un trigger `schedule` (cron).
- **Ejecución manual:** Disponible en cualquier momento desde la pestaña **Actions** de GitHub o mediante GitHub CLI con:
  ```bash
  gh workflow run weekly-redeploy.yml
  ```

### Configuración del Deploy Hook en Vercel

1. En el panel de control de Vercel, ingresá a tu proyecto **portfolio**.
2. Dirigite a **Settings** > **Git** > **Deploy Hooks**.
3. Creá un nuevo hook con nombre descriptivo (por ejemplo: `weekly-github-sync`) asignado a la rama `main`.
4. Copiá la URL generada (`https://api.vercel.com/v1/integrations/deploy/...`).
5. Registrá el secreto en el repositorio de GitHub sin exponer el valor:
   ```bash
   gh secret set VERCEL_DEPLOY_HOOK_URL
   ```
   (El CLI solicitará pegar la URL de forma segura sin imprimirla en terminal ni guardarla en archivos locales).
