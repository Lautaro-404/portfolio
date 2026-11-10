import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const OVERRIDES_PATH = resolve(ROOT_DIR, 'src/data/projects.overrides.json');
const OUTPUT_PATH = resolve(ROOT_DIR, 'src/data/projects.json');

const GITHUB_USER = process.env.GITHUB_USER || 'Lautaro-404';
const PORTFOLIO_REPO_NAMES = new Set(['portfolio', 'portafolio-web', GITHUB_USER.toLowerCase()]);

function runGhJson(args) {
  const stdout = execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(stdout);
}

function loadOverrides() {
  if (!existsSync(OVERRIDES_PATH)) {
    return {};
  }
  return JSON.parse(readFileSync(OVERRIDES_PATH, 'utf8'));
}

function computeLanguageBreakdown(langMap) {
  const entries = Object.entries(langMap || {});
  const totalBytes = entries.reduce((acc, [, bytes]) => acc + Number(bytes || 0), 0);
  if (totalBytes === 0) {
    return [];
  }
  return entries
    .map(([name, bytes]) => ({
      name,
      bytes: Number(bytes),
      percentage: Number(((Number(bytes) / totalBytes) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

function main() {
  const overrides = loadOverrides();
  const config = overrides._config || {};
  const includeOnly = Array.isArray(config.includeOnly)
    ? new Set(config.includeOnly.map((name) => String(name).toLowerCase()))
    : null;

  let rawRepos = [];
  try {
    // Query authenticated user's owned repos first (includes private repos like ClinAppMobile)
    const ownedRepos = runGhJson(['api', 'user/repos?affiliation=owner&per_page=100']);
    rawRepos = Array.isArray(ownedRepos)
      ? ownedRepos.filter(
          (r) =>
            r?.owner?.login?.toLowerCase() === GITHUB_USER.toLowerCase()
        )
      : [];
  } catch {
    try {
      rawRepos = runGhJson(['api', `users/${GITHUB_USER}/repos`, '--paginate']);
    } catch (err) {
      if (existsSync(OUTPUT_PATH)) {
        console.warn(
          `[fetch:github] No se pudo consultar GitHub CLI (${err.message}). Se conserva src/data/projects.json existente.`
        );
        return;
      }
      throw err;
    }
  }

  // Filter: no forks, no archived, no self-portfolio repo
  let filtered = rawRepos.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      !PORTFOLIO_REPO_NAMES.has(String(repo.name).toLowerCase())
  );

  // If any repo has the 'portfolio' topic, include only those unless includeOnly is explicitly defined
  const withPortfolioTopic = filtered.filter(
    (repo) => Array.isArray(repo.topics) && repo.topics.includes('portfolio')
  );
  if (includeOnly && includeOnly.size > 0) {
    filtered = filtered.filter((repo) =>
      includeOnly.has(String(repo.name).toLowerCase())
    );
  } else if (withPortfolioTopic.length > 0) {
    filtered = withPortfolioTopic;
  }

  if (filtered.length === 0 && existsSync(OUTPUT_PATH)) {
    console.warn(
      '[fetch:github] Ningun repositorio coincidio con el filtro activo. Se conserva src/data/projects.json anterior.'
    );
    return;
  }

  const projects = filtered.map((repo, index) => {
    const repoName = repo.name;
    const override = overrides[repoName] || {};

    let langMap = {};
    try {
      langMap = runGhJson(['api', `repos/${GITHUB_USER}/${repoName}/languages`]);
    } catch {
      langMap = repo.language ? { [repo.language]: 100 } : {};
    }

    const languages = computeLanguageBreakdown(langMap);
    const mergedTopics = Array.from(
      new Set([...(Array.isArray(repo.topics) ? repo.topics : []), ...(override.topics || [])])
    );

    return {
      name: repoName,
      title: override.title || repoName,
      subtitle: override.subtitle || undefined,
      description:
        override.description ||
        repo.description ||
        'Proyecto de ingeniería de software desarrollado por Lautaro Ponzina.',
      architectureNote: override.architectureNote || undefined,
      html_url: repo.html_url,
      homepage:
        override.homepage !== undefined
          ? override.homepage
          : repo.homepage || null,
      secondaryUrl: override.secondaryUrl || undefined,
      topics: mergedTopics,
      languages,
      stargazers_count: Number(repo.stargazers_count || 0),
      pushed_at: repo.pushed_at || new Date().toISOString(),
      featured: Boolean(override.featured),
      privateRepo:
        override.privateRepo !== undefined
          ? Boolean(override.privateRepo)
          : Boolean(repo.private),
      order: typeof override.order === 'number' ? override.order : index + 10,
      highlights: Array.isArray(override.highlights) ? override.highlights : undefined,
      screenshot: override.screenshot || undefined,
    };
  });

  projects.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
  console.log(
    `[fetch:github] Sincronizados ${projects.length} proyectos en src/data/projects.json: ${projects
      .map((p) => p.name)
      .join(', ')}`
  );
}

main();
