/**
 * Change Categorization System
 * 
 * Provides sophisticated classification logic for different change types,
 * severity assessment, and benefit extraction from completion documents.
 * Implements systematic categorization rules based on content analysis.
 */

import { ExtractionConfig } from '../config/AnalysisConfig';
import { 
  BreakingChange, 
  Feature, 
  BugFix, 
  Improvement,
  DocumentationChange 
} from '../types/AnalysisTypes';

export interface CategorizationResult {
  type: 'breaking' | 'feature' | 'bugfix' | 'improvement' | 'documentation' | 'unknown';
  confidence: number;
  reasoning: string[];
  suggestedCategory?: string;
}

export interface SeverityAssessment {
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  reasoning: string;
}

export interface FeatureClassification {
  category: string;
  subcategory?: string;
  confidence: number;
  benefits: string[];
  reasoning: string[];
}

export interface ImprovementClassification {
  type: 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other';
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string[];
}

export interface BugFixClassification {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'functional' | 'performance' | 'security' | 'ui' | 'integration' | 'other';
  confidence: number;
  reasoning: string[];
}

export class ChangeCategorizationSystem {
  private config: ExtractionConfig;

  // Classification patterns for different change types
  private readonly BREAKING_CHANGE_PATTERNS = [
    // API/Interface changes
    { pattern: /removes?\s+(api|interface|method|function|endpoint)/i, weight: 0.9, indicator: 'API removal' },
    { pattern: /changes?\s+(api|interface|signature|contract)/i, weight: 0.8, indicator: 'API modification' },
    { pattern: /deprecates?\s+(api|interface|method|function)/i, weight: 0.7, indicator: 'API deprecation' },
    
    // Behavioral changes
    { pattern: /breaking\s+change/i, weight: 1.0, indicator: 'Explicit breaking change' },
    { pattern: /incompatible\s+with/i, weight: 0.9, indicator: 'Incompatibility introduced' },
    { pattern: /migration\s+required/i, weight: 0.8, indicator: 'Migration required' },
    
    // Data/Schema changes
    { pattern: /schema\s+change/i, weight: 0.8, indicator: 'Schema modification' },
    { pattern: /database\s+migration/i, weight: 0.7, indicator: 'Database changes' },
    { pattern: /config\s+format\s+change/i, weight: 0.7, indicator: 'Configuration changes' }
  ];

  private readonly FEATURE_PATTERNS = [
    // New functionality
    { pattern: /adds?\s+(new\s+)?(feature|functionality|capability)/i, weight: 0.9, indicator: 'New functionality' },
    { pattern: /implements?\s+(new\s+)?(feature|component|system)/i, weight: 0.8, indicator: 'Implementation' },
    { pattern: /introduces?\s+(new\s+)?(api|interface|endpoint)/i, weight: 0.8, indicator: 'New API' },
    
    // Enhancement patterns
    { pattern: /enhances?\s+(existing\s+)?/i, weight: 0.7, indicator: 'Enhancement' },
    { pattern: /extends?\s+(functionality|capability)/i, weight: 0.7, indicator: 'Extension' },
    { pattern: /supports?\s+(new\s+)?/i, weight: 0.6, indicator: 'New support' }
  ];

  private readonly BUG_FIX_PATTERNS = [
    // Direct fix indicators
    { pattern: /fixes?\s+(bug|issue|problem|error)/i, weight: 0.9, indicator: 'Bug fix' },
    { pattern: /resolves?\s+(issue|problem|bug)/i, weight: 0.9, indicator: 'Issue resolution' },
    { pattern: /corrects?\s+(incorrect|wrong|invalid)/i, weight: 0.8, indicator: 'Correction' },
    
    // Error handling
    { pattern: /handles?\s+(error|exception|edge\s+case)/i, weight: 0.7, indicator: 'Error handling' },
    { pattern: /prevents?\s+(crash|failure|error)/i, weight: 0.7, indicator: 'Prevention' },
    { pattern: /validates?\s+(input|data|parameters)/i, weight: 0.6, indicator: 'Validation' }
  ];

