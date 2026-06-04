import type { APIRoute } from 'astro';

export const prerender = false;

interface YarvisResponse {
  respuesta: string;
  accion: { tipo: string; url?: string; target?: string; valor?: string; selector?: string } | null;
}

function match(msg: string, ...keywords: string[]): boolean {
  return keywords.some(k => msg.includes(k));
}

function getResponse(message: string): YarvisResponse {
  const msg = message.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Saludos
  if (match(msg, 'hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'hello'))
    return {
      respuesta: '¡Hola! Soy Yarvis, el asistente de Sagiii. Puedo contarte sobre sus servicios, tecnologías, proyectos o precios. ¿En qué te ayudo?',
      accion: null,
    };

  if (match(msg, 'gracias', 'thanks', 'thank you', 'perfecto', 'listo'))
    return { respuesta: 'Con gusto. Si necesitas algo más, aquí estoy.', accion: null };

  // Información (primero para evitar colisiones con navegación)
  if (match(msg, 'precio', 'costo', 'cobr', 'cuesta', 'cuanto', 'presupuesto', 'tarifa'))
    return {
      respuesta: 'Los proyectos van de S/2,000 a S/5,000 según complejidad. Se cobra por hitos: adelanto, entrega parcial y entrega final con soporte opcional.',
      accion: null,
    };

  if (match(msg, 'que hace', 'servicios', 'ofrece', 'dedica'))
    return {
      respuesta: 'Sagiii es Full Stack Developer y Data Scientist freelance en Huancayo, Perú. Hace desarrollo web (e-commerce, landing pages, sistemas a medida), integración de sistemas, soporte TIC y data science aplicado para empresas.',
      accion: null,
    };

  if (match(msg, 'tecnolog', 'stack', 'lenguaje', 'herramienta', 'programa'))
    return {
      respuesta: 'Stack principal: Python, JavaScript, Angular, MongoDB, MySQL y Flask. Usa lo que el proyecto necesite.',
      accion: null,
    };

  if (match(msg, 'contratar', 'cotizar', 'como lo contrato', 'empezar un proyecto'))
    return {
      respuesta: 'Contacta a Sagiii por WhatsApp o por el formulario de contacto. Analiza tu proyecto, define el alcance y da un presupuesto sin intermediarios.',
      accion: { tipo: 'navegar', url: '/contact' },
    };

  // Navegación
  if (match(msg, 'proyecto', 'portafolio', 'trabajos', 'trabajado', 'clientes'))
    return { respuesta: 'Aquí están los proyectos de Sagiii.', accion: { tipo: 'navegar', url: '/projects' } };

  if (match(msg, 'sobre', 'about', 'quien es', 'historia', 'experiencia', 'estudios'))
    return { respuesta: 'Te cuento más sobre Sagiii.', accion: { tipo: 'navegar', url: '/about' } };

  if (match(msg, 'contacto', 'contactar', 'escribir', 'mensaje', 'email', 'correo'))
    return { respuesta: 'Te llevo a la página de contacto.', accion: { tipo: 'navegar', url: '/contact' } };

  if (match(msg, 'github'))
    return { respuesta: 'Abriendo el GitHub de Sagiii.', accion: { tipo: 'link', url: 'https://github.com/Sagiiiii' } };

  if (match(msg, 'whatsapp', 'llamar', 'telefono', 'celular', 'numero'))
    return { respuesta: 'Abriendo WhatsApp para contactar a Sagiii.', accion: { tipo: 'link', url: 'https://wa.me/51985000716' } };

  if (match(msg, 'inicio', 'home', 'arriba'))
    return { respuesta: 'Voy al inicio.', accion: { tipo: 'scroll', target: 'top' } };

  // Default
  return {
    respuesta: 'Para esa consulta lo mejor es hablar directamente con Sagiii. ¿Te llevo al formulario de contacto?',
    accion: { tipo: 'navegar', url: '/contact' },
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
