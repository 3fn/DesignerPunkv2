/**
 * Workflow Event Detector
 * 
 * Integrates the WorkflowMonitor with the existing hook system and provides
 * a bridge between shell-based hooks and TypeScript release detection system.
 * Handles event detection, queuing, and processing coordination.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { WorkflowMonitor, WorkflowEvent } from '../detection/WorkflowMonitor';
import { ReleaseDetector } from '../detection/ReleaseDetector';
import { DetectionConfig } from '../config/ReleaseConfig';
import { ReleaseSignal } from '../types/ReleaseTypes';

export interface EventDetectorOptions {
  enableAutoProcessing: boolean;
  processingDelay: number;
  maxRetries: number;
  retryDelay: number;
}

export interface ProcessingResult {
  event: WorkflowEvent;
  releaseSignal: ReleaseSignal | null;
  processed: boolean;
  error?: Error;
  retryCount: number;
}

export class WorkflowEventDetector {
  private monitor: WorkflowMonitor;
  private detector: ExtendedReleaseDetector;
  private config: DetectionConfig;
  private options: EventDetectorOptions;
  private processingResults: Map<string, ProcessingResult> = new Map();
  private isProcessing: boolean = false;

  constructor(
    config: DetectionConfig, 
    options: Partial<EventDetectorOptions> = {}
  ) {
    this.config = config;
    this.options = {
      enableAutoProcessing: true,
      processingDelay: 2000, // 2 seconds
      maxRetries: 3,
      retryDelay: 5000, // 5 seconds
      ...options
    };

    // Initialize components
    this.monitor = new WorkflowMonitor(config);
    this.detector = new ExtendedReleaseDetector(config);

    // Set up event handling
    this.setupEventHandling();
  }

  /**
   * Start the workflow event detection system
   */
  async start(): Promise<void> {
    await this.monitor.startMonitoring();
    
    if (this.options.enableAutoProcessing) {
      this.startAutoProcessing();
    }
  }

  /**
   * Stop the workflow event detection system
   */
  async stop(): Promise<void> {
    this.isProcessing = false;
    await this.monitor.stopMonitoring();
    
    // Clear processing results to free memory
    this.processingResults.clear();
  }

  /**
   * Manually process a specific event
   */
  async processEvent(event: WorkflowEvent): Promise<ProcessingResult> {
    const eventId = this.generateEventId(event);
    
    try {
      const releaseSignal = await this.detector.detectReleaseFromEvent(event);
      
      const result: ProcessingResult = {
        event,
        releaseSignal,
        processed: true,
        retryCount: 0
      };
      
      this.processingResults.set(eventId, result);
      return result;
      
    } catch (error) {
      const result: ProcessingResult = {
        event,
        releaseSignal: null,
        processed: false,
        error: error as Error,
        retryCount: 0
      };
      
      this.processingResults.set(eventId, result);
      return result;
    }
  }

  /**
   * Get processing results for analysis
   */
  getProcessingResults(): ProcessingResult[] {
    return Array.from(this.processingResults.values());
  }

  /**
   * Manually trigger a workflow event (delegates to WorkflowMonitor)
   */
  async triggerEvent(type: WorkflowEvent['type'], source: string, metadata: Record<string, any> = {}): Promise<void> {
    await this.monitor.triggerEvent(type, source, metadata);
  }

  /**
   * Get current system status
   */
  getStatus(): {
    monitoring: boolean;
    processing: boolean;
    queueStatus: any;
    resultsCount: number;
    recentEvents: WorkflowEvent[];
  } {
    const recentResults = Array.from(this.processingResults.values())
      .sort((a, b) => b.event.timestamp.getTime() - a.event.timestamp.getTime())
      .slice(0, 5);

    return {
      monitoring: this.monitor['isMonitoring'],
      processing: this.isProcessing,
      queueStatus: this.monitor.getQueueStatus(),
      resultsCount: this.processingResults.size,
      recentEvents: recentResults.map(r => r.event)
    };
  }

  /**
   * Integrate with existing hook system by processing trigger files
   */
  async processHookTriggers(triggersPath: string = '.kiro/release-triggers'): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    
    try {
      const files = await fs.readdir(triggersPath);
      const triggerFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of triggerFiles) {
        const filePath = path.join(triggersPath, file);
        
        try {
          const triggerData = await fs.readFile(filePath, 'utf-8');
          const trigger = JSON.parse(triggerData);
          
          // Only process pending triggers
          if (trigger.status === 'pending') {
            const event: WorkflowEvent = {
              type: this.mapTriggerType(trigger.type),
              source: trigger.source || filePath,
              timestamp: new Date(trigger.triggeredAt || Date.now()),
              metadata: {
                ...trigger,
                triggerFile: filePath
              }
            };
            
            const result = await this.processEvent(event);
            results.push(result);
            
            // Update trigger status
            trigger.status = result.processed ? 'processed' : 'failed';
            trigger.processedAt = new Date().toISOString();
            trigger.releaseSignal = result.releaseSignal;
            
            if (result.error) {
              trigger.error = result.error.message;
            }
            
            await fs.writeFile(filePath, JSON.stringify(trigger, null, 2));
          }
        } catch (error) {
          console.error(`Error processing trigger file ${filePath}:`, error);
        }
      }
    } catch (error) {
      // Directory doesn't exist - this is normal for tests or new installations
      if ((error as any).code !== 'ENOENT') {
        console.error('Error reading triggers directory:', error);
      }
    }
    
    return results;
  }

  /**
   * Create a CLI interface for manual event processing
   */
  async processCliCommand(command: string, args: string[]): Promise<void> {
    switch (command) {
      case 'status':
        await this.showStatus();
        break;
        
      case 'process-triggers':
        await this.processTriggersCommand();
        break;
        
      case 'monitor':
        await this.startMonitoringCommand();
        break;
        
      case 'stop':
        await this.stopMonitoringCommand();
        break;
        
      default:
        console.log('Unknown command:', command);
        this.showHelp();
    }
  }

  // Private methods

  private setupEventHandling(): void {
    // Handle workflow events from the monitor
    this.monitor.on('workflow-event', (event: WorkflowEvent) => {
      if (this.options.enableAutoProcessing) {
        // Queue for processing
        setTimeout(() => {
          this.processEvent(event).catch(error => {
            console.error('Error processing workflow event:', error);
          });
        }, this.options.processingDelay);
      }
    });

    // Handle release signals
    this.monitor.on('release-signal', (signal: ReleaseSignal) => {
      console.log('Release signal detected:', signal);
      // This could trigger the release process
    });

    // Handle errors
    this.monitor.on('error', (error: Error) => {
      console.error('Workflow monitor error:', error);
    });
  }

  private startAutoProcessing(): void {
    this.isProcessing = true;
    
    // Periodically process hook triggers
    const processHookTriggers = async () => {
      if (this.isProcessing) {
        try {
          await this.processHookTriggers();
        } catch (error) {
          console.error('Error processing hook triggers:', error);
        }
        
        // Schedule next processing
        setTimeout(processHookTriggers, this.options.processingDelay);
      }
    };
    
    // Start processing after initial delay
    setTimeout(processHookTriggers, this.options.processingDelay);
  }

  private generateEventId(event: WorkflowEvent): string {
    return `${event.type}-${event.timestamp.getTime()}-${event.source.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  private mapTriggerType(triggerType: string): WorkflowEvent['type'] {
    switch (triggerType) {
      case 'spec-completion':
        return 'spec-completion';
      case 'task-completion':
        return 'task-completion';
      default:
        return 'hook-trigger';
    }
  }

  // CLI command implementations

  private async showStatus(): Promise<void> {
    const status = this.getStatus();
    
    console.log('\n=== Workflow Event Detector Status ===');
    console.log(`Monitoring: ${status.monitoring ? '✅ Active' : '❌ Inactive'}`);
    console.log(`Processing: ${status.processing ? '✅ Active' : '❌ Inactive'}`);
    console.log(`Queue Length: ${status.queueStatus.queueLength}`);
    console.log(`Results Count: ${status.resultsCount}`);
    
    if (status.recentEvents.length > 0) {
      console.log('\nRecent Events:');
      status.recentEvents.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.type} - ${event.source} (${event.timestamp.toISOString()})`);
      });
    }
    
    console.log('');
  }

  private async processTriggersCommand(): Promise<void> {
    console.log('Processing hook triggers...');
    
    const results = await this.processHookTriggers();
    
    console.log(`Processed ${results.length} triggers:`);
    results.forEach((result, index) => {
      const status = result.processed ? '✅' : '❌';
      const signal = result.releaseSignal ? ` -> ${result.releaseSignal.type} release` : '';
      console.log(`  ${index + 1}. ${status} ${result.event.type}${signal}`);
      
      if (result.error) {
        console.log(`     Error: ${result.error.message}`);
      }
    });
  }

  private async startMonitoringCommand(): Promise<void> {
    console.log('Starting workflow monitoring...');
    await this.start();
    console.log('✅ Monitoring started');
  }

  private async stopMonitoringCommand(): Promise<void> {
    console.log('Stopping workflow monitoring...');
    await this.stop();
    console.log('✅ Monitoring stopped');
  }

  private showHelp(): void {
    console.log(`
Workflow Event Detector CLI

Commands:
  status           - Show current system status
  process-triggers - Process pending hook triggers
  monitor          - Start workflow monitoring
  stop             - Stop workflow monitoring

Examples:
  npm run release:detect status
  npm run release:detect process-triggers
  npm run release:detect monitor
`);
  }
}

