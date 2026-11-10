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
