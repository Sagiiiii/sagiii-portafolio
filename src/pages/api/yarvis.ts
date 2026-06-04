import type { APIRoute } from 'astro';

export const prerender = false;

interface YarvisResponse {
  respuesta: string;
  accion: { tipo: string; url?: string; target?: string; valor?: string; selector?: string } | null;
  sugerencias?: string[];
}

function match(msg: string, ...keywords: string[]): boolean {
  return keywords.some(k => msg.includes(k));
}

const CURIOSIDADES = [
  'Python fue creado en 1991 y su nombre viene de Monty Python, no de la serpiente.',
  'el primer e-commerce del mundo fue Pizza Hut en 1994, antes que Amazon.',
  'JavaScript fue creado en solo 10 días en 1995. Hoy es el lenguaje más usado del mundo.',
  'MongoDB se llama así por "humongous" — fue diseñado para manejar datos masivos.',
  'Huancayo está a 3,260 metros sobre el nivel del mar, pero eso no impide conectarse con clientes de todo el mundo.',
  'el primer sitio web con imágenes apareció en 1993. Antes todo era texto plano.',
  'Angular fue creado por Google y hoy impulsa apps usadas por millones de personas.',
  'el 95% de los sitios web del mundo usan JavaScript de alguna forma.',
  'Flask, el framework que usa Sagiii, corre en producción en empresas como Netflix y LinkedIn.',
  'el término "bug" en programación viene de un insecto real que se encontró dentro de un computador en 1947.',
];

function getCuriosidad(msg: string): string {
  return CURIOSIDADES[msg.length % CURIOSIDADES.length];
}