  private readonly IMPROVEMENT_PATTERNS = [
    // Performance
    { pattern: /improves?\s+(performance|speed|efficiency)/i, weight: 0.8, indicator: 'Performance improvement', type: 'performance' },
    { pattern: /optimizes?\s+(performance|memory|cpu)/i, weight: 0.8, indicator: 'Optimization', type: 'performance' },
    { pattern: /reduces?\s+(latency|load\s+time|memory)/i, weight: 0.7, indicator: 'Resource reduction', type: 'performance' },
    
    // Usability
    { pattern: /improves?\s+(usability|user\s+experience|ux)/i, weight: 0.8, indicator: 'UX improvement', type: 'usability' },
    { pattern: /enhances?\s+(accessibility|a11y)/i, weight: 0.8, indicator: 'Accessibility enhancement', type: 'accessibility' },
    { pattern: /simplifies?\s+(interface|workflow|process)/i, weight: 0.7, indicator: 'Simplification', type: 'usability' },
    
    // Maintainability
    { pattern: /refactors?\s+(code|implementation|structure)/i, weight: 0.7, indicator: 'Refactoring', type: 'maintainability' },
    { pattern: /cleans?\s+up\s+(code|implementation)/i, weight: 0.6, indicator: 'Code cleanup', type: 'maintainability' },
    { pattern: /improves?\s+(code\s+quality|maintainability)/i, weight: 0.7, indicator: 'Quality improvement', type: 'maintainability' },
    
    // Security
    { pattern: /improves?\s+(security|safety)/i, weight: 0.8, indicator: 'Security improvement', type: 'security' },
    { pattern: /hardens?\s+(security|authentication)/i, weight: 0.8, indicator: 'Security hardening', type: 'security' }
  ];

  // Severity indicators for breaking changes
  private readonly SEVERITY_INDICATORS = {
    critical: [
      /data\s+loss/i,
      /security\s+vulnerability/i,
      /complete\s+rewrite/i,
      /removes?\s+core\s+functionality/i
    ],
    high: [
      /removes?\s+(api|interface|method)/i,
      /incompatible\s+with\s+previous/i,
      /major\s+refactor/i,
      /changes?\s+core\s+behavior/i
    ],
    medium: [
      /deprecates?\s+(api|method)/i,
      /changes?\s+default\s+behavior/i,
      /updates?\s+dependencies/i,
      /deprecated.*favor/i,
      /configuration.*format/i
    ],
    low: [
      /minor\s+api\s+change/i,
      /cosmetic\s+change/i,
      /internal\s+refactor/i
    ]
  };

  // Feature categories
  private readonly FEATURE_CATEGORIES = {
    'UI/UX': [
      /user\s+interface/i,
      /ui\s+component/i,
      /visual\s+design/i,
      /user\s+experience/i,
      /accessibility/i,
      /responsive/i
    ],
    'API': [
      /api\s+endpoint/i,
      /rest\s+api/i,
      /graphql/i,
      /web\s+service/i,
      /interface\s+definition/i
    ],
    'Performance': [
      /performance\s+optimization/i,
      /caching/i,
      /lazy\s+loading/i,
      /bundling/i,
      /compression/i,
      /redis.*caching/i,
      /data\s+optimization/i,
      /speed\s+improvements/i
    ],
    'Security': [
      /authentication/i,
      /authorization/i,
      /encryption/i,
      /security\s+feature/i,
      /access\s+control/i
    ],
    'Integration': [
      /third\s+party\s+integration/i,
      /external\s+service/i,
      /webhook/i,
      /plugin/i,
      /connector/i
    ],
    'Data': [
      /database/i,
      /data\s+model/i,
      /schema/i,
      /migration/i,
      /storage/i
    ],
    'Developer Experience': [
      /developer\s+tools/i,
      /debugging/i,
      /logging/i,
      /testing\s+framework/i,
      /build\s+system/i
    ],
    'General': [] // Default category
  };

  constructor(config: ExtractionConfig) {
    this.config = config;
  }

