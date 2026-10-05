// Guías: contenido informativo que responde búsquedas reales de dueños de negocios.
// Cada guía enlaza a los rubros y a los packs (enlazado interno).

export type Block = { t: 'p'; text: string } | { t: 'h2'; text: string } | { t: 'ul'; items: string[] } | { t: 'cta'; text: string; href: string };
export type Guide = { slug: string; title: string; description: string; date: string; updated: string; readMin: number; related: string[]; body: Block[] };

export const GUIDES: Guide[] = [
  {
    slug: 'cuanto-cuesta-una-pagina-web',
    title: '¿Cuánto cuesta una página web para un negocio en Argentina?',
    description: 'Qué define el precio de una página web, qué costos fijos tiene (dominio, hosting, mantenimiento) y cómo elegir la opción justa para tu negocio.',
    date: '2026-10-04', updated: '2026-10-04', readMin: 5,
    related: ['barberias', 'talleres', 'mayoristas'],
    body: [
      { t: 'p', text: 'El precio de una página web depende menos de “la web” y más de lo que tiene que hacer por tu negocio. Una página que muestra servicios y un botón de WhatsApp no cuesta lo mismo que un sistema con turnos online o un catálogo con pedidos.' },
      { t: 'h2', text: 'Qué define el precio' },
      { t: 'ul', items: [
        'La cantidad de secciones: una sola página o varias (servicios, galería, contacto, preguntas).',
        'Las funciones: turnos online, carrito de pedidos, cotizador o panel para que administres vos.',
        'Quién escribe los textos y prepara las fotos.',
        'Si el diseño es a medida o sobre una base adaptada a tu rubro.',
      ] },
      { t: 'h2', text: 'Los costos que se repiten' },
      { t: 'p', text: 'Además del diseño, toda web tiene costos que siguen después de la entrega:' },
      { t: 'ul', items: [
        'Dominio: en Argentina, los dominios .com.ar se registran en NIC.ar y tienen un arancel anual.',
        'Hosting: el servidor donde vive la web.',
        'Mantenimiento: cambios, actualizaciones y soporte cuando algo no anda.',
      ] },
      { t: 'p', text: 'Muchas veces el error es comparar solo el precio inicial. Una web barata sin mantenimiento puede quedar desactualizada o dejar de funcionar, y terminar costando más.' },
      { t: 'h2', text: 'Cómo elegir la opción justa' },
      { t: 'ul', items: [
        'Si necesitás estar en Google y que te escriban: una página simple con servicios, ubicación y WhatsApp alcanza.',
        'Si querés verte profesional y mostrar catálogo o precios: una web de varias secciones con SEO.',
        'Si recibís muchos turnos o pedidos: un sistema que los gestione solo te ahorra horas por semana.',
      ] },
      { t: 'p', text: 'En Webazo los packs tienen precio cerrado y el dominio va a tu nombre, así la web es tuya.' },
      { t: 'cta', text: 'Ver packs y precios', href: '/#packs' },
    ],
  },
  {
    slug: 'como-aparecer-en-google-maps',
    title: 'Cómo hacer que tu negocio aparezca en Google Maps',
    description: 'Guía paso a paso para crear y optimizar tu perfil de Google Business, conseguir reseñas reales y mejorar tu posición en búsquedas locales.',
    date: '2026-10-04', updated: '2026-10-04', readMin: 6,
    related: ['talleres', 'barberias', 'oficios'],
    body: [
      { t: 'p', text: 'Cuando alguien busca “barbería cerca” o “lubricentro en Flores”, Google muestra primero un mapa con negocios. Aparecer ahí es gratis, pero hay que hacerlo bien.' },
      { t: 'h2', text: '1. Creá tu perfil de Google Business' },
      { t: 'ul', items: [
        'Entrá a Google Business Profile con una cuenta de Google del negocio.',
        'Cargá el nombre real del negocio, sin agregar palabras clave de relleno.',
        'Elegí la categoría principal más precisa (por ejemplo, “Barbería” y no “Salón de belleza”).',
        'Verificá el perfil con el método que te ofrezca Google.',
      ] },
      { t: 'h2', text: '2. Completá todo' },
      { t: 'p', text: 'Un perfil completo tiene más chances de mostrarse. Cargá horarios, teléfono, zona de servicio o dirección, fotos reales del local y de tus trabajos, servicios con descripción y el link a tu página web.' },
      { t: 'h2', text: '3. Mantené los datos iguales en todos lados' },
      { t: 'p', text: 'El nombre, la dirección y el teléfono tienen que coincidir en Google, en tu web, en Instagram y en cualquier directorio. Si cada lugar dice algo distinto, Google confía menos en tu negocio.' },
      { t: 'h2', text: '4. Pedí reseñas reales' },
      { t: 'ul', items: [
        'Pedíselas a clientes contentos, con el link directo a tu perfil.',
        'Respondé todas, también las negativas, con respeto.',
        'Nunca compres ni inventes reseñas: va contra las políticas de Google y te pueden suspender el perfil.',
      ] },
      { t: 'h2', text: '5. Sumá una página web' },
      { t: 'p', text: 'Google usa tu web para entender qué hacés y dónde. Una página con tus servicios, tu zona y tus datos de contacto, conectada al perfil, refuerza tu posición en las búsquedas locales.' },
      { t: 'cta', text: 'Quiero mi web conectada a Google', href: '/#contacto' },
    ],
  },
  {
    slug: 'pagina-web-o-instagram',
    title: '¿Página web o Instagram? Qué necesita tu negocio',
    description: 'Diferencias reales entre tener solo Instagram y tener página web propia: alcance en Google, control, ventas y confianza.',
    date: '2026-10-04', updated: '2026-10-04', readMin: 4,
    related: ['estetica', 'tiendas', 'gastronomia'],
    body: [
      { t: 'p', text: 'Instagram es excelente para mostrar tu trabajo y mantener el contacto con tus clientes. Pero no reemplaza a una página web: cumplen funciones distintas.' },
      { t: 'h2', text: 'Lo que Instagram hace bien' },
      { t: 'ul', items: ['Mostrar novedades y trabajos del día a día.', 'Generar comunidad y confianza con historias.', 'Llegar a gente que ya te sigue.'] },
      { t: 'h2', text: 'Lo que una web hace y Instagram no' },
      { t: 'ul', items: [
        'Aparecer en Google cuando alguien busca tu servicio en tu zona.',
        'Ser tuya: no depende de un algoritmo ni de que te bloqueen la cuenta.',
        'Resolver sola: turnos, pedidos, precios y preguntas frecuentes sin que respondas cada mensaje.',
        'Dar confianza: un negocio con dominio propio se ve más establecido.',
      ] },
      { t: 'h2', text: 'La combinación que funciona' },
      { t: 'p', text: 'Lo ideal es usar los dos: Instagram para que te conozcan y la web para que te encuentren en Google y concreten. El link de la bio lleva a la web, y la web muestra tu Instagram.' },
      { t: 'cta', text: 'Ver cómo quedaría mi web', href: '/#rubros' },
    ],
  },
  {
    slug: 'que-debe-tener-la-web-de-un-negocio',
    title: 'Qué tiene que tener la página web de un negocio (checklist)',
    description: 'Lista práctica de lo que no puede faltar en la web de un comercio o servicio: celular, WhatsApp, ubicación, velocidad, SEO local y más.',
    date: '2026-10-04', updated: '2026-10-04', readMin: 5,
    related: ['profesionales', 'salud', 'ferreterias'],
    body: [
      { t: 'p', text: 'No hace falta una web enorme. Hace falta que tenga lo que el cliente busca y que se lo haga fácil. Esta es la lista que usamos en cada proyecto.' },
      { t: 'h2', text: 'Lo básico que no puede faltar' },
      { t: 'ul', items: [
        'Que se vea perfecta en el celular: la mayoría de las visitas llegan desde ahí.',
        'Botón de WhatsApp siempre visible.',
        'Qué hacés, para quién y en qué zona, en la primera pantalla.',
        'Horarios, dirección o zona de trabajo, y un mapa.',
        'Dominio propio y certificado de seguridad (el candado en la barra).',
      ] },
      { t: 'h2', text: 'Lo que hace que te elijan' },
      { t: 'ul', items: [
        'Servicios claros, idealmente con precios o un “desde”.',
        'Fotos reales de tu trabajo o tu local.',
        'Preguntas frecuentes que respondan las dudas antes del mensaje.',
        'Opiniones reales de clientes, cuando las tengas.',
      ] },
      { t: 'h2', text: 'Lo que te ahorra tiempo' },
      { t: 'ul', items: ['Turnos online si trabajás con agenda.', 'Catálogo con pedido armado si vendés productos.', 'Un panel para cambiar precios y contenido sin depender de nadie.'] },
      { t: 'h2', text: 'Lo que te hace aparecer en Google' },
      { t: 'ul', items: [
        'Títulos y textos que digan qué hacés y dónde.',
        'Que cargue rápido.',
        'Datos de contacto iguales a los de tu perfil de Google Business.',
        'Contenido útil y propio, no copiado de otras webs.',
      ] },
      { t: 'cta', text: 'Quiero una web con todo esto', href: '/#packs' },
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
