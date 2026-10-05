# Webazo · webazo.com.ar

Landing de ventas + landings por rubro para anuncios + CRM de leads + panel de administración.

**Stack:** Next.js 15 (App Router, TypeScript) · Supabase (Postgres, Auth, RLS) · Vercel · Meta Píxel + API de Conversiones · GA4

---

## Qué incluye

**Sitio público**
- `/` landing principal con demo interactiva de turnos, packs con precios, rubros, testimonios, FAQ y formulario.
- **19 landings por rubro** (`/barberias`, `/estetica`, `/tatuajes`, `/salud`, `/talleres`, `/autos`, `/mayoristas`, `/tiendas`, `/ferreterias`, `/gastronomia`, `/gimnasios`, `/veterinarias`, `/inmobiliarias`, `/oficios`, `/profesionales`, `/educacion`, `/eventos`, `/alojamiento`, `/limpieza`), pensadas como destino de los anuncios. Cada una tiene su título, dolores, demo interactiva con datos del rubro, pack recomendado y mensaje de WhatsApp propio.
- `/gracias` página post-formulario (no indexada).
- `/privacidad` y `/terminos` (Meta exige política de privacidad para anuncios de clientes potenciales).
- SEO: metadatos por página, datos estructurados (negocio + FAQ), `sitemap.xml`, `robots.txt`, imagen OG automática.

**Cupones**
- Popup de bienvenida (una vez por semana por visitante): aparece a los X segundos, al intentar salir (compu) o al bajar el 60% (celu). Pide nombre y WhatsApp y entrega el código.
- El cupón queda guardado en el navegador 30 días: los packs muestran el precio con descuento y "ahorrás USD X", hay una barra que lo recuerda en todas las páginas y los mensajes de WhatsApp lo mencionan solos.
- El formulario aplica el cupón y muestra el resumen (precio, descuento, total). El servidor siempre revalida el código y recalcula el precio.
- Cupones por porcentaje o monto fijo, con vencimiento, límite de usos y packs a los que aplica.
- Cada reclamo queda como contacto en `/admin/cupones` con botón para escribirle por WhatsApp, y se marca si después pidió presupuesto.
- Evento `CompleteRegistration` (Píxel + CAPI) cuando alguien reclama un cupón.

**Medición para Meta Ads**
- Captura de UTM y `fbclid` en cookie (90 días) y se guardan con cada lead.
- Eventos `PageView`, `Contact` (clic en WhatsApp) y `Lead` (formulario) por **Píxel y API de Conversiones**, deduplicados con el mismo `eventId`.
- Los datos personales viajan a Meta cifrados (SHA-256).
- Cada clic en WhatsApp queda registrado en la base con su campaña.

**Panel `/admin`**
- Resumen: leads de 30 días, clics a WhatsApp, sin contactar, tasa de cierre, facturado, y leads por campaña, anuncio, rubro y pack.
- Leads: filtros por estado, buscador, botón directo a WhatsApp, detalle con atribución completa, estado, valor del trabajo y notas. Exportación CSV.
- Packs y precios, mantenimiento mensual y banner: se editan y la web se actualiza sola.
- Cupones: crear y editar códigos, configurar el popup y ver quién reclamó cada cupón.
- Testimonios (se pueden asignar a un rubro) y preguntas frecuentes.

**Seguridad:** RLS en todas las tablas, panel protegido por middleware + verificación de rol admin, honeypot y rate limit en formularios, validación con zod, headers de seguridad.

---

## Estructura

```
src/
  app/
    (site)/            páginas públicas (home, [rubro], gracias, legales)
    admin/             login, panel y acciones del servidor
    api/leads          recibe el formulario → Supabase + CAPI + mail
    api/track          registra clics de WhatsApp → Supabase + CAPI
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/          secciones de la landing, demos, formulario, tracking
  lib/
    rubros.ts          ← contenido de cada landing por rubro
    defaults.ts        contenido de respaldo si la base no responde
    data.ts            lectura de packs, FAQ, testimonios, ajustes
    meta-capi.ts       API de Conversiones
    supabase/          clientes (navegador, servidor, service role, público)
  middleware.ts        protege /admin
supabase/
  migrations/0001_init.sql   tablas + RLS
  seed.sql                   packs, FAQ y ajustes iniciales
```

---

## Puesta en marcha

