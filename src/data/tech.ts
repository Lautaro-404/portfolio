import {
  siAndroidstudio,
  siClaude,
  siDart,
  siDocker,
  siExpress,
  siFlutter,
  siGit,
  siGithub,
  siHtml5,
  siIntellijidea,
  siJavascript,
  siLinux,
  siModelcontextprotocol,
  siMysql,
  siNodedotjs,
  siOpencode,
  siOpenjdk,
  siPostgresql,
  siPrisma,
  siPython,
  siRailway,
  siReact,
  siRender,
  siSpringboot,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVuedotjs,
} from 'simple-icons';
import type { TechCategory, TechItem } from '../lib/types';

export const TECH_CATEGORIES: TechCategory[] = [
  'Frontend',
  'Backend',
  'Bases de datos',
  'Herramientas y DevOps',
  'IA y agentes',
];

interface IconSource {
  path: string;
  hex: string;
}

type TechSeed = Omit<TechItem, 'svgPaths' | 'brandColor' | 'mono'> & {
  icon: IconSource;
};

/**
 * Brands whose official color is nearly black disappear on the dark theme,
 * so those icons are painted with the current text color instead.
 */
function isNearBlack(hex: string): boolean {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b < 64;
}

function build(seed: TechSeed): TechItem {
  const { icon, ...rest } = seed;
  return {
    ...rest,
    brandColor: `#${icon.hex}`,
    mono: isNearBlack(icon.hex),
    svgPaths: { viewBox: '0 0 24 24', elements: [{ d: icon.path }] },
  };
}

/**
 * Simple Icons does not ship these brands, so they use simple geometric
 * glyphs instead of an imitation of the official logo.
 */
const customIcons = {
  antigravity: { hex: '4285F4', path: 'M12 2 3 21h4.2L12 10.5 16.8 21H21z' },
  herdr: { hex: '34B38A', path: 'M4 3h4v7h8V3h4v18h-4v-7H8v7H4z' },
  openDesign: {
    hex: 'F59E0B',
    path: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M12 6a6 6 0 1 1 0 12a6 6 0 1 1 0-12z',
  },
  stitch: { hex: '8AB4F8', path: 'M3 5h8v3H3zM13 10.5h8v3h-8zM3 16h8v3H3z' },
} satisfies Record<string, IconSource>;

/**
 * Technologies confirmed by the owner (GitHub README + later additions).
 * `featured` marks the core stack, taken from the README "Sobre mi":
 * Java + Spring Boot backend, Flutter mobile, Docker and Linux.
 */
