# Design Document: Cross-Platform Build System

**Date**: January 10, 2025  
**Spec**: F2 - Cross-Platform Build System  
**Status**: Design Phase  
**Dependencies**: F1 - Mathematical Token System (Complete)

---

## Overview

The Cross-Platform Build System implements True Native Architecture through build-time platform separation, enabling native iOS (Swift + SwiftUI), Android (Kotlin + Jetpack Compose), and Web (Web Components + Lit) applications from unified component interfaces while maintaining mathematical consistency through F1 token integration.

**Core Design Principles**:
- Build-time platform selection eliminates runtime overhead
- Platform-native technologies for optimal performance
- Mathematical token integration ensures cross-platform consistency
- Unified interface contracts enable predictable developer experience
- Component tokens as fallback when existing tokens insufficient

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Build Orchestrator                        │
│  - Platform selection (iOS/Android/Web)                     │
│  - Build configuration management                            │
│  - Parallel/sequential build execution                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────────┐
        │                     │                   │
┌───────▼────────┐   ┌────────▼───────┐   ┌─────▼──────────┐
│  iOS Builder   │   │ Android Builder│   │  Web Builder   │
│  Swift Package │   │  AAR/Gradle    │   │  NPM Package   │
└───────┬────────┘   └────────┬───────┘   └─────┬──────────┘
        │                     │                   │
        └──────────┬──────────┴──────────────────┘
                   │
        ┌──────────▼──────────────────────────────────────────┐
        │           Token Integration Layer                    │
        │  - F1 primitive/semantic token consumption          │
        │  - Component token generation (if needed)            │
        │  - Cross-platform unit conversion                    │
        │  - Mathematical validation                           │
        └──────────┬──────────────────────────────────────────┘
                   │
        ┌──────────▼──────────────────────────────────────────┐
        │        Interface Validation Layer                    │
        │  - Cross-platform API contract validation           │
        │  - Type checking and signature matching             │
        │  - Behavioral consistency verification              │
        └─────────────────────────────────────────────────────┘
```

### Component Structure

```
Component Definition
├── interface.ts          # Cross-platform API contract
├── design-spec.ts        # Mathematical relationships & design principles
├── token-integration.ts  # Token consumption patterns
└── platforms/
    ├── ios/
    │   └── Component.swift      # SwiftUI implementation
    ├── android/
    │   └── Component.kt         # Jetpack Compose implementation
    └── web/
        └── Component.ts         # Web Component (Lit) implementation
```

---

## Components and Interfaces

### Build Orchestrator

**Purpose**: Coordinates platform-specific builds and manages build lifecycle

**Interface**:
```typescript
interface BuildOrchestrator {
  // Configure build for specific platforms
  configure(config: BuildConfig): void;
  
  // Execute builds for configured platforms
  build(platforms: Platform[]): Promise<BuildResult[]>;
  
  // Validate build configuration
  validateConfig(config: BuildConfig): ValidationResult;
  
  // Get build status and progress
  getStatus(): BuildStatus;
}

interface BuildConfig {
  platforms: Platform[];           // Target platforms
  mode: 'development' | 'production';
  outputDir: string;
  parallel: boolean;               // Parallel or sequential builds
  incremental: boolean;            // Enable incremental builds
  sourceMaps: boolean;             // Generate source maps
  validation: ValidationOptions;
}

interface BuildResult {
  platform: Platform;
  success: boolean;
  packagePath: string;
  duration: number;
  warnings: string[];
  errors: BuildError[];
}
```

**Responsibilities**:
- Parse and validate build configuration
- Coordinate platform-specific builders
- Manage build execution (parallel/sequential)
- Aggregate build results and generate reports
- Handle build errors and provide recovery options

### Platform Builders

#### iOS Builder

**Purpose**: Generate Swift Package with SwiftUI components

**Interface**:
```typescript
interface iOSBuilder {
  // Build iOS Swift Package
  build(components: ComponentDefinition[]): Promise<SwiftPackage>;
  
  // Generate Swift constants from tokens
  generateTokens(tokens: TokenSet): SwiftConstants;
  
  // Validate SwiftUI implementation
  validate(implementation: SwiftImplementation): ValidationResult;
}

interface SwiftPackage {
  packageManifest: string;         // Package.swift
  sourceFiles: SwiftFile[];
  resources: Resource[];
  dependencies: Dependency[];
}
```

**Responsibilities**:
- Generate Package.swift manifest
- Convert TypeScript interfaces to Swift protocols
- Generate Swift constants from F1 tokens (pt units)
- Compile SwiftUI implementations
- Validate Swift code compiles
- Package as Swift Package Manager compatible structure

#### Android Builder

**Purpose**: Generate Android Library (AAR) or Gradle module with Jetpack Compose components

**Interface**:
```typescript
interface AndroidBuilder {
  // Build Android library
  build(components: ComponentDefinition[]): Promise<AndroidLibrary>;
  
