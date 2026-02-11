import { spawn } from "node:child_process";

export interface RunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function runSkillsCommand(
  command: string,
  args: string[]
): Promise<RunResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (data: Buffer) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("close", (code: number | null) => {
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });

    child.on("error", (err: Error) => {
      stderr += err.message;
      resolve({ exitCode: 1, stdout, stderr });
    });
  });
}
