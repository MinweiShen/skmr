import { readFileSync } from "node:fs";
import { join } from "node:path";

export function helpCommand(): void {
  const pkgPath = join(__dirname, "..", "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { version: string };

  console.log(`
skmr v${pkg.version} - AI skill manager

Usage:
  skmr <command> [options]

Commands:
  add [source] --skill [name]   Add a skill and update skills.json
    -a <agent>                  Target agent (required, repeatable, e.g. -a claude-code -a cursor)
    -g                          Install globally
    -p                          Install for project

  install                       Install all skills from skills.json in parallel
    -c <path>                   Path to skills.json (default: ./skills.json)

  help                          Show this help message

Examples:
  skmr add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -p
  skmr install
  skmr install -c config/skills.json
`.trim());
}
