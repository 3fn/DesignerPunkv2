# Phase 1 Architecture Discovery Report

**Date**: October 29, 2025
**Auditor**: Kiro AI Agent
**Scope**: Phase 1 Architecture Systems
**Status**: Complete
**Organization**: audit-findings
**Scope**: phase-1-discovery-audit

---

## Executive Summary

**Issues Discovered**: 13 items initially identified (#008-#020)
**Issues Affecting This Area**: 9 actual issues (4 reclassified as intentional design)
- Critical: 0 (Issue #010 reclassified as intentional design)
- Important: 5 (Issues #008, #009, #011 reclassified as intentional design) - **3 RESOLVED** (#012, #013, #014)
- Minor: 3
- Not Issues: 1 (documented for clarity)
- Reclassified: 4 (platform-appropriate design decisions)
- **Resolved**: 3 issues (#012, #013, #014) via architecture-separation-of-concerns spec
- **Partial Progress**: Issues #016, #017 (interfaces created but full integration pending)

The architecture audit revealed significant inconsistencies across platform implementations and violations of separation of concerns principles. While the system demonstrates strong use of the generator pattern and consistent base class inheritance, there are critical gaps in interface definitions and systematic mixing of validation logic into non-validation components.

**Key Findings**:
- Platform implementations lack consistency in constructor patterns, method naming, and special token handling
- Validation logic is duplicated across generators and registries, violating separation of concerns
- Validator and registry systems lack common interfaces, preventing polymorphic usage
- Code organization shows minor inconsistencies in file naming and test directory structure

---

## Audit Scope

### Systems Reviewed

**Platform Implementations**:
- iOS format generators, unit converters, color resolvers, file organizers
- Android format generators, unit converters, color resolvers, file organizers
- Web format generators, unit converters, color resolvers, file organizers

**Architectural Patterns**:
- Builder pattern usage (none found)
- Validator pattern usage (mixed into components)
- Generator pattern usage (consistent across platforms)
- Separation of concerns across all components

**Interface Contracts**:
- Provider interfaces (FormatProvider, UnitProvider, PathProvider)
- Build system interfaces (IBuildSystemIntegration)
- Validator interfaces (none found - critical gap)
- Registry interfaces (none found - critical gap)

**Code Organization**:
- File naming conventions across platforms and modules
- Directory structure consistency
- Module boundary clarity through index.ts files
- Test directory organization patterns

---

## Area-Specific Analysis

### Platform Implementation Consistency

**Strengths**:
- All platforms extend common base classes (BaseFormatProvider, BaseUnitProvider, BasePathProvider)
- All platforms implement required interface methods consistently
- Generator pattern used consistently across all platforms
- Semantic token formatting methods consistent across platforms

**Critical Issues**:
- **Z-Index Token Handling** (Issue #010): iOS scales down by 100, Web uses direct values, Android undocumented
  - Impact: Cross-platform visual inconsistency in layered UI elements
  - Example: `elevation.modal = 100` → iOS: 1.0, Web: 100, Android: unknown

**Important Issues**:
- **Constructor Inconsistency** (Issue #008): iOS has no constructor, Android/Web support format selection
  - Impact: Inconsistent initialization patterns across platforms
  - Prevents polymorphic instantiation
  
- **Method Naming Inconsistency** (Issue #009): Platform-specific prefixes (Swift/Kotlin/CSS) for equivalent methods
  - Impact: Difficult to understand equivalent functionality
  - Example: `getSwiftType()` vs `getKotlinType()` vs inline handling in Web

**Minor Issues**:
- **Opacity/Alpha Terminology** (Issue #011): iOS/Web use "opacity", Android uses "alpha"
  - Impact: Terminology confusion for same concept
  - Recommendation: Standardize on "opacity" (CSS standard term)

### Separation of Concerns

**Status**: ✅ **RESOLVED** (November 9, 2025)
**Resolved By**: architecture-separation-of-concerns spec

**Critical Violations** (All Resolved):

Three components were found performing validation logic that should be delegated to validators:

1. **TokenFileGenerator** (Issue #012) - ✅ **RESOLVED**:
   - **Original Issue**: Contains `validateSemanticReferences()` method checking primitive token references
   - **Impact**: Duplicate validation logic, potential for inconsistency, mixed responsibilities
   - **Resolution**: Validation logic removed from TokenFileGenerator. Callers now validate before generation using SemanticTokenValidator and PrimitiveReferenceValidator. Generator focuses solely on platform-specific file generation.
   - **Resolution Details**: See `.kiro/specs/architecture-separation-of-concerns/completion/task-2-parent-completion.md`

2. **PrimitiveTokenRegistry** (Issue #013) - ✅ **RESOLVED**:
   - **Original Issue**: Instantiates BaselineGridValidator in constructor, performs validation during token registration, has `validateToken()` and `validateAll()` methods
   - **Impact**: Registry couples storage with validation, tight coupling to validator implementation
   - **Resolution**: Validation logic removed from PrimitiveTokenRegistry. Registry now focuses solely on storage operations (register, query, get, has). Callers validate tokens before registration using appropriate validators.
   - **Resolution Details**: See `.kiro/specs/architecture-separation-of-concerns/completion/task-3-parent-completion.md`

3. **SemanticTokenRegistry** (Issue #014) - ✅ **RESOLVED**:
   - **Original Issue**: Performs primitive reference validation during registration, checks if primitive tokens exist using primitive registry, has `validateToken()` and `validateAll()` methods
   - **Impact**: Registry couples storage with validation, duplicate validation logic
   - **Resolution**: Validation logic removed from SemanticTokenRegistry. Registry now focuses solely on storage operations (register, query, get, has). Callers validate tokens before registration using appropriate validators.
   - **Resolution Details**: See `.kiro/specs/architecture-separation-of-concerns/completion/task-3-parent-completion.md`

**Correct Pattern Documented**:

**ThreeTierValidator** (Issue #015 - Not an Issue):
- Orchestrates multiple validators (PassValidator, WarningValidator, ErrorValidator)
- Delegates validation to specialized validators
- Composes results without duplicating validation logic
- **Example**: Demonstrates proper separation - orchestrator coordinates, validators validate

**Resolution Cross-References**:
- **Spec**: `.kiro/specs/architecture-separation-of-concerns/`
- **Requirements**: `.kiro/specs/architecture-separation-of-concerns/requirements.md`
- **Design**: `.kiro/specs/architecture-separation-of-concerns/design.md`
- **Tasks**: `.kiro/specs/architecture-separation-of-concerns/tasks.md`
- **Task 2 Completion** (TokenFileGenerator): `.kiro/specs/architecture-separation-of-concerns/completion/task-2-parent-completion.md`
- **Task 3 Completion** (Registries): `.kiro/specs/architecture-separation-of-concerns/completion/task-3-parent-completion.md`
- **Task 3.7 Completion** (Async Validator Investigation): `.kiro/specs/architecture-separation-of-concerns/completion/task-3-7-completion.md`

**Pattern Analysis**:

The common violation pattern is components performing validation during their primary operation:
- Generator validates during generation
- Registries validate during registration
- Validation logic duplicated across components

This creates:
- Duplicate validation logic in multiple places
- Inconsistent validation rules possible
- Mixed responsibilities complicate testing
- Tight coupling between components
- Maintenance burden when validation rules change

### Interface Contracts

**Well-Defined Interfaces**:

1. **Provider Interfaces**:
   - FormatProvider: Well-defined with abstract base class enforcement
   - UnitProvider: Well-defined with abstract base class enforcement
   - PathProvider: Well-defined with abstract base class enforcement
   - **Strength**: Abstract base classes enforce implementation of required methods

2. **Build System Interface**:
   - IBuildSystemIntegration: Properly defined with clear contract
   - BuildSystemIntegration class implements interface correctly
   - **Strength**: Methods properly typed and documented

**Critical Gaps**:

1. **Validator System Lacks Common Interface** (Issue #016):
   - No IValidator or BaseValidator interface
   - PassValidator, WarningValidator, ErrorValidator are independent classes
   - ThreeTierValidator orchestrates validators without common interface
   - **Impact**: Cannot add new validators without modifying ThreeTierValidator, no contract enforcement
   - **Note**: IValidator interface created by architecture-separation-of-concerns spec (Task 1), but issue remains ACTIVE pending full integration

2. **Registry System Lacks Common Interface** (Issue #017):
   - No IRegistry or ITokenRegistry interface
   - PrimitiveTokenRegistry and SemanticTokenRegistry have different method signatures
   - Cannot work with registries polymorphically
   - **Impact**: Cannot abstract over registry type, difficult to add new registry types
   - **Note**: IRegistry interface created by architecture-separation-of-concerns spec (Task 1), but issue remains ACTIVE pending full integration

**Enforcement Analysis**:

**Strong Enforcement**:
- Provider interfaces use abstract base classes with abstract methods
- TypeScript compiler enforces implementation of abstract methods
- Platform-specific implementations must implement all required methods

**Weak Enforcement**:
- Validator system has no interface to enforce
- Registry system has no interface to enforce
- Components can be used without implementing common contract

### Code Organization

**Strengths**:
- Clear module separation (providers, validators, tokens, resolvers, etc.)
- Most modules provide barrel exports through index.ts files
- Test colocation with source code in __tests__ subdirectories
- Platform-specific files follow consistent naming patterns (platform prefix + function suffix)

**Minor Issues**:

1. **Missing Index File** (Issue #018):
   - `src/registries/` directory lacks index.ts file
   - Creates inconsistent import patterns
   - **Impact**: Registries must be imported directly from files rather than through module-level export

2. **Test Directory Organization** (Issue #019):
   - Mixed pattern: module-level __tests__ vs top-level src/__tests__
   - Top-level contains integration and performance tests
   - Some modules have nested __tests__ at multiple levels
   - **Impact**: Ambiguity about where tests should be placed

3. **Validator File Naming** (Issue #020):
   - Inconsistent suffixes: "Validator" vs "Handler" vs descriptive names
   - Examples: BaselineGridValidator, PlatformConstraintHandler, ValidationReasoning, ToleranceCalculator
   - **Impact**: Difficult to identify validator files by naming pattern

---

## Discovered Issues

Issues discovered during this audit (see Issues Registry for full details):

### Critical Issues

- **Issue #010**: Z-Index Token Handling Inconsistency Across Platforms
  - iOS scales down by 100, Web uses direct values, Android undocumented
  - Violates cross-platform consistency principle
  - Affects layering token generation across all platforms

### Important Issues

- **Issue #008**: Format Generator Constructor Inconsistency Across Platforms
  - iOS has no constructor, Android/Web support format selection
  - Prevents polymorphic instantiation

- **Issue #009**: Platform-Specific Method Naming Inconsistency
  - Different prefixes (Swift/Kotlin/CSS) for equivalent methods
  - Makes cross-platform understanding difficult

- **Issue #012**: TokenFileGenerator Performs Validation Logic - ✅ **RESOLVED**
  - Generator validates during generation
  - Duplicates validation logic from validators
  - **Resolution**: Validation logic removed, callers validate before generation

- **Issue #013**: PrimitiveTokenRegistry Performs Validation - ✅ **RESOLVED**
  - Registry validates during registration
  - Couples storage with validation
  - **Resolution**: Validation logic removed, callers validate before registration

- **Issue #014**: SemanticTokenRegistry Performs Validation - ✅ **RESOLVED**
  - Registry validates during registration
  - Duplicates validation logic
  - **Resolution**: Validation logic removed, callers validate before registration

- **Issue #016**: Validator System Lacks Common Interface
  - No IValidator interface for validation system
  - Prevents polymorphic validator usage
  - **Note**: IValidator interface created by architecture-separation-of-concerns spec (Task 1)

- **Issue #017**: Registry System Lacks Common Interface
  - No IRegistry interface for registry system
  - Prevents polymorphic registry usage
  - **Note**: IRegistry interface created by architecture-separation-of-concerns spec (Task 1)

### Minor Issues

- **Issue #011**: Opacity/Alpha Terminology Inconsistency
  - iOS/Web use "opacity", Android uses "alpha"
  - Terminology confusion for same concept

- **Issue #018**: Missing Index File in Registries Module
  - Inconsistent import patterns
  - Registries lack barrel export

- **Issue #019**: Test Directory Organization Inconsistency
  - Mixed pattern of test directory placement
  - Ambiguity about test location

- **Issue #020**: Validator File Naming Suffix Inconsistency
  - Inconsistent naming patterns for validators
  - Difficult to identify validator files

### Not Issues (Documented for Clarity)

- **Issue #015**: ThreeTierValidator Orchestrates Multiple Validators
  - Correct orchestration pattern
  - Demonstrates proper separation of concerns
  - Documented to clarify orchestration vs mixed responsibilities

---

## Reclassified Items (Investigation Results)

**Investigation Date**: November 8, 2025
**Investigator**: Kiro AI Agent + Peter Michaels Allen
**Methodology**: Reviewed original design specs, implementation code, and design rationale

The following items were initially flagged as inconsistencies during the architecture audit. Subsequent investigation revealed they are **intentional platform-appropriate design decisions**, not issues requiring fixes. These items have been reclassified and are documented here to prevent future misidentification.

### Platform-Appropriate Design Decisions

**Issue #008 - Constructor Inconsistency**:
- **Initial Classification**: Important - Constructor patterns differ across platforms
- **Reclassified As**: Not an issue - Intentional design
- **Rationale**: iOS has no constructor because it only supports one output format (Swift). Android and Web have constructors because they support multiple output formats (Kotlin/XML for Android, CSS/JavaScript for Web). Constructors are only needed when format selection is required.
- **Investigation**: Reviewed `.kiro/specs/cross-platform-build-system/design.md` and `.kiro/specs/semantic-token-generation/design.md`
- **Evidence**: 
  - iOS: `readonly formats: OutputFormat[] = ['swift']` - Single format, no constructor needed
  - Android: `readonly formats: OutputFormat[] = ['kotlin', 'xml']` - Multiple formats, constructor for selection
  - Web: `readonly formats: OutputFormat[] = ['css', 'javascript']` - Multiple formats, constructor for selection
- **Resolution**: Documented in Platform Conventions Guide
- **True Native Architecture**: Respects platform-specific needs rather than forcing artificial uniformity

**Issue #009 - Method Naming Inconsistency**:
- **Initial Classification**: Important - Platform-specific method names for equivalent functionality
- **Reclassified As**: Not an issue - Intentional design
- **Rationale**: Method names are platform-specific (`getSwiftType()`, `getKotlinType()`) because they return platform-specific types. iOS returns Swift types (`CGFloat`, `UIColor`, `UIFont.Weight`), Android returns Kotlin types (`Float`, `Color`, `Int`). Web doesn't need this method because it has a simpler type system (numbers/strings). The method names communicate WHAT they return.
- **Investigation**: Reviewed platform generator implementations in `src/providers/`
- **Evidence**:
  - iOS `getSwiftType()`: Returns `'CGFloat' | 'UIColor' | 'UIFont.Weight' | 'String'`
  - Android `getKotlinType()`: Returns `'Float' | 'Color' | 'Int' | 'String'`
  - Web: No type method needed - inline handling for simple type system
- **Resolution**: Documented in Platform Conventions Guide
- **True Native Architecture**: Method names reflect platform-specific type systems

**Issue #010 - Z-Index Handling Inconsistency**:
- **Initial Classification**: Critical - Z-index scaling differs across platforms
- **Reclassified As**: Not an issue - Intentional design
- **Rationale**: Z-index scaling is intentional to match platform conventions. Web uses values like 100/200/300 (standard CSS z-index convention), iOS scales down by 100 to get 1/2/3 (SwiftUI layering convention). This respects platform-native layering patterns rather than forcing artificial consistency.
- **Investigation**: Reviewed `.kiro/specs/layering-token-system/design.md`
- **Evidence**: Design document explicitly states: "For z-index tokens, scale down values (divide by 100) for SwiftUI conventions. Web uses 100, 200, 300... but iOS uses 1, 2, 3..."
- **Code Comment**: `src/providers/iOSFormatGenerator.ts` lines 24-27 document this intentional scaling
- **Resolution**: Documented in Platform Conventions Guide
- **True Native Architecture**: Respects platform-native layering conventions

**Issue #011 - Opacity/Alpha Terminology**:
- **Initial Classification**: Minor - Terminology inconsistency for same concept
- **Reclassified As**: Not an issue - Intentional design
- **Rationale**: Terminology matches platform API conventions. iOS and Web use "opacity" because that's what their APIs use (CSS `opacity` property, SwiftUI `.opacity()` modifier). Android uses "alpha" because that's what Compose uses (`Modifier.alpha()`, `Color.copy(alpha = ...)`). This ensures generated code matches platform documentation and developer expectations.
- **Investigation**: Reviewed `.kiro/specs/opacity-tokens/design.md`
- **Evidence**:
  - Web: `opacity: 0.48;` (CSS property name)
  - iOS: `.opacity(0.48)` (SwiftUI modifier name)
  - Android: `Modifier.alpha(0.48f)` (Compose modifier name)
- **Resolution**: Documented in Platform Conventions Guide
- **True Native Architecture**: Matches platform API terminology

### Lessons Learned from Investigation

**Pattern Recognition**: Platform differences that appear as "inconsistencies" may actually be intentional platform-appropriate design. True Native Architecture respects platform conventions rather than forcing artificial uniformity.

**Investigation Value**: Investigating before "fixing" prevented introducing actual problems by undoing intentional design decisions. All four items would have broken the system if "fixed" to be uniform.

**Documentation Need**: Implicit design decisions should be made explicit through documentation to prevent future misidentification as issues. The Platform Conventions Guide now documents these design decisions with rationale.

**Audit Process Success**: The audit successfully identified items that appeared inconsistent. The investigation process successfully determined which were real issues vs intentional design. Both processes worked as intended.

**True Native Architecture Principle**: The system correctly prioritizes platform-appropriate design over artificial consistency. This is a feature, not a bug. Cross-platform consistency is achieved through mathematical foundations and token values, not through forcing identical implementation patterns.

---

## Cross-Area Issues Affecting This Area

No issues discovered by other audits affect the architecture area.

---

## Platform Implementation Comparison Matrix

A comprehensive side-by-side comparison of platform implementations has been created:

**Location**: `.kiro/audits/platform-implementation-comparison-matrix.md`

**Contents**:
- Format Generator Comparison (class structure, core methods, platform-specific methods, semantic token methods, opacity/alpha methods, special token handling)
- Unit Converter Comparison (class structure, core methods, unit mapping, platform-specific methods)
- Color Resolver Comparison (class structure, core methods, mode/theme handling)
- File Organizer Comparison (class structure, core methods, directory structure, build system integration, naming conventions)
- Builder Pattern Consistency (none found)
- Validator Pattern Consistency (mixed into components)
- Generator Pattern Consistency (consistent across platforms)

**Key Findings from Matrix**:
- 10 inconsistencies identified across platforms
- 3 critical inconsistencies (constructor, z-index, color resolver approaches)
- 4 important inconsistencies (method naming, opacity/alpha, unit converter config, directory structure)
- 3 minor inconsistencies (naming conventions, build system integration, special token handling)

---

## Architectural Observations

### Pattern Usage

**Generator Pattern**: ✅ Consistently used across all platforms
- All format generators extend BaseFormatProvider
- All unit converters extend BaseUnitProvider
- All file organizers extend BasePathProvider
- Pattern provides good foundation for platform-specific implementations

**Builder Pattern**: ❌ Not used
- No builder classes found in codebase
- Direct instantiation with optional constructor parameters
- Consistent across all platforms (none use builder pattern)

**Validator Pattern**: ⚠️ Inconsistently applied
- Validation logic mixed into generators and registries
- No common validator interface
- ThreeTierValidator demonstrates correct orchestration pattern
- Separation of concerns violated in multiple components

### Architectural Strengths

1. **Base Class Inheritance**:
   - Strong use of abstract base classes for providers
   - Enforces implementation of required methods
   - Provides consistent foundation across platforms

2. **Generator Pattern Consistency**:
   - All platforms use generator pattern consistently
   - Clear separation between platform-specific and shared logic
   - Extensible for new platforms

3. **Semantic Token Formatting**:
   - Consistent methods across platforms
   - `formatSingleReferenceToken()` and `formatMultiReferenceToken()` implemented uniformly
   - Good foundation for semantic token generation

### Architectural Weaknesses

1. **Interface Gaps**:
   - Validator system lacks common interface
   - Registry system lacks common interface
   - Prevents polymorphic usage and extensibility

2. **Validation Logic Duplication**:
   - Validation logic in generators, registries, and validators
   - Potential for inconsistency
   - Maintenance burden

3. **Platform Inconsistencies**:
   - Constructor patterns differ
   - Method naming differs
   - Special token handling differs
   - Creates complexity in cross-platform development

4. **Code Organization**:
   - Minor inconsistencies in file naming
   - Test directory organization unclear
   - Missing index files in some modules

---

## Recommendations for Next Steps

### High Priority

1. **Standardize Z-Index Handling** (Issue #010):
   - Document platform-specific conventions
   - Create clear guidance for layering token values
   - Consider platform-specific token definitions if needed

2. **Extract Validation Logic** (Issues #012, #013, #014):
   - Remove validation from TokenFileGenerator
   - Remove validation from PrimitiveTokenRegistry
   - Remove validation from SemanticTokenRegistry
   - Centralize validation in validator classes
   - Validate before generation/registration, not during

3. **Create Common Interfaces** (Issues #016, #017):
   - Define IValidator interface for validation system
   - Define IRegistry interface for registry system
   - Refactor existing validators and registries to implement interfaces
   - Enable polymorphic usage and extensibility

### Medium Priority

4. **Standardize Format Generator Constructors** (Issue #008):
   - Add format selection support to iOS generator
   - Ensure consistent initialization patterns across platforms
   - Enable polymorphic instantiation

5. **Standardize Method Naming** (Issue #009):
   - Use consistent method naming patterns across platforms
   - Consider platform-agnostic names (e.g., `getPlatformType()` instead of `getSwiftType()`)
   - Document equivalent methods across platforms

6. **Unify Opacity/Alpha Terminology** (Issue #011):
   - Choose one term (recommend "opacity" as CSS standard)
   - Update Android methods to use "opacity" terminology
   - Update documentation to reflect consistent terminology

### Low Priority

7. **Add Missing Index Files** (Issue #018):
   - Create index.ts for registries module
   - Ensure consistent barrel export pattern

8. **Clarify Test Organization** (Issue #019):
   - Document test directory organization guidelines
   - Clarify when to use module-level vs top-level tests
   - Consider standardizing on one pattern

9. **Standardize Validator Naming** (Issue #020):
   - Use consistent "Validator" suffix for all validators
   - Rename PlatformConstraintHandler to PlatformConstraintValidator
   - Update ValidationReasoning and ToleranceCalculator if they perform validation

---

## Quality Assessment

### Compliance with Architectural Principles

**Separation of Concerns**: ⚠️ Partially Compliant
- Generator pattern properly separates platform-specific logic
- Validation logic mixed into generators and registries (violations)
- ThreeTierValidator demonstrates correct orchestration pattern

**Interface Consistency**: ⚠️ Partially Compliant
- Provider interfaces well-defined and enforced
- Validator and registry systems lack interfaces (critical gaps)
- Platform implementations have inconsistencies despite shared interfaces

**Code Organization**: ✅ Mostly Compliant
- Clear module separation
- Consistent directory structure
- Minor inconsistencies in file naming and test organization

**Cross-Platform Consistency**: ⚠️ Partially Compliant
- Generator pattern consistent across platforms
- Constructor patterns inconsistent
- Method naming inconsistent
- Special token handling inconsistent (z-index critical issue)

### Impact on Development

**Positive Impacts**:
- Generator pattern provides good foundation for platform-specific implementations
- Base class inheritance enforces required method implementation
- Clear module separation aids code navigation

**Negative Impacts**:
- Validation logic duplication creates maintenance burden
- Platform inconsistencies complicate cross-platform development
- Missing interfaces prevent polymorphic usage
- Code organization inconsistencies create confusion

### Technical Debt Assessment

**High Priority Debt**:
- Validation logic duplication (Issues #012, #013, #014)
- Missing validator interface (Issue #016)
- Missing registry interface (Issue #017)
- Z-index handling inconsistency (Issue #010)

**Medium Priority Debt**:
- Constructor inconsistency (Issue #008)
- Method naming inconsistency (Issue #009)
- Opacity/alpha terminology (Issue #011)

**Low Priority Debt**:
- Missing index files (Issue #018)
- Test organization (Issue #019)
- Validator naming (Issue #020)

---

## Conclusion

The Phase 1 architecture audit revealed a system with strong foundational patterns (generator pattern, base class inheritance) but significant issues in separation of concerns and interface definitions. The most critical findings are:

1. **Validation logic duplication**: Three components (generator, two registries) perform validation that should be delegated to validators
2. **Missing interfaces**: Validator and registry systems lack common interfaces, preventing polymorphic usage
3. **Platform inconsistencies**: Constructor patterns, method naming, and special token handling differ across platforms
4. **Z-index handling**: Critical cross-platform inconsistency in layering token values

These issues create technical debt that should be addressed before building additional features on top of the Phase 1 foundation. The separation of concerns violations are particularly concerning as they create maintenance burden and potential for inconsistency.

The audit successfully identified and documented all architectural issues, providing a foundation for future fix specs and architectural improvements. The comparison matrix provides a comprehensive reference for understanding platform implementation patterns and identifying areas for standardization.

---

**Organization**: audit-findings
**Scope**: phase-1-discovery-audit

*This architecture discovery report completes Task 3 of the Phase 1 Discovery Audit, providing comprehensive analysis of architectural patterns, inconsistencies, and violations across all Phase 1 implementations.*
