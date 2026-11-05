import { About } from './components/About';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TechStack } from './components/TechStack';
import projectsData from './data/projects.json';
import { useTheme } from './lib/theme';
import type { ProjectItem } from './lib/types';

const projects = projectsData as ProjectItem[];

export function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="contenido-principal" className="flex-1">
        <Hero projects={projects} />
        <About />
        <TechStack projects={projects} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
