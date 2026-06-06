export interface Project {
  id: number;
  title: string;
  short_desc: string;
  description: string;
  technologies: string[];
  github_urls: { label: string; url: string }[];
  live_url: string;
  image_url: string;
  category: string[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Soreus Motors — Frontend & Admin",
    short_desc: "Interfaz de tienda online y panel administrativo para gestión de productos, pedidos y clientes de una distribuidora automotriz.",
    description: "Desarrollo del frontend y módulo administrativo del sistema e-commerce de Soreus Motors E.I.R.L. La tienda presenta un catálogo visual de productos con filtros por categoría, carrito de compras interactivo y flujo de checkout. El panel admin permite gestionar el inventario, revisar pedidos entrantes, actualizar estados de entrega y administrar la base de clientes mediante un módulo CRM integrado. Diseño responsive con Bootstrap orientado a una experiencia de usuario fluida tanto en desktop como en móvil.",
    technologies: ["HTML", "CSS", "Bootstrap", "JavaScript", "NodeJS", "MEAN Stack"],
    github_urls: [
      { label: "Tienda", url: "https://github.com/Sagiiiii/ecommerce_tienda" },
      { label: "Admin", url: "https://github.com/Sagiiiii/ecommerce_admin" },
    ],
    live_url: "https://ecommercesoreustienda.netlify.app",
    image_url: "/img/soreus.jpeg",
    category: ["frontend", "web", "mobile"],
    featured: true,
  },
  {
    id: 2,
    title: "E-commerce Soreus Motors — Backend & API",
    short_desc: "Motor del servidor, API REST y base de datos del sistema e-commerce para distribuidora automotriz, construido con Python y Flask.",
    description: "Desarrollo del backend completo del sistema e-commerce de Soreus Motors E.I.R.L. Incluye una API REST construida con Flask que expone endpoints para productos, pedidos, usuarios y reportes. La capa de datos usa MySQL con modelos relacionales optimizados para consultas de inventario y trazabilidad de pedidos. Implementa autenticación con sesiones seguras, validación de datos en servidor, control de stock en tiempo real y generación de reportes exportables. Arquitectura modular con Blueprints para facilitar el mantenimiento y escalabilidad del sistema.",
    technologies: ["MEAN Stack", "MongoDB", "SQLAlchemy", "REST API", "NodeJS"],
    github_urls: [
      { label: "Backend", url: "https://github.com/Sagiiiii/eccommerce_back" },
    ],
    live_url: "https://ecommercesoreusadmin.netlify.app",
    image_url: "/img/soreus_back.jpg",
    category: ["backend", "web"],
    featured: false,
  },
  {
    id: 3,
    title: "Análisis Predictivo — Soreus Motors Capstone",
    short_desc: "Modelo de ciencia de datos con ARIMA, Regresión Lineal y Random Forest para optimizar inventario y predecir ventas en una distribuidora automotriz.",
    description: `Proyecto Capstone de Data Science desarrollado para SOREUS MOTORS E.I.R.L., empresa del sector automotriz en Huancayo, Perú. El objetivo fue transformar los datos generados por su sistema e-commerce MEAN (2024) en conocimiento estratégico para optimizar decisiones comerciales.

Se aplicó la metodología CRISP-DM con tres modelos predictivos:
• ARIMA (2,1,1): Series temporales para pronóstico de sobrestock mensual. Proyectó ~6,500 unidades de sobrestock promedio para 2025, con pico en marzo.
• Regresión Lineal Múltiple (RLM): R² = 0.75, identificó el inventario como variable principal. Reducción proyectada del 40% en costos de sobrestock (de S/ 15.3M a S/ 9.1M).
• Random Forest (RF): Mejor modelo con R² = 0.9995, MAE = 0.01. Reducción del 70% en sobrestock (ahorro potencial de S/ 10M+ anuales).`,
    technologies: ["Python", "Pandas", "Scikit-learn", "ARIMA", "Random Forest", "Matplotlib", "Seaborn", "Plotly", "MongoDB", "Jupyter Notebook"],
    github_urls: [
      { label: "Repositorio", url: "https://github.com/Sagiiiii/Analsis-Soreus-Motors-CAPSTOM-PROJECT" },
    ],
    live_url: "",
    image_url: "/img/datascience.jpg",
    category: ["data"],
    featured: true,
  },
  {
    id: 4,
    title: "Flutter Components — App Multiplataforma",
    short_desc: "Colección de componentes reutilizables desarrollados en Flutter para aplicaciones multiplataforma: Android, iOS, Web, Windows, Linux y macOS.",
    description: `Proyecto de desarrollo multiplataforma construido con Flutter y Dart, orientado a la creación y documentación de componentes reutilizables para aplicaciones modernas. El repositorio incluye soporte nativo para 6 plataformas simultáneas desde una sola base de código.

Plataformas soportadas: Android, iOS, Web (PWA), Windows, Linux, macOS.

Stack tecnológico: Dart 63.1%, C++ 30.7%, CMake 13.5%, HTML / Swift / C para capas nativas.`,
    technologies: ["Flutter", "Dart", "Android", "iOS", "Web", "Windows", "C++", "CMake"],
    github_urls: [
      { label: "Repositorio", url: "https://github.com/Sagiiiii/flutter-components" },
    ],
    live_url: "",
    image_url: "/img/mobile_flutter.jpg",
    category: ["mobile"],
    featured: false,
  },
  {
    id: 5,
    title: "Sagiii.dev — Portfolio Personal",
    short_desc: "Portfolio personal desarrollado con Python + Flask, tema oscuro naranja fox. Muestra proyectos, CV y formulario de contacto.",
    description: `Portfolio personal diseñado y desarrollado desde cero con Python y Flask, implementando un tema oscuro con paleta de colores fox/naranja personalizada.

• Arquitectura Flask con Blueprints para separación de responsabilidades
• Bootstrap 5 con Dark Mode nativo + CSS personalizado (variables fox)
• Proyectos gestionados desde archivo Python sin base de datos
• Formulario de contacto con Flask-Mail + Gmail SMTP
• Preloader animado con sessionStorage para primera visita`,
    technologies: ["Python", "Flask", "Bootstrap 5", "Jinja2", "CSS", "JavaScript", "Flask-Mail", "HTML", "Git"],
    github_urls: [
      { label: "Repositorio", url: "https://github.com/Sagiiiii/sagiiiii-portfolio" },
    ],
    live_url: "https://sagiiiii-portfolio.onrender.com",
    image_url: "/img/FOX2.jpg",
    category: ["web", "frontend"],
    featured: true,
  },
  {
    id: 6,
    title: "Dashboard de Análisis de Datos",
    short_desc: "Web app que analiza CSV/Excel automáticamente: gráficos, estadísticas descriptivas y predicciones con regresión lineal.",
    description: `Aplicación web de ciencia de datos desarrollada con Python y Flask que permite analizar cualquier archivo CSV o Excel sin escribir código, generando resultados en segundos.

• Backend Flask con Blueprint y arquitectura modular
• Pandas + NumPy para carga, limpieza y análisis estadístico
• Scikit-learn (LinearRegression) para predicción de tendencias con R²
• Chart.js 4 para gráficos de líneas interactivos y responsivos
• Drag & Drop de archivos con feedback visual en tiempo real
• Deploy en Render con Gunicorn como servidor WSGI de producción`,
    technologies: ["Python", "Flask", "Pandas", "NumPy", "Scikit-learn", "Chart.js", "JavaScript", "HTML", "CSS", "Git", "Render"],
    github_urls: [
      { label: "Repositorio", url: "https://github.com/Sagiiiii/dashboard-analisis-datos" },
    ],
    live_url: "https://dashboard-analisis-datos.onrender.com/",
    image_url: "/img/dashboard.jpg",
    category: ["web", "backend", "data"],
    featured: true,
  },
  {
    id: 7,
    title: "Torneo Praxis — Sitio Web Oficial",
    short_desc: "Sitio web oficial del torneo académico del Colegio Praxis. Información de niveles, sedes, bases, evaluaciones y galería de eventos.",
    description: `Sitio web oficial desarrollado para el torneo académico del Centro de Estudios Praxis SAC. Plataforma informativa completa que centraliza toda la información del evento: niveles educativos (Inicial, Primaria, Secundaria), sedes, bases del torneo, temario, evaluaciones de años anteriores y galería multimedia.

Características principales:
• Carrusel principal animado con GSAP y Swiper
• Secciones por nivel educativo con información detallada
• Descarga de bases y temarios en PDF
• Galería de fotos de eventos anteriores
• Animaciones 3D con Three.js en la sección de fundadores
• Diseño responsive con Tailwind CSS 4
• Múltiples páginas: Aniversario, Centro, Estrellas, Estrellitas, Esperanza, Festidanzas, Olimpiadas`,
    technologies: ["Astro", "React", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "Swiper", "Framer Motion"],
    github_urls: [
      { label: "Repositorio", url: "https://github.com/Sagiiiii/praxis-torneo" },
    ],
    live_url: "https://praxis-torneo.vercel.app",
    image_url: "/img/praxis-torneo.jpg",
    category: ["frontend", "web"],
    featured: true,
  },
];

export function getAll() { return PROJECTS; }
export function getFeatured() { return PROJECTS.filter(p => p.featured); }
export function getById(id: number) { return PROJECTS.find(p => p.id === id); }
export function getByCategory(cat: string) {
  if (!cat) return PROJECTS;
  return PROJECTS.filter(p => p.category.includes(cat));
}
