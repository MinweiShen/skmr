import { runSkillsCommand } from "../lib/runner.js";
import { readSkillsJson, writeSkillsJson, upsertSkill } from "../lib/skills-json.js";
import type { SkillEntry } from "../lib/types.js";

interface AddArgs {
  source: string;
  skill: string;
  agents: string[];
  location: "global" | "project" | undefined;
}

function parseAddArgs(args: string[]): AddArgs {
  const result: AddArgs = {
    source: "",
    skill: "",
    agents: [],
    location: undefined,
  };

  let i = 0;

  // First positional arg is the source
  if (args.length > 0 && !args[0].startsWith("-")) {
    result.source = args[0];
    i = 1;
  }

  while (i < args.length) {
    const arg = args[i];
    if (arg === "--skill" && i + 1 < args.length) {
      result.skill = args[++i];
    } else if (arg === "-a" && i + 1 < args.length) {
      result.agents.push(args[++i]);
    } else if (arg === "-g") {
      result.location = "global";
    } else if (arg === "-p") {
      result.location = "project";
    }
    i++;
  }

  return result;
}

function buildSkillsArgs(parsed: AddArgs): string[] {
  const args: string[] = ["add", parsed.source, "--skill", parsed.skill];

  if (parsed.agents.length > 0) {
    args.push("--agent", ...parsed.agents);
  }

  if (parsed.location === "global") {
    args.push("-g");
  }

  args.push("-y");
  return args;
}

const KNOWN_AGENTS = [
  "claude-code",
  "cursor",
  "windsurf",
  "cline",
  "copilot",
  "codex",
  "gemini-cli",
  "roo-code",
  "kilo-code",
  "trae",
  "goose",
  "opencode",
  "continue",
  "junie",
  "kiro-cli",
  "qwen-code",
  "pochi",
  "amp",
];

export async function addCommand(args: string[]): Promise<void> {
  const parsed = parseAddArgs(args);

  if (!parsed.source || !parsed.skill) {
    console.error("Error: source and --skill are required.");
    console.error("Usage: skmr add [source] --skill [name] -a [agent]... [-g|-p]");
    process.exit(1);
  }

  if (parsed.agents.length === 0) {
    console.error("Error: at least one agent is required via -a flag.\n");
    console.error("Available agents:");
    for (const agent of KNOWN_AGENTS) {
      console.error(`  ${agent}`);
    }
    console.error("\nUsage: skmr add [source] --skill [name] -a [agent]... [-g|-p]");
    console.error("Example: skmr add https://github.com/org/repo --skill my-skill -a claude-code -a cursor -p");
    process.exit(1);
  }

  // Read the manifest to get the command
  const manifest = await readSkillsJson();
  const baseCommand = manifest.command || "npx";

  // Build and run the skills command
  const skillsArgs = ["skills", ...buildSkillsArgs(parsed)];
  console.log(`Running: ${baseCommand} ${skillsArgs.join(" ")}`);

  const result = await runSkillsCommand(baseCommand, skillsArgs);

  if (result.exitCode !== 0) {
    console.error(`\nskills command failed with exit code ${result.exitCode}`);
    process.exit(result.exitCode);
  }

  // Update skills.json
  const entry: SkillEntry = {
    source: parsed.source,
    name: parsed.skill,
    agents: parsed.agents,
    location: parsed.location ?? "project",
  };

  const updated = upsertSkill(manifest, entry);
  await writeSkillsJson(updated);
  console.log(`\nUpdated skills.json with "${entry.name}"`);
}
