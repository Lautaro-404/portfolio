export type TechCategory =
  | 'Frontend'
  | 'Backend'
  | 'Bases de datos'
  | 'Herramientas y DevOps'
  | 'IA y agentes';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategory;
  brandColor: string;
  role?: string;
  featured?: boolean;
  mono?: boolean;
  aliases: string[];
  svgPaths?: {
    viewBox: string;
    elements: Array<{
      d: string;
      fill?: string;
    }>;
  };
}

export interface LanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
}

export interface ProjectItem {
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  architectureNote?: string;
  html_url: string;
  homepage: string | null;
  secondaryUrl?: {
    label: string;
    url: string;
  };
  topics: string[];
  languages: LanguageBreakdown[];
  stargazers_count: number;
  pushed_at: string;
  featured: boolean;
  privateRepo?: boolean;
  order: number;
  highlights?: string[];
  screenshot?: string;
}

export interface ContactRequestPayload {
  name: string;
  email: string;
  message: string;
  website?: string;
}

export interface ContactResponsePayload {
  ok: boolean;
  message: string;
}
