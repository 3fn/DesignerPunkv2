# Integration Examples

**Date**: October 20, 2025  
**Purpose**: Integration examples for different project types and workflows  
**Organization**: spec-completion  
**Scope**: release-analysis-system  
**Status**: Complete Documentation  

---

## Overview

This document provides comprehensive integration examples for the Release Analysis System across different project types, development workflows, and CI/CD environments. Each example includes complete configuration, setup instructions, and best practices.

## Project Type Integrations

### Standard Node.js Project

#### Project Structure
```
my-project/
├── package.json
├── src/
│   ├── index.ts
│   └── components/
├── .kiro/
│   ├── specs/
│   │   └── feature-name/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── completion/
│   │           ├── task-1-completion.md
│   │           └── task-2-completion.md
│   └── release-analysis-config.json
├── CHANGELOG.md
└── README.md
```

#### Configuration
```json
{
  "extraction": {
    "completionPatterns": [
      ".kiro/specs/*/completion/*-completion.md",
      ".kiro/specs/*/spec-completion-summary.md"
    ],
    "confidenceThresholds": {
      "minimumConfidence": 0.7,
      "reviewThreshold": 0.75
    }
  },
  "reporting": {
    "defaultFormat": "detailed",
    "outputFiles": {
      "saveResults": true,
      "outputDirectory": "./release-notes"
    }
  },
  "git": {
    "releaseTagPattern": "^v?\\d+\\.\\d+\\.\\d+",
    "completionPaths": [
      ".kiro/specs/*/completion/"
    ]
  }
}
```

#### Package.json Scripts
```json
{
  "scripts": {
    "release:analyze": "npx ts-node src/release-analysis/cli/release-analyze.ts",
    "release:preview": "npm run release:analyze -- --dry-run --format detailed",
    "release:notes": "npm run release:analyze -- --format detailed --output RELEASE_NOTES.md",
    "release:interactive": "npm run release:analyze -- --interactive --format detailed"
  }
}
```##
## Workflow Example
```bash
# 1. Complete development work and create completion documents
echo "# Task 1 Completion
## New Features
- Implemented user authentication system
- Added JWT token validation

## Bug Fixes  
- Fixed login redirect issue
- Corrected password validation" > .kiro/specs/auth-system/completion/task-1-completion.md

# 2. Commit completion documentation
git add .kiro/specs/auth-system/completion/
git commit -m "Add authentication system completion documentation"

# 3. Analyze changes for release
npm run release:preview

# 4. Create release with interactive review
npm run release:interactive

# 5. Generate final release notes
npm run release:notes
```

### Monorepo Project

#### Project Structure
```
monorepo/
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   ├── src/
│   │   └── CHANGELOG.md
│   ├── ui/
│   │   ├── package.json
│   │   ├── src/
│   │   └── CHANGELOG.md
│   └── utils/
│       ├── package.json
│       ├── src/
│       └── CHANGELOG.md
├── .kiro/
│   ├── specs/
│   └── release-analysis-config.json
├── lerna.json
└── package.json
```

#### Configuration
```json
{
  "extraction": {
    "completionPatterns": [
      ".kiro/specs/*/completion/*-completion.md",
      "packages/*/CHANGELOG.md",
      "packages/*/docs/completion/*.md"
    ],
    "featureKeywords": [
      "new feature",
      "adds functionality",
      "package:",
      "component:"
    ]
  },
  "git": {
    "completionPaths": [
      ".kiro/specs/*/completion/",
      "packages/*/docs/completion/",
      "packages/*/CHANGELOG.md"
    ]
  },
  "reporting": {
    "templates": {
      "releaseNotes": "monorepo"
    },
    "outputFiles": {
      "filenamePattern": "release-{version}-{date}.{format}"
    }
  }
}
```

#### Lerna Integration
```json
{
  "scripts": {
    "release:analyze": "npx ts-node ../../src/release-analysis/cli/release-analyze.ts",
    "release:analyze:all": "lerna run release:analyze",
    "release:publish": "lerna publish --conventional-commits"
  }
}
```

#### Workflow Example
```bash
# 1. Analyze changes across all packages
npm run release:analyze:all

# 2. Generate consolidated release notes
npm run release:analyze -- --format detailed --output RELEASE_NOTES.md

# 3. Publish with Lerna
npm run release:publish
```###
 Documentation-Heavy Project

