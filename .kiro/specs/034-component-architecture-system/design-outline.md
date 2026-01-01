# Component Architecture System - Design Outline

**Date**: 2025-12-31
**Purpose**: Evolve from individual components to cohesive component architecture
**Organization**: spec-guide
**Scope**: 034-component-architecture-system

## Current State Analysis

### What We Have (Strengths)
- **Solid Token Foundation**: Mathematical token system with semantic/primitive hierarchy
- **True Native Architecture**: Platform-specific implementations (web/iOS/Android)
- **Individual Component Quality**: Well-implemented components with proper accessibility
- **Theme-Aware Utilities**: Blend utilities for consistent state styling
- **Cross-Platform Consistency**: Same component APIs across platforms

### What We're Missing (The Gap)
- **Component Relationships**: No clear patterns for how components work together
- **Composition Patterns**: Limited guidance on combining components
- **System-Level Consistency**: Each component solves similar problems independently
- **Implementation Streamlining**: Developers recreate patterns instead of reusing them

### Recent Demo Findings (Critical Issues)
- **Token Usage Inconsistency**: Components not using tokens, fallbacks, inline styles
- **Foundation Integration Gaps**: Components developed without full system foundation leverage
- **Cross-Platform Uncertainty**: Unknown state of iOS/Android implementations
- **Quality Control**: Mixed results in first iteration demo

## Phase 2 Vision: Component Architecture

### The Stemma System

**Stemma System**: The foundational principles and architecture that govern our component system, complementing the Rosetta System's mathematical token foundation with relational component foundation.

**Core Stemma Principles**:
- **Family Inheritance Patterns**: Components inherit behaviors and properties from family ancestors (Input-Email inherits from Input-Text)
- **Behavioral Contracts**: Each component guarantees consistent behaviors across platforms (focusable, validatable, etc.)
- **Composition Relationships**: Systematic patterns for how components work together (Login Form, Feed Post, etc.)
- **Cross-Platform Behavioral Consistency**: Same component concept with platform-appropriate implementations

**Stemma System Governance**:
- "This component follows Stemma System principles"
- "Make sure the inheritance aligns with the Stemma System"
- "The Stemma System ensures behavioral consistency across platforms"

**Rosetta + Stemma Integration**:
- **Rosetta System**: Mathematical relationships and token hierarchy (how things look and scale)
- **Stemma System**: Family relationships and component hierarchy (how things behave and relate)
- Together: Complete design system foundation covering both visual consistency (Rosetta) and behavioral consistency (Stemma)

### Core Architectural Insights

**Cross-Platform API Approach**: 
- Define component structure as platform-agnostic API contracts
- Similar to token system: foundational organization that translates to platform implementations
- NOT code-sharing (React/React Native), but conceptual consistency

**Component Hierarchy (Token-Inspired)**:
```
Primitive Component Family
├── Primitive Components (foundational behaviors)
└── Semantic Components (composed, purpose-driven)
    └── Variants (specific implementations)
```

### Proposed Component Families

**1. Buttons Family**
- Primitive: Button (core interaction patterns)
- Semantic: CTA, ButtonIcon, ButtonShare, ButtonMedia
- Variants: Primary/Secondary/Tertiary styles
- Override Example: Hover states vary by context (CTA: 12% darker, Media: opacity/color shift)

**2. Form Inputs Family**
- Primitive: Input-Text-Base (text input fundamentals)
- Semantic: Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber
- Variants: Validation states, formatting patterns

**3. Containers Family** 
- Primitive: PD-Container (layout fundamentals)
- Semantic: Simple, Cards, Notifications, Banners
- Variants: Size, elevation, purpose variants
- Override Example: Hover states (4% darker for containers vs. buttons)

**4. Modals Family**
- Primitive: Modal (overlay fundamentals)
- Semantic: Dialog, Drawer, Popover, Tooltip

