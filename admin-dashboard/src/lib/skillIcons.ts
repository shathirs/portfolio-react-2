/**
 * Skill logos — keep in sync with portfolio-site/src/lib/skillIcons.ts
 * Simple Icons + Devicon for names with special characters (C++, C#, etc.)
 */
type SkillIconDef =
  | { slug: string; color: string }
  | { url: string }

const DEVICON_BASE =
  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const iconMap: Record<string, SkillIconDef> = {
  react: { slug: 'react', color: '61DAFB' },
  'react.js': { slug: 'react', color: '61DAFB' },
  next: { slug: 'nextdotjs', color: '000000' },
  'next.js': { slug: 'nextdotjs', color: '000000' },
  vue: { slug: 'vuedotjs', color: '4FC08D' },
  'vue.js': { slug: 'vuedotjs', color: '4FC08D' },
  angular: { slug: 'angular', color: 'DD0031' },
  node: { slug: 'nodedotjs', color: '339933' },
  'node.js': { slug: 'nodedotjs', color: '339933' },
  express: { slug: 'express', color: '000000' },
  'express.js': { slug: 'express', color: '000000' },
  mongodb: { slug: 'mongodb', color: '47A248' },
  postgresql: { slug: 'postgresql', color: '4169E1' },
  mysql: { slug: 'mysql', color: '4479A1' },
  redis: { slug: 'redis', color: 'FF4438' },
  typescript: { slug: 'typescript', color: '3178C6' },
  javascript: { slug: 'javascript', color: 'F7DF1E' },
  'tailwind css': { slug: 'tailwindcss', color: '06B6D4' },
  tailwindcss: { slug: 'tailwindcss', color: '06B6D4' },
  html: { slug: 'html5', color: 'E34F26' },
  css: { slug: 'css3', color: '1572B6' },
  'html/css': { slug: 'html5', color: 'E34F26' },
  'html & css': { slug: 'html5', color: 'E34F26' },
  php: { slug: 'php', color: '777BB4' },
  python: { slug: 'python', color: '3776AB' },
  java: { slug: 'openjdk', color: '000000' },
  go: { slug: 'go', color: '00ADD8' },
  golang: { slug: 'go', color: '00ADD8' },
  rust: { slug: 'rust', color: '000000' },
  kotlin: { slug: 'kotlin', color: '7F52FF' },
  swift: { slug: 'swift', color: 'F05138' },
  ruby: { slug: 'ruby', color: 'CC342D' },
  dart: { slug: 'dart', color: '0175C2' },
  scala: { slug: 'scala', color: 'DC322F' },
  r: { slug: 'r', color: '276DC3' },
  matlab: { slug: 'mathworks', color: '0076A8' },
  bash: { slug: 'gnubash', color: '4EAA25' },
  shell: { slug: 'gnubash', color: '4EAA25' },
  linux: { slug: 'linux', color: 'FCC624' },
  'c++': {
    url: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  },
  cplusplus: {
    url: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  },
  'c plus plus': {
    url: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
  },
  'c#': {
    url: `${DEVICON_BASE}/csharp/csharp-original.svg`,
  },
  csharp: {
    url: `${DEVICON_BASE}/csharp/csharp-original.svg`,
  },
  'c-sharp': {
    url: `${DEVICON_BASE}/csharp/csharp-original.svg`,
  },
  c: { slug: 'c', color: 'A8B9CC' },
  docker: { slug: 'docker', color: '2496ED' },
  kubernetes: { slug: 'kubernetes', color: '326CE5' },
  azure: { slug: 'azure', color: '0078D4' },
  'google cloud': { slug: 'googlecloud', color: '4285F4' },
  aws: {
    url: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-original.svg`,
  },
  'amazon web services': {
    url: `${DEVICON_BASE}/amazonwebservices/amazonwebservices-original.svg`,
  },
  git: { slug: 'git', color: 'F05032' },
  github: { slug: 'github', color: '181717' },
  'git & github': { slug: 'github', color: '181717' },
  gitlab: { slug: 'gitlab', color: 'FC6D26' },
  'rest apis': { slug: 'openapiinitiative', color: '6BA539' },
  rest: { slug: 'openapiinitiative', color: '6BA539' },
  graphql: { slug: 'graphql', color: 'E10098' },
  redux: { slug: 'redux', color: '764ABC' },
  vite: { slug: 'vite', color: '646CFF' },
  figma: { slug: 'figma', color: 'F24E1E' },
  firebase: { slug: 'firebase', color: 'DD2C00' },
  vercel: { slug: 'vercel', color: '000000' },
  render: { slug: 'render', color: '46E3B7' },
  netlify: { slug: 'netlify', color: '00C7B7' },
  railway: { slug: 'railway', color: '0B0D0E' },
  digitalocean: { slug: 'digitalocean', color: '0080FF' },
  'digital ocean': { slug: 'digitalocean', color: '0080FF' },
  fly: { slug: 'flydotio', color: '24175B' },
  'fly.io': { slug: 'flydotio', color: '24175B' },
  flydotio: { slug: 'flydotio', color: '24175B' },
  cursor: { slug: 'cursor', color: '000000' },
  'cursor ide': { slug: 'cursor', color: '000000' },
  'cursor ai': { slug: 'cursor', color: '000000' },
  'vs code': {
    url: `${DEVICON_BASE}/vscode/vscode-original.svg`,
  },
  vscode: {
    url: `${DEVICON_BASE}/vscode/vscode-original.svg`,
  },
  'visual studio code': {
    url: `${DEVICON_BASE}/vscode/vscode-original.svg`,
  },
  copilot: { slug: 'githubcopilot', color: '000000' },
  'github copilot': { slug: 'githubcopilot', color: '000000' },
  jest: { slug: 'jest', color: 'C21325' },
  postman: { slug: 'postman', color: 'FF6C37' },
  'agile methodology': { slug: 'jira', color: '0052CC' },
  agile: { slug: 'jira', color: '0052CC' },
  scrum: { slug: 'scrumalliance', color: '009FDA' },
  'ci/cd': { slug: 'githubactions', color: '2088FF' },
  spring: { slug: 'spring', color: '6DB33F' },
  'spring boot': { slug: 'springboot', color: '6DB33F' },
  django: { slug: 'django', color: '092E20' },
  flask: { slug: 'flask', color: '000000' },
  laravel: { slug: 'laravel', color: 'FF2D20' },
  bootstrap: { slug: 'bootstrap', color: '7952B3' },
  sass: { slug: 'sass', color: 'CC6699' },
  webpack: { slug: 'webpack', color: '8DD6F9' },
  npm: { slug: 'npm', color: 'CB3837' },
  yarn: { slug: 'yarn', color: '2C8EBB' },
  pnpm: { slug: 'pnpm', color: 'F69220' },
  prisma: { slug: 'prisma', color: '2D3748' },
  supabase: { slug: 'supabase', color: '3FCF8E' },
  tensorflow: { slug: 'tensorflow', color: 'FF6F00' },
  pytorch: { slug: 'pytorch', color: 'EE4C2C' },
  openai: { slug: 'openai', color: '412991' },
  blockchain: { slug: 'ethereum', color: '3C3C3D' },
  solidity: { slug: 'solidity', color: '363636' },
}

/** Map display names / AI output → iconMap key */
const nameAliases: Record<string, string> = {
  'c++': 'c++',
  cpp: 'c++',
  cplusplus: 'c++',
  'c plus plus': 'c++',
  'c#': 'c#',
  'c-sharp': 'c#',
  csharp: 'c#',
  'c sharp': 'c#',
  golang: 'go',
  'node js': 'node.js',
  'react js': 'react.js',
  'vue js': 'vue.js',
  'next js': 'next.js',
  'express js': 'express.js',
  'digital ocean': 'digital ocean',
  'fly io': 'fly.io',
  'cursor ide': 'cursor',
  'cursor ai': 'cursor',
  'vs code': 'vs code',
  'visual studio code': 'visual studio code',
  'github copilot': 'github copilot',
}

function normalizeKey(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

function resolveKey(name: string): string {
  const key = normalizeKey(name)
  if (nameAliases[key]) return nameAliases[key]
  if (iconMap[key]) return key

  const withoutJs = key.replace(/\.js$/i, '').trim()
  if (nameAliases[withoutJs]) return nameAliases[withoutJs]
  if (iconMap[withoutJs]) return withoutJs

  const withJs = key.includes('.js') ? key : `${key}.js`
  if (iconMap[withJs]) return withJs

  return key
}

function lookupDef(name: string): SkillIconDef | null {
  const key = resolveKey(name)
  return iconMap[key] ?? iconMap[normalizeKey(name)] ?? null
}

function defToUrl(def: SkillIconDef): string {
  if ('url' in def) return def.url
  return `https://cdn.simpleicons.org/${def.slug}/${def.color}`
}

export function getSkillIconUrl(name: string, iconField?: string): string | null {
  const custom = iconField?.trim()
  if (custom) {
    if (custom.startsWith('http://') || custom.startsWith('https://')) return custom
    const def = lookupDef(custom) ?? iconMap[custom.toLowerCase()]
    if (def) return defToUrl(def)
    return `https://cdn.simpleicons.org/${custom}/6366f1`
  }

  const def = lookupDef(name)
  if (!def) return null
  return defToUrl(def)
}
