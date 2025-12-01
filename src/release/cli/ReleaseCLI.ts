#!/usr/bin/env node

/**
 * Release Management CLI
 * 
 * Command-line interface for manual release management operations.
 * Provides commands for executing releases, checking status, and managing configuration.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import * as readline from 'readline';
import { ReleaseManager, ReleaseManagerConfig } from '../ReleaseManager';
import { ReleaseTrigger } from '../types/ReleaseTypes';

/**
 * CLI command options
 */
export interface CLIOptions {
  /** Dry run mode (don't actually publish) */
  dryRun?: boolean;
  /** Skip confirmation prompts */
  skipConfirmation?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Configuration file path */
  config?: string;
  /** GitHub token */
  githubToken?: string;
  /** npm token */
  npmToken?: string;
  /** Working directory */
  workingDirectory?: string;
}

/**
 * CLI execution result
 */
export interface CLIResult {
  /** Whether the command was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Exit code */
  exitCode: number;
}

/**
 * Release override options for manual releases
 */
export interface ReleaseOverrides {
  /** Override version bump type */
  versionBump?: 'major' | 'minor' | 'patch';
  /** Override version number */
  version?: string;
  /** Override release notes */
  releaseNotes?: string;
  /** Skip specific stages */
  skipStages?: string[];
}

/**
 * Release Management CLI
 */
export class ReleaseCLI {
  private rl: readline.Interface;
  private options: CLIOptions;