**5. Avatars Family**
- Primitive: Avatar (identity representation)
- Semantic: AvatarUser, AvatarGroup, AvatarPlaceholder

**6. Badges & Tags Family**
- Primitive: Badge (status/label fundamentals)
- Semantic: StatusBadge, CountBadge, Tag, Chip

**7. Data Displays Family**
- Primitive: DataDisplay (information presentation)
- Semantic: Table, List, Grid, Chart

**8. Dividers Family**
- Primitive: Divider (separation fundamentals)
- Semantic: LineDivider, SpaceDivider, SectionDivider

**9. Loading Family**
- Primitive: Loading (progress indication)
- Semantic: Spinner, ProgressBar, Skeleton, PulseLoader

**10. Navigation Family**
- Primitive: Navigation (wayfinding fundamentals)
- Semantic: TabBar, Breadcrumb, Pagination, Menu

### Component Architecture Focus (Structure Over Style)

**Key Insight**: Tokens (Rosetta System) already handle systematic style variation. Component architecture (Stemma System) should focus on relationships, contracts, and property structures.

**Stemma System Responsibilities**:
- **Relationships**: How components inherit and compose (Input-Email extends Input-Text)
- **Contracts**: What behaviors and properties each component guarantees
- **Property Structures**: Required vs. optional properties, valid values, inheritance patterns
- **Cross-Platform Consistency**: Behavioral contracts that work across web/iOS/Android

**Rosetta System Responsibilities** (Already Solved):
- **Visual Styling**: How components look and feel
- **Mathematical Relationships**: Systematic style variation (4% vs. 12% darker)
- **Context-Aware Styling**: Adaptive styling based on usage context
- **Style Override Mechanisms**: Semantic and component tokens for variation

### Structural Schema Format (Stemma System Implementation)

**Focus on Behavior and Relationships**:
```yaml
Input-Text-Base:
  type: primitive
  family: FormInputs
  behaviors: [focusable, validatable, float-label]
  properties:
    label: string (required)
    value: string
    placeholder: string
    disabled: boolean
  contracts:
    - provides_float_label_animation
    - validates_on_blur
    - supports_error_states
  tokens: [typography.input.*, color.*, space.*, motion.float-label.*]

Input-Text-Email:
  type: semantic
  family: FormInputs
  inherits: Input-Text-Base
  extends:
    validation: email_format
    autocomplete: email
    properties:
      type: "email" (fixed)
  contracts:
    - validates_email_format
    - provides_email_autocomplete
    - inherits_all_input_text_base_contracts
```

**Stemma System Behavior Composition Pattern**:
- Define reusable behaviors (Focusable, Pressable, Validatable, FloatLabel)
- Components compose behaviors they need
- Each behavior defines its contract and property requirements
- Rosetta System tokens handle all visual aspects of behavior implementation

### Industry Examples to Study
- **Spotify**: Component composition and relationship patterns
- **Atlassian**: Design token integration with component architecture
- **Google Material**: Component system relationships and guidelines

## Component Lifecycle & Problem Analysis

### Three Critical Events

**1. Component Creation**
- Initial component development
- Foundation integration decisions
- Cross-platform implementation consistency

**2. Component Usage** 
- Developers leveraging components in projects
- Component selection and configuration
- Integration with other components

**3. Component Maintenance**
- Updates during system evolution
- Token changes and component adaptation
- Cross-platform synchronization

### Problem Categories

**A. Event-Specific Problems**

*Component Creation:*
- Token usage inconsistency during development
- Missing foundation integration patterns
- Cross-platform implementation gaps

*Component Usage:*
- Unclear component selection guidance
- Integration pattern uncertainty
- Composition relationship confusion

*Component Maintenance:*
- Token updates breaking components
- Cross-platform drift over time
- System evolution coordination

**B. Shared Problems (2+ Events)**

*Creation + Usage:*
- Lack of systematic component organization
- Missing behavioral contracts/APIs
- Inconsistent override mechanisms

