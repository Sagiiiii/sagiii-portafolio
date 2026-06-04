import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const prerender = false;

const SYSTEM_PROMPT = `Eres Yarvis, el asistente de IA personal de Sagiii (David Adolfo Garcia Giron) en su portafolio web sagiii.dev.

Eres inteligente, directo y eficiente. Responde por defecto en español. Si el visitante escribe en inglés, responde en inglés.

INFORMACIÓN SOBRE SAGIII:
- Nombre completo: David Adolfo Garcia Giron (alias: Sagiii)
- Rol: Full Stack Developer, Data Scientist e Integrador de Sistemas — freelancer independiente
- Ubicación: Huancayo, Perú
- Web: sagiii.dev | GitHub: github.com/Sagiiiii
- Stack técnico: Python, JavaScript, Angular, MongoDB, MySQL, Flask
- Servicios: desarrollo web (e-commerce, landing pages, sistemas a medida), integración de sistemas, soporte TIC, data science aplicado
- Rango de precios: S/2,000 a S/5,000 por proyecto según complejidad
- Historia: Instituto técnico en Huancayo + Universidad Continental + estudios en Florida (USA). Freelancer independiente, no trabaja para agencias.
- Clientes reales: Soreus Motors (e-commerce + sistema de inventario), Centro de Distribución DXN (web corporativa + eventos), Colegio Praxis (soporte TIC)
- Propuesta de valor: soluciones a medida con trato directo, sin intermediarios. Formación internacional + conocimiento del mercado local peruano.
- Modelo de cobro: por hitos (adelanto → entrega parcial → entrega final + soporte opcional)

PÁGINAS DEL PORTAFOLIO:
- / — Inicio (Hero, proyectos, testimoniales)
- /about — Sobre mí (historia, habilidades, experiencia)
- /projects — Proyectos (portafolio completo)
- /contact — Contacto (formulario y datos)

CÓMO RESPONDER:
Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{"respuesta": "texto de tu respuesta", "accion": null}

O con una acción del navegador si el visitante lo pide:
{"respuesta": "Te llevo a los proyectos", "accion": {"tipo": "navegar", "url": "/projects"}}
{"respuesta": "Te llevo al inicio", "accion": {"tipo": "navegar", "url": "/"}}
{"respuesta": "Voy al inicio de la página", "accion": {"tipo": "scroll", "target": "top"}}
{"respuesta": "Voy al final de la página", "accion": {"tipo": "scroll", "target": "bottom"}}
{"respuesta": "Cambié a modo oscuro", "accion": {"tipo": "tema", "valor": "dark"}}
{"respuesta": "Cambié a modo claro", "accion": {"tipo": "tema", "valor": "light"}}
{"respuesta": "Abriendo GitHub de Sagiii", "accion": {"tipo": "link", "url": "https://github.com/Sagiiiii"}}
{"respuesta": "Abriendo WhatsApp para contactar a Sagiii", "accion": {"tipo": "link", "url": "https://wa.me/51985000716"}}
{"respuesta": "Resaltando los proyectos en pantalla", "accion": {"tipo": "highlight", "selector": "#projects"}}

REGLAS:
- Sé conciso: máximo 3-4 oraciones por respuesta.
- Para contacto, menciona /contact o WhatsApp (sin revelar el número exacto en texto, usa la acción link).
- Si preguntan por precios, da el rango: S/2,000 a S/5,000 según complejidad.
- Si piden navegar a una sección, usa la acción correspondiente.
- Para GitHub, LinkedIn u otros links: usa la acción link.
- Sin sycophancy. Directo al punto.
- No uses markdown en el campo respuesta. Solo texto plano.
- El campo "accion" debe ser null o un objeto. Nunca un string.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, history = [] } = body as { message: string; history: ChatMessage[] };

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Mensaje vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ respuesta: 'El asistente no está configurado aún. Contacta a Sagiii directamente en /contact', accion: null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new Anthropic({ apiKey });

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';

    let respuesta = raw;
    let accion = null;

    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd));
        respuesta = parsed.respuesta || raw;
        accion = parsed.accion ?? null;
      } catch {
        respuesta = raw;
      }
    }

    return new Response(JSON.stringify({ respuesta, accion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Yarvis API]', err);
    return new Response(
      JSON.stringify({ respuesta: 'Error al conectar con el asistente. Intenta de nuevo o escríbele directamente a Sagiii.', accion: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