  /**
   * Categorize a change based on its content
   */
  public categorizeChange(title: string, description: string, context?: string): CategorizationResult {
    const fullText = `${title} ${description} ${context || ''}`.toLowerCase();
    const results: Array<{ type: string; confidence: number; reasoning: string[] }> = [];

    // Check for breaking changes
    const breakingResult = this.checkPatterns(fullText, this.BREAKING_CHANGE_PATTERNS);
    if (breakingResult.confidence > 0) {
      results.push({
        type: 'breaking',
        confidence: breakingResult.confidence,
        reasoning: breakingResult.indicators
      });
    }

    // Check for features
    const featureResult = this.checkPatterns(fullText, this.FEATURE_PATTERNS);
    if (featureResult.confidence > 0) {
      results.push({
        type: 'feature',
        confidence: featureResult.confidence,
        reasoning: featureResult.indicators
      });
    }

    // Check for bug fixes
    const bugFixResult = this.checkPatterns(fullText, this.BUG_FIX_PATTERNS);
    if (bugFixResult.confidence > 0) {
      results.push({
        type: 'bugfix',
        confidence: bugFixResult.confidence,
        reasoning: bugFixResult.indicators
      });
    }

    // Check for improvements
    const improvementResult = this.checkPatterns(fullText, this.IMPROVEMENT_PATTERNS);
    if (improvementResult.confidence > 0) {
      results.push({
        type: 'improvement',
        confidence: improvementResult.confidence,
        reasoning: improvementResult.indicators
      });
    }

    // Check for documentation
    const docResult = this.checkDocumentationPatterns(fullText);
    if (docResult.confidence > 0) {
      results.push({
        type: 'documentation',
        confidence: docResult.confidence,
        reasoning: docResult.indicators
      });
    }

    // Return the highest confidence result
    if (results.length === 0) {
      return {
        type: 'unknown',
        confidence: 0.1,
        reasoning: ['No clear categorization patterns found'],
        suggestedCategory: 'improvement' // Default fallback
      };
    }

    // Sort by confidence and return the best match
    results.sort((a, b) => b.confidence - a.confidence);
    const best = results[0];

    return {
      type: best.type as any,
      confidence: best.confidence,
      reasoning: best.reasoning,
      suggestedCategory: results.length > 1 ? results[1].type : 'improvement'
    };
  }

  /**
   * Assess severity of a breaking change
   */
  public assessBreakingChangeSeverity(title: string, description: string, affectedAPIs: string[]): SeverityAssessment {
    const fullText = `${title} ${description}`.toLowerCase();
    const indicators: string[] = [];
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let confidence = 0.5;

    // Check severity indicators
    for (const [severity, patterns] of Object.entries(this.SEVERITY_INDICATORS)) {
      for (const pattern of patterns) {
        if (pattern.test(fullText)) {
          indicators.push(`${severity} severity indicator found`);
          if (this.getSeverityWeight(severity as any) > this.getSeverityWeight(maxSeverity)) {
            maxSeverity = severity as any;
            confidence = Math.min(0.95, confidence + 0.3);
          }
        }
      }
    }

    // Consider number of affected APIs
    if (affectedAPIs.length > 5) {
      indicators.push('Multiple APIs affected (>5)');
      if (this.getSeverityWeight('high') > this.getSeverityWeight(maxSeverity)) {
        maxSeverity = 'high';
      }
      confidence = Math.min(0.9, confidence + 0.1);
    } else if (affectedAPIs.length > 2) {
      indicators.push('Several APIs affected (>2)');
      if (this.getSeverityWeight('medium') > this.getSeverityWeight(maxSeverity)) {
        maxSeverity = 'medium';
      }
      confidence = Math.min(0.8, confidence + 0.1);
    }

    // Generate reasoning
    const reasoning = this.generateSeverityReasoning(maxSeverity, indicators, affectedAPIs.length);

    return {
      severity: maxSeverity,
      confidence,
      indicators,
      reasoning
    };
  }

