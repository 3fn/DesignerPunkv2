# Release Management System - Examples

**Date**: November 28, 2025  
**Purpose**: Example configurations and tutorials for different project types  
**Organization**: process-standard  
**Scope**: cross-project

---

## Overview

This directory contains example configurations, step-by-step tutorials, and integration examples for the Release Management System. Examples cover different project types, release strategies, and common scenarios.

## Directory Structure

```
examples/
├── README.md                           # This file
├── configurations/                     # Example configurations
│   ├── single-package.json            # Single package project
│   ├── monorepo-synchronized.json     # Monorepo with synchronized versions
│   ├── monorepo-independent.json      # Monorepo with independent versions
│   ├── ci-cd-github-actions.json      # CI/CD optimized configuration
│   └── development-dry-run.json       # Development with dry run
├── tutorials/                          # Step-by-step tutorials
│   ├── 01-first-release.md            # Setting up first release
│   ├── 02-patch-release.md            # Releasing a bug fix
│   ├── 03-minor-release.md            # Releasing a new feature
│   ├── 04-major-release.md            # Releasing breaking changes
│   ├── 05-multi-package.md            # Multi-package coordination
│   └── 06-ci-cd-integration.md        # CI/CD pipeline integration
└── integrations/                       # Integration examples
    ├── existing-project.md             # Integrating with existing project
    ├── github-actions.yml              # GitHub Actions workflow
    ├── gitlab-ci.yml                   # GitLab CI configuration
    └── migration-guide.md              # Migrating from other systems
```

## Quick Links

### Example Configurations

- [Single Package Project](./configurations/single-package.json) - Minimal configuration for single-package projects
- [Monorepo (Synchronized)](./configurations/monorepo-synchronized.json) - All packages share same version
- [Monorepo (Independent)](./configurations/monorepo-independent.json) - Packages have independent versions
- [CI/CD (GitHub Actions)](./configurations/ci-cd-github-actions.json) - Optimized for automated releases
- [Development (Dry Run)](./configurations/development-dry-run.json) - Safe testing configuration

### Tutorials

- [First Release](./tutorials/01-first-release.md) - Complete guide to your first release
- [Patch Release](./tutorials/02-patch-release.md) - Releasing bug fixes
- [Minor Release](./tutorials/03-minor-release.md) - Releasing new features
- [Major Release](./tutorials/04-major-release.md) - Releasing breaking changes
- [Multi-Package](./tutorials/05-multi-package.md) - Coordinating multiple packages
- [CI/CD Integration](./tutorials/06-ci-cd-integration.md) - Automating releases

### Integration Examples

- [Existing Project](./integrations/existing-project.md) - Add to existing project
- [GitHub Actions](./integrations/github-actions.yml) - Complete workflow example
- [GitLab CI](./integrations/gitlab-ci.yml) - GitLab pipeline example
- [Migration Guide](./integrations/migration-guide.md) - Migrate from other systems

## Getting Started

### 1. Choose Your Project Type

**Single Package:**
- One package.json
- Simple versioning
- Start with: [Single Package Configuration](./configurations/single-package.json)

**Monorepo (Synchronized):**
- Multiple packages
- All packages share same version
- Start with: [Monorepo Synchronized Configuration](./configurations/monorepo-synchronized.json)

**Monorepo (Independent):**
- Multiple packages
- Each package has independent version
- Start with: [Monorepo Independent Configuration](./configurations/monorepo-independent.json)

### 2. Follow the Tutorial

**First Time User:**
1. Read [First Release Tutorial](./tutorials/01-first-release.md)
2. Set up configuration
3. Execute first release
4. Verify on GitHub

**Experienced User:**
- Jump to specific scenario tutorial
- Adapt configuration examples
- Integrate with CI/CD

### 3. Integrate with Your Workflow

**Manual Releases:**
- Use CLI commands
- Review release plans
- Execute with confirmation

**Automated Releases:**
- Set up CI/CD integration
- Configure automatic triggers
- Monitor release pipeline

## Common Scenarios

### Scenario 1: Bug Fix Release

**Goal:** Release a patch version with bug fixes

**Steps:**
1. Complete bug fix work
2. Create completion document
3. Run: `npm run release:cli plan`
4. Verify patch bump (0.1.0 → 0.1.1)
5. Run: `npm run release:cli release auto`

**Tutorial:** [Patch Release](./tutorials/02-patch-release.md)

### Scenario 2: New Feature Release

**Goal:** Release a minor version with new features

**Steps:**
1. Complete feature implementation
2. Create spec completion document
3. Run: `npm run release:cli plan`
4. Verify minor bump (0.1.0 → 0.2.0)
5. Run: `npm run release:cli release auto`

**Tutorial:** [Minor Release](./tutorials/03-minor-release.md)

### Scenario 3: Breaking Change Release

**Goal:** Release a major version with breaking changes

**Steps:**
1. Complete breaking change implementation
2. Document breaking changes and migration
3. Run: `npm run release:cli plan`
4. Verify major bump (0.1.0 → 1.0.0)
5. Review breaking changes carefully
6. Run: `npm run release:cli release auto`

**Tutorial:** [Major Release](./tutorials/04-major-release.md)

### Scenario 4: Multi-Package Coordination

**Goal:** Release multiple packages with coordinated versions

**Steps:**
1. Complete work affecting multiple packages
2. System automatically coordinates versions
3. Run: `npm run release:cli plan`
4. Verify all packages updated
5. Run: `npm run release:cli release auto`

**Tutorial:** [Multi-Package](./tutorials/05-multi-package.md)

### Scenario 5: CI/CD Automation

**Goal:** Automate releases in CI/CD pipeline

**Steps:**
1. Set up CI/CD configuration
2. Configure secrets (tokens)
3. Add release workflow
4. Test with dry run
5. Enable automatic releases

**Tutorial:** [CI/CD Integration](./tutorials/06-ci-cd-integration.md)

## Best Practices

### Configuration

- ✅ Use environment variables for tokens
- ✅ Validate configuration before first release
- ✅ Test with dry run before actual release
- ✅ Keep configuration in version control (without tokens)

### Documentation

- ✅ Write clear completion documents
- ✅ Document breaking changes with migration guidance
- ✅ Include before/after examples
- ✅ Reference requirements in completion docs

### Testing

- ✅ Preview release plan before executing
- ✅ Use dry run for testing
- ✅ Verify on GitHub after release
- ✅ Test rollback procedures

### Automation

- ✅ Start with manual releases
- ✅ Test automation with dry run
- ✅ Monitor automated releases
- ✅ Have manual override available

## Additional Resources

- **Usage Guide**: `docs/release-management-guide.md`
- **Configuration Reference**: `docs/configuration-reference.md`
- **Troubleshooting**: `docs/troubleshooting-guide.md`
- **API Documentation**: `docs/api-reference.md`

## Contributing Examples

Have a useful example or tutorial? Contributions are welcome!

1. Follow existing format and structure
2. Include clear explanations
3. Test examples before submitting
4. Add to this README

---

*This directory provides comprehensive examples and tutorials for the Release Management System.*
