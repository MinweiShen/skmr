# skmr

**`npm` for AI agent skills.** Manage, share, and sync your AI coding agent skills across tools and teams with a single manifest file.

Just like `package.json` tracks your npm dependencies, `skills.json` tracks your AI skills. Add a skill once, install everywhere.

```bash
# Add a skill - just like npm install
skmr add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -a cursor -p

# Set up a new machine in seconds - just like npm install
skmr install
```

## Why skmr?

- **Declarative skill management** - Track all your AI skills in a single `skills.json` file, just like `package.json`
- **One command setup** - Clone a repo, run `skmr install`, and every team member gets the same skills
- **Multi-agent support** - Install skills to Claude Code, Cursor, Windsurf, Copilot, and 15+ other agents at once
- **Parallel installs** - All skills install concurrently, not one at a time
- **Zero dependencies** - Lightweight wrapper with no runtime deps

## Install

```bash
npm install -g skmr
```

Or use directly with `npx`:

```bash
npx skmr <command>
```

## Usage

### `skmr add` - Add a skill

```bash
skmr add <source> --skill <name> -a <agent> [-a <agent>...] [-g|-p]
```

Installs the skill via [`skills`](https://skills.sh/) and saves it to `skills.json` - just like `npm install --save`.

```bash
# Add a skill for claude-code and cursor, project-level
skmr add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -a cursor -p

# Add a skill globally
skmr add https://github.com/anthropics/skills --skill skill-creator -a claude-code -g
```

The `-a` flag is required. Run without it to see all available agents.

### `skmr install` - Install all skills

```bash
# Install from ./skills.json - just like npm install
skmr install

# Install from a custom path
skmr install -c path/to/skills.json
```

Reads `skills.json` and installs all skills in parallel. Share your `skills.json` with your team and everyone gets the same setup.

### `skmr help`

```bash
skmr help
skmr -h
```

### Additional Commands

`skmr` also supports these additional commands that are inherited from the underlying [`skills`](https://skills.sh/) command:

| Command | Description |
|---------|-------------|
| `skmr list` | List all installed skills |
| `skmr find <query>` | Search for skills by name or description |
| `skmr remove <skill>` | Remove a skill |
| `skmr check` | Check for skill updates |
| `skmr update [skill]` | Update skills to latest versions |
| `skmr init` | Initialize a new skills.json file |

#### Examples

```bash
# List all installed skills
skmr list

# Find skills related to React
skmr find react

# Remove a skill
skmr remove vercel-react-best-practices

# Check for updates
skmr check

# Update all skills
skmr update

# Update a specific skill
skmr update vercel-react-best-practices

# Initialize a new skills.json file
skmr init
```

## skills.json

Your skill manifest. Commit it to your repo and share with your team.

```json
{
  "version": "0.0.1",
  "command": "npx",
  "skills": [
    {
      "source": "https://github.com/vercel-labs/agent-skills",
      "name": "vercel-react-best-practices",
      "agents": ["claude-code", "cursor"],
      "location": "project"
    }
  ]
}
```

| Field | Description |
|-------|-------------|
| `source` | GitHub repo URL or shorthand |
| `name` | Skill name to install |
| `agents` | Target AI agents |
| `location` | `"project"` (default) or `"global"` |

## Supported Agents

claude-code, cursor, windsurf, cline, copilot, codex, gemini-cli, roo-code, kilo-code, trae, goose, opencode, continue, junie, kiro-cli, qwen-code, pochi, amp

## License

MIT