#### Project Structure
```
docs-project/
├── docs/
│   ├── guides/
│   ├── api/
│   ├── tutorials/
│   └── completion/
│       ├── guide-updates-completion.md
│       └── api-docs-completion.md
├── .kiro/
│   ├── specs/
│   └── release-analysis-config.json
├── mkdocs.yml
└── package.json
```

#### Configuration
```json
{
  "extraction": {
    "completionPatterns": [
      "docs/completion/*-completion.md",
      "docs/releases/*-notes.md",
      ".kiro/specs/*/completion/*.md"
    ],
    "documentationKeywords": [
      "documentation update",
      "guide added",
      "api documentation",
      "tutorial created",
      "examples added",
      "content updated"
    ],
    "featureKeywords": [
      "new guide",
      "new tutorial",
      "new documentation",
      "content expansion"
    ]
  },
  "versioning": {
    "versionBumpRules": {
      "defaultBumpType": "minor"
    }
  },
  "reporting": {
    "templates": {
      "releaseNotes": "documentation"
    }
  }
}
```

#### MkDocs Integration
```yaml
# mkdocs.yml
site_name: Project Documentation
nav:
  - Home: index.md
  - Guides: guides/
  - API: api/
  - Release Notes: releases/

plugins:
  - search
  - release-notes:
      source: .kiro/release-analysis/
```

### TypeScript Library Project

#### Project Structure
```
ts-library/
├── src/
│   ├── index.ts
│   ├── types/
│   └── utils/
├── dist/
├── .kiro/
│   ├── specs/
│   └── release-analysis-config.json
├── package.json
├── tsconfig.json
└── rollup.config.js
```

#### Configuration
```json
{
  "extraction": {
    "breakingChangeKeywords": [
      "breaking change",
      "API change",
      "interface change",
      "type change",
      "removes export",
      "signature change"
    ],
    "featureKeywords": [
      "new export",
      "new function",
      "new class",
      "new interface",
      "new type"
    ]
  },
  "versioning": {
    "semanticVersioning": true,
    "versionBumpRules": {
      "requireMajorConfirmation": true
    }
  }
}
```

#### Build Integration
```json
{
  "scripts": {
    "build": "rollup -c",
    "release:analyze": "npx ts-node src/release-analysis/cli/release-analyze.ts",
    "release:prepare": "npm run build && npm run release:analyze",
    "release:publish": "npm run release:prepare && npm publish"
  }
}
```## CI/CD
 Integration Examples

### GitHub Actions

#### Basic Workflow
```yaml
name: Release Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Full history for analysis
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Analyze release changes
        run: npm run release:analyze -- --format json --output analysis.json
      
      - name: Upload analysis results
        uses: actions/upload-artifact@v3
        with:
          name: release-analysis
          path: analysis.json
```

#### Advanced Workflow with Release Creation
```yaml
name: Automated Release
on:
  workflow_dispatch:
    inputs:
      force_version:
        description: 'Force specific version (optional)'
        required: false

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Analyze changes
        id: analyze
        run: |
          npm run release:analyze -- --format json --output analysis.json
          echo "version=$(jq -r '.versionRecommendation.recommendedVersion' analysis.json)" >> $GITHUB_OUTPUT
          echo "notes<<EOF" >> $GITHUB_OUTPUT
          jq -r '.releaseNotes' analysis.json >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT
      
      - name: Create Release
        if: steps.analyze.outputs.version != 'null'
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ steps.analyze.outputs.version }}
          release_name: Release ${{ steps.analyze.outputs.version }}
          body: ${{ steps.analyze.outputs.notes }}
          draft: false
          prerelease: false
```

### GitLab CI

#### Basic Pipeline
```yaml
stages:
  - analyze
  - release

analyze_changes:
  stage: analyze
  script:
    - npm ci
    - npm run release:analyze -- --format json --output analysis.json
  artifacts:
    reports:
      junit: analysis.json
    paths:
      - analysis.json
  only:
    - main

create_release:
  stage: release
  script:
    - VERSION=$(jq -r '.versionRecommendation.recommendedVersion' analysis.json)
    - NOTES=$(jq -r '.releaseNotes' analysis.json)
    - git tag "v$VERSION"
    - git push origin "v$VERSION"
  dependencies:
    - analyze_changes
  only:
    - main
  when: manual
```

