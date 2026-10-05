// Contenido único por rubro para SEO: intro y preguntas frecuentes propias.
// Google premia contenido útil y específico; por eso cada rubro tiene su texto.

export type RubroSeo = { keyword: string; intro: string[]; faqs: { question: string; answer: string }[] };

export const RUBRO_SEO: Record<string, RubroSeo> = {
  barberias: {
    keyword: 'página web para barberías',
    intro: [
      'Una página web para barberías tiene un trabajo concreto: que el cliente vea los servicios, elija horario y reserve sin escribirte. Mientras cortás, la agenda se completa sola.',
      'Además, con una web propia tu barbería aparece cuando alguien busca “barbería cerca” o “corte de pelo” en tu barrio, y no dependés solo de Instagram para que te encuentren.',
    ],
    faqs: [
      { question: '¿Cómo funcionan los turnos online para una barbería?', answer: 'El cliente entra a tu web, elige el servicio (corte, barba, perfilado), el barbero y el horario disponible, y confirma. Vos ves todos los turnos en un panel y podés moverlos o cancelarlos.' },
      { question: '¿Puedo tener varios barberos con agendas distintas?', answer: 'Sí. Cada barbero puede tener sus servicios y horarios, y el cliente elige con quién quiere atenderse.' },
      { question: '¿La web de mi barbería aparece en Google?', answer: 'La armamos optimizada para búsquedas locales y te ayudamos a vincularla con tu perfil de Google Maps, que es lo que más pesa para aparecer en tu zona.' },
    ],
  },
  estetica: {
    keyword: 'página web para centros de estética',
    intro: [
      'En estética, uñas y peluquería la clienta elige con los ojos. Una página web con galería de trabajos, lista de precios y turnos online convierte a quien te descubre en una reserva concreta.',
      'También te saca de encima las consultas repetidas por mensaje: precios, duración y horarios quedan claros en la web.',
    ],
    faqs: [
      { question: '¿Puedo mostrar fotos de mis trabajos en la web?', answer: 'Sí, incluimos una galería ordenada por servicio (uñas, cejas, pestañas, peluquería) que podés ir actualizando.' },
      { question: '¿Se pueden reservar turnos por profesional?', answer: 'Sí. Cada profesional puede tener su agenda y la clienta elige con quién y a qué hora.' },
      { question: '¿Sirve si trabajo sola desde mi casa?', answer: 'Sí. Muchas profesionales independientes usan la web para mostrar precios, trabajos y recibir turnos sin estar pendientes del celular.' },
    ],
  },
  tatuajes: {
    keyword: 'página web para estudios de tatuajes',
    intro: [
      'Una página web para un estudio de tatuajes funciona como portfolio y filtro: muestra el estilo de cada artista y ordena las consultas con zona, tamaño y referencia del diseño.',
      'Así dejás de responder “¿cuánto sale un tatuaje?” sin datos y recibís pedidos listos para presupuestar.',
    ],
    faqs: [
      { question: '¿Puedo tener un portfolio por artista?', answer: 'Sí. Cada artista tiene su sección con sus trabajos y estilos, y el cliente consulta directamente con quien prefiera.' },
      { question: '¿Cómo llegan las consultas?', answer: 'Con un formulario que pide zona del cuerpo, tamaño, estilo y una imagen de referencia, y te llega por WhatsApp o al panel.' },
      { question: '¿Se puede cobrar seña online?', answer: 'Se puede sumar el cobro de seña para confirmar la sesión y reducir las ausencias.' },
    ],
  },
  salud: {
    keyword: 'página web para consultorios',
    intro: [
      'Para un consultorio, la página web transmite confianza antes de la primera consulta: quién atiende, qué tratamientos ofrece, con qué obras sociales trabaja y cómo llegar.',
      'Con turnos online, los pacientes reservan a cualquier hora y se reducen las llamadas solo para pedir o cambiar un turno.',
    ],
    faqs: [
      { question: '¿Puedo indicar con qué obras sociales y prepagas atiendo?', answer: 'Sí, incluimos una sección con las coberturas que aceptás para que el paciente lo sepa antes de reservar.' },
      { question: '¿Los turnos online sirven para varios profesionales?', answer: 'Sí. Cada profesional tiene su agenda y sus prestaciones, y el paciente elige.' },
      { question: '¿La web cumple con la privacidad de los datos de los pacientes?', answer: 'Solo pedimos los datos necesarios para el turno y la web incluye política de privacidad. No se publican datos de salud.' },
    ],
  },
  talleres: {
    keyword: 'página web para talleres mecánicos y lubricentros',
    intro: [
      'La mayoría de los clientes de un taller o lubricentro busca en Google cuando tiene el problema: “cambio de aceite cerca” o “alineación y balanceo”. Si tenés página web, aparecés en ese momento.',
      'La web muestra tus servicios, horarios y ubicación, y deja pedir turno por WhatsApp con un toque.',
    ],
    faqs: [
      { question: '¿Puedo mostrar precios de servicios en la web?', answer: 'Sí, podés mostrar precios fijos (por ejemplo, cambio de aceite) o “consultar” para trabajos que dependen del vehículo.' },
      { question: '¿Los clientes pueden pedir turno online?', answer: 'Sí, con turno por WhatsApp ya armado o con reserva online según el pack.' },
      { question: '¿Sirve para un taller chico de barrio?', answer: 'Justamente: para un taller de barrio, aparecer en Google y Maps cuando buscan cerca es una de las formas más baratas de conseguir clientes nuevos.' },
    ],
  },
  autos: {
    keyword: 'página web para agencias de autos',
    intro: [
      'Una página web para una agencia de autos te permite tener tu stock en un solo lugar, con fotos, año, kilometraje y precio, y marcar como vendida cada unidad al instante.',
      'Las consultas llegan por WhatsApp con el auto ya identificado, y tu marca deja de depender solo de los portales.',
    ],
    faqs: [
      { question: '¿Puedo cargar y dar de baja autos yo mismo?', answer: 'Sí, con el pack Golazo tenés un panel para cargar unidades, fotos y precios, y marcarlas como vendidas.' },
      { question: '¿La web tiene filtros por marca y precio?', answer: 'Sí, el catálogo incluye filtros por marca, tipo, año y rango de precio.' },
      { question: '¿Puedo seguir publicando en portales?', answer: 'Claro. La web complementa los portales: te da un canal propio y profesional para mandar a tus clientes.' },
    ],
  },
  mayoristas: {
    keyword: 'catálogo online para mayoristas',
    intro: [
      'Para un mayorista o distribuidora, un catálogo online reemplaza las listas de precios en PDF: tus clientes ven productos siempre actualizados, eligen cantidades y te mandan el pedido armado.',
      'Menos audios y mensajes sueltos significa menos errores en los pedidos y más tiempo para vender.',
    ],
    faqs: [
      { question: '¿Puedo tener precios distintos para mayoristas?', answer: 'Sí, se pueden mostrar precios por bulto o caja y, si lo necesitás, ocultarlos para que los vean solo clientes registrados.' },
      { question: '¿Cómo me llegan los pedidos?', answer: 'El cliente arma el carrito y el pedido te llega por WhatsApp o al panel, con productos y cantidades.' },
      { question: '¿Puedo actualizar precios yo?', answer: 'Sí, desde el panel cargás y actualizás productos y precios cuando quieras.' },
    ],
  },
  tiendas: {
    keyword: 'tienda online para locales de ropa',
    intro: [
      'Una tienda online propia muestra tus prendas con talles, colores y precios, y el cliente te escribe con el pedido armado en vez de preguntar “¿precio?” en cada foto.',
      'Vendés sin pagar comisiones por cada venta y con tu propia marca.',
    ],
    faqs: [
      { question: '¿Necesito una plataforma de e-commerce?', answer: 'No necesariamente. Podemos armar un catálogo con carrito que te manda el pedido por WhatsApp, o una tienda con pago online según lo que necesites.' },
      { question: '¿Puedo marcar productos sin stock?', answer: 'Sí, desde el panel podés ocultar productos o marcar talles agotados.' },
      { question: '¿Sirve si vendo solo por Instagram?', answer: 'Sí. La web ordena tu catálogo y es el link que mandás desde Instagram para que el cliente compre más fácil.' },
    ],
  },
  ferreterias: {
    keyword: 'página web para ferreterías y corralones',
    intro: [
      'Muchos clientes no saben qué tenés en tu ferretería o corralón y terminan en una cadena grande. Una página web con tu catálogo por rubro cambia eso.',
      'Además, te pueden pedir presupuesto con la lista de materiales armada, sin dictarla por teléfono.',
    ],
    faqs: [
      { question: '¿Tengo que cargar todos mis productos?', answer: 'No. Podés empezar con los rubros y productos principales y sumar el resto de a poco.' },
      { question: '¿Cómo funciona el pedido de presupuesto?', answer: 'El cliente agrega productos y cantidades, y te llega la lista para cotizar por WhatsApp.' },
      { question: '¿Puedo mostrar zonas de envío?', answer: 'Sí, incluimos las zonas y condiciones de entrega.' },
    ],
  },
  gastronomia: {
    keyword: 'menú online y página web para restaurantes',
    intro: [
      'La carta en PDF no se lee bien en el celular. Un menú online con fotos y precios que actualizás vos, más pedidos por WhatsApp ya armados, mejora la experiencia y te ahorra errores.',
      'Con tu propia web también recibís pedidos directos, sin la comisión de las apps de delivery.',
    ],
    faqs: [
      { question: '¿Incluye código QR para las mesas?', answer: 'Sí, te damos el QR que lleva directo a tu menú online.' },
      { question: '¿Puedo cambiar los precios yo?', answer: 'Sí, desde el panel actualizás precios y platos en el momento.' },
      { question: '¿Cómo llegan los pedidos?', answer: 'El cliente arma su pedido en la web y te llega por WhatsApp con todo detallado.' },
    ],
  },
  gimnasios: {
    keyword: 'página web para gimnasios',
    intro: [
      'Una página web para gimnasios muestra planes, precios y la grilla de clases siempre actualizada, y facilita el primer paso con la reserva de una clase de prueba.',
      'Es el lugar al que llevar a la gente desde Instagram para que pase de “me interesa” a “voy a probar”.',
    ],
    faqs: [
      { question: '¿Puedo mostrar la grilla de clases por día?', answer: 'Sí, con horarios por actividad que podés actualizar.' },
      { question: '¿Se puede reservar una clase de prueba?', answer: 'Sí, el interesado deja sus datos y elige día y hora.' },
      { question: '¿Sirve para entrenadores personales?', answer: 'Sí, para mostrar servicios, planes y recibir consultas.' },
    ],
  },
  veterinarias: {
    keyword: 'página web para veterinarias',
    intro: [
      'Una página web para veterinarias ordena los turnos de consulta, vacunas y peluquería, y destaca la información de guardias y urgencias.',
      'Si tenés pet shop, también podés mostrar el catálogo de productos.',
    ],
    faqs: [
      { question: '¿Puedo destacar la guardia o urgencias?', answer: 'Sí, se muestra bien visible con horarios y contacto directo.' },
      { question: '¿Se pueden sacar turnos para peluquería canina?', answer: 'Sí, cada servicio puede tener su duración y horarios.' },
      { question: '¿Puedo sumar el catálogo del pet shop?', answer: 'Sí, con productos, precios y pedido por WhatsApp.' },
    ],
  },
  inmobiliarias: {
    keyword: 'página web para inmobiliarias',
    intro: [
      'Una web propia le da a tu inmobiliaria un canal de marca, con fichas de propiedades, fotos, filtros y consultas directas por WhatsApp.',
      'Complementa los portales y es el link profesional que mandás a tus clientes.',
    ],
    faqs: [
      { question: '¿Puedo cargar propiedades yo mismo?', answer: 'Sí, desde el panel cargás fichas con fotos, ambientes, precio y operación.' },
      { question: '¿Tiene filtros por zona y tipo de operación?', answer: 'Sí, por zona, tipo de propiedad, venta o alquiler y precio.' },
      { question: '¿Cómo llegan las consultas?', answer: 'Por WhatsApp, con la propiedad ya identificada.' },
    ],
  },
  oficios: {
    keyword: 'página web para plomeros, electricistas y gasistas',
    intro: [
      'Quien busca un plomero, electricista o gasista suele necesitarlo rápido y llama al primero que encuentra en Google. Con una página web propia, ese puede ser vos.',
      'La web muestra tus servicios, zonas de trabajo, matrícula y un botón directo de urgencias por WhatsApp.',
    ],
    faqs: [
      { question: '¿Me conviene una web si trabajo solo?', answer: 'Sí. Es una de las formas más simples de conseguir trabajos fuera de las recomendaciones.' },
      { question: '¿Puedo mostrar las zonas donde trabajo?', answer: 'Sí, listamos barrios y localidades para que el cliente sepa si llegás.' },
      { question: '¿Qué pack me conviene?', answer: 'El pack Arranque suele alcanzar: una página clara con servicios, zonas, matrícula y WhatsApp.' },
    ],
  },
  profesionales: {
    keyword: 'página web para profesionales',
    intro: [
      'Contadores, abogados, arquitectos y otros profesionales necesitan una web que transmita confianza: quién sos, qué servicios ofrecés y cómo contactarte.',
      'Con dominio propio y mail profesional, tu presencia se ve tan seria como tu trabajo.',
    ],
    faqs: [
      { question: '¿Incluye mail profesional con mi dominio?', answer: 'Se puede sumar una casilla del tipo vos@tuestudio.com.ar.' },
      { question: '¿Puedo recibir consultas o turnos?', answer: 'Sí, con formulario de consulta o turnos online, según tu forma de trabajo.' },
      { question: '¿Sirve para un estudio con varios profesionales?', answer: 'Sí, con una sección por profesional y sus áreas.' },
    ],
  },
  educacion: {
    keyword: 'página web para academias e institutos',
    intro: [
      'Una página web para academias e institutos presenta cursos, niveles, horarios y precios en un solo lugar, y permite inscribirse online.',
      'Ideal para captar alumnos nuevos y responder dudas antes de que pregunten.',
    ],
    faqs: [
      { question: '¿Puedo ofrecer un test de nivel o clase de prueba?', answer: 'Sí, con un formulario para que el interesado lo reserve.' },
      { question: '¿Sirve para profesores particulares?', answer: 'Sí, para mostrar materias, modalidad y recibir consultas.' },
      { question: '¿Puedo actualizar horarios y cursos?', answer: 'Sí, con el mantenimiento mensual o desde el panel, según el pack.' },
    ],
  },
  eventos: {
    keyword: 'página web para salones de eventos',
    intro: [
      'Salones, DJ, catering y fotógrafos venden con imágenes. Una página web con galería de eventos y paquetes claros genera confianza y pedidos de presupuesto con fecha y cantidad de invitados.',
      'Así dejás de responder “¿cuánto sale?” sin datos.',
    ],
    faqs: [
      { question: '¿El pedido de presupuesto incluye fecha e invitados?', answer: 'Sí, el formulario pide tipo de evento, fecha, cantidad de invitados y servicios.' },
      { question: '¿Puedo mostrar paquetes con precios?', answer: 'Sí, o mostrar “desde” y cotizar a medida.' },
      { question: '¿Sirve para fotógrafos?', answer: 'Sí, con portfolio por tipo de evento.' },
    ],
  },
  alojamiento: {
    keyword: 'página web para cabañas y alojamientos',
    intro: [
      'Con una página web propia, tu alojamiento recibe consultas y reservas directas, sin la comisión de las plataformas por cada estadía.',
      'La web muestra unidades, fotos, tarifas por temporada, servicios y cómo llegar.',
    ],
    faqs: [
      { question: '¿Puedo seguir publicando en plataformas de reservas?', answer: 'Sí. La web es tu canal directo para huéspedes que vuelven o que te encuentran por Google.' },
      { question: '¿Se puede consultar disponibilidad?', answer: 'Sí, por WhatsApp con fechas y cantidad de personas, o con un calendario según el pack.' },
      { question: '¿Puedo cambiar las tarifas por temporada?', answer: 'Sí, desde el panel o con el mantenimiento mensual.' },
    ],
  },
  limpieza: {
    keyword: 'página web para empresas de servicios',
    intro: [
      'Las empresas y consorcios buscan proveedores en Google antes de llamar. Una página web profesional para tu empresa de limpieza, seguridad o mantenimiento te pone en esa lista.',
      'Mostrá servicios, sectores, experiencia y un pedido de cotización pensado para empresas.',
    ],
    faqs: [
      { question: '¿Incluye pedido de cotización para empresas?', answer: 'Sí, con datos de la empresa, servicio, frecuencia y superficie.' },
      { question: '¿Puedo mostrar clientes con los que trabajo?', answer: 'Sí, siempre que tengas su autorización para mostrarlos.' },
      { question: '¿Sirve para licitaciones o grandes clientes?', answer: 'Una web profesional y un mail con dominio propio suman mucha credibilidad frente a empresas.' },
    ],
  },
};