export const CURATED_TECH: TechItem[] = [
  // Frontend
  build({ id: 'react', name: 'React', category: 'Frontend', icon: siReact, aliases: ['react', 'reactjs', 'jsx', 'tsx'] }),
  build({ id: 'vue', name: 'Vue.js', category: 'Frontend', icon: siVuedotjs, aliases: ['vue', 'vuejs'] }),
  build({
    id: 'flutter',
    name: 'Flutter',
    category: 'Frontend',
    icon: siFlutter,
    featured: true,
    role: 'Apps moviles multiplataforma',
    aliases: ['flutter', 'mobile'],
  }),
  build({
    id: 'dart',
    name: 'Dart',
    category: 'Frontend',
    icon: siDart,
    featured: true,
    role: 'Lenguaje base de Flutter',
    aliases: ['dart'],
  }),
  build({ id: 'typescript', name: 'TypeScript', category: 'Frontend', icon: siTypescript, aliases: ['typescript', 'ts'] }),
  build({ id: 'javascript', name: 'JavaScript', category: 'Frontend', icon: siJavascript, aliases: ['javascript', 'js'] }),
  build({ id: 'tailwindcss', name: 'Tailwind CSS', category: 'Frontend', icon: siTailwindcss, aliases: ['tailwind', 'tailwindcss', 'css'] }),

  // Backend
  build({
    id: 'java',
    name: 'Java',
    category: 'Backend',
    icon: siOpenjdk,
    featured: true,
    role: 'Backend y modelado de dominio',
    aliases: ['java'],
  }),
  build({
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'Backend',
    icon: siSpringboot,
    featured: true,
    role: 'APIs REST, JPA y seguridad',
    aliases: ['spring', 'spring-boot', 'springboot'],
  }),
  build({ id: 'nodejs', name: 'Node.js', category: 'Backend', icon: siNodedotjs, aliases: ['node', 'nodejs', 'serverless'] }),
  build({ id: 'express', name: 'Express.js', category: 'Backend', icon: siExpress, aliases: ['express', 'expressjs'] }),
  build({ id: 'python', name: 'Python', category: 'Backend', icon: siPython, aliases: ['python', 'py'] }),

  // Bases de datos
  build({
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Bases de datos',
    icon: siPostgresql,
    featured: true,
    role: 'Modelado de bases relacionales',
    aliases: ['postgresql', 'postgres', 'plpgsql', 'sql', 'flyway'],
  }),
  build({ id: 'mysql', name: 'MySQL', category: 'Bases de datos', icon: siMysql, aliases: ['mysql'] }),
  build({ id: 'supabase', name: 'Supabase', category: 'Bases de datos', icon: siSupabase, aliases: ['supabase'] }),
  build({ id: 'prisma', name: 'Prisma', category: 'Bases de datos', icon: siPrisma, aliases: ['prisma'] }),

  // Herramientas y DevOps
  build({
    id: 'docker',
    name: 'Docker',
    category: 'Herramientas y DevOps',
    icon: siDocker,
    featured: true,
    role: 'Desarrollo y despliegue en contenedores',
    aliases: ['docker', 'dockerfile', 'containers'],
  }),
  build({
    id: 'linux',
    name: 'Linux',
    category: 'Herramientas y DevOps',
    icon: siLinux,
    featured: true,
    role: 'Entorno de desarrollo diario',
    aliases: ['linux', 'bash', 'shell'],
  }),
  build({ id: 'git', name: 'Git', category: 'Herramientas y DevOps', icon: siGit, aliases: ['git'] }),
  build({ id: 'github', name: 'GitHub', category: 'Herramientas y DevOps', icon: siGithub, aliases: ['github', 'gh'] }),
  build({ id: 'railway', name: 'Railway', category: 'Herramientas y DevOps', icon: siRailway, aliases: ['railway'] }),
  build({ id: 'render', name: 'Render', category: 'Herramientas y DevOps', icon: siRender, aliases: ['render'] }),
  build({ id: 'vercel', name: 'Vercel', category: 'Herramientas y DevOps', icon: siVercel, aliases: ['vercel'] }),
  build({ id: 'intellij', name: 'IntelliJ IDEA', category: 'Herramientas y DevOps', icon: siIntellijidea, aliases: ['intellij', 'intellij-idea'] }),
  build({ id: 'android-studio', name: 'Android Studio', category: 'Herramientas y DevOps', icon: siAndroidstudio, aliases: ['android-studio', 'kotlin'] }),

  // IA y agentes
  build({
    id: 'mcp',
    name: 'MCP',
    category: 'IA y agentes',
    icon: siModelcontextprotocol,
    featured: true,
    role: 'Flujos asistidos por agentes y herramientas CLI',
    aliases: ['mcp', 'model-context-protocol'],
  }),
  build({ id: 'claude-code', name: 'Claude Code CLI', category: 'IA y agentes', icon: siClaude, aliases: ['claude', 'claude-code'] }),
  build({ id: 'opencode', name: 'OpenCode', category: 'IA y agentes', icon: siOpencode, aliases: ['opencode'] }),
  build({ id: 'antigravity', name: 'Antigravity CLI', category: 'IA y agentes', icon: customIcons.antigravity, aliases: ['antigravity', 'agy'] }),
  build({ id: 'herdr', name: 'Herdr', category: 'IA y agentes', icon: customIcons.herdr, aliases: ['herdr'] }),
  build({ id: 'open-design', name: 'Open Design', category: 'IA y agentes', icon: customIcons.openDesign, aliases: ['open-design'] }),
  build({ id: 'google-stitch', name: 'Google Stitch', category: 'IA y agentes', icon: customIcons.stitch, aliases: ['stitch', 'google-stitch'] }),
];

/**
 * Not shown in the Tecnologias section (not part of the confirmed list);
 * only used to render badges on project cards from GitHub topics/languages.
 */
const PROJECT_ONLY_TECH: TechItem[] = [
  build({ id: 'html5', name: 'HTML5', category: 'Frontend', icon: siHtml5, aliases: ['html', 'html5'] }),
];

export function findTechForTag(tagOrLanguage: string): TechItem | undefined {
  const normalized = tagOrLanguage.trim().toLowerCase();
  return [...CURATED_TECH, ...PROJECT_ONLY_TECH].find(
    (item) =>
      item.id === normalized ||
      item.name.toLowerCase() === normalized ||
      item.aliases.includes(normalized)
  );
}

export function getTechItemsForProject(
  languages: Array<{ name: string }>,
  topics: string[]
): TechItem[] {
  const seen = new Set<string>();
  const matched: TechItem[] = [];

  const candidates = [
    ...languages.map((l) => l.name),
    ...topics,
  ];

  for (const candidate of candidates) {
    const found = findTechForTag(candidate);
    if (found && !seen.has(found.id)) {
      seen.add(found.id);
      matched.push(found);
    }
  }

  return matched;
}
