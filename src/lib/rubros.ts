// Landings por rubro: destinos de los anuncios de Meta.
// Cada entrada genera webazo.com.ar/<slug> y entra sola en el sitemap.

export type DemoData = { biz: string; subtitle?: string; items: { name: string; meta: string }[] };

export type Rubro = {
  slug: string;
  name: string;                 // cómo aparece en selects y en el CRM
  title: string;                // H1
  lead: string;                 // bajada del hero
  pains: { title: string; text: string }[];
  features: string[];
  recommendedPack: 'arranque' | 'negocio' | 'golazo';
  whatsappMessage: string;
  demo: 'turnos' | 'catalogo' | 'servicios';
  demoData: DemoData;
  featured?: boolean;           // aparece como tarjeta grande en la home
  seoTitle: string;
  seoDescription: string;
};

export const RUBROS: Rubro[] = [
  {
    slug: 'barberias', name: 'Barbería', featured: true,
    title: 'Turnos online para tu barbería',
    lead: 'Tus clientes sacan turno solos, a cualquier hora, sin que tengas que contestar mensajes mientras cortás.',
    pains: [
      { title: 'Contestás WhatsApp todo el día', text: 'Cada turno son cinco mensajes. Mientras cortás, se te acumulan.' },
      { title: 'Huecos en la agenda', text: 'Sin recordatorios, la gente se olvida y perdés el turno.' },
      { title: 'Nadie te encuentra en Google', text: 'El que busca barbería en tu barrio llega al de al lado.' },
    ],
    features: ['Turnos online por servicio y barbero', 'Agenda que se ordena sola', 'Panel para ver y mover turnos', 'Aparecés en Google Maps'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una barbería y quiero turnos online', demo: 'turnos',
    demoData: { biz: 'Barbería Norte', items: [{ name: 'Corte', meta: '30 min' }, { name: 'Corte + barba', meta: '45 min' }, { name: 'Perfilado de barba', meta: '20 min' }] },
    seoTitle: 'Turnos online para barberías | Webazo',
    seoDescription: 'Sistema de turnos online para barberías. Tus clientes reservan solos, 24/7. Online en días.',
  },
  {
    slug: 'estetica', name: 'Estética / peluquería / uñas',
    title: 'Tu centro de estética con turnos online',
    lead: 'Peluquerías, uñas, cejas, depilación y spa: que tus clientas reserven solas y vos te dediques a atender.',
    pains: [
      { title: 'El celular no para', text: 'Consultas de precios y horarios mientras estás con una clienta.' },
      { title: 'Ausencias sin aviso', text: 'Un turno perdido es plata que no vuelve.' },
      { title: 'Tus trabajos no se lucen', text: 'Las fotos quedan perdidas en el feed de Instagram.' },
    ],
    features: ['Turnos online por servicio y profesional', 'Galería de trabajos', 'Lista de precios siempre actualizada', 'Botón de WhatsApp y ubicación'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo un centro de estética y quiero turnos online', demo: 'turnos',
    demoData: { biz: 'Estudio Bella', items: [{ name: 'Esmaltado semipermanente', meta: '60 min' }, { name: 'Corte y brushing', meta: '45 min' }, { name: 'Perfilado de cejas', meta: '20 min' }] },
    seoTitle: 'Web y turnos online para centros de estética | Webazo',
    seoDescription: 'Página web con turnos online para peluquerías, uñas, cejas y centros de estética. Online en días.',
  },
  {
    slug: 'tatuajes', name: 'Estudio de tatuajes',
    title: 'La web que tu estudio de tatuajes merece',
    lead: 'Portfolio de cada artista, consultas con referencia de diseño y señas online. Todo en un lugar.',
    pains: [
      { title: 'Consultas sin datos', text: '“¿Cuánto sale un tatuaje?” sin tamaño, zona ni referencia.' },
      { title: 'Portfolio desordenado', text: 'Tus mejores trabajos mezclados entre historias y memes.' },
      { title: 'Turnos que se caen', text: 'Sin seña, la gente reserva y no viene.' },
    ],
    features: ['Portfolio por artista y estilo', 'Formulario de consulta con zona, tamaño y referencia', 'Agenda de sesiones', 'Cuidados post tatuaje'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo un estudio de tatuajes y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Tinta Sur Studio', subtitle: 'Martes a sábado, de 12 a 20 hs', items: [{ name: 'Tatuaje chico', meta: 'Hasta 5 cm' }, { name: 'Tatuaje mediano', meta: 'Hasta 15 cm' }, { name: 'Sesión completa', meta: '4 hs' }, { name: 'Piercing', meta: 'Sin turno' }] },
    seoTitle: 'Páginas web para estudios de tatuajes | Webazo',
    seoDescription: 'Web para estudios de tatuajes con portfolio por artista, consultas y turnos. Online en días.',
  },
  {
    slug: 'salud', name: 'Consultorio / salud',
    title: 'Turnos online para tu consultorio',
    lead: 'Odontólogos, kinesiólogos, nutricionistas, psicólogos y más. Tus pacientes reservan solos y vos atendés tranquilo.',
    pains: [
      { title: 'La secretaria no da abasto', text: 'Llamadas y mensajes solo para pedir o cambiar turnos.' },
      { title: 'Pacientes que no vienen', text: 'Sin recordatorio, se olvidan y queda el hueco.' },
      { title: 'No transmitís confianza', text: 'Un profesional sin web se ve menos serio que la competencia.' },
    ],
    features: ['Turnos online por profesional y prestación', 'Obras sociales y prepagas que atendés', 'Ubicación y cómo llegar', 'Panel para manejar la agenda'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo un consultorio y quiero turnos online', demo: 'turnos',
    demoData: { biz: 'Consultorio Dra. Ruiz', items: [{ name: 'Primera consulta', meta: '40 min' }, { name: 'Control', meta: '20 min' }, { name: 'Limpieza dental', meta: '30 min' }] },
    seoTitle: 'Turnos online para consultorios y profesionales de la salud | Webazo',
    seoDescription: 'Web con turnos online para odontólogos, kinesiólogos, nutricionistas y consultorios. Online en días.',
  },
  {
    slug: 'talleres', name: 'Taller / lubricentro', featured: true,
    title: 'La web que tu taller necesita',
    lead: 'Tus servicios, horarios y turnos en un solo lugar. El cliente te encuentra en Google y te escribe con un toque.',
    pains: [
      { title: 'Te preguntan siempre lo mismo', text: 'Horarios, servicios, si atendés sábados. Todo por teléfono.' },
      { title: 'No aparecés cuando te buscan', text: 'El que necesita un cambio de aceite cerca elige al que encuentra primero.' },
      { title: 'Turnos anotados en papel', text: 'Se pisan, se pierden y no sabés qué tenés la semana que viene.' },
    ],
    features: ['Lista de servicios clara', 'Turno por WhatsApp o reserva online', 'Ubicación y horarios en Google', 'Panel de gestión opcional'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo un taller y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Lubricentro Centro', subtitle: 'Lunes a sábado, de 8 a 19 hs', items: [{ name: 'Cambio de aceite y filtro', meta: 'En el momento' }, { name: 'Alineación y balanceo', meta: 'Con turno' }, { name: 'Revisión general', meta: 'Antes de la ruta' }, { name: 'Frenos', meta: 'Con turno' }] },
    seoTitle: 'Páginas web para talleres y lubricentros | Webazo',
    seoDescription: 'Web para talleres mecánicos y lubricentros con servicios, turnos y WhatsApp. Aparecé en Google.',
  },
  {
    slug: 'autos', name: 'Agencia de autos',
    title: 'Tu stock de autos online, siempre actualizado',
    lead: 'Catálogo con fotos, precio y ficha de cada unidad. El interesado consulta por WhatsApp con el auto ya elegido.',
    pains: [
      { title: 'Publicás en mil lados', text: 'Y cuando vendés un auto, queda colgado en todos.' },
      { title: 'Consultas sin filtro', text: '“¿Sigue disponible?” por autos que vendiste hace un mes.' },
      { title: 'Dependés de portales', text: 'Pagás por publicar y competís al lado de todos.' },
    ],
    features: ['Catálogo con fotos, año, km y precio', 'Filtros por marca, precio y tipo', 'Consulta por WhatsApp con la unidad', 'Panel para cargar y marcar vendidos'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una agencia de autos y quiero mi web', demo: 'catalogo',
    demoData: { biz: 'Sur Automotores', subtitle: 'Usados seleccionados', items: [{ name: 'Hatchback 2019', meta: '58.000 km' }, { name: 'Sedán 2021', meta: '32.000 km' }, { name: 'Pickup 2018', meta: '95.000 km' }, { name: 'SUV 2020', meta: '47.000 km' }] },
    seoTitle: 'Páginas web para agencias de autos | Webazo',
    seoDescription: 'Catálogo online para agencias de autos usados con fotos, filtros y consultas por WhatsApp.',
  },
  {
    slug: 'mayoristas', name: 'Mayorista / distribuidora', featured: true,
    title: 'Catálogo online para vender por mayor',
    lead: 'Tus clientes ven productos, eligen cantidades y te piden cotización sin llamarte ni esperar respuesta.',
    pains: [
      { title: 'Listas de precios en PDF', text: 'Desactualizadas apenas las mandás, y nadie las lee completas.' },
      { title: 'Pedidos con errores', text: 'Audios, fotos y mensajes sueltos que hay que pasar a mano.' },
      { title: 'Vendedores tapados de consultas', text: 'Tiempo que se va en responder lo que podría verse en una web.' },
    ],
    features: ['Catálogo con buscador y categorías', 'Carrito de cotización', 'Panel para cargar productos y precios', 'Pedidos ordenados en un solo lugar'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una distribuidora y quiero un catálogo online', demo: 'catalogo',
    demoData: { biz: 'Distribuidora Sur', subtitle: 'Catálogo mayorista', items: [{ name: 'Yerba mate 1 kg', meta: 'Caja x 10' }, { name: 'Café molido 500 g', meta: 'Caja x 12' }, { name: 'Azúcar 1 kg', meta: 'Bulto x 10' }, { name: 'Galletitas surtidas', meta: 'Caja x 24' }] },
    seoTitle: 'Catálogo online para mayoristas y distribuidoras | Webazo',
    seoDescription: 'Catálogo web con cotizador para mayoristas y distribuidoras. Menos mensajes, más pedidos.',
  },
  {
    slug: 'tiendas', name: 'Tienda de ropa / accesorios',
    title: 'Tu tienda online, sin comisiones',
    lead: 'Catálogo con talles, colores y precios. Te piden por WhatsApp con el carrito armado y vos cerrás la venta.',
    pains: [
      { title: '“¿Precio?” en cada foto', text: 'Respondés lo mismo cien veces por día.' },
      { title: 'Stock que no se ve', text: 'Talles y colores que hay que aclarar uno por uno.' },
      { title: 'Comisiones de plataformas', text: 'Cada venta en un marketplace se lleva una parte grande.' },
    ],
    features: ['Catálogo con talles, colores y precios', 'Carrito que arma el pedido por WhatsApp', 'Panel para cargar productos', 'Promos y destacados'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una tienda y quiero mi catálogo online', demo: 'catalogo',
    demoData: { biz: 'Moda Norte', subtitle: 'Nueva temporada', items: [{ name: 'Remera oversize', meta: 'Talles S a XL' }, { name: 'Jean recto', meta: 'Talles 36 a 46' }, { name: 'Buzo con capucha', meta: 'Talles S a XXL' }, { name: 'Gorra', meta: 'Talle único' }] },
    seoTitle: 'Tienda online para locales de ropa | Webazo',
    seoDescription: 'Catálogo online con carrito por WhatsApp para tiendas de ropa y accesorios. Sin comisiones.',
  },
  {
    slug: 'ferreterias', name: 'Ferretería / corralón',
    title: 'Tu ferretería o corralón, online',
    lead: 'Que te encuentren en Google, vean lo que tenés y te pidan presupuesto con la lista de materiales armada.',
    pains: [
      { title: 'Presupuestos por teléfono', text: 'Listas largas dictadas que terminan con errores.' },
      { title: 'No saben qué tenés', text: 'El cliente va al corralón grande porque no sabe que vos lo tenés.' },
      { title: 'Sin presencia en Google', text: 'Cuando buscan “ferretería cerca”, no aparecés.' },
    ],
    features: ['Catálogo por rubro: electricidad, plomería, pinturas', 'Pedido de presupuesto con lista', 'Envíos y zonas de entrega', 'Ubicación y horarios en Google'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo una ferretería y quiero mi web', demo: 'catalogo',
    demoData: { biz: 'Ferretería Oeste', subtitle: 'Pedí tu presupuesto', items: [{ name: 'Cemento 50 kg', meta: 'Bolsa' }, { name: 'Caño termofusión 20 mm', meta: 'Tira 4 m' }, { name: 'Látex interior 20 L', meta: 'Lata' }, { name: 'Cable 2,5 mm', meta: 'Rollo 100 m' }] },
    seoTitle: 'Páginas web para ferreterías y corralones | Webazo',
    seoDescription: 'Web con catálogo y pedido de presupuesto para ferreterías y corralones de materiales.',
  },
  {
    slug: 'gastronomia', name: 'Gastronomía', featured: false,
    title: 'Tu carta online y pedidos por WhatsApp',
    lead: 'Menú siempre actualizado, pedidos ordenados y tu local en Google con fotos, horarios y ubicación.',
    pains: [
      { title: 'La carta en PDF no se lee', text: 'En el celu hay que hacer zoom y nadie llega al final.' },
      { title: 'Pedidos desordenados', text: 'Mensajes, audios y errores en las comandas.' },
      { title: 'Comisiones de las apps', text: 'Cada pedido por app es plata que no te queda.' },
    ],
    features: ['Menú online con fotos y QR', 'Pedidos por WhatsApp ya armados', 'Precios que cambiás vos', 'Tu local en Google Maps'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo un local gastronómico y quiero mi web', demo: 'catalogo',
    demoData: { biz: 'La Esquina', subtitle: 'Pedí por WhatsApp', items: [{ name: 'Hamburguesa doble', meta: 'Con papas' }, { name: 'Pizza muzzarella', meta: '8 porciones' }, { name: 'Empanadas', meta: 'Docena' }, { name: 'Gaseosa 1,5 L', meta: 'Botella' }] },
    seoTitle: 'Menú online y web para gastronomía | Webazo',
    seoDescription: 'Carta online con QR, pedidos por WhatsApp y presencia en Google para restaurantes, bares y rotiserías.',
  },
  {
    slug: 'gimnasios', name: 'Gimnasio / entrenador',
    title: 'Más socios para tu gimnasio',
    lead: 'Planes, horarios de clases y clase de prueba en una web que convence. Para gimnasios, boxes, estudios y entrenadores.',
    pains: [
      { title: 'Preguntan precios y no vuelven', text: 'Sin una web clara, el interesado se enfría.' },
      { title: 'Grilla de clases desactualizada', text: 'Fotos de horarios viejas dando vueltas por Instagram.' },
      { title: 'Nadie prueba', text: 'Sin un botón de clase gratis, cuesta dar el primer paso.' },
    ],
    features: ['Planes y precios claros', 'Grilla de clases por día', 'Reserva de clase de prueba', 'Galería del espacio'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo un gimnasio y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Fuerza Gym', subtitle: 'Lunes a sábado, de 7 a 23 hs', items: [{ name: 'Pase libre', meta: 'Mensual' }, { name: 'Funcional', meta: '3 veces x semana' }, { name: 'Musculación', meta: 'Mensual' }, { name: 'Clase de prueba', meta: 'Gratis' }] },
    seoTitle: 'Páginas web para gimnasios y entrenadores | Webazo',
    seoDescription: 'Web para gimnasios, boxes y entrenadores con planes, grilla de clases y clase de prueba.',
  },
  {
    slug: 'veterinarias', name: 'Veterinaria / pet shop',
    title: 'Tu veterinaria con turnos online',
    lead: 'Consultas, vacunas y baños con turno online, más el catálogo de tu pet shop. Todo desde el celu.',
    pains: [
      { title: 'Turnos por teléfono', text: 'Llamadas en medio de una consulta.' },
      { title: 'Recordatorios a mano', text: 'Vacunas y desparasitaciones que se olvidan.' },
      { title: 'El pet shop no se ve', text: 'Tus productos solo los ve quien entra al local.' },
    ],
    features: ['Turnos online para consulta, vacunas y peluquería', 'Catálogo del pet shop', 'Guardias y urgencias destacadas', 'Ubicación y horarios en Google'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una veterinaria y quiero mi web', demo: 'turnos',
    demoData: { biz: 'Veterinaria Patitas', items: [{ name: 'Consulta clínica', meta: '30 min' }, { name: 'Vacunación', meta: '15 min' }, { name: 'Baño y corte', meta: '60 min' }] },
    seoTitle: 'Páginas web para veterinarias y pet shops | Webazo',
    seoDescription: 'Web con turnos online para veterinarias y catálogo para pet shops. Online en días.',
  },
  {
    slug: 'inmobiliarias', name: 'Inmobiliaria',
    title: 'Tus propiedades, en una web propia',
    lead: 'Catálogo de propiedades con fotos, filtros y consulta directa por WhatsApp. Sin depender solo de los portales.',
    pains: [
      { title: 'Todo depende de los portales', text: 'Pagás por publicar y tu marca queda en segundo plano.' },
      { title: 'Fichas desactualizadas', text: 'Propiedades vendidas que siguen recibiendo consultas.' },
      { title: 'Consultas sin datos', text: 'No sabés por qué propiedad te escriben.' },
    ],
    features: ['Catálogo con fotos, ambientes y precio', 'Filtros por zona, tipo y operación', 'Consulta por WhatsApp con la propiedad', 'Panel para cargar y dar de baja'],
    recommendedPack: 'golazo', whatsappMessage: 'Hola! Tengo una inmobiliaria y quiero mi web', demo: 'catalogo',
    demoData: { biz: 'Inmobiliaria Centro', subtitle: 'Venta y alquiler', items: [{ name: 'Depto 2 amb. Caballito', meta: 'Venta' }, { name: 'PH 3 amb. Flores', meta: 'Venta' }, { name: 'Monoambiente Almagro', meta: 'Alquiler' }, { name: 'Casa 4 amb. Ramos', meta: 'Venta' }] },
    seoTitle: 'Páginas web para inmobiliarias | Webazo',
    seoDescription: 'Web para inmobiliarias con catálogo de propiedades, filtros y consultas por WhatsApp.',
  },
  {
    slug: 'oficios', name: 'Oficios (plomero, electricista, gasista)',
    title: 'Más trabajos para tu oficio',
    lead: 'Plomeros, electricistas, gasistas, pintores y técnicos: que te encuentren en Google y te escriban con el problema ya contado.',
    pains: [
      { title: 'Dependés de recomendaciones', text: 'Si no te pasan el número, no te llaman.' },
      { title: 'No aparecés en Google', text: 'El que busca “plomero urgente” llama al primero que ve.' },
      { title: 'Mensajes sin datos', text: 'Idas y vueltas para saber qué necesitan y dónde.' },
    ],
    features: ['Servicios y zonas de trabajo', 'Botón de urgencias por WhatsApp', 'Fotos de trabajos realizados', 'Matrícula y garantía destacadas'],
    recommendedPack: 'arranque', whatsappMessage: 'Hola! Trabajo de oficio y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Instalaciones Pérez', subtitle: 'CABA y zona oeste', items: [{ name: 'Destapaciones', meta: 'Urgencias 24 hs' }, { name: 'Instalación de gas', meta: 'Gasista matriculado' }, { name: 'Electricidad', meta: 'Presupuesto sin cargo' }, { name: 'Pérdidas de agua', meta: 'Con turno' }] },
    seoTitle: 'Páginas web para plomeros, electricistas y gasistas | Webazo',
    seoDescription: 'Web para oficios: plomeros, electricistas, gasistas y técnicos. Aparecé en Google y recibí más trabajos.',
  },
  {
    slug: 'profesionales', name: 'Profesional (contador, abogado, etc.)',
    title: 'Tu web profesional, lista en días',
    lead: 'Para contadores, abogados, arquitectos, psicólogos y más. Que te encuentren, te conozcan y te consulten.',
    pains: [
      { title: 'Dependés del boca en boca', text: 'Sin web, los que no te conocen no tienen cómo llegar a vos.' },
      { title: 'No transmitís confianza', text: 'Un profesional sin web propia se ve menos serio que la competencia.' },
      { title: 'Coordinás todo por mensaje', text: 'Consultas y turnos que se podrían resolver solos.' },
    ],
    features: ['Presentación profesional y servicios', 'Turnos o formulario de consulta', 'Aparecés en Google', 'Dominio propio y mail profesional'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Soy profesional y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Estudio Contable Gómez', subtitle: 'Lunes a viernes, de 9 a 18 hs', items: [{ name: 'Monotributo', meta: 'Alta y gestión' }, { name: 'Sociedades', meta: 'Constitución' }, { name: 'Liquidación de sueldos', meta: 'Mensual' }, { name: 'Primera consulta', meta: 'Sin cargo' }] },
    seoTitle: 'Páginas web para profesionales | Webazo',
    seoDescription: 'Web profesional para contadores, abogados, arquitectos y más. Turnos online y presencia en Google.',
  },
  {
    slug: 'educacion', name: 'Academia / clases',
    title: 'Más alumnos para tus clases',
    lead: 'Institutos, academias de idiomas o música y profesores particulares: cursos, horarios e inscripción online.',
    pains: [
      { title: 'Info dispersa', text: 'Horarios, precios y niveles explicados uno por uno.' },
      { title: 'Inscripciones a mano', text: 'Planillas y transferencias que hay que controlar.' },
      { title: 'Poca visibilidad', text: 'Los alumnos nuevos no saben que existís.' },
    ],
    features: ['Cursos con niveles, horarios y precios', 'Formulario de inscripción', 'Clase de prueba o nivelación', 'Testimonios de alumnos'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Doy clases y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Instituto Idiomas Sur', subtitle: 'Inscripciones abiertas', items: [{ name: 'Inglés inicial', meta: 'Martes y jueves' }, { name: 'Inglés intermedio', meta: 'Lunes y miércoles' }, { name: 'Conversación', meta: 'Sábados' }, { name: 'Test de nivel', meta: 'Gratis' }] },
    seoTitle: 'Páginas web para academias, institutos y profesores | Webazo',
    seoDescription: 'Web para academias, institutos y profesores particulares con cursos, horarios e inscripción online.',
  },
  {
    slug: 'eventos', name: 'Eventos (salones, DJ, fotógrafos)',
    title: 'Llená tu agenda de eventos',
    lead: 'Salones, DJ, catering, fotógrafos y animación: mostrá tu trabajo y recibí pedidos de presupuesto con fecha y cantidad de invitados.',
    pains: [
      { title: 'Presupuestos sin datos', text: '“¿Cuánto sale?” sin fecha, lugar ni invitados.' },
      { title: 'Tu trabajo no se luce', text: 'Las mejores fotos perdidas en el feed.' },
      { title: 'Fechas que se pisan', text: 'Coordinar disponibilidad por chat es un lío.' },
    ],
    features: ['Galería de eventos realizados', 'Paquetes y servicios', 'Pedido de presupuesto con fecha e invitados', 'Testimonios de clientes'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Trabajo en eventos y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Salón Los Álamos', subtitle: 'Hasta 150 invitados', items: [{ name: 'Cumpleaños de 15', meta: 'Paquete completo' }, { name: 'Casamientos', meta: 'Con catering' }, { name: 'Eventos empresariales', meta: 'Lunes a jueves' }, { name: 'Infantiles', meta: 'Con animación' }] },
    seoTitle: 'Páginas web para salones y servicios de eventos | Webazo',
    seoDescription: 'Web para salones de eventos, DJ, catering y fotógrafos con galería y pedido de presupuesto.',
  },
  {
    slug: 'alojamiento', name: 'Alojamiento / turismo',
    title: 'Reservas directas, sin comisiones',
    lead: 'Cabañas, hostels, departamentos temporarios y excursiones: fotos, disponibilidad y consulta directa por WhatsApp.',
    pains: [
      { title: 'Comisiones de las plataformas', text: 'Cada reserva por app te descuenta una parte importante.' },
      { title: 'Consultas repetidas', text: 'Precios, fechas y servicios explicados mil veces.' },
      { title: 'Huéspedes que no vuelven', text: 'Sin canal propio, el cliente es de la plataforma.' },
    ],
    features: ['Galería de habitaciones o unidades', 'Tarifas por temporada', 'Consulta de disponibilidad por WhatsApp', 'Mapa, servicios y cómo llegar'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Tengo un alojamiento y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Cabañas del Lago', subtitle: 'Temporada de verano', items: [{ name: 'Cabaña 2 personas', meta: 'Con desayuno' }, { name: 'Cabaña 4 personas', meta: 'Con parrilla' }, { name: 'Cabaña 6 personas', meta: 'Vista al lago' }, { name: 'Excursión en kayak', meta: 'Medio día' }] },
    seoTitle: 'Páginas web para cabañas, hostels y alojamientos | Webazo',
    seoDescription: 'Web para alojamientos y turismo con galería, tarifas y reservas directas por WhatsApp.',
  },
  {
    slug: 'limpieza', name: 'Servicios para empresas',
    title: 'Conseguí clientes empresa',
    lead: 'Limpieza, seguridad, mantenimiento, fumigación y logística: una web seria que te abre puertas con empresas y consorcios.',
    pains: [
      { title: 'Sin web, no te toman en serio', text: 'Las empresas buscan proveedores en Google antes de llamar.' },
      { title: 'Propuestas que no llegan', text: 'Sin un lugar donde mostrar experiencia y servicios.' },
      { title: 'Consultas mal enfocadas', text: 'Llamados que no son tu cliente ideal.' },
    ],
    features: ['Servicios y sectores que atendés', 'Clientes y experiencia', 'Pedido de cotización para empresas', 'Mail profesional con tu dominio'],
    recommendedPack: 'negocio', whatsappMessage: 'Hola! Brindo servicios a empresas y quiero mi web', demo: 'servicios',
    demoData: { biz: 'Limpieza Integral BA', subtitle: 'Empresas y consorcios', items: [{ name: 'Limpieza de oficinas', meta: 'Diaria o semanal' }, { name: 'Consorcios', meta: 'Abono mensual' }, { name: 'Final de obra', meta: 'Por proyecto' }, { name: 'Vidrios en altura', meta: 'Con certificación' }] },
    seoTitle: 'Páginas web para empresas de servicios | Webazo',
    seoDescription: 'Web profesional para empresas de limpieza, seguridad, mantenimiento y servicios B2B.',
  },
];

export const RUBRO_NAMES = [...RUBROS.map((r) => r.name), 'Otro'];

export function getRubro(slug: string) {
  return RUBROS.find((r) => r.slug === slug);
}
