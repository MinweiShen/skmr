# skmr

A CLI tool to manage AI agent skills using a `skills.json` manifest file. Think of it as `package.json` for [skills](https://skills.sh/).

## Install

```bash
npm install -g skmr
```

Or use directly with `npx`:

```bash
npx skmr <command>
```

## Usage

### Add a skill

```bash
skmr add <source> --skill <name> -a <agent> [-a <agent>...] [-g|-p]
```

The `-a` flag is required and repeatable. This wraps `npx skills add` and updates your `skills.json`.

```bash
# Add a skill for claude-code and cursor, project-level
skmr add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -a claude-code -a cursor -p

# Add a skill globally
skmr add https://github.com/anthropics/skills --skill skill-creator -a claude-code -g
```

### Install all skills

```bash
# Install from ./skills.json
skmr install

# Install from a custom path
skmr install -c path/to/skills.json
```

Reads `skills.json` and installs all skills in parallel.

### Help

```bash
skmr help
skmr -h
```

## skills.json

The `skills.json` file tracks your installed skills:

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

| Field | Maps to |
|-------|---------|
| `source` | `<source>` positional arg |
| `name` | `--skill <name>` |
| `agents` | `--agent <agent1> <agent2>` |
| `location: "global"` | `-g` |
| `location: "project"` | (default) |

## Supported Agents

claude-code, cursor, windsurf, cline, copilot, codex, gemini-cli, roo-code, kilo-code, trae, goose, opencode, continue, junie, kiro-cli, qwen-code, pochi, amp

## License

MIT
