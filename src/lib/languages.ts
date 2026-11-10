import type { ProjectItem } from './types';

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
}

export interface LanguageSummary {
  totalBytes: number;
  stats: LanguageStat[];
}

/**
 * Aggregates the per-repo language breakdown of projects.json into a single
 * ranking. Pure function: the UI only renders what this returns, so the data
 * source can change without touching the components.
 */
export function computeLanguageSummary(
  projects: ProjectItem[],
  minPercentage = 0.1
): LanguageSummary {
  const bytesByLanguage = new Map<string, number>();
  let totalBytes = 0;

  for (const project of projects) {
    for (const lang of project.languages) {
      totalBytes += lang.bytes;
      bytesByLanguage.set(
        lang.name,
        (bytesByLanguage.get(lang.name) ?? 0) + lang.bytes
      );
    }
  }

  const stats = Array.from(bytesByLanguage, ([name, bytes]) => ({
    name,
    bytes,
    percentage:
      totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0,
  }))
    .filter((stat) => stat.percentage >= minPercentage)
    .sort((a, b) => b.bytes - a.bytes);

  return { totalBytes, stats };
}