function getResponse(message: string): YarvisResponse {
  const msg = message.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Saludos
  if (match(msg, 'hola', 'buenas', 'buen dia', 'hey', 'hi', 'hello', 'buenas tardes', 'buenas noches', 'saludos'))
    return {
      respuesta: '¡Hola! Soy Yarvis, el asistente de Sagiii. Puedo contarte sobre sus servicios, proyectos, precios o proceso de trabajo. ¿Por dónde empezamos?',
      accion: null,
      sugerencias: ['¿Qué hace Sagiii?', '¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?', '¿Qué tecnologías usa?'],
    };

  if (match(msg, 'gracias', 'thanks', 'thank you', 'perfecto', 'excelente', 'genial', 'buenisimo', 'chevere'))
    return {
      respuesta: 'Con gusto. Si necesitas algo más, aquí estoy.',
      accion: null,
      sugerencias: ['¿Cómo lo contrato?', 'Ver proyectos', '¿Cuánto cobran los proyectos?'],
    };

  // Tiempo de entrega (antes de precios para evitar colisión con "cuanto")
  if (match(msg, 'tarda', 'demora', 'plazo', 'rapido', 'velocidad', 'cuanto demora', 'dias', 'semanas', 'cuanto tiempo'))
    return {
      respuesta: 'Depende de la complejidad. Una landing page puede estar lista en 1-2 semanas. Un e-commerce o sistema a medida toma entre 4 y 8 semanas. Sagiii define plazos reales desde el inicio, sin prometer fechas imposibles.',
      accion: null,
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Hay soporte después de la entrega?', '¿Cómo es el proceso?'],
    };

  // Precios
  if (match(msg, 'precio', 'costo', 'cobr', 'cuesta', 'cuanto', 'presupuesto', 'tarifa', 'vale', 'inversion', 'paga'))
    return {
      respuesta: 'Los proyectos van de S/2,000 a S/5,000 según complejidad. Se cobra por hitos: adelanto al inicio, pago parcial con avances y saldo en la entrega final. No hay costos sorpresa.',
      accion: null,
      sugerencias: ['¿Cuánto tarda un proyecto?', '¿Hay soporte después de la entrega?', '¿Cómo es el proceso de trabajo?'],
    };

  // Qué hace
  if (match(msg, 'que hace', 'servicios', 'ofrece', 'dedica', 'especializa', 'que es'))
    return {
      respuesta: 'Sagiii es Full Stack Developer y Data Scientist freelance en Huancayo, Perú. Hace desarrollo web (e-commerce, landing pages, sistemas a medida), integración de sistemas, soporte TIC y data science aplicado para empresas.',
      accion: null,
      sugerencias: ['¿Qué tecnologías usa?', '¿Hace e-commerce?', '¿Cuáles son sus clientes?'],
    };

  // Tecnologías
  if (match(msg, 'tecnolog', 'stack', 'lenguaje', 'herramienta', 'programa', 'framework', 'python', 'javascript', 'angular'))
    return {
      respuesta: 'Stack principal: Python, JavaScript, Angular, MongoDB, MySQL y Flask. Trabaja con lo que el proyecto necesite, no se casa con una sola tecnología.',
      accion: null,
      sugerencias: ['¿También hace data science?', '¿Hace e-commerce?', '¿Cuánto cobran los proyectos?'],
    };

  // Proceso de contratación
  if (match(msg, 'contratar', 'cotizar', 'proceso', 'metodologia', 'como trabajo', 'como funciona', 'pasos'))
    return {
      respuesta: 'Simple: contactas a Sagiii, describes tu proyecto, él analiza y da un presupuesto. Si acuerdan, arranca el desarrollo por hitos con revisiones en cada etapa. Trato directo, sin burocracia.',
      accion: { tipo: 'navegar', url: '/contact' },
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cuánto tarda un proyecto?', '¿Hay soporte después de la entrega?'],
    };


  // Soporte post-entrega
  if (match(msg, 'soporte', 'garantia', 'despues', 'mantenimiento', 'post entrega', 'bugs', 'errores', 'actualizacion'))
    return {
      respuesta: 'Sí, hay soporte post-entrega opcional. Sagiii no desaparece después de entregar. Puede incluir mantenimiento, corrección de bugs y actualizaciones, según lo que acuerden desde el inicio.',
      accion: null,
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?', '¿Qué hace Sagiii?'],
    };

  // Clientes y casos reales
  if (match(msg, 'clientes', 'empresas', 'trabajado con', 'casos', 'ejemplos', 'referencias', 'quien ha'))
    return {
      respuesta: 'Clientes reales: Soreus Motors (e-commerce + inventario), Centro de Distribución DXN (web corporativa + gestión de eventos) y Colegio Praxis (soporte TIC). Cada uno con solución a medida, no plantillas genéricas.',
      accion: null,
      sugerencias: ['Ver proyectos completos', '¿Hace proyectos fuera de Huancayo?', '¿Cuánto cobran los proyectos?'],
    };

  // E-commerce
  if (match(msg, 'ecommerce', 'e-commerce', 'tienda online', 'tienda virtual', 'venta online', 'carrito', 'shop', 'woocommerce', 'shopify'))
    return {
      respuesta: 'Sí, e-commerce es una de sus especialidades. Desarrolló la tienda de Soreus Motors con sistema de inventario integrado: catálogo, carrito, pagos y panel admin. Todo a medida, sin depender de Shopify ni WooCommerce.',
      accion: null,
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cuáles son sus clientes?', '¿Cómo lo contrato?'],
    };

  // Data science
  if (match(msg, 'data science', 'datos', 'analisis', 'inteligencia artificial', 'machine learning', 'reportes', 'dashboard', ' ia ', ' ai '))
    return {
      respuesta: 'Sí, hace data science aplicado: análisis de datos de negocio, dashboards interactivos, automatización de reportes y modelos básicos de ML. Ideal para empresas que tienen datos pero no los aprovechan.',
      accion: null,
      sugerencias: ['¿Qué tecnologías usa?', '¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?'],
    };

  // Integración de sistemas
  if (match(msg, 'integracion', 'sistemas', 'api', 'conectar', 'automatizar', 'automatizacion', 'procesos', 'erp', 'crm'))
    return {
      respuesta: 'Hace integración de sistemas: conecta plataformas, automatiza procesos manuales y construye APIs. Si tienes herramientas que no se comunican entre sí o procesos que se hacen a mano, ese es el problema que resuelve.',
      accion: null,
      sugerencias: ['¿Qué tecnologías usa?', '¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?'],
    };

  // Landing pages
  if (match(msg, 'landing', 'pagina web', 'página web', 'sitio web', 'web corporativa', 'pagina corporativa'))
    return {
      respuesta: 'Hace landing pages y sitios corporativos optimizados para convertir visitas en contactos. Diseño profesional, rápidos y adaptados a móvil. No usa plantillas, todo es a medida.',
      accion: null,
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cuánto tarda un proyecto?', '¿Cómo lo contrato?'],
    };

  // Diferencia vs agencias
  if (match(msg, 'agencia', 'diferente', 'diferencia', 'ventaja', 'por que elegir', 'mejor que', 'freelancer vs'))
    return {
      respuesta: 'Trato directo sin intermediarios. Formación internacional con conocimiento del mercado local peruano. No vende paquetes genéricos — analiza tu negocio y diseña la solución. Y siempre está disponible después de entregar.',
      accion: null,
      sugerencias: ['¿Cuáles son sus clientes?', '¿Cuánto cobran los proyectos?', '¿Qué hace Sagiii?'],
    };

  // Formación / estudios
  if (match(msg, 'estudio', 'formacion', 'carrera', 'universidad', 'titulo', 'florida', 'donde estudio', 'certificacion'))
    return {
      respuesta: 'Estudió en el Instituto técnico de software en Huancayo, luego Ingeniería de Sistemas en la Universidad Continental. También hizo estudios de modalidad distancia en Florida, USA — eso le dio perspectiva técnica y de mercado internacional.',
      accion: null,
      sugerencias: ['¿Qué hace Sagiii?', '¿Qué tecnologías usa?', '¿Hace proyectos fuera de Huancayo?'],
    };

  // Trabaja fuera de Huancayo / remoto
  if (match(msg, 'fuera de huancayo', 'lima', 'otra ciudad', 'otro pais', 'extranjero', 'internacional', 'remoto', 'online'))
    return {
      respuesta: 'Sí, trabaja con clientes de cualquier parte de Perú y del extranjero. Todo se gestiona de forma remota: reuniones por videollamada, entregas digitales y soporte online. La ubicación no es un límite.',
      accion: null,
      sugerencias: ['¿Cómo lo contrato?', '¿Cuánto cobran los proyectos?', '¿Qué hace Sagiii?'],
    };

  // Ubicación
  if (match(msg, 'donde esta', 'donde vive', 'ubicacion', 'huancayo', 'peru', 'presencial'))
    return {
      respuesta: 'Está basado en Huancayo, Perú (3,260 msnm). Trabaja principalmente de forma remota. Para proyectos locales en Huancayo puede coordinar atención presencial si el proyecto lo necesita.',
      accion: null,
      sugerencias: ['¿Hace proyectos fuera de Huancayo?', '¿Cómo lo contrato?', '¿Qué hace Sagiii?'],
    };

  // Navegación — proyectos
  if (match(msg, 'proyecto', 'portafolio', 'trabajos', 'ver su trabajo', 'muestra', 'ver mas'))
    return {
      respuesta: 'Aquí están los proyectos de Sagiii.',
      accion: { tipo: 'navegar', url: '/projects' },
      sugerencias: ['¿Cuáles son sus clientes?', '¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?'],
    };

  // Sobre Sagiii
  if (match(msg, 'about', 'quien es', 'historia de sagiii', 'experiencia de', 'conocer mas', 'sobre sagiii', 'sobre el desarrollador'))
    return {
      respuesta: 'Te cuento más sobre Sagiii.',
      accion: { tipo: 'navegar', url: '/about' },
      sugerencias: ['¿Qué hace Sagiii?', '¿Qué tecnologías usa?', '¿Cuáles son sus clientes?'],
    };

  // Contacto
  if (match(msg, 'contacto', 'contactar', 'escribir', 'mensaje', 'email', 'correo', 'formulario'))
    return {
      respuesta: 'Te llevo a la página de contacto.',
      accion: { tipo: 'navegar', url: '/contact' },
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cómo es el proceso?'],
    };

  // WhatsApp
  if (match(msg, 'whatsapp', 'llamar', 'telefono', 'celular', 'numero', 'wsp', 'wa'))
    return {
      respuesta: 'Abriendo WhatsApp para contactar a Sagiii directamente.',
      accion: { tipo: 'link', url: 'https://wa.me/51985000716' },
      sugerencias: ['¿Cuánto cobran los proyectos?', '¿Cómo es el proceso?'],
    };

  // GitHub
  if (match(msg, 'github', 'repositorio', 'codigo', 'repo', 'open source'))
    return {
      respuesta: 'Abriendo el GitHub de Sagiii.',
      accion: { tipo: 'link', url: 'https://github.com/Sagiiiii' },
      sugerencias: ['Ver proyectos', '¿Qué tecnologías usa?'],
    };

  // Scroll
  if (match(msg, 'inicio', 'home', 'arriba', 'subir', 'volver'))
    return {
      respuesta: 'Voy al inicio.',
      accion: { tipo: 'scroll', target: 'top' },
      sugerencias: ['¿Qué hace Sagiii?', '¿Cuánto cobran los proyectos?'],
    };

  // Default — dato curioso
  const curiosidad = getCuriosidad(message);
  return {
    respuesta: `No tengo esa información exacta, pero dato curioso: ${curiosidad} Para consultas específicas, lo mejor es escribirle directamente a Sagiii.`,
    accion: null,
    sugerencias: ['¿Qué hace Sagiii?', '¿Cuánto cobran los proyectos?', '¿Cómo lo contrato?', 'Contactar a Sagiii'],
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message } = body as { message: string };

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Mensaje vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = getResponse(message.trim());

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ respuesta: 'Error al procesar tu mensaje. Intenta de nuevo.', accion: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
