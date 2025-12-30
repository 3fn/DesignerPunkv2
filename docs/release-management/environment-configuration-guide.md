# Environment Configuration Guide

**Date**: November 28, 2025  
**Last Reviewed**: 2025-12-30  
**Purpose**: Environment-specific configuration for development, staging, and production  
**Audience**: DevOps engineers, developers, system administrators

---

## Overview

This guide provides environment-specific configuration examples and best practices for deploying the Release Management System across development, staging, and production environments. It covers configuration patterns, security considerations, and CI/CD integration strategies.

---

## Table of Contents

1. [Environment Overview](#environment-overview)
2. [Development Environment](#development-environment)
3. [Staging Environment](#staging-environment)
4. [Production Environment](#production-environment)
5. [CI/CD Integration Patterns](#cicd-integration-patterns)
6. [Environment-Specific Security](#environment-specific-security)
7. [Configuration Management](#configuration-management)
8. [Troubleshooting](#troubleshooting)

---

## Environment Overview

### Environment Purposes

**Development**:
- Local development and testing
- Rapid iteration and experimentation
- Dry run releases without publishing
- Configuration validation

**Staging**:
- Pre-production testing
- Integration testing
- Release candidate validation
- Performance testing

**Production**:
- Live releases to users
- Automated or manual releases
- Full validation and monitoring
- Rollback capabilities

### Environment Characteristics

| Characteristic | Development | Staging | Production |
|----------------|-------------|---------|------------|
| **Publishing** | Disabled (dry run) | Optional (test registry) | Enabled |
| **Confirmation** | Interactive | Automated | Automated |
| **Validation** | Relaxed | Standard | Strict |
| **Monitoring** | Minimal | Standard | Comprehensive |
| **Rollback** | Not needed | Available | Required |
| **Tokens** | Development tokens | Staging tokens | Production tokens |


---

## Development Environment

### Purpose

Development environment is for local development, testing, and experimentation. It should allow rapid iteration without risk of publishing to production registries.

### Configuration

**File**: `.kiro/release-config.development.json`

```json
{
  "workingDirectory": ".",
  "dryRun": true,
  "skipConfirmation": false,
  "verbose": true,
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2",
    "token": "${GITHUB_TOKEN_DEV}",
    "createRelease": false,
    "uploadArtifacts": false,
    "draft": true
  },
  "npm": {
    "registry": "https://registry.npmjs.org",
    "token": "${NPM_TOKEN_DEV}",
    "publish": false,
    "access": "public"
  },
  "packages": {
    "coordination": "synchronized",
    "packages": [
      {
        "name": "@designerpunk/tokens",
        "path": "./packages/tokens"
      }
    ]
  },
  "validation": {
    "requireCompletionDocs": false,
    "requireBreakingChangeDoc": false,
    "validateSemanticVersioning": true,
    "allowManualOverride": true
  }
}
```

### Environment Variables

**File**: `.env.development` (add to `.gitignore`)

```bash
# Development environment variables
NODE_ENV=development

# GitHub token (development - limited permissions)
GITHUB_TOKEN_DEV=ghp_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# npm token (development - read-only or test registry)
NPM_TOKEN_DEV=npm_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Release configuration
RELEASE_DRY_RUN=true
RELEASE_SKIP_CONFIRMATION=false
RELEASE_VERBOSE=true
```

### Usage

```bash
# Load development environment
export $(cat .env.development | xargs)

# Or use dotenv
npm install dotenv --save-dev
node -r dotenv/config -e 'require("dotenv").config({ path: ".env.development" })'

# Preview release plan
npm run release:cli plan

# Test release (dry run)
npm run release:cli release auto --dry-run

# Validate configuration
npm run release:cli config validate
```

### Best Practices

**DO**:
- ✅ Use dry run mode by default
- ✅ Keep verbose logging enabled
- ✅ Allow interactive confirmation
- ✅ Disable actual publishing
- ✅ Use development tokens with limited permissions
- ✅ Test configuration changes locally first

**DON'T**:
- ❌ Use production tokens in development
- ❌ Publish to production registries
- ❌ Skip validation in development
- ❌ Commit `.env.development` to version control

### Security Considerations

**Token Permissions**:
- GitHub: Read-only access to repositories
- npm: Read-only or test registry access
- No write access to production resources

**Token Storage**:
```bash
# Store in .env.development (gitignored)
echo ".env.development" >> .gitignore

# Or use password manager
# 1Password, LastPass, Bitwarden, etc.

# Or use environment variables
export GITHUB_TOKEN_DEV="ghp_dev_xxx"
export NPM_TOKEN_DEV="npm_dev_xxx"
```


---

## Staging Environment

### Purpose

Staging environment mirrors production for pre-release testing and validation. It allows testing the complete release process without affecting production users.

### Configuration

**File**: `.kiro/release-config.staging.json`

```json
{
  "workingDirectory": ".",
  "dryRun": false,
  "skipConfirmation": true,
  "verbose": true,
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2-staging",
    "token": "${GITHUB_TOKEN_STAGING}",
    "createRelease": true,
    "uploadArtifacts": true,
    "draft": false,
    "prerelease": true
  },
  "npm": {
    "registry": "https://registry.npmjs.org",
    "token": "${NPM_TOKEN_STAGING}",
    "publish": true,
    "access": "public",
    "tag": "staging"
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
    ],
    "updateDependencies": true
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "validateSemanticVersioning": true,
    "allowManualOverride": true
  }
}
```

### Environment Variables

**File**: `.env.staging` (add to `.gitignore`)

```bash
# Staging environment variables
NODE_ENV=staging

# GitHub token (staging - full permissions for staging repo)
GITHUB_TOKEN_STAGING=ghp_staging_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# npm token (staging - publish with staging tag)
NPM_TOKEN_STAGING=npm_staging_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Release configuration
RELEASE_DRY_RUN=false
RELEASE_SKIP_CONFIRMATION=true
RELEASE_VERBOSE=true

# Staging-specific settings
GITHUB_REPO=DesignerPunkv2-staging
NPM_TAG=staging
```

### Usage

```bash
# Load staging environment
export $(cat .env.staging | xargs)

# Preview release plan
npm run release:cli plan

# Execute staging release
npm run release:cli release auto

# Verify staging release
npm view @designerpunk/tokens@staging
gh release view --repo 3fn/DesignerPunkv2-staging
```

### Best Practices

**DO**:
- ✅ Use separate staging repository or branch
- ✅ Publish with staging npm tag
- ✅ Mark GitHub releases as pre-release
- ✅ Test complete release workflow
- ✅ Validate integration with downstream systems
- ✅ Monitor staging releases for issues

**DON'T**:
- ❌ Use production tokens in staging
- ❌ Publish to latest npm tag
- ❌ Skip validation in staging
- ❌ Use staging for production releases

### Security Considerations

**Token Permissions**:
- GitHub: Full access to staging repository only
- npm: Publish access with staging tag
- No access to production resources

**Token Storage**:
```bash
# CI/CD secrets (GitHub Actions)
# Settings → Secrets and variables → Actions
GITHUB_TOKEN_STAGING=ghp_staging_xxx
NPM_TOKEN_STAGING=npm_staging_xxx

# Or environment-specific secret management
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### Staging Validation

**Pre-Release Checklist**:
- [ ] All tests passing
- [ ] Completion documents present
- [ ] Breaking changes documented
- [ ] Migration guidance provided
- [ ] Dependencies updated
- [ ] Configuration validated

**Post-Release Verification**:
```bash
# Verify npm package
npm view @designerpunk/tokens@staging

# Verify GitHub release
gh release view --repo 3fn/DesignerPunkv2-staging

# Test package installation
npm install @designerpunk/tokens@staging

# Run integration tests
npm run test:integration:staging
```


---

## Production Environment

### Purpose

Production environment is for live releases to users. It requires strict validation, comprehensive monitoring, and rollback capabilities.

### Configuration

**File**: `.kiro/release-config.production.json`

```json
{
  "workingDirectory": ".",
  "dryRun": false,
  "skipConfirmation": true,
  "verbose": false,
  "github": {
    "owner": "3fn",
    "repo": "DesignerPunkv2",
    "token": "${GITHUB_TOKEN}",
    "createRelease": true,
    "uploadArtifacts": true,
    "draft": false,
    "prerelease": false
  },
  "npm": {
    "registry": "https://registry.npmjs.org",
    "token": "${NPM_TOKEN}",
    "publish": true,
    "access": "public",
    "tag": "latest"
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
      },
      {
        "name": "@designerpunk/components",
        "path": "./packages/components",
        "independent": true
      }
    ],
    "updateDependencies": true
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "validateSemanticVersioning": true,
    "allowManualOverride": false
  }
}
```

### Environment Variables

**File**: Environment-specific secret management (not `.env` file)

```bash
# Production environment variables
NODE_ENV=production

# GitHub token (production - full permissions)
GITHUB_TOKEN=ghp_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# npm token (production - publish to latest)
NPM_TOKEN=npm_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Release configuration
RELEASE_DRY_RUN=false
RELEASE_SKIP_CONFIRMATION=true
RELEASE_VERBOSE=false

# Production-specific settings
GITHUB_OWNER=3fn
GITHUB_REPO=DesignerPunkv2
NPM_TAG=latest
```

### Usage

```bash
# NEVER load production tokens from .env file
# Use CI/CD secrets or secret management system

# Preview release plan (safe)
npm run release:cli plan

# Execute production release (requires approval)
npm run release:cli release auto

# Verify production release
npm view @designerpunk/tokens
gh release view
```

### Best Practices

**DO**:
- ✅ Use strict validation
- ✅ Require completion documents
- ✅ Require breaking change documentation
- ✅ Use automated confirmation in CI/CD
- ✅ Monitor releases comprehensively
- ✅ Have rollback procedures ready
- ✅ Test in staging first
- ✅ Use production tokens only in CI/CD

**DON'T**:
- ❌ Store production tokens in `.env` files
- ❌ Use production tokens locally
- ❌ Skip validation in production
- ❌ Allow manual version overrides
- ❌ Release without staging validation
- ❌ Commit production configuration with tokens

### Security Considerations

**Token Permissions**:
- GitHub: Full access to production repository
- npm: Publish access to production packages
- Minimum required permissions only

**Token Storage**:
```bash
# CI/CD secrets (GitHub Actions)
# Settings → Secrets and variables → Actions
GITHUB_TOKEN=ghp_prod_xxx
NPM_TOKEN=npm_prod_xxx

# Or secret management system
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id github-token-prod

# HashiCorp Vault
vault kv get secret/github-token-prod

# Never store in files or environment variables
```

**Access Control**:
- Limit production access to authorized personnel
- Require 2FA for all production access
- Use service accounts for automation
- Audit all production access
- Rotate tokens every 90 days

### Production Validation

**Pre-Release Checklist**:
- [ ] Staging release successful
- [ ] All tests passing (unit, integration, e2e)
- [ ] Completion documents complete
- [ ] Breaking changes documented with migration
- [ ] Dependencies audited (`npm audit`)
- [ ] Configuration validated
- [ ] Rollback procedure tested
- [ ] Monitoring configured
- [ ] Team notified

**Post-Release Verification**:
```bash
# Verify npm package
npm view @designerpunk/tokens

# Verify GitHub release
gh release view

# Test package installation
npm install @designerpunk/tokens

# Monitor error rates
npm run monitor:production

# Check download statistics
npm view @designerpunk/tokens --json | jq '.downloads'
```

### Rollback Procedure

**When to Rollback**:
- Critical bug discovered
- Security vulnerability found
- Breaking change not documented
- Unexpected behavior in production

**Rollback Steps**:
```bash
# 1. Unpublish from npm (within 72 hours)
npm unpublish @designerpunk/tokens@1.2.3

# 2. Delete GitHub release
gh release delete v1.2.3

# 3. Revert git tag
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3

# 4. Revert package.json version
git revert <commit-hash>
git push origin main

# 5. Publish previous version
npm publish

# 6. Document rollback
echo "$(date): Rolled back v1.2.3 - [reason]" >> rollback.log

# 7. Notify users
# Post to GitHub discussions, npm, social media
```


---

## CI/CD Integration Patterns

### GitHub Actions

**Complete Workflow**: `.github/workflows/release.yml`

```yaml
name: Release Management

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to release to'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  # Development validation (runs on all pushes)
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Validate configuration
        run: npm run release:cli config validate
      
      - name: Preview release plan
        run: npm run release:cli plan

  # Staging release (automatic on main branch)
  staging:
    needs: validate
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for release notes
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Execute staging release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_STAGING }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN_STAGING }}
          NODE_ENV: staging
        run: |
          npm run release:cli release auto \
            --skip-confirmation \
            --verbose
      
      - name: Verify staging release
        run: |
          npm view @designerpunk/tokens@staging
          gh release view --repo 3fn/DesignerPunkv2-staging

  # Production release (manual approval required)
  production:
    needs: staging
    if: github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production'
    runs-on: ubuntu-latest
    environment: 
      name: production
      url: https://github.com/3fn/DesignerPunkv2/releases
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Security audit
        run: npm audit --production --audit-level=high
      
      - name: Execute production release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_ENV: production
        run: |
          npm run release:cli release auto \
            --skip-confirmation
      
      - name: Verify production release
        run: |
          npm view @designerpunk/tokens
          gh release view
      
      - name: Notify team
        if: success()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Production release successful!'
            })
```

**Environment Configuration**:

```yaml
# GitHub repository settings
# Settings → Environments

# Staging environment
Name: staging
Protection rules: None
Secrets:
  - GITHUB_TOKEN_STAGING
  - NPM_TOKEN_STAGING

# Production environment
Name: production
Protection rules:
  - Required reviewers: 1
  - Wait timer: 5 minutes
Secrets:
  - GITHUB_TOKEN
  - NPM_TOKEN
```

### GitLab CI

**Complete Pipeline**: `.gitlab-ci.yml`

```yaml
stages:
  - validate
  - staging
  - production

variables:
  NODE_VERSION: "18"

# Validation stage (runs on all commits)
validate:
  stage: validate
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm test
    - npm run release:cli config validate
    - npm run release:cli plan
  only:
    - branches

# Staging release (automatic on main)
staging:
  stage: staging
  image: node:${NODE_VERSION}
  environment:
    name: staging
    url: https://github.com/3fn/DesignerPunkv2-staging/releases
  variables:
    NODE_ENV: staging
  script:
    - npm ci
    - npm run release:cli release auto --skip-confirmation --verbose
    - npm view @designerpunk/tokens@staging
  only:
    - main

# Production release (manual trigger)
production:
  stage: production
  image: node:${NODE_VERSION}
  environment:
    name: production
    url: https://github.com/3fn/DesignerPunkv2/releases
  variables:
    NODE_ENV: production
  script:
    - npm ci
    - npm audit --production --audit-level=high
    - npm run release:cli release auto --skip-confirmation
    - npm view @designerpunk/tokens
  when: manual
  only:
    - main
```

**GitLab CI/CD Variables**:

```bash
# Settings → CI/CD → Variables

# Staging variables
GITHUB_TOKEN_STAGING (Protected, Masked)
NPM_TOKEN_STAGING (Protected, Masked)

# Production variables
GITHUB_TOKEN (Protected, Masked)
NPM_TOKEN (Protected, Masked)
```

### Jenkins

**Jenkinsfile**:

```groovy
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Validate') {
            steps {
                script {
                    nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                        sh 'npm ci'
                        sh 'npm test'
                        sh 'npm run release:cli config validate'
                        sh 'npm run release:cli plan'
                    }
                }
            }
        }
        
        stage('Staging Release') {
            when {
                branch 'main'
            }
            environment {
                GITHUB_TOKEN = credentials('github-token-staging')
                NPM_TOKEN = credentials('npm-token-staging')
                NODE_ENV = 'staging'
            }
            steps {
                script {
                    nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                        sh 'npm ci'
                        sh 'npm run release:cli release auto --skip-confirmation --verbose'
                        sh 'npm view @designerpunk/tokens@staging'
                    }
                }
            }
        }
        
        stage('Production Release') {
            when {
                branch 'main'
            }
            environment {
                GITHUB_TOKEN = credentials('github-token-prod')
                NPM_TOKEN = credentials('npm-token-prod')
                NODE_ENV = 'production'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                script {
                    nodejs(nodeJSInstallationName: "Node ${NODE_VERSION}") {
                        sh 'npm ci'
                        sh 'npm audit --production --audit-level=high'
                        sh 'npm run release:cli release auto --skip-confirmation'
                        sh 'npm view @designerpunk/tokens'
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Release successful!'
        }
        failure {
            echo 'Release failed!'
        }
    }
}
```

### CircleCI

**Configuration**: `.circleci/config.yml`

```yaml
version: 2.1

orbs:
  node: circleci/node@5.0

workflows:
  release:
    jobs:
      - validate
      - staging:
          requires:
            - validate
          filters:
            branches:
              only: main
      - production-approval:
          type: approval
          requires:
            - staging
      - production:
          requires:
            - production-approval

jobs:
  validate:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - node/install-packages
      - run: npm test
      - run: npm run release:cli config validate
      - run: npm run release:cli plan

  staging:
    docker:
      - image: cimg/node:18.0
    environment:
      NODE_ENV: staging
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Staging release
          command: npm run release:cli release auto --skip-confirmation --verbose
      - run:
          name: Verify staging
          command: npm view @designerpunk/tokens@staging

  production:
    docker:
      - image: cimg/node:18.0
    environment:
      NODE_ENV: production
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Security audit
          command: npm audit --production --audit-level=high
      - run:
          name: Production release
          command: npm run release:cli release auto --skip-confirmation
      - run:
          name: Verify production
          command: npm view @designerpunk/tokens
```


---

## Environment-Specific Security

### Development Security

**Token Requirements**:
- Read-only GitHub access
- No npm publish permissions
- Limited to development repositories

**Security Measures**:
```bash
# Use separate development tokens
GITHUB_TOKEN_DEV=ghp_dev_xxx  # Read-only
NPM_TOKEN_DEV=npm_dev_xxx     # Read-only or test registry

# Store in .env.development (gitignored)
echo ".env.development" >> .gitignore

# Never commit tokens
git secrets --scan
```

**Access Control**:
- No production access from development
- Dry run mode enforced
- Interactive confirmation enabled
- Verbose logging for debugging

### Staging Security

**Token Requirements**:
- Full access to staging repository
- Publish to staging npm tag
- No production access

**Security Measures**:
```bash
# Use staging-specific tokens
GITHUB_TOKEN_STAGING=ghp_staging_xxx  # Staging repo only
NPM_TOKEN_STAGING=npm_staging_xxx     # Staging tag only

# Store in CI/CD secrets
# GitHub Actions: Settings → Secrets
# GitLab CI: Settings → CI/CD → Variables
# Jenkins: Credentials → Add Credentials

# Rotate every 90 days
```

**Access Control**:
- Separate staging repository or branch
- Staging npm tag (not latest)
- Pre-release GitHub releases
- Limited team access

### Production Security

**Token Requirements**:
- Full access to production repository
- Publish to production npm registry
- Minimum required permissions

**Security Measures**:
```bash
# Use production tokens ONLY in CI/CD
# NEVER store in files or local environment

# CI/CD secrets (GitHub Actions)
GITHUB_TOKEN=ghp_prod_xxx  # Production repo
NPM_TOKEN=npm_prod_xxx     # Production registry

# Or secret management system
aws secretsmanager get-secret-value --secret-id github-token-prod
vault kv get secret/github-token-prod

# Rotate every 90 days
# Enable 2FA for all production access
# Audit all production operations
```

**Access Control**:
- Restricted to authorized personnel
- 2FA required for all access
- Service accounts for automation
- Comprehensive audit logging
- Manual approval for releases

### Token Rotation Schedule

**Development Tokens**:
- Rotation: Every 90 days
- Expiration: Set to 90 days
- Notification: 2 weeks before expiration
- Impact: Low (local development only)

**Staging Tokens**:
- Rotation: Every 90 days
- Expiration: Set to 90 days
- Notification: 2 weeks before expiration
- Impact: Medium (staging releases affected)

**Production Tokens**:
- Rotation: Every 90 days
- Expiration: Set to 90 days
- Notification: 2 weeks before expiration
- Impact: High (production releases affected)
- Backup tokens: Always have backup ready

### Security Checklist

**Development**:
- [ ] Development tokens have read-only access
- [ ] Tokens stored in `.env.development` (gitignored)
- [ ] Dry run mode enabled by default
- [ ] No production access possible
- [ ] Tokens rotated every 90 days

**Staging**:
- [ ] Staging tokens limited to staging resources
- [ ] Tokens stored in CI/CD secrets
- [ ] Separate staging repository or branch
- [ ] Pre-release GitHub releases
- [ ] Tokens rotated every 90 days

**Production**:
- [ ] Production tokens stored in secret management
- [ ] 2FA enabled for all production access
- [ ] Manual approval required for releases
- [ ] Comprehensive audit logging enabled
- [ ] Rollback procedures tested
- [ ] Tokens rotated every 90 days
- [ ] Backup tokens available


---

## Configuration Management

### Configuration File Naming

**Convention**:
```
.kiro/release-config.{environment}.json
```

**Examples**:
- `.kiro/release-config.development.json`
- `.kiro/release-config.staging.json`
- `.kiro/release-config.production.json`

### Loading Configuration

**By Environment Variable**:
```bash
# Set environment
export NODE_ENV=staging

# System automatically loads .kiro/release-config.staging.json
npm run release:cli release auto
```

**By CLI Option**:
```bash
# Specify configuration file
npm run release:cli release auto --config .kiro/release-config.staging.json
```

**By Convention**:
```bash
# System detects environment and loads appropriate config
NODE_ENV=production npm run release:cli release auto
```

### Configuration Validation

**Validate Before Use**:
```bash
# Validate development config
NODE_ENV=development npm run release:cli config validate

# Validate staging config
NODE_ENV=staging npm run release:cli config validate

# Validate production config
NODE_ENV=production npm run release:cli config validate
```

**Common Validation Errors**:

**Error**: "GitHub token is required"
```bash
# Solution: Set token in environment or config
export GITHUB_TOKEN=ghp_xxx
# Or use variable substitution in config
"token": "${GITHUB_TOKEN}"
```

**Error**: "Invalid coordination strategy"
```bash
# Solution: Use valid strategy
"coordination": "synchronized"  # or "independent"
```

**Error**: "Package path does not exist"
```bash
# Solution: Verify package paths
"packages": [
  {
    "name": "@designerpunk/tokens",
    "path": "./packages/tokens"  # Must exist
  }
]
```

### Configuration Best Practices

**DO**:
- ✅ Use environment-specific configuration files
- ✅ Validate configuration before first use
- ✅ Use variable substitution for tokens
- ✅ Keep configuration in version control (without tokens)
- ✅ Document configuration changes
- ✅ Test configuration in staging first

**DON'T**:
- ❌ Commit tokens to version control
- ❌ Use production config in development
- ❌ Skip configuration validation
- ❌ Hard-code tokens in configuration
- ❌ Share configuration between environments

### Configuration Templates

**Development Template**:
```json
{
  "dryRun": true,
  "skipConfirmation": false,
  "verbose": true,
  "github": {
    "createRelease": false,
    "uploadArtifacts": false
  },
  "npm": {
    "publish": false
  },
  "validation": {
    "requireCompletionDocs": false,
    "allowManualOverride": true
  }
}
```

**Staging Template**:
```json
{
  "dryRun": false,
  "skipConfirmation": true,
  "verbose": true,
  "github": {
    "createRelease": true,
    "prerelease": true
  },
  "npm": {
    "publish": true,
    "tag": "staging"
  },
  "validation": {
    "requireCompletionDocs": true,
    "allowManualOverride": true
  }
}
```

**Production Template**:
```json
{
  "dryRun": false,
  "skipConfirmation": true,
  "verbose": false,
  "github": {
    "createRelease": true,
    "prerelease": false
  },
  "npm": {
    "publish": true,
    "tag": "latest"
  },
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "allowManualOverride": false
  }
}
```


---

## Troubleshooting

### Issue: Wrong Environment Configuration Loaded

**Symptom**: System loads incorrect configuration for environment

**Solution**:
```bash
# Verify NODE_ENV is set correctly
echo $NODE_ENV

