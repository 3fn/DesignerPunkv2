Agent configuration reference
Every agent configuration file can include the following sections:

name — The name of the agent (optional, derived from filename if not specified).
description — A description of the agent.
prompt — High-level context for the agent.
mcpServers — The MCP servers the agent has access to.
tools — The tools available to the agent.
toolAliases — Tool name remapping for handling naming collisions.
allowedTools — Tools that can be used without prompting.
toolsSettings — Configuration for specific tools.
resources — Resources available to the agent.
hooks — Commands run at specific trigger points.
includeMcpJson — Whether to include MCP servers from mcp.json files.
model — The model ID to use for this agent.
keyboardShortcut — Keyboard shortcut for quickly switching to this agent.
welcomeMessage — Message displayed when switching to this agent.
Name field

The name field specifies the name of the agent. This is used for identification and display purposes.

JSON

{
  "name": "aws-expert"
}
Description field

The description field provides a description of what the agent does. This is primarily for human readability and helps users distinguish between different agents.

JSON

{
  "description": "An agent specialized for AWS infrastructure tasks"
}
Prompt field

The prompt field is intended to provide high-level context to the agent, similar to a system prompt. It supports both inline text and file:// URIs to reference external files.

Inline prompt

JSON

{
  "prompt": "You are an expert AWS infrastructure specialist"
}
File URI prompt

You can reference external files using file:// URIs. This allows you to maintain long, complex prompts in separate files for better organization and version control, while keeping your agent configuration clean and readable.

JSON

{
  "prompt": "file://./my-agent-prompt.md"
}
File URI path resolution

Relative paths: Resolved relative to the agent configuration file's directory
"file://./prompt.md" → prompt.md in the same directory as the agent config
"file://../shared/prompt.md" → prompt.md in a parent directory
Absolute paths: Used as-is
"file:///home/user/prompts/agent.md" → Absolute path to the file
File URI examples

JSON

{
  "prompt": "file://./prompts/aws-expert.md"
}
JSON

{
  "prompt": "file:///Users/developer/shared-prompts/rust-specialist.md"
}
McpServers field

The mcpServers field specifies which Model Context Protocol (MCP) servers the agent has access to. Each server is defined with a command and optional arguments.

JSON

{
  "mcpServers": {
    "fetch": {
      "command": "fetch3.1",
      "args": []
    },
    "git": {
      "command": "git-mcp",
      "args": [],
      "env": {
        "GIT_CONFIG_GLOBAL": "/dev/null"
      },
      "timeout": 120000
    }
  }
}
Each MCP server configuration can include:

command (required): The command to execute to start the MCP server
args (optional): Arguments to pass to the command
env (optional): Environment variables to set for the server
timeout (optional): Timeout for each MCP request in milliseconds (default: 120000)
Tools field

The tools field lists all tools that the agent can potentially use. Tools include built-in tools and tools from MCP servers.

Built-in tools are specified by their name (e.g., read, shell)
MCP server tools are prefixed with @ followed by the server name (e.g., @git)
To specify a specific tool from an MCP server, use @server_name/tool_name
Use * as a special wildcard to include all available tools (both built-in and from MCP servers)
Use @builtin to include all built-in tools
Use @server_name to include all tools from a specific MCP server
JSON

{
  "tools": [
    "read",
    "write",
    "shell",
    "@git",
    "@rust-analyzer/check_code"
  ]
}
To include all available tools, you can simply use:

JSON

{
  "tools": ["*"]
}
ToolAliases field

The toolAliases field is an advanced feature that allows you to remap tool names. This is primarily used to resolve naming collisions between tools from different MCP servers, or to create more intuitive names for specific tools.

For example, if both @github-mcp and @gitlab-mcp servers provide a tool called get_issues, you would have a naming collision. You can use toolAliases to disambiguate them:

JSON

{
  "toolAliases": {
    "@github-mcp/get_issues": "github_issues",
    "@gitlab-mcp/get_issues": "gitlab_issues"
  }
}
With this configuration, the tools will be available to the agent as github_issues and gitlab_issues instead of having a collision on get_issues.

You can also use aliases to create shorter or more intuitive names for frequently used tools:

JSON

{
  "toolAliases": {
    "@aws-cloud-formation/deploy_stack_with_parameters": "deploy_cf",
    "@kubernetes-tools/get_pod_logs_with_namespace": "pod_logs"
  }
}
The key is the original tool name (including server prefix for MCP tools), and the value is the new name to use.

AllowedTools field