### Jenkins Pipeline

#### Declarative Pipeline
```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Analyze Changes') {
            steps {
                sh 'npm run release:analyze -- --format json --output analysis.json'
                archiveArtifacts artifacts: 'analysis.json', fingerprint: true
            }
        }
        
        stage('Create Release') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def analysis = readJSON file: 'analysis.json'
                    def version = analysis.versionRecommendation.recommendedVersion
                    def notes = analysis.releaseNotes
                    
                    if (version && version != 'null') {
                        sh "git tag v${version}"
                        sh "git push origin v${version}"
                        
                        // Create GitHub release
                        sh """
                            curl -X POST \
                              -H "Authorization: token ${env.GITHUB_TOKEN}" \
                              -H "Content-Type: application/json" \
                              -d '{"tag_name":"v${version}","name":"Release ${version}","body":"${notes}"}' \
                              https://api.github.com/repos/owner/repo/releases
                        """
                    }
                }
            }
        }
    }
}
```#
# IDE Integration Examples

### VS Code Integration

#### Tasks Configuration
```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Release: Analyze Changes",
            "type": "shell",
            "command": "npm",
            "args": ["run", "release:analyze"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            },
            "problemMatcher": []
        },
        {
            "label": "Release: Preview Analysis",
            "type": "shell",
            "command": "npm",
            "args": ["run", "release:analyze", "--", "--dry-run", "--format", "detailed"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        },
        {
            "label": "Release: Interactive Analysis",
            "type": "shell",
            "command": "npm",
            "args": ["run", "release:analyze", "--", "--interactive", "--format", "detailed"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": true,
                "panel": "shared"
            }
        }
    ]
}
```

#### Launch Configuration
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Release Analysis",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/src/release-analysis/cli/release-analyze.ts",
            "args": ["--dry-run", "--format", "detailed"],
            "console": "integratedTerminal",
            "env": {
                "DEBUG": "release-analysis"
            },
            "runtimeArgs": ["-r", "ts-node/register"]
        }
    ]
}
```

### JetBrains IDEs (WebStorm, IntelliJ)

#### Run Configurations

1. **Release Analysis**
   - Type: npm
   - Command: run
   - Scripts: release:analyze
   - Arguments: --format detailed

2. **Interactive Analysis**
   - Type: npm
   - Command: run
   - Scripts: release:analyze
   - Arguments: --interactive --format detailed

## Custom Integration Examples

### Slack Notifications

```javascript
// scripts/notify-release.js
const { execSync } = require('child_process');
const https = require('https');

async function notifySlack() {
    try {
        // Run analysis
        const result = execSync('npm run release:analyze -- --format json', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        
        if (analysis.versionRecommendation.recommendedVersion) {
            const message = {
                text: `🚀 New release ready: ${analysis.versionRecommendation.recommendedVersion}`,
                attachments: [{
                    color: 'good',
                    fields: [
                        {
                            title: 'Changes',
                            value: `${analysis.changes.newFeatures.length} features, ${analysis.changes.bugFixes.length} fixes`,
                            short: true
                        },
                        {
                            title: 'Confidence',
                            value: `${Math.round(analysis.confidence.overall * 100)}%`,
                            short: true
                        }
                    ]
                }]
            };
            
            // Send to Slack webhook
            const webhook = process.env.SLACK_WEBHOOK_URL;
            const data = JSON.stringify(message);
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };
            
            const req = https.request(webhook, options);
            req.write(data);
            req.end();
        }
    } catch (error) {
        console.error('Failed to notify Slack:', error);
    }
}