# Explicitly specify configuration file
npm run release:cli release auto --config .kiro/release-config.staging.json

# Check which config is loaded
npm run release:cli config show
```

### Issue: Tokens Not Found in Environment

**Symptom**: "GitHub token is required" or "npm token is required"

**Solution**:
```bash
# Verify tokens are set
echo $GITHUB_TOKEN
echo $NPM_TOKEN

# Load from .env file
export $(cat .env.staging | xargs)

# Or set manually
export GITHUB_TOKEN=ghp_xxx
export NPM_TOKEN=npm_xxx
```

### Issue: Configuration Validation Fails

**Symptom**: Configuration validation errors

**Solution**:
```bash
# Show current configuration
npm run release:cli config show

# Validate configuration
npm run release:cli config validate

# Check for common issues:
# - Missing required fields
# - Invalid values
# - Incorrect paths
# - Token format errors
```

### Issue: Staging Release Published to Production

**Symptom**: Staging release appears in production

**Solution**:
```bash
# Verify configuration
cat .kiro/release-config.staging.json | grep -E "(tag|prerelease)"

# Should show:
# "tag": "staging"
# "prerelease": true

# If incorrect, update configuration:
{
  "npm": {
    "tag": "staging"  # Not "latest"
  },
  "github": {
    "prerelease": true  # Not false
  }
}
```

### Issue: Production Tokens Used in Development

**Symptom**: Development operations affect production

**Solution**:
```bash
# Immediately revoke production tokens
# GitHub: Settings → Developer settings → Personal access tokens → Delete
# npm: Account → Access Tokens → Delete

