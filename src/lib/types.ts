export interface SkillEntry {
  source: string;
  name: string;
  agents: string[];
  location: "global" | "project";
}

export interface SkillsManifest {
  version: string;
  command: string;
  skills: SkillEntry[];
}
