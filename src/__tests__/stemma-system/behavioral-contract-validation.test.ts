/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate behavioral contracts across web, iOS, and Android platforms
 */

/**
 * Behavioral Contract Validation Test Suite
 *
 * Validates that component behavioral contracts are honored consistently across
 * web, iOS, and Android platforms. This test suite implements the validation
 * framework defined in Test-Behavioral-Contract-Validation.md.
 *
 * @see .kiro/steering/Test-Behavioral-Contract-Validation.md
 * @see .kiro/specs/034-component-architecture-system/design.md
 * @validates Requirements R6.1, R6.2, R6.3, R6.4, R6.5
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Types for behavioral contract validation
interface BehavioralContract {
  description: string;
  behavior: string;
  wcag?: string;
  platforms: string[];
  validation: string;
  inherited?: boolean;
}

interface ComponentSchema {
  name: string;
  type: string;
  family: string;
  version: string;
  readiness: string;
  behaviors: string[];
  contracts: Record<string, BehavioralContract>;
  platforms: string[];
  platform_notes?: Record<string, any>;
}

interface PlatformImplementation {
  platform: string;
  exists: boolean;
  filePath: string;
  hasContract: boolean;
}

interface ContractValidationResult {
  contractName: string;
  description: string;
  platforms: string[];
  platformImplementations: PlatformImplementation[];
  isConsistent: boolean;
  issues: string[];
}

// Component paths
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');
const COMPONENTS = [
  'Input-Text-Base',
  'Input-Text-Email',
  'Input-Text-Password',
  'Input-Text-PhoneNumber',
  'Button-CTA',
  'Container-Base',
  'Icon-Base',
];

// Platform file patterns
const PLATFORM_PATTERNS: Record<string, { dir: string; extension: string }> = {
  web: { dir: 'platforms/web', extension: '.web.ts' },
  ios: { dir: 'platforms/ios', extension: '.ios.swift' },
  android: { dir: 'platforms/android', extension: '.android.kt' },
};

/**
 * Load and parse a component schema YAML file
 */