The allowedTools field specifies which tools can be used without prompting the user for permission. This is a security feature that helps prevent unauthorized tool usage.

JSON

{
  "allowedTools": [
    "read",
    "write",
    "@git/git_status",
    "@server/read_*",
    "@fetch"
  ]
}
You can allow tools using several patterns:

Exact matches

Built-in tools: "read", "shell", "knowledge"
Specific MCP tools: "@server_name/tool_name" (e.g., "@git/git_status")
All tools from MCP server: "@server_name" (e.g., "@fetch")
Wildcard patterns

The allowedTools field supports glob-style wildcard patterns using * and ?:

MCP tool patterns

Tool prefix: "@server/read_*" → matches @server/read_file, @server/read_config
Tool suffix: "@server/*_get" → matches @server/issue_get, @server/data_get
Server pattern: "@*-mcp/read_*" → matches @git-mcp/read_file, @db-mcp/read_data
Any tool from pattern servers: "@git-*/*" → matches any tool from servers matching git-*
Optionally, you can also prefix native tools with the namespace @builtin.

Examples

JSON

{
  "allowedTools": [
    // Exact matches
    "read",
    "knowledge",
    "@server/specific_tool",
    
    // Native tool wildcards
    "r*",                    // Read
    "w*",               // Write
    @builtin,                // All native tools
    
    // MCP tool wildcards
    "@server/api_*",           // All API tools from server
    "@server/read_*",          // All read tools from server
    "@git-server/get_*_info",  // Tools like get_user_info, get_repo_info
    "@*/status",               // Status tool from any server
    
    // Server-level permissions
    "@fetch",                  // All tools from fetch server
    "@git-*"                   // All tools from any git-* server
  ]
}
Pattern matching rules

* matches any sequence of characters (including none)
? matches exactly one character
Exact matches take precedence over patterns
Server-level permissions (@server_name) allow all tools from that server
Case-sensitive matching
Unlike the tools field, the allowedTools field does not support the "*" wildcard for allowing all tools. To allow tools, you must use specific patterns or server-level permissions.

ToolsSettings field

The toolsSettings field provides configuration for specific tools. Each tool can have its own unique configuration options. Note that specifications that configure allowable patterns will be overridden if the tool is also included in allowedTools.

JSON

{
  "toolsSettings": {
    "write": {
      "allowedPaths": ["~/**"]
    },
    "@git/git_status": {
      "git_user": "$GIT_USER"
    }
  }
}
Resources field

The resources field gives an agent access to local resources. Resources can be files, skills, or knowledge bases.

JSON

{
  "resources": [
    "file://README.md",
    "file://.kiro/steering/**/*.md",
    "skill://.kiro/skills/**/SKILL.md"
  ]
}
Resources support different types via URI schemes:

file:// — Files loaded directly into context at startup
skill:// — Skills with metadata loaded at startup, full content loaded on demand
Both support:

Specific paths: file://README.md or skill://my-skill.md
Glob patterns: file://.kiro/**/*.md or skill://.kiro/skills/**/SKILL.md
Absolute or relative paths
File resources

File resources are loaded directly into the agent's context when the agent starts. Use these for content the agent always needs.

JSON

{
  "resources": [
    "file://README.md",
    "file://docs/**/*.md"
  ]
}
Skill resources

Skills are progressively loaded — only metadata (name and description) is loaded at startup, with full content loaded on demand when the agent determines it's needed. This keeps context lean while giving agents access to extensive documentation.

Skill files must begin with YAML frontmatter containing name and description:

MARKDOWN

---
name: dynamodb-data-modeling
description: Guide for DynamoDB data modeling best practices. Use when designing or analyzing DynamoDB schema.
---

# DynamoDB Data Modeling

... full content here ...
JSON

{
  "resources": [
    "skill://.kiro/skills/**/SKILL.md"
  ]
}
Write specific descriptions so the agent can reliably determine when to load the full content.

Knowledge base resources

Knowledge base resources allow agents to search indexed documentation and content. With support for millions of tokens of indexed content and incremental loading, agents can efficiently search large documentation sets.

JSON

{
  "resources": [
    {
      "type": "knowledgeBase",
      "source": "file://./docs",
      "name": "ProjectDocs",
      "description": "Project documentation and guides",
      "indexType": "best",
      "autoUpdate": true
    }
  ]
}
Fields:

Field	Required	Description
type	Yes	Must be "knowledgeBase"
source	Yes	Path to index. Use file:// prefix for local paths
name	Yes	Display name for the knowledge base
description	No	Brief description of the content
indexType	No	Indexing strategy: "best" (default, higher quality) or "fast" (quicker indexing)
autoUpdate	No	Re-index when agent spawns. Default: false
Use cases:

Share team documentation across agents
Give agents access to project-specific context (specs, decisions, meeting notes)
Index large codebases and documentation
Keep agent knowledge current with autoUpdate: true
Hooks field

The hooks field defines commands to run at specific trigger points during agent lifecycle and tool execution.

For detailed information about hook behavior, input/output formats, and examples, see the Hooks documentation.

JSON

{
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status"
      }
    ],
    "userPromptSubmit": [
      {
        "command": "ls -la"
      }
    ],
    "preToolUse": [
      {
        "matcher": "execute_bash",
        "command": "{ echo \"$(date) - Bash command:\"; cat; echo; } >> /tmp/bash_audit_log"
      },
      {
        "matcher": "use_aws",
        "command": "{ echo \"$(date) - AWS CLI call:\"; cat; echo; } >> /tmp/aws_audit_log"
      }
    ],
    "postToolUse": [
      {
        "matcher": "fs_write",
        "command": "cargo fmt --all"
      }
    ]
  }
}
Each hook is defined with:

command (required): The command to execute
matcher (optional): Pattern to match tool names for preToolUse and postToolUse hooks. Hook matchers use internal tool names (fs_read, fs_write, execute_bash, use_aws) rather than simplified names. See built-in tools documentation for available tool names.
Available hook triggers:

agentSpawn: Triggered when the agent is initialized.
userPromptSubmit: Triggered when the user submits a message.
preToolUse: Triggered before a tool is executed. Can block the tool use.
postToolUse: Triggered after a tool is executed.
stop: Triggered when the assistant finishes responding.
includeMcpJson field

The includeMcpJson field determines whether to include MCP servers defined in the MCP configuration files (~/.kiro/settings/mcp.json for global and <cwd>/.kiro/settings/mcp.json for workspace).

JSON

{
  "includeMcpJson": true
}
When set to true, the agent will have access to all MCP servers defined in the global and local configurations in addition to those defined in the agent's mcpServers field.

Model field

The model field specifies the model ID to use for this agent. If not specified, the agent will use the default model.

JSON

{
  "model": "claude-sonnet-4"
}
The model ID must match one of the available models returned by the Kiro CLI's model service. You can see available models by using the /model command in an active chat session.

If the specified model is not available, the agent will fall back to the default model and display a warning.

KeyboardShortcut field

The keyboardShortcut field configures a keyboard shortcut for quickly switching to this agent during a chat session.

JSON

{
  "keyboardShortcut": "ctrl+a"
}
Shortcuts consist of a modifier and a key, separated by +:

Modifiers (optional):

ctrl - Control key
shift - Shift key
Keys:

Single letter: a-z (case insensitive)
Single digit: 0-9
Examples:

JSON

"keyboardShortcut": "ctrl+a"           // Control + A
"keyboardShortcut": "shift+b"          // Shift + B
Toggle Behavior:

When you press a keyboard shortcut:

If you're on a different agent: switches to this agent
If you're already on this agent: switches back to your previous agent
Conflict Handling:

If multiple agents have the same keyboard shortcut, a warning is logged and the shortcut is disabled. Use /agent swap to switch manually in this case.

WelcomeMessage field

The welcomeMessage field specifies a message displayed when switching to this agent.

JSON

{
  "welcomeMessage": "What would you like to build today?"
}
This message appears after the agent switch confirmation, helping orient users to the agent's purpose.

Complete example

Here's a complete example of an agent configuration file:

JSON

{
  "name": "aws-rust-agent",
  "description": "A specialized agent for AWS and Rust development tasks",
  "mcpServers": {
    "fetch": {
      "command": "fetch3.1",
      "args": []
    },
    "git": {
      "command": "git-mcp",
      "args": []
    }
  },
  "tools": [
    "read",
    "write",
    "shell",
    "aws",
    "@git",
    "@fetch/fetch_url"
  ],
  "toolAliases": {
    "@git/git_status": "status",
    "@fetch/fetch_url": "get"
  },
  "allowedTools": [
    "read",
    "@git/git_status"
  ],
  "toolsSettings": {
    "write": {
      "allowedPaths": ["src/**", "tests/**", "Cargo.toml"]
    },
    "aws": {
      "allowedServices": ["s3", "lambda"]
    }
  },
  "resources": [
    "file://README.md",
    "file://docs/**/*.md"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status"
      }
    ],
    "userPromptSubmit": [
      {
        "command": "ls -la"
      }
    ]
  },
  "useLegacyMcpJson": true,
  "model": "claude-sonnet-4",
  "keyboardShortcut": "ctrl+r",
  "welcomeMessage": "Ready to help with AWS and Rust development!"
}
Agent configuration files are JSON files that define how your custom agents behave. The filename (without .json) becomes the agent's name.