  // Generate Kotlin constants from tokens
  generateTokens(tokens: TokenSet): KotlinConstants;
  
  // Validate Jetpack Compose implementation
  validate(implementation: KotlinImplementation): ValidationResult;
}

interface AndroidLibrary {
  buildGradle: string;             // build.gradle.kts
  sourceFiles: KotlinFile[];
  resources: AndroidResource[];
  manifest: AndroidManifest;
}
```

**Responsibilities**:
- Generate build.gradle.kts configuration
- Convert TypeScript interfaces to Kotlin interfaces
- Generate Kotlin constants from F1 tokens (dp/sp units)
- Compile Jetpack Compose implementations
- Validate Kotlin code compiles
- Package as AAR or Gradle module

#### Web Builder

**Purpose**: Generate NPM package with Web Components (Lit)

**Interface**:
```typescript
interface WebBuilder {
  // Build web package
  build(components: ComponentDefinition[]): Promise<NPMPackage>;
  
  // Generate CSS custom properties from tokens
  generateTokens(tokens: TokenSet): CSSCustomProperties;
  
  // Validate Web Component implementation
  validate(implementation: LitImplementation): ValidationResult;
}

interface NPMPackage {
  packageJson: PackageJson;
  sourceFiles: TypeScriptFile[];
  cssFiles: CSSFile[];
  declarations: TypeScriptDeclaration[];
}
```

**Responsibilities**:
- Generate package.json with proper configuration
- Generate CSS custom properties from F1 tokens (px/rem units)
- Compile Lit Web Components
- Generate TypeScript declarations
- Bundle for ESM/CJS formats
- Validate TypeScript compiles

### Token Integration Layer

**Purpose**: Integrate F1 tokens into platform-specific builds with proper unit conversion

**Interface**:
```typescript
interface TokenIntegrator {
  // Get tokens for specific platform
  getTokensForPlatform(platform: Platform): PlatformTokens;
  
  // Convert token to platform-specific value
  convertToken(token: Token, platform: Platform): PlatformValue;
  
  // Validate token selection priority
  validateTokenSelection(selection: TokenSelection): ValidationResult;
  
  // Generate component token if needed
  generateComponentToken(spec: ComponentTokenSpec): ComponentToken;
}

interface TokenSelection {
  requested: TokenRequest;
  semantic?: SemanticToken;        // First choice
  primitive?: PrimitiveToken;      // Second choice
  component?: ComponentToken;      // Fallback
  reasoning: string;               // Why this selection
}

interface PlatformTokens {
  platform: Platform;
  primitives: PlatformValue[];
  semantics: PlatformValue[];
  components: PlatformValue[];
}
```

**Responsibilities**:
- Consume primitive and semantic tokens from F1
- Follow token selection priority (semantic → primitive → component)
- Convert tokens to platform-specific units (pt, dp, px, rem)
- Generate component tokens when necessary
- Validate mathematical consistency across platforms
- Document token selection reasoning

### Interface Validation Layer

**Purpose**: Ensure unified API contracts across all platform implementations

**Interface**:
```typescript
interface InterfaceValidator {
  // Validate component interfaces match across platforms
  validateInterfaces(component: ComponentDefinition): ValidationResult;
  
  // Check method signatures match
  validateMethods(methods: MethodSignature[]): ValidationResult;
  
  // Check property types match
  validateProperties(properties: PropertyDefinition[]): ValidationResult;
  
  // Generate cross-platform validation report
  generateReport(results: ValidationResult[]): ValidationReport;
}

interface ValidationResult {
  valid: boolean;
  component: string;
  platform: Platform;
  errors: InterfaceError[];
  warnings: InterfaceWarning[];
}

interface InterfaceError {
  type: 'method_mismatch' | 'property_mismatch' | 'type_mismatch';
  message: string;
  expected: string;
  actual: string;
  platforms: Platform[];
}
```

**Responsibilities**:
- Parse interface definitions from all platforms
- Compare method signatures across platforms
- Validate property types match
- Check behavioral consistency
- Generate detailed error reports with platform differences
- Provide actionable suggestions for fixing mismatches

---

## Data Models

### Build Configuration

```typescript
interface BuildConfig {
  // Platform configuration
  platforms: Platform[];
  mode: 'development' | 'production';
  
  // Output configuration
  outputDir: string;
  filePattern?: string;
  
  // Build options
  parallel: boolean;
  incremental: boolean;
  sourceMaps: boolean;
  minify: boolean;
  
  // Validation options
  validation: {
    interfaces: boolean;
    tokens: boolean;
    mathematical: boolean;
  };
  
