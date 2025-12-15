Peter:
Hi! I have a bit of a complex question... We've been using steering and spec documentation as a way of keeping AI Agents aligned when developing this design system, and I wonder if we're starting to hit the ceiling of how much context a single AI Agent can store to work in this kind of complexity. I've heard of other people being able build their documentation into an AI inherently, but I haven't a clue about how that would work if it's possible. Any idea what I'm talking about or if it's possible?


Kiro:
Including Steering Documents

00-Steering%20Documentation%20Directional%20Priorities.md

BUILD-SYSTEM-SETUP.md

Component%20Development%20Guide.md

Core%20Goals.md

Development%20Workflow.md

File%20Organization%20Standards.md

Personal%20Note.md

Spec%20Planning%20Standards.md

Start%20Up%20Tasks.md

Task-Type-Definitions.md

Technology%20Stack.md
Hello, Peter! I've completed the required readings!

Great question - you're touching on something really important about the evolution of AI-assisted development. Let me break down what you're likely hearing about and what options exist:

What You're Probably Hearing About
1. Custom GPTs / Fine-tuning

Organizations can create custom AI models trained on their specific documentation
This "bakes in" knowledge so it doesn't need to be loaded as context every time
Trade-off: Expensive, requires significant data, and models can become stale as docs evolve
2. RAG (Retrieval-Augmented Generation)

System that indexes your documentation and retrieves relevant chunks on-demand
AI gets just the pieces it needs for the current task
Trade-off: Requires infrastructure setup, but more flexible than fine-tuning
3. MCP (Model Context Protocol) Servers

Kiro actually supports this! You can create MCP servers that provide documentation
AI can query documentation dynamically rather than loading everything upfront
Trade-off: Requires building the MCP server, but very flexible
Your Current Approach vs. Alternatives
What you're doing now (Conditional Loading):

✅ Works with standard Kiro features
✅ No infrastructure needed
✅ Documentation stays in markdown (easy to maintain)
✅ Explicit control over what loads when
❌ Still loads full documents even if only sections are needed
❌ Context window pressure as project grows
What you could explore:

Option A: MCP Server for DesignerPunk Docs
Create an MCP server that indexes your steering/spec docs and lets AI agents query them:

// .kiro/settings/mcp.json
{
  "mcpServers": {
    "designerpunk-docs": {
      "command": "node",
      "args": ["./mcp-server/docs-server.js"]
    }
  }
}
Benefits:

AI queries "show me token selection guidance" instead of loading entire Component Development Guide
Dramatically reduces context usage
Documentation stays in markdown
Can be version-controlled alongside code
Effort: Medium - requires building the MCP server

Option B: Kiro Powers
Package your documentation as a Kiro Power that other teams could use:

Benefits:

Reusable across projects
Can include both docs and tools
Kiro's power system handles loading/unloading
Effort: Medium-High - requires packaging as a power

Option C: Hybrid Approach (Recommended)
Keep your current system but enhance it:

Keep conditional loading for core workflows (what you have works!)
Add MCP server for reference documentation (token specs, component patterns)
Use "AI Agent Reading Priorities" more aggressively (you're already doing this well)
My Recommendation
Given where you are, I'd suggest:

Short-term (now):

Your current system is actually quite sophisticated
The "AI Agent Reading Priorities" sections are brilliant
Consider adding more aggressive section markers: <!-- SKIP UNLESS: condition -->
Medium-term (next month):

Build a simple MCP server for your token documentation
This is your most stable, reference-heavy content
Would dramatically reduce context for component development tasks
Long-term (when it hurts):

Consider RAG system if you hit real context limits
But honestly, your conditional loading might scale further than you think
The Real Question
Are you actually hitting context limits, or does it just feel complex?

Looking at your steering docs, you're being very thoughtful about:

Conditional loading triggers
Strategic reading sections
Minimal, focused guidance
This is actually a really mature approach. The question is: are AI agents failing to complete tasks due to context limits, or is the system working but feeling unwieldy to maintain?

If it's the former → MCP server or RAG If it's the latter → Your system is fine, maybe just needs refinement

What symptoms are you seeing that make you think you're hitting limits?

Credits used: 0.59
Elapsed time: 2m 2s
Checkpoint
Restore


Peter:
Well, look at it this way: you loaded all the steering documentation and likely skipped a lot of irrelevant contexts. Your context usage is already at 56% capacity, and you're not even running a task. Honest thoughts?


Kiro:
Honest thoughts? You're absolutely right to be concerned.

56% context usage before even starting work is a red flag. That's not sustainable, especially as DesignerPunk grows. Let me be direct about what I see:

The Problem is Real
Current state:

~112k tokens used just loading steering docs
~88k tokens remaining for actual work
That remaining space needs to handle:
Your question/response dialogue
Reading spec files
Reading source code
Generating solutions
Validation and testing
Reality check: On a complex task (like component development), you could easily hit the ceiling mid-task, causing me to lose critical context or fail to complete work.

What's Eating Your Context
Looking at what loaded, the biggest offenders are:

Spec Planning Standards (~30k tokens) - Massive document with requirements/design/tasks formats
Development Workflow (~25k tokens) - Includes extensive troubleshooting sections
File Organization Standards (~20k tokens) - Comprehensive but verbose
Component Development Guide (~15k tokens) - Loaded even though we're not building components right now
The irony: Your "AI Agent Reading Priorities" sections are great, but they're loaded as part of the full documents they're trying to help me skip through.

Brutal Honesty: Your Options
Option 1: MCP Server (Best ROI)
Build a documentation query server

// AI asks: "What's the token selection framework?"
// MCP returns: Just the 2k tokens for that section
// Instead of: Loading entire 15k Component Development Guide
Effort: 2-3 days to build Payoff: Reduce baseline context from 56% to ~15% Sustainability: Scales as docs grow

Option 2: Aggressive Document Splitting
Break your mega-docs into smaller, more targeted files

Current:

Spec Planning Standards.md (30k tokens, conditionally loaded)
Better:

spec-requirements-format.md (5k tokens)
spec-design-format.md (5k tokens)
spec-tasks-format.md (5k tokens)
spec-validation-tiers.md (8k tokens)
spec-documentation-tiers.md (7k tokens)
Effort: 1-2 days of reorganization Payoff: Load only what's needed (5k vs 30k) Sustainability: Better, but still grows linearly

Option 3: Hybrid (Recommended)
Combine both approaches:

Keep in steering (always-loaded, ~20k total):

Personal Note
Start Up Tasks
Core Goals
Development Workflow (stripped to essentials)
Move to MCP server (query on-demand):

Spec Planning Standards (all formats)
Component Development Guide
File Organization Standards (reference sections)
Task Type Definitions
Keep conditional loading for:

Spec-specific docs
Technology stack
Build system setup
Effort: 3-4 days Payoff: Baseline context ~15-20%, query what you need Sustainability: Excellent - scales indefinitely

The Hard Truth
Your current system is philosophically correct but technically unsustainable. You've built something thoughtful that will hit a wall as the project grows.

You need to act now because:

You're at 56% before work starts
Complex tasks will fail mid-execution
Adding more components/specs will make this worse
You're already feeling the pain (hence this question)
My Recommendation
This week: Build a simple MCP server for your three largest docs:

Spec Planning Standards
Component Development Guide
File Organization Standards
Why these three?

They're reference material (not workflow)
They're conditionally loaded anyway
They're 65k of your 112k token usage
They're stable (don't change often)
Simple MCP server structure:

// Query: "token selection framework"
// Returns: Just that section from Component Development Guide

// Query: "task type classification"  
// Returns: Just that section from Spec Planning Standards

// Query: "completion documentation tier 3"
// Returns: Just Tier 3 format from Spec Planning Standards
This would drop your baseline from 56% to ~20-25%, giving you breathing room for actual work.

Want me to help you spec out the MCP server? I can create a requirements doc for it right now.