*Creation + Maintenance:*
- No systematic validation of foundation usage
- Missing health guardrails for quality control
- Inadequate cross-platform consistency checks

*Usage + Maintenance:*
- Component relationship documentation gaps
- Missing guidance at point of consumption
- Unclear update impact on existing usage

*All Three Events:*
- Need for "health guardrails" throughout lifecycle
- MCP documentation integration opportunities
- Point-of-consumption guidance systems

### Health Guardrails Philosophy

**"Guidance at point of consumption rather than checkpoints"**

**Dual Mechanism Approach**:
- **IDE Linting (Real-time)**: Static analysis rules that validate component usage during development
  - Component naming convention validation
  - Token usage validation (catch inline styles, missing tokens)
  - Required property checks
  - Basic accessibility compliance
  - Immediate feedback as developers type
- **MCP Documentation (Contextual)**: Progressive disclosure documentation for deeper guidance
  - Component Quick Reference for routing to detailed docs
  - Family-specific MCP documents with behavioral contracts
  - Usage guidelines and composition patterns
  - AI agent guidance for systematic component discovery

**Why Both Mechanisms**:
- Linting catches structural issues immediately (wrong names, missing tokens)
- MCP provides contextual understanding (when to use which component, composition patterns)
- Together they provide comprehensive guidance without requiring separate validation checkpoints

**Component Templates**: Make correct usage easier by providing starting points that follow Stemma System patterns

### Emerging Solutions Framework

**Dual MCP Strategy** (Long-Term Vision):
- **Systems MCP**: Development and maintenance (current focus - extends designerpunk-docs)
- **Application MCP**: Product development tasks (future need - separate spec)

**Current Spec Scope**: This spec (034) focuses on extending the existing designerpunk-docs MCP server with component family documentation. This serves the Systems MCP use case. The Application MCP (focused on "which component should I use?") is deferred to a future spec once sufficient component families are implemented.

**Architectural Preparation**: Component documentation structure will be designed to support both use cases, enabling future Application MCP creation without retrofitting.

**AI Agent Guidance Principles**:
- **Remove Research Burden**: Pre-answer common questions
  - What tokens will I need?
  - How do I structure for token adaptability?
  - What are the accessibility considerations?
- **Reduce Guesswork**: Clear directions and planning
- **Point-of-Consumption Help**: Guidance when and where needed

**Intelligent Linting Vision**:
- **Component Property Awareness**: When typing `<button-cta>`, surface:
  - Required properties
  - Optional properties and values
  - Variant options (Primary, Secondary, Tertiary)
  - Supplemental options (icons, sizing)
- **Real-time Guidance**: Present options as developer types
- **Context-Aware Suggestions**: Based on usage patterns

**Cross-Platform API Concept**:
- **Component Property Schema**: Platform-agnostic component definitions
- **Behavioral Contracts**: Consistent behavior expectations
- **Token Integration Points**: Systematic foundation usage
- **Override Mechanisms**: Flexible but controlled customization

### Key Design Philosophy Questions

**Documentation Strategy**:
- **Creation vs. Usage**: "Why" matters when creating components, but may not when using them
- **Design Language Fluidity**: "Why" can change based on art direction, brand evolution, trends
- **Developer Experience**: Focus on "what" and "when" rather than "why" for component usage

**Usage-Focused Documentation**:
```yaml
ButtonMedia:
  use_when: "Button overlays media content (images, videos, backgrounds)"
  behavior: "High contrast state changes for visibility"
  not_when: "Standard UI backgrounds (use CTA instead)"
```

**vs. Creation-Focused Documentation**:
```yaml
ButtonMedia:
  why_created: "Brand wanted stronger visual hierarchy on hero sections"
  design_rationale: "Art director preference for dramatic state changes"
  trend_influence: "Following 2024 high-contrast interaction patterns"
```

### Scope Strategy: Structure + Selective Implementation

