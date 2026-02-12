import { runSkillsCommand } from "../lib/runner.js";
import { readSkillsJson } from '../lib/skills-json.js';

export async function inheritCommand(command: string, args: string[]): Promise<void> {
  const manifest = await readSkillsJson();
  const baseCommand = manifest.command || "npx";

  // Build and run the skills command
  const skillsArgs = ["skills", command, ...args];
  console.log(`Running: ${baseCommand} ${skillsArgs.join(" ")}`);

  const result = await runSkillsCommand(baseCommand, skillsArgs);

  if (result.exitCode !== 0) {
    console.error(`\nskills command failed with exit code ${result.exitCode}`);
    process.exit(result.exitCode);
  }
}