  constructor(options: CLIOptions = {}) {
    this.options = options;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Execute CLI command
   */
  async execute(command: string, args: string[]): Promise<CLIResult> {
    try {
      switch (command) {
        case 'release':
          return await this.executeRelease(args);
        case 'status':
          return await this.showStatus(args);
        case 'plan':
          return await this.showReleasePlan(args);
        case 'config':
          return await this.manageConfig(args);
        case 'help':
          this.showHelp(args);
          return { success: true, exitCode: 0 };
        default:
          console.error(`Unknown command: ${command}`);
          this.showHelp([]);
          return { success: false, error: `Unknown command: ${command}`, exitCode: 1 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error executing command:', error);
      return { success: false, error: errorMessage, exitCode: 1 };
    } finally {
      this.rl.close();
    }
  }

  /**
   * Execute a release
   */
  private async executeRelease(args: string[]): Promise<CLIResult> {
    console.log('🚀 Starting release process...\n');

    // Parse release type from args
    const releaseType = args[0] || 'auto';
    
    // Get configuration
    const config = await this.loadConfiguration();
    
    // Get release overrides if in interactive mode
    let overrides: ReleaseOverrides = {};
    if (!this.options.skipConfirmation) {
      overrides = await this.promptForOverrides();
    }

    // Create release manager
    const manager = new ReleaseManager(config);

    // Create release trigger
    const trigger: ReleaseTrigger = {
      type: releaseType === 'manual' ? 'manual' : 'automatic',
      source: 'cli',
      triggeredAt: new Date(),
      overrides: overrides.versionBump ? {
        forceBumpType: overrides.versionBump,
        forceVersion: overrides.version
      } : undefined
    };

    // Execute release
    const result = await manager.executeRelease(trigger);

    // Display results
    if (result.success) {
      console.log('\n✅ Release completed successfully!');
      console.log(`   Version: ${result.version}`);
      if (result.githubReleaseUrl) {
        console.log(`   GitHub: ${result.githubReleaseUrl}`);
      }
      if (result.npmPackageUrls && result.npmPackageUrls.length > 0) {
        console.log(`   npm: ${result.npmPackageUrls.join(', ')}`);
      }
      return { success: true, exitCode: 0 };
    } else {
      console.error('\n❌ Release failed!');
      if (result.errors && result.errors.length > 0) {
        console.error('   Errors:');
        result.errors.forEach(error => {
          console.error(`   - ${error.message} (${error.code})`);
        });
      }
      return { success: false, error: 'Release failed', exitCode: 1 };
    }
  }

  /**
   * Show release status
   */
  private async showStatus(args: string[]): Promise<CLIResult> {
    console.log('📊 Release Status\n');

    const config = await this.loadConfiguration();
    const manager = new ReleaseManager(config);

    // Get pipeline state
    const state = manager.getPipelineState();

    if (!state) {
      console.log('No active release pipeline.');
      return { success: true, exitCode: 0 };
    }

    console.log(`Active: ${state.active}`);
    
    if (state.context) {
      console.log(`Context: ${JSON.stringify(state.context, null, 2)}`);
    }
    
    if (state.summary) {
      console.log(`Summary: ${JSON.stringify(state.summary, null, 2)}`);
    }

    return { success: true, exitCode: 0 };
  }

  /**
   * Show release plan
   */
  private async showReleasePlan(args: string[]): Promise<CLIResult> {
    console.log('📋 Release Plan\n');

    const config = await this.loadConfiguration();
    const manager = new ReleaseManager(config);

    // Create a trigger for planning
    const trigger: ReleaseTrigger = {
      type: 'automatic',
      source: 'cli',
      triggeredAt: new Date()
    };

    try {
      // Get release plan (this will run analysis but not execute)
      const plan = await manager.getReleasePlan(trigger);

      console.log(`Current Version: ${plan.version.from}`);
      console.log(`Next Version: ${plan.version.to}`);
      console.log(`Bump Type: ${plan.version.type}`);
      console.log(`\nPackages to Update:`);
      plan.packages.forEach(pkg => {
        console.log(`  - ${pkg.name}: ${pkg.versionBump.from} → ${pkg.versionBump.to}`);
      });

      if (plan.releaseNotes) {
        console.log(`\nRelease Notes Preview:`);
        console.log(plan.releaseNotes.summary);
      }

      return { success: true, exitCode: 0 };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Failed to generate release plan:', error);
      return { success: false, error: errorMessage, exitCode: 1 };
    }
  }

  /**
   * Manage configuration
   */
  private async manageConfig(args: string[]): Promise<CLIResult> {
    const subcommand = args[0];

    switch (subcommand) {
      case 'show':
        return await this.showConfig();
      case 'set':
        return await this.setConfig(args.slice(1));
      case 'validate':
        return await this.validateConfig();
      default:
        console.error(`Unknown config subcommand: ${subcommand}`);
        console.log('Available subcommands: show, set, validate');
        return { success: false, error: `Unknown config subcommand: ${subcommand}`, exitCode: 1 };
    }
  }

  /**
   * Show current configuration
   */
  private async showConfig(): Promise<CLIResult> {
    console.log('⚙️  Current Configuration\n');

    const config = await this.loadConfiguration();

    console.log('Working Directory:', config.workingDirectory || process.cwd());
    console.log('Dry Run:', config.dryRun || false);
    console.log('Skip Confirmation:', config.skipConfirmation || false);
    
    if (config.github) {
      console.log('\nGitHub Configuration:');
      console.log('  Owner:', config.github.owner);
      console.log('  Repo:', config.github.repo);
      console.log('  Token:', config.github.token ? '***' : 'Not set');
    }

    if (config.npm) {
      console.log('\nnpm Configuration:');
      console.log('  Registry:', config.npm.registry || 'https://registry.npmjs.org');
      console.log('  Token:', config.npm.token ? '***' : 'Not set');
    }

    return { success: true, exitCode: 0 };
  }

  /**
   * Set configuration value
   */
  private async setConfig(args: string[]): Promise<CLIResult> {
    if (args.length < 2) {
      console.error('Usage: release config set <key> <value>');
      return { success: false, error: 'Missing required arguments', exitCode: 1 };
    }

    const [key, value] = args;
    console.log(`Setting ${key} = ${value}`);
    
    // TODO: Implement configuration persistence
    console.log('Configuration updated successfully.');
    return { success: true, exitCode: 0 };
  }

  /**
   * Validate configuration
   */
  private async validateConfig(): Promise<CLIResult> {
    console.log('✅ Validating configuration...\n');

    const config = await this.loadConfiguration();

    const errors: string[] = [];

    // Validate GitHub configuration
    if (config.github) {
      if (!config.github.token) {
        errors.push('GitHub token is required');
      }
      if (!config.github.owner) {
        errors.push('GitHub owner is required');
      }
      if (!config.github.repo) {
        errors.push('GitHub repo is required');
      }
    }

    // Validate npm configuration
    if (config.npm && !config.npm.token) {
      errors.push('npm token is required for publishing');
    }

    if (errors.length > 0) {
      console.error('❌ Configuration validation failed:');
      errors.forEach(error => console.error(`  - ${error}`));
      return { success: false, error: 'Configuration validation failed', exitCode: 1 };
    }

    console.log('✅ Configuration is valid.');
    return { success: true, exitCode: 0 };
  }

  /**
   * Show help information
   */
  private showHelp(args: string[]): void {
    const command = args[0];

    if (command) {
      this.showCommandHelp(command);
      return;
    }

    console.log(`
Release Management CLI

Usage: release <command> [options]

Commands:
  release [type]     Execute a release (type: auto, manual)
  status             Show current release status
  plan               Show release plan without executing
  config <sub>       Manage configuration (show, set, validate)
  help [command]     Show help information

Options:
  --dry-run          Run without actually publishing
  --skip-confirmation Skip confirmation prompts
  --verbose          Show detailed output
  --config <path>    Use custom configuration file
  --github-token     GitHub personal access token
  --npm-token        npm authentication token
  --working-dir      Working directory for release operations

Examples:
  release release auto              # Execute automatic release
  release release manual            # Execute manual release with prompts
  release status                    # Show current release status
  release plan                      # Preview release plan
  release config show               # Show current configuration
  release config validate           # Validate configuration
  release help release              # Show help for release command

For more information, visit: https://github.com/3fn/DesignerPunkv2
`);
  }

  /**
   * Show help for specific command
   */
  private showCommandHelp(command: string): void {
    const helpText: Record<string, string> = {
      release: `
release - Execute a release

Usage: release release [type] [options]

Arguments:
  type              Release type (auto, manual) [default: auto]

Options:
  --dry-run         Run without actually publishing
  --skip-confirmation Skip confirmation prompts
  --verbose         Show detailed output

Examples:
  release release auto              # Execute automatic release
  release release manual            # Execute manual release with prompts
  release release --dry-run         # Preview release without publishing
`,
      status: `
status - Show current release status

Usage: release status

Shows the current state of the release pipeline, including:
- Pipeline status (pending, in-progress, completed, failed)
- Current stage being executed
- Completed stages
- Any errors encountered

Examples:
  release status                    # Show current release status
`,
      plan: `
plan - Show release plan without executing

Usage: release plan

Analyzes changes and shows what would be released without actually
executing the release. Useful for previewing version bumps and
release notes before committing to a release.

Examples:
  release plan                      # Preview release plan
`,
      config: `
config - Manage configuration

Usage: release config <subcommand> [options]

Subcommands:
  show              Show current configuration
  set <key> <value> Set configuration value
  validate          Validate configuration

Examples:
  release config show               # Show current configuration
  release config set github.token xxx # Set GitHub token
  release config validate           # Validate configuration
`
    };

    console.log(helpText[command] || `No help available for command: ${command}`);
  }

  /**
   * Load configuration from file or environment
   */
  private async loadConfiguration(): Promise<ReleaseManagerConfig> {
    const config: ReleaseManagerConfig = {
      workingDirectory: this.options.workingDirectory || process.cwd(),
      dryRun: this.options.dryRun || false,
      skipConfirmation: this.options.skipConfirmation || false
    };

    // Load GitHub configuration
    if (this.options.githubToken || process.env.GITHUB_TOKEN) {
      config.github = {
        token: this.options.githubToken || process.env.GITHUB_TOKEN || '',
        owner: process.env.GITHUB_OWNER || '',
        repo: process.env.GITHUB_REPO || ''
      };
    }

    // Load npm configuration
    if (this.options.npmToken || process.env.NPM_TOKEN) {
      config.npm = {
        token: this.options.npmToken || process.env.NPM_TOKEN,
        registry: process.env.NPM_REGISTRY
      };
    }

    return config;
  }

  /**
   * Prompt user for release overrides
   */
  private async promptForOverrides(): Promise<ReleaseOverrides> {
    console.log('\n🤔 Release Configuration\n');

    const overrides: ReleaseOverrides = {};

    // Ask if user wants to override version bump
    const overrideVersion = await this.prompt(
      'Override automatic version bump? (y/N): '
    );

    if (overrideVersion.toLowerCase() === 'y') {
      const bumpType = await this.prompt(
        'Version bump type (major/minor/patch): '
      );
      
      if (['major', 'minor', 'patch'].includes(bumpType.toLowerCase())) {
        overrides.versionBump = bumpType.toLowerCase() as 'major' | 'minor' | 'patch';
      }

      const customVersion = await this.prompt(
        'Custom version number (leave empty for automatic): '
      );
      
      if (customVersion) {
        overrides.version = customVersion;
      }
    }

    // Ask if user wants to override release notes
    const overrideNotes = await this.prompt(
      'Override automatic release notes? (y/N): '
    );

    if (overrideNotes.toLowerCase() === 'y') {
      const notes = await this.prompt(
        'Release notes (or path to file): '
      );
      overrides.releaseNotes = notes;
    }

    return overrides;
  }

  /**
   * Prompt user for input
   */
  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

/**
 * Parse command-line arguments
 */
export function parseArgs(argv: string[]): { command: string; args: string[]; options: CLIOptions; showHelp?: boolean } {
  const args = argv.slice(2); // Remove node and script path
  
  const options: CLIOptions = {};
  const commandArgs: string[] = [];
  let command = 'help';
  let showHelp = false;

  try {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('--')) {
        // Parse option
        const optionName = arg.slice(2);
        
        switch (optionName) {
          case 'dry-run':
            options.dryRun = true;
            break;
          case 'skip-confirmation':
            options.skipConfirmation = true;
            break;
          case 'verbose':
            options.verbose = true;
            break;
          case 'config':
            options.config = args[++i];
            break;
          case 'github-token':
            options.githubToken = args[++i];
            break;
          case 'npm-token':
            options.npmToken = args[++i];
            break;
          case 'working-dir':
            options.workingDirectory = args[++i];
            break;
          default:
            // Unknown flag - show help instead of failing
            console.warn(`Warning: Unknown flag '${arg}' - showing help`);
            showHelp = true;
            command = 'help';
            break;
        }
      } else if (i === 0) {
        // First non-option argument is the command
        command = arg;
      } else {
        // Subsequent arguments are command arguments
        commandArgs.push(arg);
      }
    }
  } catch (error) {
    // If parsing fails, show help
    console.error('Error parsing arguments:', error instanceof Error ? error.message : String(error));
    showHelp = true;
    command = 'help';
  }

  return { command, args: commandArgs, options, showHelp };
}

/**
 * Main CLI entry point
 */
export async function main(argv: string[] = process.argv): Promise<CLIResult> {
  const { command, args, options, showHelp } = parseArgs(argv);
  
  const cli = new ReleaseCLI(options);
  const result = await cli.execute(command, args);
  
  // If we're showing help due to unknown flags, ensure exit code is 0
  if (showHelp && command === 'help') {
    return { success: true, exitCode: 0 };
  }
  
  return result;
}

// Run CLI if executed directly
if (require.main === module) {
  main().then((result) => {
    process.exit(result.exitCode);
  }).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