### 1. Supabase
1. Creá un proyecto en supabase.com (región São Paulo, la más cercana).
2. En **SQL Editor**, pegá y ejecutá `supabase/migrations/0001_init.sql`, después `supabase/seed.sql` y por último `supabase/migrations/0002_coupons.sql`.
3. En **Authentication → Users → Add user**, creá tu usuario (webazo.ar@gmail.com + contraseña). Marcá "Auto confirm".
4. Hacelo administrador. En SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'webazo.ar@gmail.com';
   ```
5. En **Authentication → Providers → Email**, desactivá "Allow new users to sign up" para que nadie más pueda registrarse.
6. En **Project Settings → API** copiá la URL, la `anon key` y la `service_role key`.

### 2. Variables de entorno
Copiá `.env.example` a `.env.local` y completá. **La `SUPABASE_SERVICE_ROLE_KEY` nunca va en el navegador ni en el repo.**

### 3. Local
```bash
npm install
npm run dev        # http://localhost:3000  ·  panel: /admin
```

### 4. Vercel
1. Subí el proyecto a un repo privado de GitHub e importalo en vercel.com/new.
2. Cargá las mismas variables de entorno en **Settings → Environment Variables**.
3. **Settings → Domains**: agregá `webazo.com.ar` y `www.webazo.com.ar`.
4. En NIC.ar → tu dominio → **Delegar** a los DNS que te indique Vercel (o cargá los registros A/CNAME que muestra).

---

## Meta Ads

### Píxel y API de Conversiones
1. **Administrador de eventos → Conectar orígenes de datos → Web** → creá el píxel "Webazo". Copiá el ID en `NEXT_PUBLIC_META_PIXEL_ID`.
2. En el píxel: **Configuración → API de conversiones → Generar token de acceso**. Va en `META_CAPI_TOKEN`.
3. Para probar: **Probar eventos** te da un código (TEST12345). Ponelo en `META_TEST_EVENT_CODE`, redeployá, navegá la web y mirá que lleguen `PageView`, `Contact` y `Lead` con origen "Navegador" y "Servidor". **Después borrá esa variable.**
4. En **Configuración del píxel → Verificación de dominio**, verificá `webazo.com.ar` (meta tag o DNS).

### Eventos
| Evento | Cuándo | Para qué |
|---|---|---|
| `PageView` | cada página | públicos de remarketing |
| `Contact` | clic en cualquier botón de WhatsApp | optimizar campañas de mensajes / conversiones |
| `Lead` | formulario enviado (con valor en USD si eligió pack) | optimizar campañas de clientes potenciales |
| `CompleteRegistration` | reclamo de cupón en el popup | públicos de personas interesadas |

### URLs para los anuncios
Usá la landing del rubro y estos parámetros (Meta completa las llaves solo):
```
https://webazo.com.ar/barberias?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```
En el anuncio: **Destino → Sitio web**, pegás la URL base y los parámetros en **Parámetros de URL**. Después, en el panel ves qué campaña y qué anuncio trajo cada lead.

---

## Google
- **GA4:** creá la propiedad, copiá el ID (`G-…`) en `NEXT_PUBLIC_GA_ID`.
- **Search Console:** agregá `webazo.com.ar`, verificá por DNS y enviá `https://webazo.com.ar/sitemap.xml`.
- **Google Business Profile:** creá el perfil como empresa de servicios con área de cobertura CABA y GBA.

## Avisos de leads por mail (opcional)
Creá una cuenta en resend.com, verificá el dominio y cargá `RESEND_API_KEY`. Cada lead nuevo te llega a `LEAD_NOTIFY_EMAIL`.

---

## Personalizar
- **Precios, packs, FAQ, testimonios, banner:** desde `/admin`.
- **Textos de las landings por rubro / agregar un rubro nuevo:** `src/lib/rubros.ts`. Se genera la URL sola y entra en el sitemap.
- **Colores y tipografía:** variables al principio de `src/app/globals.css`.

---

## SEO

- **Títulos y descripciones por página** con la palabra clave del rubro ("Página web para barberías en CABA y GBA").
- **Datos estructurados (JSON-LD):** Organization + ProfessionalService con catálogo de packs, WebSite, BreadcrumbList, Service por rubro, FAQPage y Article en las guías. Sin reseñas inventadas (Google lo penaliza).
- **Contenido único por rubro** (`src/lib/rubro-seo.ts`): intro y preguntas frecuentes propias de cada rubro.
- **Guías** (`src/lib/guides.ts`, en `/guias`): contenido informativo con enlaces internos a rubros y packs. Sumar guías nuevas es agregar un objeto a ese archivo.
- **Imágenes para compartir automáticas** por página, rubro y guía.
- **Sitemap** con rubros y guías, **robots**, **manifest**, íconos y `/llms.txt` para buscadores con IA.
- **Popup amigable con Google:** a quien llega desde un buscador en el celular no se le abre solo (solo ve la pestañita), para no caer en la penalización por intersticiales intrusivos.
- **Search Console:** cargá el código de verificación en `NEXT_PUBLIC_GSC_VERIFICATION` (o verificá por DNS en Cloudflare) y enviá `/sitemap.xml`.
