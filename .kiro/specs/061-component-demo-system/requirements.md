# Requirements Document: Component Demo System

**Date**: January 2026
**Spec**: 061 - Component Demo System
**Status**: Requirements Phase
**Dependencies**:
- Spec 028 (Web Component Browser Distribution) - Complete
- Spec 034 (Component Architecture System) - Complete

---

## Introduction

DesignerPunk currently has 30 web component families across 8 categories (Avatar, Badge, Button, Chip, Container, Icon, Input, Progress), but only 3 ad-hoc demo HTML files exist in `dist/browser/` (avatar-demo.html, badge-demo.html, checkbox-demo.html). These demos were created manually with no standardized structure, no central index, and no integration with the build pipeline.

The Component Demo System establishes a standardized approach for creating, organizing, and serving demo pages for all component families. It provides a central index page for navigation, a consistent demo page template, and clear instructions for running demos locally. The goal is to make it easy for developers and designers to visually verify component behavior, explore variants, and understand usage patterns.

---

## Glossary

- **Demo_Page**: A standalone HTML file that demonstrates all variants, states, and usage patterns of a single component family using live web components
- **Demo_Index**: A central HTML page that lists all available component demos with navigation links, organized by component category
- **Demo_Template**: A standardized HTML structure and CSS styling pattern that all demo pages follow for visual consistency
- **Component_Family**: A group of related components sharing a common base (e.g., Badge family includes Badge-Label-Base, Badge-Count-Base, Badge-Count-Notification)
- **Component_Category**: A top-level grouping of component families by function (Avatar, Badge, Button, Chip, Container, Icon, Input, Progress)
- **Demo_Server**: A local HTTP server used to serve demo files during development, avoiding CORS issues with file:// protocol
- **Token_CSS**: The `tokens.css` file containing CSS custom properties required for component styling
- **Browser_Bundle**: The ESM or UMD JavaScript bundle that registers all web components for browser use

---

## Requirements

### Requirement 1: Demo Index Page

**User Story:** As a developer, I want a central index page listing all component demos, so that I can quickly navigate to any component demo.

#### Acceptance Criteria

1. THE Demo_Index SHALL display all available component demos organized by Component_Category
2. WHEN a user clicks a demo link on the Demo_Index, THE Demo_Index SHALL navigate to the corresponding Demo_Page
3. THE Demo_Index SHALL display the component family name and a brief description for each demo entry
4. THE Demo_Index SHALL load Token_CSS and Browser_Bundle so that component previews render correctly
5. WHEN a new Demo_Page is added to the demos directory, THE Demo_Index SHALL include a link to the new demo after the index is updated

### Requirement 2: Standardized Demo Page Template

**User Story:** As a developer, I want all demo pages to follow a consistent structure, so that I can quickly find information about any component.

#### Acceptance Criteria

1. THE Demo_Template SHALL include a page title identifying the component family name
2. THE Demo_Template SHALL include sections for each variant, state, and size of the component
3. THE Demo_Template SHALL include a section showing interactive states (hover, focus, active) where applicable
4. THE Demo_Template SHALL include a token verification section listing relevant CSS custom properties
5. THE Demo_Template SHALL include HTML and JavaScript usage examples
6. THE Demo_Template SHALL load Token_CSS in the document head and Browser_Bundle via a script tag
7. THE Demo_Template SHALL use CSS logical properties for layout spacing per project standards

### Requirement 3: Demo Pages for All Component Families

**User Story:** As a developer, I want demo pages for every component family, so that I can visually verify and explore all components in the design system.

#### Acceptance Criteria

1. THE Demo_System SHALL provide a Demo_Page for each Component_Family that has a web platform implementation
2. WHEN a component family contains multiple related components, THE Demo_Page SHALL demonstrate all components within that family
3. THE Demo_Page SHALL demonstrate all documented props, variants, sizes, and states for each component
4. THE Demo_Page SHALL demonstrate accessibility features including ARIA attributes and keyboard interaction where applicable
5. IF a component supports event handling, THEN THE Demo_Page SHALL include interactive examples with visible event output

### Requirement 4: Demo File Organization

**User Story:** As a developer, I want demo files organized in a predictable location, so that I can find and manage them easily.

#### Acceptance Criteria

1. THE Demo_System SHALL store all demo HTML files in a dedicated `demos/` source directory
2. THE Demo_System SHALL use a consistent naming convention of `{component-family-name}-demo.html` for demo files
3. THE Demo_System SHALL copy demo files to `dist/browser/` as part of the build process
4. WHEN the build process runs, THE Demo_System SHALL copy the Demo_Index and all Demo_Pages to the output directory alongside the Browser_Bundle and Token_CSS

### Requirement 5: Local Development Server Instructions

**User Story:** As a developer, I want clear instructions for running demos locally, so that I can view and test components without deployment.

#### Acceptance Criteria

1. THE Demo_System SHALL include a README documenting how to build and serve demos locally, following the patterns established in the Browser Distribution Guide
2. THE README SHALL document the command to build browser bundles including demo files
3. THE README SHALL document at least one method to start a Demo_Server for local viewing
4. THE README SHALL document the URL to access the Demo_Index after starting the server
5. IF a developer opens a demo file directly via file:// protocol, THEN THE Demo_Page SHALL display a notice explaining that a local server is required for full functionality

### Requirement 6: Demo Visual Consistency

**User Story:** As a developer, I want demos to have a consistent visual style, so that the demo experience feels cohesive across all component families.

#### Acceptance Criteria

1. THE Demo_Template SHALL use a shared CSS stylesheet for demo page layout and typography
2. THE Demo_Template SHALL use DesignerPunk design tokens with a dark background theme
3. THE Demo_Template SHALL use consistent heading hierarchy, section spacing, and code block styling across all Demo_Pages
4. THE Demo_Template SHALL render correctly on viewport widths from 320px to 1920px

### Requirement 7: Existing Demo Migration

**User Story:** As a developer, I want existing demo files migrated to the new system, so that all demos follow the same standard.

#### Acceptance Criteria

1. WHEN the Demo_System is implemented, THE existing avatar-demo.html SHALL be migrated to follow the Demo_Template
2. WHEN the Demo_System is implemented, THE existing badge-demo.html SHALL be migrated to follow the Demo_Template
3. WHEN the Demo_System is implemented, THE existing checkbox-demo.html SHALL be migrated to follow the Demo_Template
4. THE migrated Demo_Pages SHALL preserve all existing demo content and interactive examples

### Requirement 8: Demo Creation Documentation

**User Story:** As a developer, I want documentation on how to create new demo pages, so that I can add demos for new component families.

#### Acceptance Criteria

1. THE Demo_System SHALL provide a README documenting the Demo_Template structure and required sections
2. THE README SHALL document how to add a new Demo_Page to the system (file naming, location, index update)
3. THE README SHALL document how to test a demo locally before committing
4. THE README SHALL include a minimal example of a Demo_Page following the template
