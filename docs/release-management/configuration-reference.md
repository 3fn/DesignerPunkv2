# Release Management System - Configuration Reference

**Date**: November 28, 2025  
**Last Reviewed**: 2025-12-30  
**Purpose**: Complete reference for all configuration options  
**Organization**: process-standard  
**Scope**: cross-project

---

## Table of Contents

1. [Overview](#overview)
2. [Configuration File](#configuration-file)
3. [Environment Variables](#environment-variables)
4. [Configuration Options](#configuration-options)
5. [GitHub Configuration](#github-configuration)
6. [npm Configuration](#npm-configuration)
7. [Package Coordination](#package-coordination)
8. [Validation Configuration](#validation-configuration)
9. [Examples](#examples)

---

## Overview

The Release Management System can be configured through:

1. **Configuration File**: `.kiro/release-config.json`
2. **Environment Variables**: `GITHUB_TOKEN`, `NPM_TOKEN`, etc.
3. **CLI Options**: `--github-token`, `--npm-token`, etc.

Configuration is loaded in this order (later sources override earlier):
1. Default configuration
2. Configuration file
3. Environment variables
4. CLI options

---

## Configuration File

### Location

`.kiro/release-config.json` (project root)

### Format

```json
{
  "workingDirectory": ".",
  "dryRun": false,
  "skipConfirmation": false,
  "verbose": false,
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2",
    "token": "${GITHUB_TOKEN}",
    "createRelease": true,
    "uploadArtifacts": true
  },
  "npm": {
    "registry": "https://registry.npmjs.org",
    "token": "${NPM_TOKEN}",
    "publish": true,
    "access": "public"
  },
  "packages": {
    "coordination": "synchronized",
    "packages": [
      {
        "name": "@designerpunk/tokens",
        "path": "./packages/tokens"
      },
      {
        "name": "@designerpunk/build-system",
        "path": "./packages/build-system"
      }
    ]
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "validateSemanticVersioning": true
  }
}
```

### Variable Substitution

Configuration values can reference environment variables:

```json
{
  "github": {
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}"
  }
}
```

---

## Environment Variables

### Required Variables

#### `GITHUB_TOKEN`

GitHub personal access token for API access.

**Required Permissions:**
- `repo` - Full control of private repositories
- `write:packages` - Upload packages to GitHub Package Registry

**Example:**
```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### `NPM_TOKEN`

npm authentication token for publishing.

**Required Permissions:**
- Publish access to packages

**Example:**
```bash
export NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Optional Variables

#### `GITHUB_OWNER`

GitHub repository owner (username or organization).

**Default:** Detected from git remote

**Example:**
```bash
export GITHUB_OWNER=3fn
```

#### `GITHUB_REPO`

GitHub repository name.

**Default:** Detected from git remote

**Example:**
```bash
export GITHUB_REPO=DesignerPunkv2
```

#### `NPM_REGISTRY`

npm registry URL.

**Default:** `https://registry.npmjs.org`

**Example:**
```bash
export NPM_REGISTRY=https://registry.npmjs.org
```

#### `RELEASE_DRY_RUN`

Enable dry run mode (preview without publishing).

**Default:** `false`

**Example:**
```bash
export RELEASE_DRY_RUN=true
```

#### `RELEASE_SKIP_CONFIRMATION`

Skip interactive confirmation prompts.

**Default:** `false`

**Example:**
```bash
export RELEASE_SKIP_CONFIRMATION=true
```

---

## Configuration Options

### Core Options

#### `workingDirectory`

**Type:** `string`  
**Default:** `process.cwd()`  
**Description:** Working directory for release operations

**Example:**
```json
{
  "workingDirectory": "/path/to/project"
}
```

#### `dryRun`

**Type:** `boolean`  
**Default:** `false`  
**Description:** Preview release without actually publishing

**Example:**
```json
{
  "dryRun": true
}
```

**CLI Override:**
```bash
npm run release:cli release auto --dry-run
```

#### `skipConfirmation`

**Type:** `boolean`  
**Default:** `false`  
**Description:** Skip interactive confirmation prompts

**Example:**
```json
{
  "skipConfirmation": true
}
```

**CLI Override:**
```bash
npm run release:cli release auto --skip-confirmation
```

#### `verbose`

**Type:** `boolean`  
**Default:** `false`  
**Description:** Show detailed output during release

**Example:**
```json
{
  "verbose": true
}
```

**CLI Override:**
```bash
npm run release:cli release auto --verbose
```

---

## GitHub Configuration

### `github.owner`

**Type:** `string`  
**Required:** Yes  
**Description:** GitHub repository owner (username or organization)

**Example:**
```json
{
  "github": {
    "owner": "3fn"
  }
}
```

### `github.repo`

**Type:** `string`  
**Required:** Yes  
**Description:** GitHub repository name

**Example:**
```json
{
  "github": {
    "repo": "DesignerPunkv2"
  }
}
```

### `github.token`

**Type:** `string`  
**Required:** Yes  
**Description:** GitHub personal access token

**Example:**
```json
{
  "github": {
    "token": "${GITHUB_TOKEN}"
  }
}
```

**Security Note:** Always use environment variable substitution for tokens

### `github.createRelease`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Create GitHub release

**Example:**
```json
{
  "github": {
    "createRelease": true
  }
}
```

### `github.uploadArtifacts`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Upload build artifacts to GitHub release

**Example:**
```json
{
  "github": {
    "uploadArtifacts": true
  }
}
```

### `github.draft`

**Type:** `boolean`  
**Default:** `false`  
**Description:** Create release as draft

**Example:**
```json
{
  "github": {
    "draft": false
  }
}
```

### `github.prerelease`

**Type:** `boolean`  
**Default:** `false`  
**Description:** Mark release as pre-release

**Example:**
```json
{
  "github": {
    "prerelease": false
  }
}
```

---

## npm Configuration

### `npm.registry`

**Type:** `string`  
**Default:** `https://registry.npmjs.org`  
**Description:** npm registry URL

**Example:**
```json
{
  "npm": {
    "registry": "https://registry.npmjs.org"
  }
}
```

### `npm.token`

**Type:** `string`  
**Required:** Yes (if publishing)  
**Description:** npm authentication token

**Example:**
```json
{
  "npm": {
    "token": "${NPM_TOKEN}"
  }
}
```

**Security Note:** Always use environment variable substitution for tokens

### `npm.publish`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Publish packages to npm registry

**Example:**
```json
{
  "npm": {
    "publish": true
  }
}
```

### `npm.access`

**Type:** `"public" | "restricted"`  
**Default:** `"public"`  
**Description:** Package access level

**Example:**
```json
{
  "npm": {
    "access": "public"
  }
}
```

### `npm.tag`

**Type:** `string`  
**Default:** `"latest"`  
**Description:** npm dist-tag for published packages

**Example:**
```json
{
  "npm": {
    "tag": "latest"
  }
}
```

---

## Package Coordination

### `packages.coordination`

**Type:** `"synchronized" | "independent"`  
**Default:** `"synchronized"`  
**Description:** Package versioning strategy

**Options:**
- `synchronized`: All packages use same version
- `independent`: Packages have independent versions

**Example:**
```json
{
  "packages": {
    "coordination": "synchronized"
  }
}
```

### `packages.packages`

**Type:** `Array<PackageConfig>`  
**Description:** List of packages to manage

**PackageConfig:**
```typescript
interface PackageConfig {
  name: string;        // Package name
  path: string;        // Path to package directory
  independent?: boolean; // Override coordination strategy
}
```

**Example:**
```json
{
  "packages": {
    "packages": [
      {
        "name": "@designerpunk/tokens",
        "path": "./packages/tokens"
      },
      {
        "name": "@designerpunk/build-system",
        "path": "./packages/build-system"
      },
      {
        "name": "@designerpunk/components",
        "path": "./packages/components",
        "independent": true
      }
    ]
  }
}
```

### `packages.updateDependencies`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Automatically update inter-package dependencies

**Example:**
```json
{
  "packages": {
    "updateDependencies": true
  }
}
```

---

## Validation Configuration

### `validation.requireCompletionDocs`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Require completion documents for releases

**Example:**
```json
{
  "validation": {
    "requireCompletionDocs": true
  }
}
```

### `validation.requireBreakingChangeDoc`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Require documentation for breaking changes

**Example:**
```json
{
  "validation": {
    "requireBreakingChangeDoc": true
  }
}
```

### `validation.validateSemanticVersioning`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Validate version bumps follow semantic versioning

**Example:**
```json
{
  "validation": {
    "validateSemanticVersioning": true
  }
}
```

### `validation.allowManualOverride`

**Type:** `boolean`  
**Default:** `true`  
**Description:** Allow manual version override

**Example:**
```json
{
  "validation": {
    "allowManualOverride": true
  }
}
```

---

## Examples

### Example 1: Basic Configuration

Minimal configuration for single-package project:

```json
{
  "github": {
    "owner": "myorg",
    "repo": "myproject",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}"
  }
}
```

### Example 2: Multi-Package Synchronized

Configuration for monorepo with synchronized versions:

```json
{
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "access": "public"
  },
  "packages": {
    "coordination": "synchronized",
    "packages": [
      {
        "name": "@designerpunk/tokens",
        "path": "./packages/tokens"
      },
      {
        "name": "@designerpunk/build-system",
        "path": "./packages/build-system"
      }
    ]
  }
}
```

### Example 3: Independent Package Versions

Configuration for monorepo with independent versions:

```json
{
  "github": {
    "owner": "myorg",
    "repo": "myproject",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}"
  },
  "packages": {
    "coordination": "independent",
    "packages": [
      {
        "name": "@myorg/core",
        "path": "./packages/core"
      },
      {
        "name": "@myorg/utils",
        "path": "./packages/utils"
      },
      {
        "name": "@myorg/components",
        "path": "./packages/components"
      }
    ]
  }
}
```

### Example 4: CI/CD Configuration

Configuration optimized for CI/CD:

```json
{
  "skipConfirmation": true,
  "verbose": true,
  "github": {
    "owner": "${GITHUB_OWNER}",
    "repo": "${GITHUB_REPO}",
    "token": "${GITHUB_TOKEN}",
    "createRelease": true,
    "uploadArtifacts": true
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "publish": true,
    "access": "public"
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "validateSemanticVersioning": true
  }
}
```

### Example 5: Development Configuration

Configuration for local development with dry run:

```json
{
  "dryRun": true,
  "verbose": true,
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2",
    "token": "${GITHUB_TOKEN}",
    "createRelease": false,
    "uploadArtifacts": false
  },
  "npm": {
    "publish": false
  }
}
```

### Example 6: Pre-release Configuration

Configuration for beta releases:

```json
{
  "github": {
    "owner": "myorg",
    "repo": "myproject",
    "token": "${GITHUB_TOKEN}",
    "prerelease": true
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "tag": "beta"
  }
}
```

---

## Configuration Validation

### Validate Configuration

Check if configuration is valid:

```bash
npm run release:cli config validate
```

### Common Validation Errors

#### "GitHub token is required"

**Solution:** Set `GITHUB_TOKEN` environment variable or configure in file

#### "npm token is required for publishing"

**Solution:** Set `NPM_TOKEN` environment variable or disable publishing

#### "Invalid package configuration"

**Solution:** Ensure all packages have `name` and `path` properties

#### "Invalid coordination strategy"

**Solution:** Use `"synchronized"` or `"independent"`

---

## Security Best Practices

### 1. Never Commit Tokens

**Bad:**
```json
{
  "github": {
    "token": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Good:**
```json
{
  "github": {
    "token": "${GITHUB_TOKEN}"
  }
}
```

### 2. Use Environment Variables

Store tokens in environment variables or `.env` file:

```bash
# .env (add to .gitignore)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Rotate Tokens Regularly

- Rotate GitHub tokens every 90 days
- Rotate npm tokens every 90 days
- Use token expiration when available

### 4. Limit Token Permissions

- GitHub: Only grant required permissions (`repo`, `write:packages`)
- npm: Use granular access tokens when available

### 5. Use CI/CD Secrets

Store tokens in CI/CD secret management:

```yaml
# GitHub Actions
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Additional Resources

- **Usage Guide**: See `docs/release-management-guide.md`
- **Troubleshooting**: See `docs/troubleshooting-guide.md`
- **API Documentation**: See `docs/api-reference.md`

---

*This reference provides complete configuration documentation for the Release Management System.*