**Approach**: Build complete Stemma System structure (all 11 families) with selective full implementation. This creates the architectural foundation while focusing development effort on high-value components.

**Full Implementation (Phase 1)** - 3 Families:
- **Buttons Family**: ButtonCTA (exists) + structural placeholders for future variants
- **Form Inputs Family**: Input-Text-Base (TextInputField migration) + Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber
- **Containers Family**: PD-Container (exists) + structural placeholders for future variants

**Structural Placeholders (Phase 1)** - 8 Families:
- **Icons, Modals, Avatars, Badges & Tags, Data Displays, Dividers, Loading, Navigation**
- Component Quick Reference includes all families with routing paths
- MCP document paths defined, documents contain placeholder content
- Family inheritance structures documented conceptually
- Ready for organic development as designs become available

**Why This Scope**:
- Establishes complete architectural foundation without over-building
- Focuses implementation effort on families with existing components or immediate needs
- Placeholder families can be developed organically as designs become available
- Validates Stemma System patterns with real implementation before expanding

### AI-Optimal Component Naming Convention

**Stemma System Naming Philosophy**: Component names encode hierarchy and relationships for systematic AI agent discovery and usage.

**Pattern**: `[Family]-[Type]-[Variant]`
- **Input-Text-Base** (primitive base)
- **Input-Text-Email** (semantic - email validation)
- **Input-Text-Password** (semantic - secure input)
- **Input-Text-PhoneNumber** (semantic - phone formatting)

**AI Agent Benefits**:
- **Predictable naming**: AI can infer component names without documentation lookup
- **Self-documenting hierarchy**: Input-Text-Email clearly extends Input-Text-Base
- **Systematic discovery**: Type "Input-Text-" to see all text input variants
- **Clear primitive vs semantic distinction**: "Base" signals foundational component

**Future Optimization**: Compiler can generate developer-friendly aliases (Input-Email → Input-Text-Email) for production builds while maintaining AI-optimal development experience.

### Primitive vs Semantic Usage Philosophy

**Key Difference from Rosetta System**: Unlike tokens (avoid primitives), Stemma System primitives are legitimate and necessary for coverage gaps.

**Usage Hierarchy**:
1. **Prefer semantic components** when they exist (Input-Text-Email for email fields)
2. **Use primitive components** for coverage gaps (Input-Text-Base for address, city, state fields until Input-Text-Address exists)
3. **Create semantic components** when patterns become common enough to warrant specialized behavior

**Example**: Until we create Input-Text-Address, developers should use Input-Text-Base for address form fields. This is expected and correct Stemma System usage.

**Documentation Guidance**:
- **Token Quick Reference**: "Always use semantic tokens"
- **Component Quick Reference**: "Prefer semantic components, but primitive components are legitimate for coverage gaps"

### Minimum Viable + Scalable Architecture

**Phase 1: Foundation (Viable)**
1. **Component Schema Definition**
   - JSON/YAML schemas for existing components (ButtonCTA, TextInputField)
   - Complete family structure (all 11 families with inheritance patterns)
   - Property definitions, token requirements, behavioral contracts
   - Cross-platform consistency validation

2. **TextInputField → Input-Text-Base Migration**
   - Rename and restructure for Stemma System consistency
   - Code enhancements and token optimization
   - Cross-platform implementation improvements
   - Demo page update (only consumer of TextInputField)

3. **Form Inputs Family Implementation**
   - Input-Text-Base (primitive base from TextInputField)
   - Input-Text-Email (semantic - email validation)
   - Input-Text-Password (semantic - secure input)
   - Input-Text-PhoneNumber (semantic - phone formatting)

4. **Complete MCP Integration**
   - Component Quick Reference (routing table for all 11 families, ~1,600 tokens)
   - MCP documents for implemented families (detailed)
   - MCP documents for placeholder families (structural)
   - Component selection and usage patterns
   - Extends existing designerpunk-docs MCP server