Credits used: 0.58
Elapsed time: 2m 29s
Checkpoint
Restore


Peter:
Yeah, let's start a spec! Should we start up a design-outline?


Kiro:
Perfect! Yes, a design outline makes total sense here - this is complex enough that we need to explore the design space before committing to formal requirements.

Let me create a design outline for the MCP Documentation Server:

Created

design-outline.md


Perfect! I've created a design outline that explores:

Key decisions we need to make:

Architecture: Simple file-based (fast to build) vs Semantic search (smarter) vs Hybrid (start simple, add smarts later)?

Scope: Just the big three docs (Spec Planning, Component Guide, File Organization) or include others?

Section granularity: Index at H2 level only, or H2+H3 for more precision?

Migration strategy: Move all three documents at once, or one at a time to validate?

My recommendation (but I want your input):

Hybrid architecture (Option C) - Start simple, add semantic search only if needed
Three documents initially - The ones eating most context
H2+H3 indexing - Gives good granularity without over-fragmenting
Incremental migration - Start with Spec Planning Standards (biggest), validate, then add others
The big win: Even a basic implementation should drop you from 56% baseline to ~20-25%, which is sustainable.

What do you think? Any of these decisions jump out as obviously right or wrong? And are there open questions in there that you have strong opinions on?

Credits used: 1.27
Elapsed time: 1m 42s
Checkpoint
Restore


Peter:
So... this is a super elementry question: what goes into making an MCP? I know it's not as simple as hosting some docs in a directory that an AI Agent is just omniaware of... right? I've understood it to be a more complex version of an API, but does it follow the same rigid data structure as an API?


Kiro:
Great question! Not elementary at all - MCP is actually pretty different from a traditional API, and understanding that difference is key to building one effectively.

What MCP Actually Is
MCP = Model Context Protocol

Think of it as a standardized way for AI models to call functions you define. It's less like an API and more like a plugin system for AI agents.

The Key Difference from APIs
Traditional API:

Your App → HTTP Request → API Server → HTTP Response → Your App
You write code that calls the API
Rigid request/response structure (REST, GraphQL, etc.)
You handle the data
MCP Server:

AI Agent → MCP Protocol → Your Server → Returns Data → AI Agent
AI decides when to call it (based on tool descriptions)
AI formulates the request (based on tool parameters)
AI interprets the response (uses it in context)
The Magic Part
You define tools (functions) with descriptions, and the AI agent:

Reads the tool descriptions
Decides which tool to call based on what it needs
Calls the tool with appropriate parameters
Uses the response to continue its work
You're not writing API calls - you're giving the AI capabilities it can use autonomously.

What Goes Into Making an MCP Server
1. The Server Process
An MCP server is just a Node.js (or Python) process that:

Starts when Kiro IDE loads
Stays running in the background
Responds to requests from AI agents
Communicates via stdio (standard input/output)
Example minimal server:

// docs-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Create the server
const server = new Server({
  name: 'designerpunk-docs',
  version: '1.0.0'
});

