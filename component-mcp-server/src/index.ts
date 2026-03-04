#!/usr/bin/env node
/**
 * Component MCP Server Entry Point
 *
 * Provides component metadata querying via MCP tools.
 * Indexes schema.yaml, contracts.yaml, and component-meta.yaml on startup.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { ComponentIndexer } from './indexer/ComponentIndexer';
import { ComponentQueryEngine } from './query/QueryEngine';
import { AssemblyValidator } from './validation/AssemblyValidator';
import { FileWatcher } from './watcher/FileWatcher';

const SERVER_NAME = 'mcp-component-server';
const SERVER_VERSION = '0.1.0';
const DEFAULT_COMPONENTS_DIR = 'src/components/core';

// Tool definitions
const tools = [
  {
    name: 'get_component_catalog',
    description: 'Get lightweight catalog of all components with name, type, family, purpose, and readiness. ~50 tokens per component.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'get_component_summary',
    description: 'Get component summary: identity, contract categories, token count, annotations. ~200 tokens.',
    inputSchema: {
      type: 'object' as const,
      properties: { name: { type: 'string', description: 'Component name (e.g., "Badge-Count-Base")' } },
      required: ['name'],
    },
  },
  {
    name: 'get_component_full',
    description: 'Get complete assembled metadata including all contracts, composition rules, and token relationships.',
    inputSchema: {
      type: 'object' as const,
      properties: { name: { type: 'string', description: 'Component name' } },
      required: ['name'],
    },
  },
  {
    name: 'find_components',
    description: 'Find components by category, concept, platform, purpose keyword, or usage context. Returns ApplicationSummary with promoted selection guidance (purpose, whenToUse, whenNotToUse, alternatives, contexts). All parameters optional and combinable (conjunctive).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        category: { type: 'string', description: 'Contract category (e.g., "accessibility")' },
        concept: { type: 'string', description: 'Specific contract concept (e.g., "keyboard_navigation")' },
        platform: { type: 'string', description: 'Platform (e.g., "ios")' },
        purpose: { type: 'string', description: 'Purpose keyword search' },
        context: { type: 'string', description: 'Usage context — exact match (e.g., "form-footers", "onboarding-flows", "settings-screens")' },
      },
    },
  },
  {
    name: 'check_composition',
    description: 'Check if a parent component can contain a child component, with optional prop context.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        parent: { type: 'string', description: 'Parent component name' },
        child: { type: 'string', description: 'Child component name' },
        parentProps: { type: 'object', description: 'Parent prop values for conditional rules' },
      },
      required: ['parent', 'child'],
    },
  },
  {
    name: 'get_component_health',
    description: 'Get index health: status, component count, pattern count, warnings, gaps.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'list_experience_patterns',
    description: 'List all experience patterns with name, description, category, tags, step count, and component count.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'get_experience_pattern',
    description: 'Get full experience pattern by name: steps, components with roles and hints, accessibility notes, and alternatives.',
    inputSchema: {
      type: 'object' as const,
      properties: { name: { type: 'string', description: 'Pattern name (e.g., "simple-form")' } },
      required: ['name'],
    },
  },
  {
    name: 'validate_assembly',
    description: 'Validate a component tree. Checks component existence, parent-child composition rules, requires/count constraints, and assembly-level accessibility (form labels, submit actions, page headings). Returns errors, warnings, and accessibility issues with paths.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        assembly: {
          type: 'object',
          description: 'Component tree. Each node: { component: string, props?: object, children?: node[] }',
        },
      },
      required: ['assembly'],
    },
  },
  {
    name: 'get_prop_guidance',
    description: 'Get prop selection and family member guidance for a component or family. Returns whenToUse, whenNotToUse, selectionRules (scenario→recommendation with optional props), accessibilityNotes, and family-scoped patterns. Query by component name (returns its family guidance) or family name.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        component: { type: 'string', description: 'Component name (e.g., "Button-CTA") or family name (e.g., "Buttons")' },
        verbose: { type: 'boolean', description: 'Include rationale and descriptions (default: false)' },
      },
      required: ['component'],
    },
  },
];

class ComponentMCPServer {
  private server: Server;
  private indexer: ComponentIndexer;
  private queryEngine: ComponentQueryEngine;
  private assemblyValidator: AssemblyValidator;
  private fileWatcher: FileWatcher;

  constructor(private componentsDir: string = DEFAULT_COMPONENTS_DIR) {
    this.server = new Server({ name: SERVER_NAME, version: SERVER_VERSION }, { capabilities: { tools: {} } });
    this.indexer = new ComponentIndexer();
    this.queryEngine = new ComponentQueryEngine(this.indexer);
    this.assemblyValidator = new AssemblyValidator(this.indexer);
    this.fileWatcher = new FileWatcher(this.indexer, this.componentsDir);
    this.registerHandlers();
  }

  async start(): Promise<void> {
    await this.indexer.indexComponents(this.componentsDir);
    this.fileWatcher.start();
    const health = this.indexer.getHealth();
    console.error(`[${SERVER_NAME}] Indexed ${health.componentsIndexed} components (${health.warnings.length} warnings)`);

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error(`[${SERVER_NAME}] Server running on stdio`);
  }

  private registerHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const params = (args ?? {}) as Record<string, unknown>;

      try {
        const result = this.handleTool(name, params);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text', text: JSON.stringify({ error: message }) }], isError: true };
      }
    });
  }

  private handleTool(name: string, params: Record<string, unknown>): unknown {
    switch (name) {
      case 'get_component_catalog':
        return this.queryEngine.getCatalog();
      case 'get_component_summary':
        return this.queryEngine.getComponentSummary(params.name as string);
      case 'get_component_full':
        return this.queryEngine.getComponent(params.name as string);
      case 'find_components':
        return this.handleFind(params);
      case 'check_composition':
        return this.queryEngine.checkComposition(
          params.parent as string,
          params.child as string,
          params.parentProps as Record<string, unknown> | undefined,
        );
      case 'get_component_health':
        return this.queryEngine.getHealth();
      case 'list_experience_patterns':
        return this.queryEngine.getPatternCatalog();
      case 'get_experience_pattern':
        return this.queryEngine.getPattern(params.name as string);
      case 'validate_assembly':
        return this.assemblyValidator.validate(params.assembly as any);
      case 'get_prop_guidance':
        return this.queryEngine.getGuidance(params.component as string, params.verbose as boolean | undefined);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private handleFind(params: Record<string, unknown>): unknown {
    return this.queryEngine.findComponents({
      category: params.category as string | undefined,
      concept: params.concept as string | undefined,
      platform: params.platform as string | undefined,
      purpose: params.purpose as string | undefined,
      context: params.context as string | undefined,
    });
  }
}

// Start server
const server = new ComponentMCPServer();
server.start().catch((err) => {
  console.error(`[${SERVER_NAME}] Fatal error:`, err);
  process.exit(1);
});