5. **Basic Health Guardrails**
   - Token usage validation (catch inline styles, missing tokens)
   - Required property checks
   - Basic accessibility compliance
   - IDE linting rules for real-time feedback

6. **Future Family Spec Creation**
   - **035-avatars-family**: Requirements, design, and tasks for Avatars family implementation
   - **036-navigation-family**: Requirements, design, and tasks for Navigation family implementation
   - Specs leverage established Stemma System infrastructure and patterns
   - Informed by real-world implementation experience from Phase 1 families

**Phase 2: Organic Family Expansion**
- Implement additional families as designs become available
- Follow established Stemma System patterns
- Expand semantic components within existing families
- No architectural changes needed - structure already supports growth

**Phase 3: Advanced Optimization**
1. **Cross-Platform Synchronization**
   - Automated consistency checks across web/iOS/Android
   - Platform-specific implementation validation
   - Systematic update propagation

2. **Advanced Health Guardrails**
   - Predictive component suggestions
   - Automated accessibility auditing
   - Performance impact analysis

3. **Developer Experience Enhancements**
   - Compiler-generated component name aliases
   - Advanced IDE integration and auto-completion
   - Context-aware component suggestions

### Scalability Architecture Principles

**Modular Design**: Each phase builds on previous without breaking changes
**Schema-Driven**: Component definitions drive all tooling and documentation
**Platform-Agnostic Core**: Cross-platform API contracts with platform-specific implementations
**Incremental Enhancement**: Each component can be enhanced independently

### Refined Open Questions & Solutions

**1. Component Discovery**
- **Solution**: Component Quick Reference (similar to Token Quick Reference)
- **Approach**: Build organically as component families are developed
- **Benefit**: Minimal effort, natural discovery path, links to actual implementations

**2. Family Boundary Principles**
- **Shared Need Families**: Different purposes, same user need (Data Displays: tables, charts, lists)
- **Shared Purpose Families**: Same purpose, different implementations (Avatars: user, group, placeholder)
- **Principle**: Organize around user needs rather than just technical similarity

**3. Cross-Family Relationships & Component Types**
- **Pattern Families**: UI patterns (Buttons, Forms, Containers)
- **Infrastructure Families**: Asset/utility distribution (Icons, possibly others)
- **Composite Families**: Combinations of other families (Feed Post, Card layouts)
- **Atomic Design Principles**: Components combine to create larger components across families

**4. Cross-Platform Validation Process**
1. Develop components for all platforms (web/iOS/Android)
2. Review and refine Web implementation (fastest iteration)
3. Check if iOS/Android need similar refinements
4. Final cross-platform consistency review
- **Benefit**: Prevents "fix web, break everything else" cycle

### Migration Strategy
- **Current State**: TextInputField only used in demo page
- **Approach**: Simple rename and restructure - no complex migration needed
- **Demo Page Update**: Update demo page to use Input-Text-Base (single consumer)
- **Timing**: Perfect opportunity to establish correct patterns without legacy concerns

## Future Architecture: Dual MCP Strategy

### Vision Overview

The DesignerPunk documentation system will evolve into a **Dual MCP Strategy** with two complementary MCP servers serving different audiences and use cases:

**Systems MCP (Current Focus - Spec 034)**:
- **Purpose**: Development and maintenance of the design system itself
- **Audience**: System architects, component developers, design system maintainers
- **Content**: Stemma System principles, component schemas, behavioral contracts, family development standards
- **Server**: Extends existing `designerpunk-docs` MCP server
- **Scope**: This spec (034) implements Systems MCP infrastructure

**Application MCP (Future Work)**:
- **Purpose**: Product development using the design system
- **Audience**: Product developers, application teams, AI agents building products
- **Content**: Component usage patterns, composition recipes, integration guides, "how to build X" documentation
- **Server**: Separate MCP server optimized for product development queries
- **Scope**: Deferred to future spec (potentially 037 or later)

### Why Two MCP Servers?

