-- Datos iniciales (podés editarlos después desde /admin)

insert into public.packs (slug, name, tagline, price_usd, price_before_usd, price_note, features, featured, cta_label, sort_order) values
('arranque', 'Arranque', 'Para estar en internet ya, con lo justo y necesario.', 80, 150, 'Precio de lanzamiento',
  array['Página de una sección con tus servicios','Botón de WhatsApp, mapa y horarios','Alta en Google Maps','Online en 72 hs'], false, 'Quiero el Arranque', 1),
('negocio', 'Negocio', 'Para comercios que quieren verse serios y vender más.', 180, 350, 'Precio de lanzamiento',
  array['Hasta 5 secciones','Catálogo de productos o servicios','Formulario de contacto','SEO para aparecer en Google','Estadísticas de visitas'], false, 'Quiero el Negocio', 2),
('golazo', 'Golazo', 'Un sistema a medida que trabaja por vos.', 400, 700, 'Precio de lanzamiento',
  array['Todo lo del pack Negocio','Turnos online, pedidos o cotizador','Panel para administrar todo vos','Hecho a la medida de tu negocio'], true, 'Quiero el Golazo', 3)
on conflict (slug) do nothing;

insert into public.settings (key, value) values
('monthly', '{"price_usd": 10, "title": "Mantenimiento mensual", "description": "Hosting, dominio, cambios cuando los necesites y soporte. Te olvidás de todo y tu web siempre está andando."}'),
('launch_banner', '{"enabled": true, "text": "Precios de lanzamiento por tiempo limitado"}')
on conflict (key) do nothing;

insert into public.faqs (question, answer, sort_order) values
('¿Cuánto tarda?', 'Con el pack Arranque, en 72 hs estás online. Los sistemas a medida llevan un poco más y te pasamos la fecha antes de arrancar.', 1),
('¿El dominio es mío?', 'Sí. Lo registramos a tu nombre: la web y el dominio son tuyos.', 2),
('¿Qué necesito para arrancar?', 'Tu logo, algunas fotos y qué hace tu negocio. Si no tenés algo, te ayudamos a armarlo.', 3),
('¿Puedo hacer cambios después?', 'Sí. Con el mantenimiento mensual te hacemos los cambios que necesites, sin que tengas que tocar nada.', 4),
('¿Cómo se paga?', '50% para arrancar y 50% cuando te entregamos la web. Por transferencia o Mercado Pago.', 5);