Quick start

We recommend using the /agent generate command within your active Kiro session to intelligently generate agent configurations with AI assistance.

File locations

You can define local agents and global agents.

Local agents (project-specific)


.kiro/agents/
Local agents are specific to the current workspace and only available when running Kiro CLI from that directory or its subdirectories.

Example:


my-project/
├── .kiro/
│   └── agents/
│       ├── dev-agent.json
│       └── aws-specialist.json
└── src/
    └── main.py
Global agents (user-wide)


~/.kiro/agents/
Global agents are available from any directory.

Example:


~/.kiro/agents/
├── general-assistant.json
├── code-reviewer.json
└── documentation-writer.json
Agent precedence

When Kiro CLI looks for an agent:

Local first: Checks .kiro/agents/ in the current directory
Global fallback: Checks ~/.kiro/agents/ in the HOME directory
If both locations have agents with the same name, the local agent takes precedence with a warning message.

Configuration fields

name

The agent's name for identification and display.

JSON

{
  "name": "aws-expert"
}
description

Human-readable description of the agent's purpose.

JSON

{
  "description": "An agent specialized for AWS infrastructure tasks"
}
prompt

High-level context for the agent, similar to a system prompt. Supports inline text or file:// URIs.

Inline:

JSON

{
  "prompt": "You are an expert AWS infrastructure specialist"
}
File URI:

JSON

{
  "prompt": "file://./my-agent-prompt.md"
}
Path Resolution:

Relative paths: Resolved relative to agent config file
"file://./prompt.md" → Same directory as agent config
"file://../shared/prompt.md" → Parent directory
Absolute paths: Used as-is
"file:///home/user/prompts/agent.md"
mcpServers

MCP servers the agent can access.

JSON

{
  "mcpServers": {
    "fetch": {
      "command": "fetch-server",
      "args": []
    },
    "git": {
      "command": "git-mcp",
      "args": [],
      "env": {
        "GIT_CONFIG_GLOBAL": "/dev/null"
      },
      "timeout": 120000
    }
  }
}
Fields:

command (required): Command to start the MCP server
args (optional): Arguments for the command
env (optional): Environment variables
timeout (optional): Request timeout in milliseconds (default: 120000)
tools

Tools available to the agent.

JSON

{
  "tools": [
    "read",
    "write",
    "shell",
    "@git",
    "@rust-analyzer/check_code"
  ]
}
Tool References:

Built-in tools: "read", "shell"
All MCP server tools: "@server_name"
Specific MCP tool: "@server_name/tool_name"
All tools: "*"
All built-in tools: "@builtin"
toolAliases

Remap tool names to resolve naming collisions or create intuitive names.

JSON

{
  "toolAliases": {
    "@github-mcp/get_issues": "github_issues",
    "@gitlab-mcp/get_issues": "gitlab_issues",
    "@aws-cloud-formation/deploy_stack_with_parameters": "deploy_cf"
  }
}
allowedTools

Tools that can be used without prompting for permission.

JSON

{
  "allowedTools": [
    "read",
    "@git/git_status",
    "@server/read_*",
    "@fetch"
  ]
}
Pattern Support:

Exact Matches:

Built-in: "read", "shell"
MCP tool: "@server_name/tool_name"
All server tools: "@server_name"
Wildcards:

Prefix: "code_*" → code_review, code_analysis
Suffix: "*_bash" → execute_bash, run_bash
Single char: "?ead" → read, head
MCP patterns: "@server/read_*", "@git-*/status"
toolsSettings

Configuration for specific tools.

JSON

{
  "toolsSettings": {
    "write": {
      "allowedPaths": ["~/**"]
    },
    "shell": {
      "allowedCommands": ["git status", "git fetch"],
      "deniedCommands": ["git commit .*", "git push .*"],
      "autoAllowReadonly": true
    },
    "@git/git_status": {
      "git_user": "$GIT_USER"
    }
  }
}
See Built-in Tools for tool-specific options.

resources

Local resources available to the agent. Supports file resources, skill resources, and knowledge bases.

File resources:

JSON