**Different Query Patterns**:
- Systems MCP: "How do I create a new component family?" / "What are the behavioral contracts for Input-Text-Base?"
- Application MCP: "How do I build a login form?" / "What components do I need for a user profile card?"

**Different Documentation Needs**:
- Systems MCP: Deep architectural knowledge, schema definitions, validation rules
- Application MCP: Practical recipes, composition patterns, quick-start guides

**Optimized Context Loading**:
- Systems MCP: Loads architectural context for system development
- Application MCP: Loads usage context for product development

### Design Considerations for Future Application MCP

While Spec 034 focuses on Systems MCP, the documentation structure should support future Application MCP:

1. **Component Quick Reference**: Designed as routing table that can serve both MCP servers
2. **Composition Patterns**: Documented in a format that Application MCP can leverage
3. **Usage Guidelines**: Separated from architectural details for easy extraction
4. **Progressive Disclosure**: Same workflow pattern applicable to both servers

### Implementation Timeline

**Spec 034 (Current)**: Systems MCP infrastructure via designerpunk-docs extension
**Future Spec**: Application MCP server with product development focus
**Integration**: Both servers share Component Quick Reference as common entry point

**Application MCP Trigger Criteria**: Consider creating Application MCP spec when:
- 5+ component families are fully implemented (not just placeholders)
- Common composition patterns are validated through real usage
- Product development teams express need for "how to build X" documentation
- Systems MCP has stabilized and proven effective for system development

### Implementation Insights

**Component Quick Reference Strategy**:
- **Follow Token Quick Reference Pattern**: Proven structure with master overview, documentation map, common patterns, MCP examples
- **Routing Table Philosophy**: ~1,600 tokens for complete routing and examples - helps find right MCP document, not comprehensive reference itself
- **Documentation Map Format**: Table with Component Family | Shared Need/Purpose | MCP Document Path
- **Common Composition Patterns**: Real-world scenarios (Login Form, Feed Post) showing cross-family component usage
- **Individual Component Section Structure**: Overview, Primitive vs. Semantic breakdown, behavioral contracts, cross-platform usage, usage guidelines, related documentation
- **Build alongside component development for organic growth**
- **MCP Integration**: Extends existing MCP documentation server (designerpunk-docs) with component family documents

**Token Quick Reference Analysis**:
- **Purpose**: Routing table for documentation, not reference itself - helps find right MCP document
- **Documentation Map**: Clean table format with Token Type | Purpose | MCP Document Path
- **Common Patterns**: Real-world UI scenarios showing token combinations (Button, Card, Form Input, Modal, etc.)
- **MCP Query Examples**: Progressive disclosure workflow (summary → section → full document)
- **Workflow**: Start with Quick Reference → Query summary → Query sections → Full document only when needed
- **Token Count**: Efficient at ~1,600 tokens for complete routing and examples

**Proposed Component Quick Reference Structure**:
```markdown
# Component Quick Reference
## Purpose
[Component system overview and usage guidance]

## Component Documentation Map
| Component Family | Shared Need/Purpose | MCP Document Path |
| Buttons | User interaction and actions | `.kiro/steering/button-components.md` |
| Form Inputs | Data collection and validation | `.kiro/steering/form-input-components.md` |

## Common Composition Patterns
### Login Form
- Form Inputs: Input-Email, Input-Password
- Buttons: ButtonCTA (primary for submit)
- Containers: Simple container for layout

### Feed Post  
- Avatars: AvatarUser
- Buttons: ButtonIcon, ButtonMedia
- Data Displays: Text content, media display
```

**Family Organization Philosophy**:
- Families serve user needs first, technical similarity second
- Some components are infrastructure (Icons) vs. UI patterns (Buttons)
- Composite components can span multiple families

**Cross-Platform Development**:
- Web-first refinement leverages faster iteration cycles
- Systematic review process prevents platform drift
- Process refinement over complex tooling for validation

---

*This outline will evolve as we discuss ideas and refine our approach*