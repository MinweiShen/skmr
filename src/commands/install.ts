import { readSkillsJson } from "../lib/skills-json.js";
import { runSkillsCommand } from "../lib/runner.js";
import type { SkillEntry } from "../lib/types.js";

function buildSkillsArgs(skill: SkillEntry): string[] {
  const args: string[] = ["skills", "add", skill.source, "--skill", skill.name];

  if (skill.agents.length > 0) {
    args.push("--agent", ...skill.agents);
  }

  if (skill.location === "global") {
    args.push("-g");
  }

  args.push("-y");
  return args;
}

function parseInstallArgs(args: string[]): { configPath?: string } {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-c" && i + 1 < args.length) {
      return { configPath: args[i + 1] };
    }
  }
  return {};
}

export async function installCommand(args: string[]): Promise<void> {
  const { configPath } = parseInstallArgs(args);

  let manifest;
  try {
    manifest = await readSkillsJson(configPath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(
        `Error: skills.json not found at ${configPath ?? "skills.json"}`
      );
      process.exit(1);
    }
    if (err instanceof SyntaxError) {
      console.error(
        `Error: Invalid JSON in ${configPath ?? "skills.json"}: ${err.message}`
      );
      process.exit(1);
    }
    throw err;
  }

  if (manifest.skills.length === 0) {
    console.log("No skills to install.");
    return;
  }

  const baseCommand = manifest.command || "npx";
  console.log(`Installing ${manifest.skills.length} skill(s) in parallel...\n`);

  const results = await Promise.allSettled(
    manifest.skills.map(async (skill) => {
      const skillArgs = buildSkillsArgs(skill);
      console.log(`[${skill.name}] Running: ${baseCommand} ${skillArgs.join(" ")}`);
      const result = await runSkillsCommand(baseCommand, skillArgs);
      return { skill, result };
    })
  );

  // Summary
  let succeeded = 0;
  let failed = 0;

  console.log("\n--- Installation Summary ---");
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.result.exitCode === 0) {
      console.log(`  OK: ${r.value.skill.name}`);
      succeeded++;
    } else if (r.status === "fulfilled") {
      console.log(
        `  FAIL: ${r.value.skill.name} (exit code ${r.value.result.exitCode})`
      );
      failed++;
    } else {
      console.log(`  FAIL: ${r.reason}`);
      failed++;
    }
  }

  console.log(`\n${succeeded} succeeded, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}
