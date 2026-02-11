import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { SkillEntry, SkillsManifest } from "./types.js";

const DEFAULT_PATH = "skills.json";

function createDefaultManifest(): SkillsManifest {
  return {
    version: "0.0.1",
    command: "npx",
    skills: [],
  };
}

export async function readSkillsJson(
  path?: string
): Promise<SkillsManifest> {
  const filePath = resolve(path ?? DEFAULT_PATH);
  let content: string;
  try {
    content = await readFile(filePath, "utf-8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return createDefaultManifest();
    }
    throw err;
  }

  const data = JSON.parse(content) as SkillsManifest;
  if (!Array.isArray(data.skills)) {
    throw new Error(`Invalid skills.json: "skills" must be an array`);
  }
  return data;
}

export async function writeSkillsJson(
  manifest: SkillsManifest,
  path?: string
): Promise<void> {
  const filePath = resolve(path ?? DEFAULT_PATH);
  await writeFile(filePath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
}

export function upsertSkill(
  manifest: SkillsManifest,
  entry: SkillEntry
): SkillsManifest {
  const idx = manifest.skills.findIndex(
    (s) => s.source === entry.source && s.name === entry.name
  );
  if (idx >= 0) {
    manifest.skills[idx] = entry;
  } else {
    manifest.skills.push(entry);
  }
  return manifest;
}
