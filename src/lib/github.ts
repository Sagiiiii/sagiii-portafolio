import { marked } from 'marked';
import { LIVE_URLS, DISPLAY_NAMES, PRIVATE_REPOS } from '../data/manual-projects';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  image_url: string | null;
  categories: string[];
  technologies: string[];
  readme_html: string | null;
  display_name?: string;
  is_private?: boolean;
  coming_soon?: boolean;
}

const GITHUB_USER = 'Sagiiiii';

const REPO_DESCRIPTIONS: Record<string, string> = {
  'praxis-torneo': 'Sitio web oficial del Torneo Académico del Colegio Praxis. Información de niveles, sedes, bases, evaluaciones y galería de eventos. Construido con Astro, React, GSAP y Three.js.',
};

const REPO_IMAGES: Record<string, string> = {
  'sagiiiii-portfolio':                    '/img/FOX2.jpg',
  'dashboard-analisis-datos':              '/img/dashboard.jpg',
  // EcommerceMonteroStore: usa imagen genérica de ecommerce, no la de Soreus
  'Analsis-Soreus-Motors-CAPSTOM-PROJECT': '/img/datascience.jpg',
  'flutter-components':                    '/img/mobile_flutter.jpg',
  'helpdesk-laravel':                      '/img/dashboard-la-gi-6.png',
  'praxis-torneo':                         '/img/praxis-torneo.jpg',
};

const LANG_CATEGORIES: Record<string, string[]> = {
  'Python':           ['backend', 'web'],
  'Jupyter Notebook': ['data'],
  'JavaScript':       ['frontend', 'web'],
  'TypeScript':       ['frontend', 'web'],
  'Dart':             ['mobile'],
  'HTML':             ['frontend', 'web'],
  'Astro':            ['frontend', 'web'],
  'Blade':            ['backend', 'web'],
  'PHP':              ['backend', 'web'],
  'Java':             ['backend'],
};

const COMING_SOON_REPOS = new Set(['EcommerceMonteroStore']);
const REPO_COVER_IMAGES: Record<string, string> = {
  'EcommerceMonteroStore': '/img/ecommerce.png',
};

const REPO_CAT_OVERRIDES: Record<string, string[]> = {
  'Analsis-Soreus-Motors-CAPSTOM-PROJECT': ['data'],
  'dashboard-analisis-datos':              ['data', 'backend', 'web'],
  'sagiiiii-portfolio':                    ['web', 'frontend'],
  'EcommerceMonteroStore':                 ['frontend', 'backend', 'web'],
  'flutter-components':                    ['mobile'],
  'helpdesk-laravel':                      ['backend', 'web'],
  'personal_yarvis_linux':                 ['backend', 'data'],
  'praxis-torneo':                         ['frontend', 'web'],
};

// Technologies per repo (from language analysis + README)
const REPO_TECHS: Record<string, string[]> = {
  'sagiiiii-portfolio':                    ['Python', 'Flask', 'Jinja2', 'Bootstrap', 'CSS', 'JavaScript', 'HTML'],
  'dashboard-analisis-datos':              ['Python', 'Flask', 'Pandas', 'NumPy', 'Scikit-learn', 'Chart.js', 'JavaScript'],
  'helpdesk-laravel':                      ['Laravel', 'PHP', 'Blade', 'MySQL', 'JavaScript'],
  'EcommerceMonteroStore':                 ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'MySQL'],
  'Analsis-Soreus-Motors-CAPSTOM-PROJECT': ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter Notebook'],
  'flutter-components':                    ['Flutter', 'Dart', 'Kotlin', 'Swift'],
  'mi-portfolio':                          ['Astro', 'TypeScript', 'CSS'],
  'astrobuild.tips':                       ['Astro', 'JavaScript', 'CSS', 'Docker'],
  'authflow-privacy':                      ['HTML', 'CSS'],
  'personal_yarvis_linux':                 ['Python', 'Claude AI', 'Whisper', 'ElevenLabs'],
  'praxis-torneo':                         ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Three.js', 'Swiper'],
};

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
    { headers: { 'Accept': 'application/vnd.github+json' } }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const raw: any[] = await res.json();

  const publicRepos: GitHubRepo[] = raw
    .filter(r => !r.fork && !r.private)
    .map(r => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: REPO_DESCRIPTIONS[r.name] ?? r.description,
      language: r.language,
      html_url: r.html_url,
      homepage: LIVE_URLS[r.name] ?? r.homepage ?? null,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      created_at: r.created_at,
      pushed_at: r.pushed_at,
      topics: r.topics ?? [],
      fork: r.fork,
      image_url: REPO_COVER_IMAGES[r.name] ?? REPO_IMAGES[r.name] ?? null,
      coming_soon: COMING_SOON_REPOS.has(r.name),
      categories: REPO_CAT_OVERRIDES[r.name] ?? LANG_CATEGORIES[r.language] ?? ['web'],
      technologies: REPO_TECHS[r.name] ?? [r.language].filter(Boolean),
      readme_html: null,
      display_name: DISPLAY_NAMES[r.name],
      is_private: false,
    }));

  // Merge private repos + deduplicate (private repos come after public)
  const allNames = new Set(publicRepos.map(r => r.name));
  const extras = PRIVATE_REPOS.filter(r => !allNames.has(r.name));

  return [...publicRepos, ...extras];
}

export async function fetchReadme(repoName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repoName}/readme`,
      { headers: { 'Accept': 'application/vnd.github+json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const content = atob(data.content.replace(/\n/g, ''));
    const rawBase = `https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/main`;
    const fixed = content.replace(/!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
      (_, alt, path) => `![${alt}](${rawBase}/${path})`
    );
    return marked(fixed) as string;
  } catch {
    return null;
  }
}

export async function fetchRepoByName(repoName: string): Promise<GitHubRepo | null> {
  const all = await fetchRepos();
  return all.find(r => r.name === repoName) ?? null;
}
