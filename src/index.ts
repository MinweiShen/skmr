import { helpCommand } from "./commands/help.js";
import { addCommand } from "./commands/add.js";
import { installCommand } from "./commands/install.js";
import { inheritCommand } from "./commands/inherit.js";

export async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const commandArgs = args.slice(1);

  switch (command) {
    case "add":
      await addCommand(commandArgs);
      break;
    case "install":
      await installCommand(commandArgs);
      break;
    case "list":
    case "find":
    case "remove":
    case "check":
    case "update":
    case "init":
      await inheritCommand(command, commandArgs);
      break;
    case "help":
    case "-h":
    case "--help":
    case undefined:
      helpCommand();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      helpCommand();
      process.exit(1);
  }
}