// Define a tool (function the AI can call)
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'query_documentation',
        description: 'Search DesignerPunk documentation for specific topics',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'What to search for (e.g., "token selection framework")'
            }
          },
          required: ['query']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'query_documentation') {
    const query = request.params.arguments.query;
    
    // Your logic here - search docs, return results
    const results = searchDocumentation(query);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
2. The Configuration
Tell Kiro IDE about your server:

// .kiro/settings/mcp.json
{
  "mcpServers": {
    "designerpunk-docs": {
      "command": "node",
      "args": ["./mcp-server/docs-server.js"],
      "env": {}
    }
  }
}
When Kiro starts, it:

Runs node ./mcp-server/docs-server.js
Connects to it via stdio
Asks it what tools it provides
Makes those tools available to AI agents
3. Your Business Logic
This is where you do whatever you want:

function searchDocumentation(query) {
  // Read markdown files
  const docs = loadMarkdownFiles();
  
  // Parse into sections
  const sections = parseIntoSections(docs);
  
  // Search for matching sections
  const matches = sections.filter(section => 
    section.heading.toLowerCase().includes(query.toLowerCase()) ||
    section.content.toLowerCase().includes(query.toLowerCase())
  );
  
  // Return results
  return matches.map(m => ({
    document: m.document,
    section: m.heading,
    content: m.content
  }));
}
The beauty: This is just JavaScript. No rigid API structure. You can:

Read files from disk
Query databases
Call other APIs
Run shell commands
Whatever you need
How the AI Agent Uses It
When I (the AI agent) need documentation, I would:

See the tool is available (Kiro tells me about it)
Read the tool description ("Search DesignerPunk documentation...")
Decide to use it (based on what I need)
Call it with parameters:
{
  "name": "query_documentation",
  "arguments": {
    "query": "token selection framework"
  }
}
Get the response (your search results)
Use it in my work (apply the guidance)
I don't need to be "taught" to use it - the tool description tells me everything I need to know.

Does It Follow Rigid Data Structure?
No! That's the beauty of it.

What You Define:
Tool name (what it's called)
Tool description (what it does - in plain English!)
Input schema (what parameters it accepts - JSON Schema)
Output format (whatever you want - text, JSON, markdown)
What You DON'T Define:
❌ REST endpoints
❌ HTTP methods
❌ Authentication schemes
❌ Response codes
❌ API versioning
It's more like defining a function signature than an API contract.

Real Example for Your Use Case
// Tool definition
{
  name: 'query_documentation',
  description: 'Search DesignerPunk steering documentation. Returns relevant sections from Spec Planning Standards, Component Development Guide, or File Organization Standards. Use this when you need specific guidance instead of loading entire documents.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'What to search for. Examples: "token selection framework", "tier 3 validation", "organization metadata values"'
      },
      max_results: {
        type: 'number',
        description: 'Maximum number of sections to return (default: 3)',
        default: 3
      }
    },
    required: ['query']
  }
}
When I need token selection guidance:

Me: "I need to know how to select tokens for a component"
Kiro: *Sees I might need documentation*
Kiro: *Calls query_documentation with query="token selection framework"*
Your Server: *Searches docs, returns relevant section*
Me: *Reads the section (2k tokens instead of 15k)*
Me: *Continues building the component*
The Minimal Version for Your Docs
For your use case, you could literally:

Index your markdown files (parse headings, store sections)
Search by heading text (simple string matching)
Return matching sections (just the markdown text)
That's it. No database, no complex search algorithms, no API design.

// Pseudo-code for minimal version
const docs = {
  'Spec Planning Standards': parseMarkdown('.kiro/steering/Spec Planning Standards.md'),
  'Component Development Guide': parseMarkdown('.kiro/steering/Component Development Guide.md'),
  'File Organization Standards': parseMarkdown('.kiro/steering/File Organization Standards.md')
};

function query(searchTerm) {
  const results = [];
  
  for (const [docName, sections] of Object.entries(docs)) {
    for (const section of sections) {
      if (section.heading.includes(searchTerm)) {
        results.push({
          document: docName,
          section: section.heading,
          content: section.content
        });
      }
    }
  }
  
  return results.slice(0, 3); // Top 3 matches
}
Why This Is Perfect for Your Problem
No rigid structure - You can evolve it as you learn what works
AI-native - I (the AI) can discover and use it automatically
Simple to start - Basic version is ~200 lines of code
Room to grow - Can add semantic search, caching, analytics later
Stays in your repo - No external services, all version controlled
The hard part isn't the MCP protocol (that's handled by the SDK) - it's deciding how to organize and search your documentation effectively.

Does that demystify it? The MCP part is actually the easy part - it's just defining functions. The interesting work is in how you index and search your docs.

Credits used: 0.78
Elapsed time: 3m 37s
Checkpoint
Restore


