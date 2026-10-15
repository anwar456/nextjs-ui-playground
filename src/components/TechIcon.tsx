import {
  siApacheecharts,
  siBootstrap,
  siClaude,
  siCss,
  siD3,
  siDocker,
  siExpress,
  siGit,
  siGithub,
  siGitlab,
  siGo,
  siHtml5,
  siJavascript,
  siMapbox,
  siMarkdown,
  siMongodb,
  siNextdotjs,
  siNpm,
  siPostgresql,
  siPython,
  siReact,
  siSass,
  siStyledcomponents,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
} from "simple-icons";

type Brand = { path: string; hex: string };

// Brand logos, keyed by the skill name used in the content files.
const brands: Record<string, Brand> = {
  ReactJS: siReact,
  TypeScript: siTypescript,
  NextJS: siNextdotjs,
  TailwindCSS: siTailwindcss,
  Bootstrap: siBootstrap,
  Sass: siSass,
  "Styled Components": siStyledcomponents,
  HTML: siHtml5,
  CSS: siCss,
  JavaScript: siJavascript,
  "Three.js": siThreedotjs,
  Markdown: siMarkdown,
  "D3.js": siD3,
  ExpressJS: siExpress,
  Python: siPython,
  Golang: siGo,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  "Apache ECharts": siApacheecharts,
  Mapbox: siMapbox,
  Claude: siClaude,
  Git: siGit,
  GitHub: siGithub,
  GitLab: siGitlab,
  Docker: siDocker,
  npm: siNpm,
};

// Skills without a brand logo get a simple line icon in the primary colour.
const lines: Record<string, string> = {
  SQL: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  NoSQL: "M8 4C6 4 5 5 5 7v2c0 1.5-.8 2.5-2 3 1.2.5 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5.8 2.5 2 3-1.2.5-2 1.5-2 3v2c0 2-1 3-3 3",
  "CI/CD": "M17.5 8A5.5 5.5 0 0 0 7 9.5M6.5 16A5.5 5.5 0 0 0 17 14.5M17.5 3.5V8H13M6.5 20.5V16H11",
  "VS Code": "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  Highcharts: "M3 3v18h18M7 15l4-5 3 3 6-7",
  ApexCharts: "M5 21V12M10 21V6M15 21V10M20 21V3",
  "Ogma.js (SNA)":
    "M6 6l6 5 6-5M12 11v8M4.5 6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M16.5 6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M10.5 11a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M10.5 19a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0",
};

// Very dark brand colours disappear on the dark theme, so those use the text colour.
function isDark(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.12;
}

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const brand = brands[name];
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={className}
        style={{ fill: isDark(brand.hex) ? "var(--fg)" : `#${brand.hex}` }}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={lines[name] ?? "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"} />
    </svg>
  );
}
