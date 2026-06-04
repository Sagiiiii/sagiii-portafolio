import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface YarvisAction {
  tipo: 'navegar' | 'scroll' | 'tema' | 'link' | 'highlight';
  url?: string;
  target?: string;
  valor?: string;
  selector?: string;
}

const QUICK_QUESTIONS = [
  '¿Qué hace Sagiii?',
  '¿Qué tecnologías usa?',
  '¿Cómo lo contrato?',
  '¿Cuánto cobran los proyectos?',
];

function executeAction(action: YarvisAction) {
  switch (action.tipo) {
    case 'navegar':
      if (action.url) window.location.href = action.url;
      break;
    case 'scroll':
      if (action.target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action.target === 'bottom') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (action.target) {
        document.querySelector(action.target)?.scrollIntoView({ behavior: 'smooth' });
      }
      break;
    case 'tema':
      if (action.valor) {
        document.documentElement.setAttribute('data-theme', action.valor);
        localStorage.setItem('theme', action.valor);
        const btn = document.getElementById('themeToggle') as HTMLButtonElement | null;
        if (btn) btn.textContent = action.valor === 'dark' ? '☀️' : '🌙';
      }
      break;
    case 'link':
      if (action.url) window.open(action.url, '_blank', 'noopener,noreferrer');
      break;
    case 'highlight': {
      const sel = action.selector || action.target;
      if (!sel) break;
      const el = document.querySelector<HTMLElement>(sel);
      if (!el) break;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const prev = el.style.cssText;
      el.style.cssText += ';outline:2px solid var(--fox);outline-offset:6px;border-radius:8px;transition:outline 0.3s;';
      setTimeout(() => { el.style.cssText = prev; }, 2500);
      break;
    }
  }
}

export default function YarvisChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Yarvis, el asistente de Sagiii. ¿En qué puedo ayudarte?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(1);
      const res = await fetch('/api/yarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.respuesta || 'No pude generar una respuesta.' },
      ]);

      if (data.accion) {
        setTimeout(() => executeAction(data.accion), 400);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Hubo un error al conectar. Intenta de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const canSend = input.trim().length > 0 && !loading;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes yarvis-in {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes yarvis-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
        .yarvis-dot { display: inline-block; animation: yarvis-dot 1.2s infinite; }
        .yarvis-dot:nth-child(2) { animation-delay: 0.2s; }
        .yarvis-dot:nth-child(3) { animation-delay: 0.4s; }
        .yarvis-messages::-webkit-scrollbar { width: 4px; }
        .yarvis-messages::-webkit-scrollbar-track { background: transparent; }
        .yarvis-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .yarvis-input:focus { border-color: var(--fox) !important; outline: none; }
        .yarvis-btn-float:hover { transform: scale(1.1) !important; }
      `}</style>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(1.25rem + 50px + 0.75rem + env(safe-area-inset-bottom, 0px))',
            right: '5rem',
            width: '320px',
            maxWidth: 'calc(100vw - 5.5rem)',
            height: '430px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
            zIndex: 9010,
            animation: 'yarvis-in 0.22s ease',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.7rem 1rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg-card2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 6px rgba(74,222,128,0.7)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                }}
              >
                Yarvis
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· IA</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                lineHeight: 1,
                transition: 'color 0.15s',
              }}
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="yarvis-messages"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '0.5rem 0.75rem',
                    borderRadius:
                      msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: msg.role === 'user' ? 'var(--fox)' : 'var(--bg-card2)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text)',
                    fontSize: '0.82rem',
                    lineHeight: 1.55,
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'var(--bg-card2)',
                    border: '1px solid var(--border)',
                    fontSize: '1rem',
                    letterSpacing: '2px',
                  }}
                >
                  <span className="yarvis-dot">●</span>
                  <span className="yarvis-dot">●</span>
                  <span className="yarvis-dot">●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions (only at start) */}
          {messages.length === 1 && !loading && (
            <div
              style={{
                padding: '0 0.75rem 0.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.35rem',
                flexShrink: 0,
              }}
            >
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    background: 'var(--bg-card2)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    color: 'var(--text-muted)',
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.6rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--fox)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--fox)';
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: '0.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '0.4rem',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              className="yarvis-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--bg-card2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                color: 'var(--text)',
                fontSize: '0.82rem',
                transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!canSend}
              style={{
                background: canSend ? 'var(--fox)' : 'var(--bg-card2)',
                border: `1px solid ${canSend ? 'var(--fox)' : 'var(--border)'}`,
                borderRadius: '8px',
                color: canSend ? '#fff' : 'var(--text-muted)',
                cursor: canSend ? 'pointer' : 'default',
                padding: '0.4rem 0.7rem',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              aria-label="Enviar"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className="yarvis-btn-float"
        onClick={() => setIsOpen(prev => !prev)}
        title={isOpen ? 'Cerrar asistente' : 'Hablar con Yarvis'}
        aria-label={isOpen ? 'Cerrar asistente' : 'Hablar con Yarvis'}
        style={{
          position: 'fixed',
          bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
          right: '5rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: isOpen ? 'var(--fox-dark)' : 'var(--fox)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9002,
          boxShadow: '0 4px 18px rgba(232,101,26,0.5)',
          transition: 'transform 0.2s, background 0.2s',
          fontSize: '1.3rem',
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>
    </>
  );
}