# Generate new production tokens
# Store in CI/CD secrets only

# Use development tokens locally
export GITHUB_TOKEN_DEV=ghp_dev_xxx
export NPM_TOKEN_DEV=npm_dev_xxx

# Verify dry run is enabled
cat .kiro/release-config.development.json | grep dryRun
# Should show: "dryRun": true
```

### Issue: CI/CD Pipeline Fails with Authentication Error

**Symptom**: Pipeline fails with "Bad credentials" or "Unable to authenticate"

**Solution**:
```bash
# Verify secrets are set in CI/CD
# GitHub Actions: Settings → Secrets and variables → Actions
# GitLab CI: Settings → CI/CD → Variables
# Jenkins: Credentials → Manage Credentials

# Check secret names match configuration
# Config: ${GITHUB_TOKEN}
# Secret name: GITHUB_TOKEN (must match exactly)

# Verify token permissions
# GitHub: repo, write:packages
# npm: Publish access

# Test tokens locally (if safe)
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
npm whoami --registry=https://registry.npmjs.org/
```

### Issue: Release Validation Fails in Production

**Symptom**: Production release fails validation

**Solution**:
```bash
# Check validation requirements
cat .kiro/release-config.production.json | grep -A 5 validation

# Ensure completion documents exist
ls -la .kiro/specs/*/completion/

# Verify breaking changes documented
grep -r "Breaking Changes" .kiro/specs/*/completion/

