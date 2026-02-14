Agent Examples
This page provides practical examples of custom agents you can use as starting points for your own workflows.

AWS Specialist Agent

This custom agent is optimized for AWS infrastructure management and development tasks. It provides pre-approved access to AWS tools while including relevant documentation.

JSON

{
  "name": "aws-specialist-agent",
  "description": "Specialized custom agent for AWS infrastructure and development tasks",
  "prompt": "You are an expert AWS infrastructure specialist with deep knowledge of cloud architecture and best practices",
  "tools": [
    "read",
    "write",
    "shell",
    "aws"
  ],
  "allowedTools": [
    "read",
    "aws"
  ],
  "toolsSettings": {
    "aws": {
      "allowedServices": [
        "s3",
        "lambda",
        "cloudformation",
        "ec2",
        "iam",
        "logs"
      ]
    },
    "write": {
      "allowedPaths": [
        "infrastructure/**",
        "scripts/**",
        "*.yaml",
        "*.yml",
        "*.json"
      ]
    }
  },
  "resources": [
    "file://README.md",
    "file://infrastructure/**/*.yaml",
    "file://infrastructure/**/*.yml",
    "file://docs/aws-setup.md",
    "file://scripts/deploy.sh"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "aws sts get-caller-identity",
        "timeout_ms": 10000,
        "cache_ttl_seconds": 300
      }
    ]
  },
  "model": "claude-sonnet-4"
}
Use cases:

Deploying CloudFormation stacks
Managing S3 buckets and Lambda functions
Troubleshooting AWS service issues
Reviewing and updating infrastructure as code
Development Workflow Agent

This custom agent is designed for general software development tasks, including code review, testing, and Git operations.

JSON

{
  "name": "development-workflow-agent",
  "description": "General development workflow custom agent with Git integration",
  "prompt": "You are a software development assistant with expertise in Git workflows and code management",
  "mcpServers": {
    "git": {
      "command": "git-mcp-server",
      "args": [],
      "timeout": 30000
    }
  },
  "tools": [
    "read",
    "write",
    "shell",
    "@git"
  ],
  "allowedTools": [
    "read",
    "@git/git_status",
    "@git/git_log",
    "@git/git_diff"
  ],
  "toolAliases": {
    "@git/git_status": "status",
    "@git/git_log": "log",
    "@git/git_diff": "diff"
  },
  "toolsSettings": {
    "write": {
      "allowedPaths": [
        "src/**",
        "tests/**",
        "docs/**",
        "*.md",
        "*.json",
        "package.json",
        "requirements.txt"
      ]
    }
  },
  "resources": [
    "file://README.md",
    "file://CONTRIBUTING.md",
    "file://docs/**/*.md",
    "file://package.json",
    "file://requirements.txt"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status --porcelain",
        "timeout_ms": 5000
      },
      {
        "command": "git branch --show-current",
        "timeout_ms": 3000
      }
    ]
  }
}
Use cases:

Code review and analysis
Writing and updating tests
Git workflow management
Documentation updates
Dependency management
Code Review Agent

This custom agent focuses specifically on code review tasks, with tools and context optimized for analyzing code quality, security, and best practices.

JSON

{
  "name": "code-review-agent",
  "description": "Specialized custom agent for code review and quality analysis",
  "prompt": "You are a code review specialist focused on quality, security, and best practices",
  "tools": [
    "read",
    "shell"
  ],
  "allowedTools": [
    "read",
    "shell"
  ],
  "toolsSettings": {
    "shell": {
      "allowedCommands": [
        "grep",
        "find",
        "wc",
        "head",
        "tail",
        "cat",
        "diff",
        "git diff",
        "git log",
        "eslint",
        "pylint",
        "rubocop"
      ]
    }
  },
  "resources": [
    "file://CONTRIBUTING.md",
    "file://docs/coding-standards.md",
    "file://docs/security-guidelines.md",
    "file://.eslintrc.json",
    "file://.pylintrc",
    "file://pyproject.toml"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "git diff --name-only HEAD~1",
        "timeout_ms": 5000,
        "max_output_size": 2048
      }
    ],
    "userPromptSubmit": [
      {
        "command": "find . -name '*.py' -o -name '*.js' -o -name '*.ts' | wc -l",
        "timeout_ms": 3000,
        "cache_ttl_seconds": 60
      }
    ]
  }
}
Use cases:

Reviewing pull requests for code quality
Identifying security vulnerabilities
Checking adherence to coding standards
Analyzing code complexity and maintainability
Suggesting improvements and refactoring opportunities
Project-Specific Agent

This example shows how to create a custom agent tailored to a specific project, including project-specific tools, documentation, and build processes.

JSON

{
  "name": "mobile-app-agent",
  "description": "Custom agent for the mobile app backend project",
  "prompt": "You are a backend development specialist for mobile applications with expertise in Docker and database management",
  "mcpServers": {
    "docker": {
      "command": "docker-mcp-server",
      "args": ["--socket", "/var/run/docker.sock"]
    },
    "database": {
      "command": "postgres-mcp-server",
      "args": ["--connection", "postgresql://localhost:5432/myapp"],
      "env": {
        "PGPASSWORD": "$DATABASE_PASSWORD"
      }
    }
  },
  "tools": [
    "read",
    "write",
    "shell",
    "@docker",
    "@database"
  ],
  "allowedTools": [
    "read",
    "@docker/docker_ps",
    "@docker/docker_logs",
    "@database/query_read_only"
  ],
  "toolAliases": {
    "@docker/docker_ps": "containers",
    "@docker/docker_logs": "logs",
    "@database/query_read_only": "query"
  },
  "toolsSettings": {
    "write": {
      "allowedPaths": [
        "src/**",
        "tests/**",
        "migrations/**",
        "docker-compose.yml",
        "Dockerfile",
        "requirements.txt"
      ]
    },
    "shell": {
      "allowedCommands": [
        "npm test",
        "npm run build",
        "python manage.py test",
        "docker-compose up",
        "docker-compose down"
      ]
    }
  },
  "resources": [
    "file://README.md",
    "file://docs/api-documentation.md",
    "file://docs/database-schema.md",
    "file://docker-compose.yml",
    "file://requirements.txt",
    "file://src/config/settings.py"
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "docker-compose ps",
        "timeout_ms": 10000,
        "cache_ttl_seconds": 30
      },
      {
        "command": "git status --porcelain",
        "timeout_ms": 5000
      }
    ]
  }
}
Use cases:

Managing Docker containers and services
Running database queries and migrations
Building and testing the application
Debugging production issues
Updating API documentation
Tips for Creating Effective Custom Agents

Start simple - Begin with basic tool configurations and add complexity as needed
Use descriptive names - Choose custom agent names that clearly indicate their purpose
Include relevant context - Add project documentation and configuration files to resources
Pre-approve safe tools - Include frequently used, low-risk tools in allowedTools
Use hooks for dynamic context - Include current system state through command hooks
Limit tool scope - Use toolsSettings to restrict tool access to relevant paths and services
Test thoroughly - Verify that your custom agent configuration works as expected
Document your custom agents - Use clear descriptions to help team members understand custom agent purposes
Remote MCP Server Integration

This example shows an agent configured to use a remote MCP server:

JSON

{
  "name": "domain-finder",
  "description": "Agent with access to domain search capabilities",
  "prompt": "You help users find and research domain names using the find-a-domain service.",
  "mcpServers": {
    "find-a-domain": {
      "type": "http",
      "url": "https://api.findadomain.dev/mcp"
    }
  },
  "tools": ["@find-a-domain"],
  "allowedTools": ["@find-a-domain"]
}
This agent provides access to domain search tools through a remote MCP server. If the server requires OAuth authentication, use the /mcp command to authenticate when prompted.