{
  "resources": [
    "file://README.md",
    "file://.kiro/steering/**/*.md",
    "skill://.kiro/skills/**/SKILL.md"
  ]
}
Knowledge base resources:

JSON

{
  "resources": [
    {
      "type": "knowledgeBase",
      "source": "file://./docs",
      "name": "ProjectDocs",
      "description": "Project documentation",
      "indexType": "best",
      "autoUpdate": true
    }
  ]
}
Resource types:

file:// — Loaded into context at startup
skill:// — Metadata loaded at startup, full content loaded on demand
Both support specific files, glob patterns, and absolute or relative paths.

Knowledge base fields:

type: Must be "knowledgeBase"
source: Path to index (use file:// prefix)
name: Display name
description: Optional description
indexType: "best" (default) or "fast"
autoUpdate: Re-index on agent spawn (default: false)
hooks

Commands to run at specific trigger points.

JSON

{
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status"
      }
    ],
    "userPromptSubmit": [
      {
        "command": "ls -la"
      }
    ],
    "preToolUse": [
      {
        "matcher": "execute_bash",
        "command": "{ echo \"$(date) - Bash:\"; cat; } >> /tmp/audit.log"
      }
    ],
    "postToolUse": [
      {
        "matcher": "fs_write",
        "command": "cargo fmt --all"
      }
    ],
    "stop": [
      {
        "command": "npm test"
      }
    ]
  }
}
Hook Types:

agentSpawn: When agent is activated
userPromptSubmit: When user submits a prompt
preToolUse: Before tool execution (can block)
postToolUse: After tool execution
stop: When assistant finishes responding
See Hooks for detailed documentation.

model

Model ID to use for this agent.

JSON

{
  "model": "claude-sonnet-4"
}
If not specified or unavailable, falls back to default model.

keyboardShortcut

Keyboard shortcut for quickly switching to this agent.

JSON

{
  "keyboardShortcut": "ctrl+a"
}
Format: [modifier+]key

Modifiers: ctrl, shift

Keys: a-z, 0-9

Behavior:

Pressing the shortcut switches to this agent
Pressing again while on this agent switches back to the previous agent
Conflicting shortcuts are disabled with a warning
welcomeMessage

Message displayed when switching to this agent.

JSON

{
  "welcomeMessage": "What would you like to build today?"
}
This message appears after the agent switch confirmation, helping orient users to the agent's purpose.

Complete example

JSON

{
  "name": "aws-rust-agent",
  "description": "Specialized agent for AWS and Rust development",
  "prompt": "file://./prompts/aws-rust-expert.md",
  "mcpServers": {
    "fetch": {
      "command": "fetch-server",
      "args": []
    },
    "git": {
      "command": "git-mcp",
      "args": []
    }
  },
  "tools": [
    "read",
    "write",
    "shell",
    "aws",
    "@git",
    "@fetch/fetch_url"
  ],
  "toolAliases": {
    "@git/git_status": "status",
    "@fetch/fetch_url": "get"
  },
  "allowedTools": [
    "read",
    "@git/git_status"
  ],
  "toolsSettings": {
    "write": {
      "allowedPaths": ["src/**", "tests/**", "Cargo.toml"]
    },
    "aws": {
      "allowedServices": ["s3", "lambda"],
      "autoAllowReadonly": true
    }
  },
  "resources": [
    "file://README.md",
    "file://docs/**/*.md"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status"
      }
    ],
    "postToolUse": [
      {
        "matcher": "fs_write",
        "command": "cargo fmt --all"
      }
    ]
  },
  "model": "claude-sonnet-4",
  "keyboardShortcut": "ctrl+shift+r",
  "welcomeMessage": "Ready to help with AWS and Rust development!"
}
Best practices

Start restrictive: Begin with minimal tool access and expand as needed
Name clearly: Use descriptive names that indicate the agent's purpose
Document usage: Add clear descriptions to help team members understand the agent
Version control: Store agent configurations in your project repository
Test thoroughly: Verify tool permissions work as expected before sharing
Local vs global agents

Use Local Agents For:

Project-specific configurations
Agents needing project files/tools
Development environments with unique requirements
Sharing with team via version control
Use Global Agents For:

General-purpose agents across projects
Personal productivity agents
Agents without project-specific context
Commonly used tools and workflows
Security

Review allowedTools carefully
Use specific patterns over wildcards
Configure toolsSettings for sensitive operations
Test agents in safe environments first
Organization

Use descriptive agent names
Document agent purposes in descriptions
Keep prompt files organized
Version control local agents with projects