# If validation is too strict, adjust configuration
# (Only in exceptional cases)
{
  "validation": {
    "requireCompletionDocs": true,
    "requireBreakingChangeDoc": true,
    "allowManualOverride": false  # Keep false for production
  }
}
```

### Issue: Multi-Environment Token Confusion

**Symptom**: Using wrong tokens for wrong environment

**Solution**:
```bash
# Use clear naming convention
GITHUB_TOKEN_DEV=ghp_dev_xxx
GITHUB_TOKEN_STAGING=ghp_staging_xxx
GITHUB_TOKEN=ghp_prod_xxx  # Production

NPM_TOKEN_DEV=npm_dev_xxx
NPM_TOKEN_STAGING=npm_staging_xxx
NPM_TOKEN=npm_prod_xxx  # Production

# Use environment-specific .env files
.env.development
.env.staging
# No .env.production (use CI/CD secrets)

# Load appropriate file
export $(cat .env.development | xargs)  # Development
export $(cat .env.staging | xargs)      # Staging
# Never load production tokens locally
```

---

## Additional Resources

- **Authentication Setup**: `docs/authentication-setup-guide.md`
- **Security Best Practices**: `docs/security-best-practices.md`
- **Configuration Reference**: `docs/configuration-reference.md`
- **Release Management Guide**: `docs/release-management-guide.md`
- **Troubleshooting Guide**: `docs/troubleshooting-guide.md`

---

## Summary

This guide provides comprehensive environment configuration for development, staging, and production environments. Key takeaways:

1. **Development**: Use dry run mode, read-only tokens, interactive confirmation
2. **Staging**: Mirror production, use staging tags, test complete workflow
3. **Production**: Strict validation, automated confirmation, comprehensive monitoring
4. **CI/CD**: Environment-specific pipelines, secret management, manual approval for production
5. **Security**: Separate tokens per environment, rotate every 90 days, use secret management

For questions or issues, refer to the troubleshooting section or related documentation.

---

**Last Updated**: November 28, 2025  
**Next Review**: February 28, 2026  
**Document Owner**: DevOps Team