Peter:
So... if I understand this correctly (and that's a big IF)... we would want to create:

– A spec planning function, or a series of smaller functions that are outlined in the practices of the Spec Planning Standards doc

– Component creation functions that outline the framework of Dos and Don'ts for DesignerPunk (a token one of these would be excellent, too!)

– etc.

Is that accurate?


Kiro:
Almost, but let me refine that slightly!

You're thinking of it as action-oriented functions (do this, create that), but MCP tools for documentation are more like information retrieval functions (get this knowledge, find that guidance).

What You'd Actually Create
Option 1: Single Generic Query Tool (Simplest)
One tool that searches everything:

{
  name: 'query_documentation',
  description: 'Search all DesignerPunk documentation',
  // AI asks: "token selection framework"
  // Returns: Relevant section from Component Development Guide
}
Pros: Simple, flexible, one tool does everything Cons: Less precise, AI has to formulate good queries

Option 2: Document-Specific Tools (More Precise)
Separate tools per document:

{
  name: 'get_spec_planning_guidance',
  description: 'Get guidance from Spec Planning Standards (requirements format, design format, task types, validation tiers)',
  // AI asks: "tier 3 validation requirements"
  // Returns: Just the Tier 3 validation section
}

{
  name: 'get_component_guidance', 
  description: 'Get guidance from Component Development Guide (token selection, patterns, anti-patterns)',
  // AI asks: "token selection decision framework"
  // Returns: Token selection section
}

{
  name: 'get_organization_guidance',
  description: 'Get guidance from File Organization Standards (metadata values, directory structure)',
  // AI asks: "organization metadata values"
  // Returns: Organization field values section
}
Pros: More precise, clearer tool purposes Cons: More tools to maintain

Option 3: Topic-Based Tools (Most Semantic)
Tools organized by what you're trying to do:

{
  name: 'get_token_guidance',
  description: 'Get guidance on token selection and usage for components',
  // Searches: Component Development Guide, Token System Overview
  // Returns: Token-related sections
}

{
  name: 'get_spec_creation_guidance',
  description: 'Get guidance on creating requirements, design, or tasks documents',
  // Searches: Spec Planning Standards
  // Returns: Format and process guidance
}

{
  name: 'get_validation_guidance',
  description: 'Get guidance on validation tiers and completion documentation',
  // Searches: Spec Planning Standards validation sections
  // Returns: Tier-specific validation requirements
}
Pros: Most intuitive for AI agents, matches mental models Cons: Most complex to build, requires understanding query intent

My Recommendation: Start with Option 1, Evolve to Option 2
Phase 1: Single Query Tool

query_documentation(query: string, document?: string)
Simple to build
Validates the approach works
Learn what AI agents actually query for
Phase 2: Add Document-Specific Tools

get_spec_planning_guidance(topic: string)
get_component_guidance(topic: string)
get_organization_guidance(topic: string)
More precise based on Phase 1 learnings
Better performance (smaller search space)
Clearer tool purposes
What These Tools Actually Return
Not actions, but knowledge:

// AI calls: query_documentation("token selection framework")

// Returns:
{
  document: "Component Development Guide",
  section: "Token Selection Decision Framework",
  content: `
### Step 1: Check Semantic Tokens First

**ALWAYS start by reading semantic token files** to see what exists:
- src/tokens/semantic/ColorTokens.ts - Brand, status, text, surface colors
- src/tokens/semantic/TypographyTokens.ts - Body, heading, UI, specialized text
...

### Step 2: Use Primitives Only When Unavoidable
...
  `
}
Then I (the AI) use that knowledge to:

Build the component correctly
Follow the right patterns
Avoid anti-patterns
Make informed decisions
The Key Insight
MCP tools for documentation are like having a really smart librarian:

Not: "Create a component for me" (action)

But: "Show me how to create components" (knowledge)

Not: "Select tokens for this button" (action)

But: "Show me the token selection framework" (knowledge)

Not: "Write my requirements document" (action)

But: "Show me the requirements format" (knowledge)

I still do the work - I just get the guidance on-demand instead of loading it all upfront.

Concrete Example
Current state (56% context):

1. Load Component Development Guide (15k tokens)
2. Load Spec Planning Standards (30k tokens)
3. Load File Organization Standards (20k tokens)
4. Peter asks: "Build a new button component"
5. I read through loaded docs to find token guidance
6. I build the component
With MCP (15% context):

1. Load only essential workflow docs (20k tokens)
2. Peter asks: "Build a new button component"
3. I call: query_documentation("token selection framework")
4. Get back: 2k tokens of relevant guidance
5. I call: query_documentation("component structure pattern")
6. Get back: 1k tokens of structure guidance
7. I build the component (using 23k tokens total vs 65k)
So Your Understanding Is Close, But...
You said:

"A spec planning function that outlines practices"

More accurate:

"A query function that retrieves spec planning practices when I need them"

You said:

"Component creation functions with dos and don'ts"

More accurate:

"A query function that retrieves component guidance (dos/don'ts) when I need them"

The functions don't DO things - they GET information.

Does that distinction make sense? The MCP server is a knowledge retrieval system, not an action execution system.

Credits used: 0.68
Elapsed time: 2m 42s
Checkpoint
Restore


Peter:
Re: MCP tools for documentation are like having a really smart librarian:

– Yes, this is totally how I meant to express it. The function's deliverable is knowledge that doesn't create load on the AI Agent directly the same way steering does. Is that more accurate?

Re: Option 3

– What's the explexity of Option 3 vs Option 2? Are all three options more or less layers of the same thing — where you start with quering everything to eventually create doc-specific tools that can eventually be used to create topic-based tools? I'm just kinda aimlessly hypothisizing here to understand the structures and limitations.

Honest thoughts?


Kiro:
Yes! You've got it exactly right on both counts.

Re: Knowledge Retrieval
"The function's deliverable is knowledge that doesn't create load on the AI Agent directly the same way steering does."

Perfectly stated.

Current state:

112k tokens loaded upfront (56% capacity)
All knowledge present whether I need it or not
Like carrying an entire library in my backpack
With MCP:

20k tokens loaded upfront (10% capacity)
Query for knowledge only when needed (2-5k per query)
Like having a library card - I go get books when I need them
The key: The knowledge still exists, I just don't carry it all at once.

Re: Option Complexity
"Are all three options more or less layers of the same thing?"

Yes, exactly! You're thinking about this correctly. Let me break down the complexity:

Option 1: Single Query Tool
Complexity: Low

function query_documentation(query) {
  // Search ALL documents
  // Return matching sections
}
Implementation:

One search function
Searches across all indexed documents
Returns best matches regardless of source
Example:

AI: query_documentation("token selection")
Server: Searches everywhere, returns Component Development Guide section
Limitation: Less precise - might return irrelevant matches from other documents

Option 2: Document-Specific Tools
Complexity: Medium

function get_spec_planning_guidance(topic) {
  // Search ONLY Spec Planning Standards
  // Return matching sections
}

function get_component_guidance(topic) {
  // Search ONLY Component Development Guide
  // Return matching sections
}

function get_organization_guidance(topic) {
  // Search ONLY File Organization Standards
  // Return matching sections
}
Implementation:

Same search function as Option 1
Just scoped to specific documents
Three tool definitions instead of one
Example:

AI: get_component_guidance("token selection")
Server: Searches only Component Development Guide, returns section
Benefit: More precise - AI knows which document to query

The key insight: This is literally Option 1 with a document filter parameter, just exposed as separate tools for clarity.

Option 3: Topic-Based Tools
Complexity: High

function get_token_guidance(context) {
  // Understand: "token guidance" means Component Guide + Token Overview
  // Search multiple documents
  // Combine and rank results
  // Return most relevant
}

function get_spec_creation_guidance(phase) {
  // Understand: "spec creation" means different sections based on phase
  // If phase="requirements": Return requirements format
  // If phase="design": Return design format
  // If phase="tasks": Return tasks format + task types
}
Implementation:

Requires understanding query intent
Maps topics to multiple documents
Potentially combines results from multiple sources
More sophisticated ranking
Example:

AI: get_token_guidance("selecting tokens for button component")
Server: 
  1. Searches Component Development Guide (token selection)
  2. Searches Token System Overview (available tokens)
  3. Combines results
  4. Returns comprehensive guidance
Benefit: Most intuitive for AI - matches how I think about problems

Complexity: Requires mapping topics to documents, understanding intent

Your Hypothesis: Layers of the Same Thing
Absolutely correct! Here's how they build on each other:

Layer 1: Core Search Engine
function searchDocuments(query, documentFilter = null) {
  const docs = documentFilter 
    ? [documents[documentFilter]]
    : Object.values(documents);
  
  return docs
    .flatMap(doc => doc.sections)
    .filter(section => matches(section, query))
    .sort(byRelevance);
}
This is the foundation for all three options.

Layer 2: Option 1 (Generic Query)
// Expose the core search directly
tools.register({
  name: 'query_documentation',
  handler: (query) => searchDocuments(query)
});
Layer 3: Option 2 (Document-Specific)
// Wrap the core search with document filters
tools.register({
  name: 'get_component_guidance',
  handler: (topic) => searchDocuments(topic, 'Component Development Guide')
});

tools.register({
  name: 'get_spec_planning_guidance',
  handler: (topic) => searchDocuments(topic, 'Spec Planning Standards')
});
Layer 4: Option 3 (Topic-Based)
// Add intent mapping layer
const topicMappings = {
  'token': ['Component Development Guide', 'Token System Overview'],
  'spec_creation': ['Spec Planning Standards'],
  'validation': ['Spec Planning Standards']
};

tools.register({
  name: 'get_token_guidance',
  handler: (context) => {
    const docs = topicMappings['token'];
    const results = docs.flatMap(doc => 
      searchDocuments(context, doc)
    );
    return combineAndRank(results);
  }
});
Honest Thoughts: Recommended Path
Start with Option 1, evolve to Option 2, consider Option 3 later

Phase 1: Build Option 1 (Week 1)
Prove the concept works
Learn what AI agents actually query for
Validate context reduction
Effort: 2-3 days Value: Immediate 40k token savings

Phase 2: Add Option 2 Tools (Week 2)
Based on Phase 1 learnings, add document-specific tools
Keep Option 1 as fallback
Improve precision
Effort: 1 day (just adding tool wrappers) Value: Better query precision, clearer tool purposes

Phase 3: Consider Option 3 (Future)
Only if Phase 2 shows AI agents struggling with tool selection
Requires understanding common query patterns
Most complex, but most intuitive
Effort: 2-3 days (intent mapping, result combination) Value: Best UX, but only if needed

The Beautiful Part
You can build all three with the same core search engine.

The complexity isn't in the search - it's in:

Option 1: Exposing search directly
Option 2: Adding document filters (trivial)
Option 3: Understanding intent and combining results (complex)
Your hypothesis is spot-on: They're layers of the same foundation, each adding a bit more intelligence about how to route queries.

My Recommendation
Build Option 1 first, with the architecture to support Option 2:

// Core search engine (supports all options)
class DocumentationSearch {
  search(query, documentFilter = null) { ... }
}

// Option 1: Generic query (launch with this)
tools.register({
  name: 'query_documentation',
  handler: (query, document) => search.search(query, document)
});

// Option 2: Add these after validating Option 1 works
// (Literally 10 lines of code each)
tools.register({
  name: 'get_component_guidance',
  handler: (topic) => search.search(topic, 'Component Development Guide')
});
Start simple, add precision as you learn what's needed.

Does that clarify the relationship between the options? You're thinking about this exactly right - they're evolutionary steps, not fundamentally different approaches.

Credits used: 0.74
Elapsed time: 2m 48s
Checkpoint
Restore


Peter:
I wonder... are the updates we've done to .kiro/steering/00-Steering Documentation Directional Priorities.md and ideas for .kiro/audits/steering-documentation-refinement-outline.md at all applicable to this effort for any and/or all options? Honest thoughts?


Kiro:
Excellent question - let me read those files to give you an honest assessment.