  // Platform-specific options
  ios?: iOSBuildOptions;
  android?: AndroidBuildOptions;
  web?: WebBuildOptions;
}

interface iOSBuildOptions {
  swiftVersion: string;
  minimumDeploymentTarget: string;
  dependencies: string[];
}

interface AndroidBuildOptions {
  kotlinVersion: string;
  minSdkVersion: number;
  targetSdkVersion: number;
  dependencies: string[];
}

interface WebBuildOptions {
  target: 'es2020' | 'es2021' | 'esnext';
  formats: ('esm' | 'cjs' | 'umd')[];
  externals: string[];
}
```

### Component Definition

```typescript
interface ComponentDefinition {
  // Component metadata
  name: string;
  description: string;
  category: ComponentCategory;
  
  // Interface contract
  interface: InterfaceDefinition;
  
  // Design specification
  design: DesignSpecification;
  
  // Token integration
  tokens: TokenIntegration;
  
  // Platform implementations
  implementations: {
    ios?: SwiftImplementation;
    android?: KotlinImplementation;
    web?: LitImplementation;
  };
}

interface InterfaceDefinition {
  properties: PropertyDefinition[];
  methods: MethodSignature[];
  events: EventDefinition[];
  states: StateDefinition[];
}

interface DesignSpecification {
  mathematicalRelationships: MathematicalRelationship[];
  accessibilityRequirements: AccessibilityRequirement[];
  platformAdaptations: PlatformAdaptation[];
}

interface TokenIntegration {
  spacing: TokenReference[];
  colors: TokenReference[];
  typography: TokenReference[];
  radius: TokenReference[];
  custom: ComponentToken[];
}
```

### Token Models

```typescript
interface TokenReference {
  property: string;                // Component property using token
  selection: TokenSelection;       // Selected token with reasoning
  platforms: {
    ios: PlatformValue;
    android: PlatformValue;
    web: PlatformValue;
  };
}

interface ComponentToken {
  name: string;
  category: TokenCategory;
  baseValue: number;
  reasoning: string;               // Why existing tokens insufficient
  references?: string[];           // Primitive tokens referenced
  platforms: {
    ios: { value: number; unit: 'pt' };
    android: { value: number; unit: 'dp' | 'sp' };
    web: { value: number; unit: 'px' | 'rem' };
  };
}

interface PlatformValue {
  value: number;
  unit: string;
  token: string;                   // Token name (e.g., "space100")
}
```

---

## Error Handling

### Error Categories

**Configuration Errors**:
- Invalid platform specification
- Missing required configuration
- Conflicting build options
- Invalid output directory

**Build Errors**:
- Platform-specific compilation failures
- Missing dependencies
- Invalid source files
- Package generation failures

**Token Integration Errors**:
- Token not found in F1
- Invalid token selection
- Mathematical inconsistency
- Unit conversion failures

**Interface Validation Errors**:
- Method signature mismatches
- Property type differences
- Missing platform implementations
- Behavioral inconsistencies

### Error Handling Strategy

```typescript
interface BuildError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  category: ErrorCategory;
  platform?: Platform;
  component?: string;
  context: Record<string, unknown>;
  suggestions: string[];
  documentation: string[];
}

interface ErrorHandler {
  // Handle build error
  handleError(error: BuildError): ErrorRecovery;
  
  // Attempt recovery
  recover(error: BuildError): Promise<RecoveryResult>;
  
  // Generate error report
  generateReport(errors: BuildError[]): ErrorReport;
}

