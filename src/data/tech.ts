import type { TechCategory, TechItem } from '../lib/types';

export const TECH_CATEGORIES: TechCategory[] = [
  'Frontend',
  'Backend',
  'Bases de datos',
  'Herramientas/DevOps',
  'IA y agentes',
];

export const CURATED_TECH: TechItem[] = [
  // Frontend
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    brandColor: '#61DAFB',
    role: 'Interfaces web SPA y componentes declarativos',
    aliases: ['react', 'reactjs', 'jsx', 'tsx'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26s-1.18-1.63-3.28-2.26c-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26s1.18 1.63 3.28 2.26c.25-.76.55-1.51.89-2.26m9 2.26-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 0 1 2.4-.36c.48-.67.99-1.31 1.51-1.9Z',
          fill: '#61DAFB',
        },
      ],
    },
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    brandColor: '#3178C6',
    role: 'Tipado estático estricto para frontend y APIs',
    aliases: ['typescript', 'ts'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
          fill: '#3178C6',
        },
      ],
    },
  },
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    category: 'Frontend',
    brandColor: '#02569B',
    role: 'Aplicaciones móviles multiplataforma (ClinApp)',
    aliases: ['dart', 'flutter', 'riverpod', 'mobile'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z',
          fill: '#47C5FB',
        },
      ],
    },
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'Frontend',
    brandColor: '#F7DF1E',
    role: 'Lógica cliente, asincronismo e integración DOM/REST',
    aliases: ['javascript', 'js'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z',
          fill: '#F7DF1E',
        },
      ],
    },
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    category: 'Frontend',
    brandColor: '#06B6D4',
    role: 'Sistemas de diseño utilitarios y layouts responsive',
    aliases: ['tailwind', 'tailwindcss', 'css', 'html'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z',
          fill: '#06B6D4',
        },
      ],
    },
  },
  {
    id: 'html5',
    name: 'HTML5 & CSS3',
    category: 'Frontend',
    brandColor: '#E34F26',
    role: 'Marcado semántico accesible y arquitectura CSS moderna',
    aliases: ['html5'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z',
          fill: '#E34F26',
        },
      ],
    },
  },

  // Backend
  {
    id: 'java',
    name: 'Java & Spring Boot',
    category: 'Backend',
    brandColor: '#6DB33F',
    role: 'APIs RESTful en capas, seguridad JWT y JPA/Flyway',
    aliases: ['java', 'spring', 'spring-boot', 'springboot', 'jwt'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M20.996 1.095a11.95 11.95 0 0 1-1.219 2.719C16.299-.292 10.156-.04 6.135 2.84 1.669 6.038.493 11.832 2.768 16.71c.235.505.512.99.826 1.454-.216-.873-.14-1.825.242-2.767.855-2.106 3.095-3.416 5.654-3.835 3.317-.544 6.774-.743 9.39-3.175-1.787 2.893-5.228 3.791-8.46 4.432-2.556.507-5.025 1.562-5.735 4.21-.31 1.157-.074 2.378.54 3.465 4.922 3.047 11.771 1.766 15.174-2.958 2.862-3.972 2.917-10.608.6-16.441z',
          fill: '#6DB33F',
        },
      ],
    },
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    brandColor: '#3776AB',
    role: 'Automatización, algoritmos, scripting y lógica backend',
    aliases: ['python', 'py'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85c.578 0 1.046.47 1.046 1.052 0 .581-.468 1.051-1.046 1.051-.579 0-1.046-.47-1.046-1.051 0-.582.467-1.052 1.046-1.052z',
          fill: '#3776AB',
        },
        {
          d: 'M12.087 24c6.093 0 5.713-2.656 5.713-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.451s-3.24-.052-3.24 3.148v5.292S5.72 24 12.087 24zm3.206-1.85c-.579 0-1.046-.47-1.046-1.052 0-.581.467-1.051 1.046-1.051.578 0 1.046.47 1.046 1.051 0 .582-.468 1.052-1.046 1.052z',
          fill: '#FFD43B',
        },
      ],
    },
  },
  {
    id: 'nodejs',
    name: 'Node.js & Serverless APIs',
    category: 'Backend',
    brandColor: '#5FA04E',
    role: 'Funciones serverless, scripts de build e integraciones REST',
    aliases: ['node', 'nodejs', 'serverless', 'resend'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.07,6.68C2.984,6.729,2.93,6.825,2.93,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z',
          fill: '#5FA04E',
        },
      ],
    },
  },

  // Bases de datos
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Bases de datos',
    brandColor: '#4169E1',
    role: 'Modelado relacional, transacciones ACID, PL/pgSQL y Flyway',
    aliases: ['postgresql', 'postgres', 'plpgsql', 'sql', 'flyway'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M17.128 0a10.134 10.134 0 0 0-2.755.403l-.063.02A10.922 10.922 0 0 0 12.6.258C8.442.258 5.66 3.2 5.66 3.2a10.67 10.67 0 0 0-3.52 1.832C.246 6.72-.35 9.818.18 13.56c.53 3.743 2.55 6.38 4.496 6.135 1.547-.194 2.186-1.588 2.37-2.61.367.152.775.238 1.224.238.91 0 1.71-.347 2.275-.91V21.7c0 1.25.98 2.3 2.33 2.3 1.35 0 2.33-1.05 2.33-2.3v-5.91c.71.22 1.49.33 2.31.33 3.91 0 6.485-3.44 6.485-8.19C24 3.17 21.038 0 17.128 0zm.17 4.98c.82 0 1.49.67 1.49 1.49s-.67 1.49-1.49 1.49-1.49-.67-1.49-1.49.67-1.49 1.49-1.49zm-8.57 1.12c.74 0 1.34.6 1.34 1.34s-.6 1.34-1.34 1.34-1.34-.6-1.34-1.34.6-1.34 1.34-1.34z',
          fill: '#4169E1',
        },
      ],
    },
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Bases de datos',
    brandColor: '#3ECF8E',
    role: 'Auth, PostgreSQL gestionado, Edge Functions y Realtime',
    aliases: ['supabase', 'realtime', 'baas'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z',
          fill: '#3ECF8E',
        },
      ],
    },
  },

  // Herramientas/DevOps
  {
    id: 'docker',
    name: 'Docker',
    category: 'Herramientas/DevOps',
    brandColor: '#2496ED',
    role: 'Contenedores multi-etapa para APIs y entornos reproducibles',
    aliases: ['docker', 'dockerfile', 'containers'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z',
          fill: '#2496ED',
        },
      ],
    },
  },
  {
    id: 'linux',
    name: 'Linux (CachyOS, Ubuntu, Mint)',
    category: 'Herramientas/DevOps',
    brandColor: '#FCC624',
    role: 'Entorno diario de programación, shell scripting y gestión de paquetes',
    aliases: ['linux', 'cachyos', 'ubuntu', 'mint', 'bash'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a4.42 4.42 0 00-.68.49c-1.002.927-1.268 2.57-.595 3.671.673 1.102 2.094 1.454 3.437.854.48-.215.922-.525 1.298-.897a9.87 9.87 0 003.74 1.01c1.31.09 2.66-.14 3.84-.74.37.36.8.65 1.27.86 1.34.6 2.76.25 3.44-.85.67-1.1.41-2.74-.6-3.67a4.35 4.35 0 00-.65-.47c.12-.8-.01-1.64-.29-2.47-.59-1.77-1.83-3.47-2.72-4.52-.75-1.07-.97-1.93-1.05-3.02-.06-1.49 1.06-5.97-3.17-6.3-.16-.01-.32-.02-.48-.02z',
          fill: '#FCC624',
        },
      ],
    },
  },
  {
    id: 'cloud-deploy',
    name: 'Vercel, Render & Cloudflare',
    category: 'Herramientas/DevOps',
    brandColor: '#F38020',
    role: 'Despliegue continuo de SPAs, contenedores backend, DNS y Edge',
    aliases: ['vercel', 'render', 'cloudflare'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M24 22.525H0l12-21.05 12 21.05z',
          fill: '#34B38A',
        },
      ],
    },
  },
  {
    id: 'wezterm',
    name: 'WezTerm & Git CLI',
    category: 'Herramientas/DevOps',
    brandColor: '#4E49EE',
    role: 'Emulador de terminal acelerado por GPU, flujos con Git y GitHub CLI (gh)',
    aliases: ['wezterm', 'git', 'github', 'gh'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M2 4a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm4.7 4.3a1 1 0 00-1.4 1.4L8.58 13l-3.29 3.3a1 1 0 101.42 1.4l4-4a1 1 0 000-1.4l-4-4zM12 16a1 1 0 100 2h6a1 1 0 100-2h-6z',
          fill: '#34B38A',
        },
      ],
    },
  },
  {
    id: 'ides',
    name: 'IntelliJ IDEA, Android Studio & Herd',
    category: 'Herramientas/DevOps',
    brandColor: '#3DDC84',
    role: 'Entornos para Java/Spring, emulación Android/Flutter y servicios locales',
    aliases: ['intellij', 'android-studio', 'herd', 'kotlin', 'swift', 'objective-c'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67a.643.643 0 00-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 001 18h22a10.81 10.81 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z',
          fill: '#3DDC84',
        },
      ],
    },
  },
  {
    id: 'video-editing',
    name: 'Edición de Video Digital',
    category: 'Herramientas/DevOps',
    brandColor: '#F59E0B',
    role: 'Producción audiovisual para demos de producto y presentaciones técnicas',
    aliases: ['video', 'media'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M4 4h12a2 2 0 012 2v3.5l4-2.5v10l-4-2.5V18a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm6 5v6l5-3-5-3z',
          fill: '#F59E0B',
        },
      ],
    },
  },

  // IA y agentes
  {
    id: 'antigravity',
    name: 'Google Antigravity (IDE & CLI)',
    category: 'IA y agentes',
    brandColor: '#34B38A',
    role: 'Desarrollo agéntico guiado por planes, artefactos y verificación',
    aliases: ['antigravity', 'agy'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12 2L2 19.5h6.2L12 12.8l3.8 6.7H22L12 2zm0 7.2l-2.1 3.8h4.2L12 9.2z',
          fill: '#34B38A',
        },
      ],
    },
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'IA y agentes',
    brandColor: '#D97757',
    role: 'Agente en terminal para refactorización, análisis de arquitectura y tests',
    aliases: ['claude', 'claude-code'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12 2.5l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4L12 2.5z',
          fill: '#D97757',
        },
      ],
    },
  },
  {
    id: 'opencode',
    name: 'OpenCode & Agent CLIs',
    category: 'IA y agentes',
    brandColor: '#38BDF8',
    role: 'Flujos de ingeniería asistidos en terminal y automatización vía CLI',
    aliases: ['opencode', 'cli-agents'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M3 3h18v18H3V3zm4.5 6l3.5 3-3.5 3 1.3 1.5L13.8 12 8.8 7.5 7.5 9zm5.5 6h5v-2h-5v2z',
          fill: '#38BDF8',
        },
      ],
    },
  },
  {
    id: 'agent-skills',
    name: 'Agent Skills & AGENTS.md',
    category: 'IA y agentes',
    brandColor: '#F59E0B',
    role: 'Estandarización de reglas de diseño (taste-skill) y contratos de repositorio',
    aliases: ['skills', 'agents-md', 'taste-skill'],
    svgPaths: {
      viewBox: '0 0 24 24',
      elements: [
        {
          d: 'M12 2l9 4.9V17L12 22l-9-5V6.9L12 2zm0 2.3L5.4 7.9 12 11.5l6.6-3.6L12 4.3zm-7 5.6v5.9l6 3.3v-5.9l-6-3.3zm14 0l-6 3.3v5.9l6-3.3V9.9z',
          fill: '#F59E0B',
        },
      ],
    },
  },
];

export function findTechForTag(tagOrLanguage: string): TechItem | undefined {
  const normalized = tagOrLanguage.trim().toLowerCase();
  return CURATED_TECH.find(
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
