# Agent Skills

This directory contains specialized skills for GitHub Copilot CLI to enhance its capabilities when working on this project.

## Available Skills

### frontend-design

**Purpose**: Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics.

**When to use**: Building web components, pages, dashboards, or any UI requiring high design quality.

**Usage**:

```
Use the /frontend-design skill to create a responsive navigation bar in React.
```

**Location**: `.github/skills/frontend-design/SKILL.md`

---

## Using Skills

Copilot will automatically use relevant skills based on your prompt and the skill's description. To explicitly invoke a skill, prefix the skill name with a forward slash:

```
/frontend-design
```

## Skills Commands

- **List available skills**: `/skills list` or "What skills do you have?"
- **Enable/disable skills**: `/skills` (use arrow keys and spacebar)
- **Get skill info**: `/skills info`
- **Reload skills**: `/skills reload` (if you added a skill during a session)

## Creating New Skills

1. Create a subdirectory under `.github/skills/` (use lowercase with hyphens)
2. Add a `SKILL.md` file with:
   - YAML frontmatter (`name`, `description`, optional `license`)
   - Markdown body with instructions
3. Optionally add scripts, examples, or resources

See the `frontend-design` skill as a reference example.

## Skill Best Practices

- **Clear descriptions**: Help Copilot know when to use the skill
- **Specific instructions**: Provide step-by-step guidance
- **Examples**: Show expected inputs and outputs
- **Resources**: Include scripts or reference files when helpful