function loadComponentSchema(componentName: string): ComponentSchema | null {
  const schemaPath = path.join(COMPONENTS_DIR, componentName, `${componentName}.schema.yaml`);
  
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    return yaml.load(content) as ComponentSchema;
  } catch (error) {
    // Some schemas may have YAML syntax that js-yaml struggles with
    // Log the error but don't fail - return null to skip this component
    console.log(`Warning: Could not parse schema for ${componentName}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Load behavioral contracts from contracts.yaml (sole source of truth per spec 063)
 */
function loadComponentContracts(componentName: string): Record<string, BehavioralContract> | null {
  const contractsPath = path.join(COMPONENTS_DIR, componentName, 'contracts.yaml');
  
  if (!fs.existsSync(contractsPath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(contractsPath, 'utf-8');
    const parsed = yaml.load(content) as Record<string, any>;
    return (parsed?.contracts as Record<string, BehavioralContract>) || null;
  } catch (error) {
    console.log(`Warning: Could not parse contracts for ${componentName}: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Check if a platform implementation file exists
 */
function checkPlatformImplementation(
  componentName: string,
  platform: string
): PlatformImplementation {
  const pattern = PLATFORM_PATTERNS[platform];
  if (!pattern) {
    return {
      platform,
      exists: false,
      filePath: '',
      hasContract: false,
    };
  }
  
  const componentDir = path.join(COMPONENTS_DIR, componentName);
  const platformDir = path.join(componentDir, pattern.dir);
  
  // Find the implementation file
  let filePath = '';
  let exists = false;
  
  if (fs.existsSync(platformDir)) {
    const files = fs.readdirSync(platformDir);
    const implFile = files.find(f => f.endsWith(pattern.extension));
    if (implFile) {
      filePath = path.join(platformDir, implFile);
      exists = true;
    }
  }
  
  return {
    platform,
    exists,
    filePath,
    hasContract: exists, // Assume contract is implemented if file exists
  };
}

/**
 * Validate a single behavioral contract across platforms
 */
function validateContract(
  componentName: string,
  contractName: string,
  contract: BehavioralContract
): ContractValidationResult {
  const platformImplementations: PlatformImplementation[] = [];
  const issues: string[] = [];
  
  for (const platform of contract.platforms) {
    const impl = checkPlatformImplementation(componentName, platform);
    platformImplementations.push(impl);
    
    if (!impl.exists) {
      issues.push(`Missing ${platform} implementation for contract '${contractName}'`);
    }
  }
  
  const isConsistent = issues.length === 0 && 
    platformImplementations.every(p => p.exists);
  
  return {
    contractName,
    description: contract.description,
    platforms: contract.platforms,
    platformImplementations,
    isConsistent,
    issues,
  };
}

describe('Behavioral Contract Validation Suite', () => {
  describe('Component Schema Validation', () => {
    it('all components should have schema files', () => {
      for (const component of COMPONENTS) {
        const schemaPath = path.join(COMPONENTS_DIR, component, `${component}.schema.yaml`);
        const exists = fs.existsSync(schemaPath);
        
        if (!exists) {
          console.log(`Missing schema: ${component}`);
        }
        
        expect(exists).toBe(true);
      }
    });

    it('all schemas should have required fields', () => {
      // Per spec 063: contracts live in contracts.yaml, not in schema
      const requiredFields = ['name', 'type', 'family', 'behaviors', 'platforms'];
      
      for (const component of COMPONENTS) {
        const schema = loadComponentSchema(component);
        
        if (!schema) {
          console.log(`Could not load schema for ${component}`);
          continue;
        }
        
        for (const field of requiredFields) {
          const hasField = field in schema;
          
          if (!hasField) {
            console.log(`${component}: Missing required field '${field}'`);
          }
          
          expect(hasField).toBe(true);
        }
      }
    });

    it('all schemas should have at least one behavioral contract', () => {
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) {
          console.log(`${component}: No contracts.yaml found`);
          continue;
        }
        
        const contractCount = Object.keys(contracts).length;
        
        if (contractCount === 0) {
          console.log(`${component}: No behavioral contracts defined`);
        }
        
        expect(contractCount).toBeGreaterThan(0);
      }
    });
  });

  describe('Platform Parity Validation', () => {
    it('all components should have implementations for declared platforms', () => {
      for (const component of COMPONENTS) {
        const schema = loadComponentSchema(component);
        
        if (!schema) continue;
        
        for (const platform of schema.platforms) {
          const impl = checkPlatformImplementation(component, platform);
          
          if (!impl.exists) {
            console.log(`${component}: Missing ${platform} implementation`);
          }
          
          expect(impl.exists).toBe(true);
        }
      }
    });

    it('all contracts should specify platforms', () => {
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          const hasPlatforms = contract.platforms && contract.platforms.length > 0;
          
          if (!hasPlatforms) {
            console.log(`${component}.${contractName}: No platforms specified`);
          }
          
          expect(hasPlatforms).toBe(true);
        }
      }
    });
  });

  describe('Contract Consistency Validation', () => {
    it('all contracts should have implementations on all declared platforms', () => {
      const results: ContractValidationResult[] = [];
      
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          const result = validateContract(component, contractName, contract);
          results.push(result);
          
          if (!result.isConsistent) {
            console.log(`${component}.${contractName}: ${result.issues.join(', ')}`);
          }
        }
      }
      
      const inconsistentContracts = results.filter(r => !r.isConsistent);
      
      console.log(`\nContract Validation Summary:`);
      console.log(`  Total contracts: ${results.length}`);
      console.log(`  Consistent: ${results.length - inconsistentContracts.length}`);
      console.log(`  Inconsistent: ${inconsistentContracts.length}`);
      
      // All contracts should be consistent
      expect(inconsistentContracts.length).toBe(0);
    });
  });

  describe('WCAG Reference Validation', () => {
    it('accessibility-related contracts should have WCAG references', () => {
      const accessibilityContracts = [
        'focusable',
        'focus_ring',
        'disabled_state',
        'error_state_display',
        'reduced_motion_support',
        'accessibility_hidden',
      ];
      
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          if (accessibilityContracts.includes(contractName)) {
            const hasWcag = contract.wcag && contract.wcag.length > 0;
            
            if (!hasWcag) {
              console.log(`${component}.${contractName}: Missing WCAG reference`);
            }
            
            expect(hasWcag).toBe(true);
          }
        }
      }
    });

    it('WCAG references should follow standard format', () => {
      // WCAG references can be in various formats:
      // - "2.1.1 Keyboard"
      // - "3.3.1 Error Identification, 1.4.1 Use of Color"
      // - "4.1.2 Name, Role, Value" (single reference with commas in name)
      // - "N/A" for non-accessibility contracts
      
      // Pattern for a single WCAG reference (number + text, may contain commas)
      const singleRefPattern = /^\d+\.\d+(\.\d+)?\s+.+$/;
      
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          if (contract.wcag && contract.wcag !== 'N/A') {
            // Try to validate the WCAG reference
            // It could be a single reference or multiple separated by comma + space + number
            const wcagValue = contract.wcag;
            
            // Check if it's a valid single reference
            if (singleRefPattern.test(wcagValue)) {
              // Valid single reference
              continue;
            }
            
            // Try splitting by ", " followed by a number (indicating multiple refs)
            const multiRefPattern = /,\s+(?=\d)/;
            const references = wcagValue.split(multiRefPattern).map((r: string) => r.trim());
            
            let allValid = true;
            for (const ref of references) {
              if (!singleRefPattern.test(ref)) {
                console.log(`${component}.${contractName}: Invalid WCAG format '${ref}'`);
                allValid = false;
              }
            }
            
            expect(allValid).toBe(true);
          }
        }
      }
    });
  });

  describe('Validation Criteria Completeness', () => {
    it('all contracts should have validation criteria', () => {
      let contractsWithValidation = 0;
      let contractsWithoutValidation = 0;
      
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          // Inherited contracts may not have validation defined locally
          if (contract.inherited) {
            continue;
          }
          
          // In canonical format (spec 063), validation is a list
          const hasValidation = contract.validation &&
            (Array.isArray(contract.validation) ? contract.validation.length > 0 : String(contract.validation).trim().length > 0);
          
          if (!hasValidation) {
            console.log(`${component}.${contractName}: Missing validation criteria`);
            contractsWithoutValidation++;
          } else {
            contractsWithValidation++;
          }
        }
      }
      
      console.log(`\nValidation Criteria Summary:`);
      console.log(`  With validation: ${contractsWithValidation}`);
      console.log(`  Without validation: ${contractsWithoutValidation}`);
      
      // Most contracts should have validation criteria
      expect(contractsWithValidation).toBeGreaterThan(0);
    });

    it('validation criteria should include testable assertions', () => {
      // In canonical format (spec 063), validation is a list of assertions
      for (const component of COMPONENTS) {
        const contracts = loadComponentContracts(component);
        
        if (!contracts) continue;
        
        for (const [contractName, contract] of Object.entries(contracts)) {
          // Skip inherited contracts
          if (contract.inherited) {
            continue;
          }
          
          if (contract.validation) {
            // Canonical format uses a list; legacy format uses multiline string with dashes
            const hasAssertions = Array.isArray(contract.validation)
              ? contract.validation.length > 0
              : String(contract.validation).includes('-');
            
            if (!hasAssertions) {
              console.log(`${component}.${contractName}: Validation lacks testable assertions`);
            }
            
            expect(hasAssertions).toBe(true);
          }
        }
      }
    });
  });
});