  /**
   * Classify a feature and extract benefits
   */
  public classifyFeature(title: string, description: string, artifacts: string[]): FeatureClassification {
    const fullText = `${title} ${description}`.toLowerCase();
    let bestCategory = 'General';
    let bestConfidence = 0.3;
    const reasoning: string[] = [];
    const benefits: string[] = [];

    // Find best matching category
    for (const [category, patterns] of Object.entries(this.FEATURE_CATEGORIES)) {
      if (patterns.length === 0) continue; // Skip default category

      let categoryConfidence = 0;
      const categoryReasons: string[] = [];

      for (const pattern of patterns) {
        if (pattern.test(fullText)) {
          categoryConfidence += 0.2;
          categoryReasons.push(`Matches ${category.toLowerCase()} pattern: ${pattern.source}`);
        }
      }

      if (categoryConfidence > bestConfidence) {
        bestCategory = category;
        bestConfidence = categoryConfidence;
        reasoning.length = 0; // Clear previous reasoning
        reasoning.push(...categoryReasons);
      }
    }

    // Extract benefits from description
    benefits.push(...this.extractBenefits(description));

    // Consider artifacts for additional categorization
    const artifactCategory = this.categorizeByArtifacts(artifacts);
    if (artifactCategory && artifactCategory !== 'General') {
      reasoning.push(`Artifacts suggest ${artifactCategory} category`);
      if (bestCategory === 'General') {
        bestCategory = artifactCategory;
        bestConfidence = Math.max(bestConfidence, 0.6);
      }
    }

    return {
      category: bestCategory,
      confidence: Math.min(0.9, bestConfidence),
      benefits,
      reasoning
    };
  }

  /**
   * Classify an improvement
   */
  public classifyImprovement(title: string, description: string): ImprovementClassification {
    const fullText = `${title} ${description}`.toLowerCase();
    let bestType: ImprovementClassification['type'] = 'other';
    let bestConfidence = 0.3;
    let impact: ImprovementClassification['impact'] = 'medium';
    const reasoning: string[] = [];

    // Check improvement patterns with types
    for (const pattern of this.IMPROVEMENT_PATTERNS) {
      if (pattern.pattern.test(fullText)) {
        const patternType = (pattern as any).type;
        if (patternType && pattern.weight > bestConfidence) {
          bestType = patternType;
          bestConfidence = pattern.weight;
          reasoning.push(`${pattern.indicator}: ${pattern.pattern.source}`);
        }
      }
    }

    // Assess impact based on keywords
    impact = this.assessImprovementImpact(fullText, reasoning);

    return {
      type: bestType,
      impact,
      confidence: bestConfidence,
      reasoning
    };
  }

  /**
   * Classify a bug fix
   */
  public classifyBugFix(title: string, description: string, affectedComponents: string[]): BugFixClassification {
    const fullText = `${title} ${description}`.toLowerCase();
    let severity: BugFixClassification['severity'] = 'medium';
    let category: BugFixClassification['category'] = 'other';
    let confidence = 0.5;
    const reasoning: string[] = [];

    // Assess severity
    if (/critical|blocker|urgent/i.test(fullText)) {
      severity = 'critical';
      confidence = Math.max(confidence, 0.8);
      reasoning.push('Critical severity indicators found');
    } else if (/major|important|significant/i.test(fullText)) {
      severity = 'high';
      confidence = Math.max(confidence, 0.7);
      reasoning.push('High severity indicators found');
    } else if (/minor|trivial|cosmetic/i.test(fullText)) {
      severity = 'low';
      confidence = Math.max(confidence, 0.6);
      reasoning.push('Low severity indicators found');
    }

    // Categorize by type
    if (/security|vulnerability|exploit/i.test(fullText)) {
      category = 'security';
      severity = 'critical'; // Security issues are always critical
      confidence = Math.max(confidence, 0.9);
      reasoning.push('Security-related bug fix');
    } else if (/performance|slow|timeout|memory/i.test(fullText)) {
      category = 'performance';
      confidence = Math.max(confidence, 0.8);
      reasoning.push('Performance-related bug fix');
    } else if (/ui|interface|display|visual/i.test(fullText)) {
      category = 'ui';
      confidence = Math.max(confidence, 0.7);
      reasoning.push('UI-related bug fix');
    } else if (/integration|api|service|connection/i.test(fullText)) {
      category = 'integration';
      confidence = Math.max(confidence, 0.7);
      reasoning.push('Integration-related bug fix');
    } else if (/function|logic|calculation|algorithm/i.test(fullText)) {
      category = 'functional';
      confidence = Math.max(confidence, 0.6);
      reasoning.push('Functional bug fix');
    }

    // Consider affected components
    if (affectedComponents.length > 3) {
      reasoning.push('Multiple components affected - may indicate systemic issue');
      if (severity === 'low') severity = 'medium';
      if (severity === 'medium') severity = 'high';
    }

    return {
      severity,
      category,
      confidence,
      reasoning
    };
  }

