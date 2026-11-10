import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { TechStack } from '@/components/TechStack';
import projectsData from '@/data/projects.json';
import { useTheme } from '@/lib/theme';
import type { ProjectItem } from '@/lib/types';

const projects = projectsData as ProjectItem[];

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:border focus:border-[var(--accent-primary)] focus:bg-[var(--bg-primary)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-[var(--text-primary)]"
      >
        Saltar al contenido principal
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="contenido-principal" className="flex-1">
        <Hero />
        <About />
        <TechStack projects={projects} />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