/**
 * Extended Release Detector that can handle WorkflowEvents
 */
class ExtendedReleaseDetector extends ReleaseDetector {
  async detectReleaseFromEvent(event: WorkflowEvent): Promise<ReleaseSignal | null> {
    try {
      switch (event.type) {
        case 'task-completion':
          if (event.metadata.taskNumber && event.metadata.taskDescription) {
            // Extract task path from metadata or construct it
            const taskPath = event.metadata.taskPath || this.findTasksFileFromEvent(event);
            const taskName = `${event.metadata.taskNumber} ${event.metadata.taskDescription}`;
            
            // Check if task file exists before processing
            try {
              await fs.access(taskPath);
              return await this.detectReleaseFromTaskCompletion(taskPath, taskName);
            } catch (error) {
              // File doesn't exist - return null instead of throwing
              return null;
            }
          }
          break;
          
        case 'spec-completion':
          // Extract spec path from source
          const specPath = this.extractSpecPathFromSource(event.source);
          if (specPath) {
            try {
              await fs.access(specPath);
              return await this.detectReleaseFromSpecCompletion(specPath);
            } catch (error) {
              // Path doesn't exist - return null instead of throwing
              return null;
            }
          }
          break;
          
        case 'hook-trigger':
          // Process based on trigger metadata
          if (event.metadata.type === 'task-completion' && event.metadata.source) {
            try {
              await fs.access(event.metadata.source);
              return await this.detectReleaseFromTaskCompletion(
                event.metadata.source, 
                event.metadata.taskName || 'Unknown Task'
              );
            } catch (error) {
              return null;
            }
          }
          if (event.metadata.type === 'spec-completion' && event.metadata.source) {
            try {
              await fs.access(event.metadata.source);
              return await this.detectReleaseFromSpecCompletion(event.metadata.source);
            } catch (error) {
              return null;
            }
          }
          break;
      }
      
      return null;
    } catch (error) {
      // Log error but don't throw - return null to indicate no release signal
      console.warn('Error detecting release from event:', error);
      return null;
    }
  }

  private findTasksFileFromEvent(event: WorkflowEvent): string {
    // Try to extract spec name from source and construct tasks.md path
    if (event.source.includes('git-commit:')) {
      // For git commits, we need to find the relevant tasks.md file
      // This is a simplified approach - in practice, you might need more sophisticated logic
      return '.kiro/specs/release-management-system/tasks.md'; // Default fallback
    }
    
    return event.source;
  }

  private extractSpecPathFromSource(source: string): string | null {
    // Extract spec path from completion document path
    const specMatch = source.match(/\.kiro\/specs\/([^\/]+)/);
    if (specMatch) {
      return `.kiro/specs/${specMatch[1]}`;
    }
    
    return null;
  }
}