notifySlack();
```###
 Discord Bot Integration

```javascript
// scripts/discord-release-bot.js
const { Client, GatewayIntentBits } = require('discord.js');
const { execSync } = require('child_process');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('messageCreate', async (message) => {
    if (message.content === '!release-analyze') {
        try {
            const result = execSync('npm run release:analyze -- --format json', { encoding: 'utf8' });
            const analysis = JSON.parse(result);
            
            const embed = {
                title: '📊 Release Analysis Results',
                color: 0x00ff00,
                fields: [
                    {
                        name: 'Recommended Version',
                        value: analysis.versionRecommendation.recommendedVersion || 'No changes detected',
                        inline: true
                    },
                    {
                        name: 'Change Summary',
                        value: `${analysis.changes.newFeatures.length} features, ${analysis.changes.bugFixes.length} fixes, ${analysis.changes.breakingChanges.length} breaking`,
                        inline: true
                    }
                ]
            };
            
            await message.reply({ embeds: [embed] });
        } catch (error) {
            await message.reply('❌ Failed to analyze release changes');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

### Email Notifications

```javascript
// scripts/email-release-notification.js
const nodemailer = require('nodemailer');
const { execSync } = require('child_process');

async function sendReleaseEmail() {
    try {
        const result = execSync('npm run release:analyze -- --format json', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        
        if (analysis.versionRecommendation.recommendedVersion) {
            const transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            
            const mailOptions = {
                from: process.env.FROM_EMAIL,
                to: process.env.TO_EMAIL,
                subject: `Release ${analysis.versionRecommendation.recommendedVersion} Ready`,
                html: `
                    <h2>Release Analysis Complete</h2>
                    <p><strong>Recommended Version:</strong> ${analysis.versionRecommendation.recommendedVersion}</p>
                    <p><strong>Changes:</strong></p>
                    <ul>
                        <li>Features: ${analysis.changes.newFeatures.length}</li>
                        <li>Bug Fixes: ${analysis.changes.bugFixes.length}</li>
                        <li>Breaking Changes: ${analysis.changes.breakingChanges.length}</li>
                    </ul>
                    <p><strong>Confidence:</strong> ${Math.round(analysis.confidence.overall * 100)}%</p>
                    <hr>
                    <pre>${analysis.releaseNotes}</pre>
                `
            };
            
            await transporter.sendMail(mailOptions);
            console.log('Release notification email sent');
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

sendReleaseEmail();
```

## Testing Integration Examples

### Jest Integration

```javascript
// __tests__/release-analysis.integration.test.js
const { execSync } = require('child_process');

describe('Release Analysis Integration', () => {
    test('should analyze changes successfully', () => {
        const result = execSync('npm run release:analyze -- --format json --dry-run', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        
        expect(analysis).toHaveProperty('versionRecommendation');
        expect(analysis).toHaveProperty('changes');
        expect(analysis).toHaveProperty('confidence');
    });
    
    test('should handle no changes gracefully', () => {
        // Create test scenario with no changes
        const result = execSync('npm run release:analyze -- --format json --since HEAD', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        
        expect(analysis.versionRecommendation.bumpType).toBe('none');
    });
    
    test('should detect breaking changes correctly', () => {
        // This test would require setting up test completion documents
        // with known breaking changes
        const result = execSync('npm run release:analyze -- --format json --dry-run', { encoding: 'utf8' });
        const analysis = JSON.parse(result);
        
        if (analysis.changes.breakingChanges.length > 0) {
            expect(analysis.versionRecommendation.bumpType).toBe('major');
        }
    });
});
```

### Cypress E2E Testing

```javascript
// cypress/integration/release-workflow.spec.js
describe('Release Workflow', () => {
    it('should complete full release analysis workflow', () => {
        cy.exec('npm run release:analyze -- --format json --dry-run')
            .then((result) => {
                const analysis = JSON.parse(result.stdout);
                expect(analysis.versionRecommendation).to.exist;
                
                if (analysis.versionRecommendation.recommendedVersion) {
                    expect(analysis.versionRecommendation.bumpType).to.be.oneOf(['major', 'minor', 'patch']);
                }
            });
    });
    
    it('should generate valid release notes', () => {
        cy.exec('npm run release:analyze -- --format json --dry-run')
            .then((result) => {
                const analysis = JSON.parse(result.stdout);
                
                if (analysis.releaseNotes) {
                    expect(analysis.releaseNotes).to.include('##');
                    expect(analysis.releaseNotes).to.match(/\d+\.\d+\.\d+/);
                }
            });
    });
});
```

This comprehensive integration guide provides practical examples for implementing the Release Analysis System across different project types, development workflows, and automation scenarios. Each example includes complete configuration and setup instructions to enable quick adoption and customization for specific needs.