Custom agents
Custom agents provide a way to customize Kiro behavior by defining specific configurations for different use cases. Each custom agent is defined by a configuration file that specifies which tools the agent can access, what permissions it has, and what context it should include.

By default, Kiro CLI provides access to all available tools but requires user confirmation for most operations. This approach prioritizes security but can interrupt your workflow with frequent permission prompts.

Custom agents solve this by allowing you to:

Pre-approve specific tools - Define which tools can run without prompting
Limit tool access - Restrict which tools are available to reduce complexity
Include relevant context - Automatically load project files, documentation, or system information
Configure tool behavior - Set specific parameters for how tools should operate
Benefits of using custom agents

Workflow optimization - Create custom agents tailored to specific tasks like AWS infrastructure management, code reviews, or debugging sessions.
Reduced interruptions - Pre-approve trusted tools to eliminate permission prompts during focused work sessions.
Enhanced context - Automatically include relevant project documentation, configuration files, or system information.
Team collaboration - Share custom agent configurations with team members to ensure consistent development environments.
Security control - Limit tool access to only what's needed for specific workflows, reducing potential security risks.
Relationship to MCP and built-in tools

Custom agents work with both built-in tools and external tools provided through the Model Context Protocol (MCP). This gives you flexibility to:

Use built-in tools - File operations, command execution, AWS CLI integration, and other core functionality
Integrate MCP servers - Add custom tools and services through MCP server configurations
Control tool access - Specify exactly which tools from each source are available
Manage tool conflicts - Use aliases to handle naming conflicts between different tool sources