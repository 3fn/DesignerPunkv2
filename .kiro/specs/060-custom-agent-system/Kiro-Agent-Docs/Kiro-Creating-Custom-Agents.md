Creating custom agents
Custom agents allow you to tailor Kiro CLI behavior for specific tasks by defining which tools are available, what permissions are granted, and what context is automatically included.

Quick start

You can create an agent configuration using a slash command from within a Kiro CLI chat session. It will guide you through the process of configuring the agent:


> /agent generate

✔ Enter agent name:  · backend-specialist
✔ Enter agent description:  · You are specialist in backend coding practices 
✔ Agent scope · Local (current workspace)
Select MCP servers (use Space to toggle, Enter to confirm): markdown-downloader (node), code-analysis (uv)

✓ Agent 'backend-specialist' has been created and saved successfully!
Alternatively, you can also use the CLI command to create a new custom agent:

BASH

kiro-cli agent create --name my-agent
This will guide you through the setup process and create a configuration file at ~/.kiro/agents/my-agent.json.

Agent configuration file

Custom agents are defined using JSON configuration files. Here's a basic example:

JSON

{
  "name": "my-agent",
  "description": "A custom agent for my workflow",
  "tools": ["read","write"],
  "allowedTools": ["read"],
  "resources": [
    "file://README.md",
    "file://.kiro/steering/**/*.md",
    "skill://.kiro/skills/**/SKILL.md"
  ],
  "prompt": "You are a helpful coding assistant",
  "model": "claude-sonnet-4"
}
Using your custom agent

Start a new chat session - which uses the default agent ("kiro_default") and swap to an agent using the agent slash command

BASH

> /agent swap

 Choose one of the following agents 
❯ rust-developer-agent
  kiro_default
  backend-specialist
After selecting an agent, you will see the following:

BASH

✔ Choose one of the following agents · backend-specialist

[backend-specialist] > 
Alternatively, start a chat session with your custom agent:

BASH

kiro-cli --agent my-agent