interface ErrorRecovery {
  recoverable: boolean;
  strategy: 'retry' | 'skip' | 'fallback' | 'abort';
  actions: string[];
}
```

**Recovery Strategies**:
- **Retry**: Attempt build again (transient errors)
- **Skip**: Skip problematic platform, continue with others
- **Fallback**: Use cached build or default configuration
- **Abort**: Stop build, require manual intervention

---

## Testing Strategy

### Unit Testing

**Build Orchestrator Tests**:
- Configuration validation
- Platform selection logic
- Build execution coordination
- Error handling and recovery

**Platform Builder Tests**:
- Package generation (Swift Package, AAR, NPM)
- Token conversion (pt, dp, px, rem)
- Code compilation validation
- Platform-specific optimizations

**Token Integration Tests**:
- Token selection priority (semantic → primitive → component)
- Cross-platform unit conversion
- Mathematical consistency validation
- Component token generation

**Interface Validation Tests**:
- Method signature matching
- Property type validation
- Cross-platform consistency
- Error reporting accuracy

### Integration Testing

**End-to-End Build Tests**:
- Build all platforms from component definition
- Validate generated packages
- Verify token integration
- Check interface consistency

**Cross-Platform Validation Tests**:
- Same component builds on all platforms
- Mathematical tokens consistent
- Interface contracts maintained
- Platform-specific optimizations work

**Error Handling Tests**:
- Invalid configuration handling
- Build failure recovery
- Token integration errors
- Interface validation failures

### Validation Testing

**Mathematical Consistency Tests**:
- Token values match across platforms
- Mathematical relationships preserved
- Strategic flexibility maintained
- Accessibility requirements met

**Package Integrity Tests**:
- Swift Package valid and installable
- Android library valid and importable
- NPM package valid and installable
- All dependencies resolved correctly

---

## Design Decisions

### Decision 1: Build-Time vs Runtime Platform Separation

**Options Considered**:
- Runtime platform detection (React Native approach)
- Build-time platform separation (True Native approach)
- Hybrid approach (some runtime, some build-time)

**Decision**: Build-time platform separation

**Rationale**:
- Eliminates runtime overhead (no platform detection cost)
- Smaller bundle sizes (only relevant code included)
- Clearer code organization (platform concerns separated)
- Better performance (static optimization possible)
- Aligns with True Native Architecture philosophy

**Trade-offs**:
- More complex build system
- Separate builds for each platform
- Cannot switch platforms at runtime

### Decision 2: Native Technologies per Platform

**Options Considered**:
- Cross-platform framework (React Native, Flutter)
- Web technologies everywhere (Capacitor, Cordova)
- Native technologies per platform (Swift, Kotlin, Lit)

**Decision**: Native technologies per platform

**Rationale**:
- True native performance and user experience
- Access to latest platform features
- No framework abstraction overhead
- Aligns with True Native Architecture philosophy
- Better platform-specific optimizations

**Trade-offs**:
- Need to learn multiple technologies
- More complex build system
- Separate implementations per platform

### Decision 3: Token Selection Priority

**Options Considered**:
- Always use primitive tokens
- Always create component tokens
- Priority system (semantic → primitive → component)

**Decision**: Priority system (semantic → primitive → component)

**Rationale**:
- Leverages existing tokens first (prevents proliferation)
- Maintains mathematical consistency
- Component tokens only when necessary
- Encourages token system thinking
- Provides clear decision framework

**Trade-offs**:
- More complex token selection logic
- Requires documentation of reasoning
- Need to validate token selection

### Decision 4: Package Format per Platform

**Options Considered**:
- Universal package format
- Platform-specific package formats
- Hybrid approach

**Decision**: Platform-specific package formats

**Rationale**:
- Follows platform conventions (SPM, Gradle, NPM)
- Easy integration with platform tools
- Familiar to platform developers
- Better tooling support
- Standard distribution channels

**Trade-offs**:
- Different package formats to maintain
- Platform-specific documentation needed
- More complex distribution

### Decision 5: Interface Validation Approach

**Options Considered**:
- Manual validation (developer responsibility)
- Build-time validation (automated checks)
- Runtime validation (checks at execution)

**Decision**: Build-time validation (automated checks)

**Rationale**:
- Catches errors early (before deployment)
- Automated (no manual checking needed)
- Clear error messages (actionable feedback)
- Prevents cross-platform inconsistencies
- Aligns with build-time separation philosophy

**Trade-offs**:
- More complex build system
- Slower builds (validation overhead)
- Need to maintain validation logic

---

## Integration Points

### F1 Integration (Mathematical Token System)

**Token Consumption**:
- Build system consumes primitive tokens from F1
- Build system consumes semantic tokens from F1
- Build system generates component tokens if needed
- All tokens validated for mathematical consistency

**Cross-Platform Conversion**:
- iOS: Tokens converted to Swift constants (pt units)
- Android: Tokens converted to Kotlin constants (dp/sp units)
- Web: Tokens converted to CSS custom properties (px/rem units)

**Validation**:
- Mathematical relationships preserved across platforms
- Strategic flexibility tokens maintained
- Accessibility requirements validated

### F3 Integration (Component Architecture - Future)

**Component Generation**:
- F3 will generate component definitions
- F2 will build those definitions into platform packages
- Interface contracts defined by F3, validated by F2
- Token integration patterns established by F3, executed by F2

**Design Spec Translation**:
- F3 translates design specs to component definitions
- F2 builds component definitions to platform code
- Token selection guided by F3, executed by F2
- Validation performed by both F3 (design) and F2 (build)

### ButtonCTA Integration (Validation Component - Next)

**Validation Use Case**:
- ButtonCTA will be first component built with F2
- Validates build system works for real component
- Tests token selection priority in practice
- Proves cross-platform consistency achievable
- Creates reference pattern for future components

---

*This design document provides the architectural foundation for cross-platform build orchestration that enables True Native Architecture while maintaining mathematical consistency through F1 token integration and preparing for F3 component generation capabilities.*