  /**
   * Check patterns against text and return confidence score
   */
  private checkPatterns(text: string, patterns: Array<{ pattern: RegExp; weight: number; indicator: string }>): { confidence: number; indicators: string[] } {
    let matchedWeight = 0;
    const indicators: string[] = [];

    for (const { pattern, weight, indicator } of patterns) {
      if (pattern.test(text)) {
        matchedWeight += weight;
        indicators.push(indicator);
      }
    }

    // Return the highest matched weight as confidence (not average)
    const confidence = matchedWeight > 0 ? Math.min(0.95, matchedWeight) : 0;
    return { confidence, indicators };
  }

  /**
   * Check for documentation patterns
   */
  private checkDocumentationPatterns(text: string): { confidence: number; indicators: string[] } {
    const docPatterns = [
      { pattern: /documentation|docs/i, weight: 0.8, indicator: 'Documentation keyword' },
      { pattern: /readme|guide|tutorial/i, weight: 0.7, indicator: 'Documentation type' },
      { pattern: /comments?|examples?/i, weight: 0.6, indicator: 'Documentation content' }
    ];

    return this.checkPatterns(text, docPatterns);
  }

  /**
   * Get numeric weight for severity comparison
   */
  private getSeverityWeight(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    const weights = { low: 1, medium: 2, high: 3, critical: 4 };
    return weights[severity];
  }

  /**
   * Generate reasoning for severity assessment
   */
  private generateSeverityReasoning(severity: string, indicators: string[], apiCount: number): string {
    const reasons = [];
    
    if (indicators.length > 0) {
      reasons.push(`Severity indicators: ${indicators.join(', ')}`);
    }
    
    if (apiCount > 0) {
      reasons.push(`${apiCount} API(s) affected`);
    }
    
    reasons.push(`Assessed as ${severity} severity based on content analysis`);
    
    return reasons.join('. ');
  }

  /**
   * Extract benefits from description text
   */
  private extractBenefits(description: string): string[] {
    const benefits: string[] = [];
    const benefitPatterns = [
      /(?:benefit|advantage|improvement)s?:?\s*([^.!?]+)/gi,
      /(?:enables?|allows?|provides?)\s+([^.!?]+)/gi,
      /(?:improves?|enhances?|increases?)\s+([^.!?]+)/gi
    ];

    for (const pattern of benefitPatterns) {
      const matches = description.match(pattern);
      if (matches) {
        benefits.push(...matches.map(match => match.trim()));
      }
    }

    return benefits;
  }

  /**
   * Categorize feature by artifacts
   */
  private categorizeByArtifacts(artifacts: string[]): string | null {
    const artifactText = artifacts.join(' ').toLowerCase();
    
    if (/\.tsx?$|component|ui/i.test(artifactText)) {
      return 'UI/UX';
    }
    if (/api|endpoint|service|controller/i.test(artifactText)) {
      return 'API';
    }
    if (/test|spec/i.test(artifactText)) {
      return 'Developer Experience';
    }
    if (/db|database|migration|schema/i.test(artifactText)) {
      return 'Data';
    }
    
    return null;
  }

  /**
   * Assess improvement impact
   */
  private assessImprovementImpact(text: string, reasoning: string[]): 'low' | 'medium' | 'high' {
    if (/significant|major|substantial|dramatic|60%|50%|dramatically/i.test(text)) {
      reasoning.push('High impact keywords found');
      return 'high';
    }
    if (/minor|small|slight|incremental/i.test(text)) {
      reasoning.push('Low impact keywords found');
      return 'low';
    }
    
    reasoning.push('Medium impact assumed (no clear indicators)');
    return 'medium';
  }
}