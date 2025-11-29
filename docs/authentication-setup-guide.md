# Authentication Setup Guide

**Date**: November 28, 2025  
**Purpose**: Step-by-step instructions for configuring authentication for GitHub and npm publishing  
**Audience**: Developers setting up the Release Management System

---

## Overview

The Release Management System requires authentication credentials to:
- Create GitHub releases and tags
- Publish packages to npm registry
- Access GitHub API for release operations

This guide provides detailed instructions for creating and configuring these credentials securely.

---

## GitHub Personal Access Token

### Why You Need This

GitHub personal access tokens (PATs) authenticate API requests for:
- Creating releases
- Creating and pushing tags
- Uploading release artifacts
- Accessing repository information

### Step 1: Navigate to Token Settings

1. Log in to GitHub at https://github.com
2. Click your profile picture in the top-right corner
3. Select **Settings** from the dropdown menu
4. Scroll down the left sidebar and click **Developer settings**
5. Click **Personal access tokens** → **Tokens (classic)**

**Direct URL**: https://github.com/settings/tokens

### Step 2: Generate New Token

1. Click **Generate new token** → **Generate new token (classic)**
2. GitHub will prompt for your password - enter it to continue
3. You'll see the "New personal access token" form

### Step 3: Configure Token Settings

**Token Name (Note)**:
- Enter a descriptive name: `DesignerPunk Release Management`
- This helps you identify the token's purpose later

**Expiration**:
- **Recommended**: 90 days (balance between security and convenience)
- **Alternative**: No expiration (less secure, requires manual rotation)
- **Best Practice**: Set expiration and add calendar reminder to rotate

**Select Scopes**:

Check these permissions (required for release management):

- ✅ **repo** (Full control of private repositories)
  - Includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
  - **Why**: Create releases, push tags, access repository information

- ✅ **write:packages** (Upload packages to GitHub Package Registry)
  - Includes: `read:packages`
  - **Why**: Upload release artifacts if using GitHub Packages

**Optional Scopes** (only if needed):

- ⚠️ **workflow** (Update GitHub Action workflows)
  - Only needed if release system modifies workflow files
  - Most users don't need this

- ⚠️ **admin:org** (Full control of orgs and teams)
  - Only needed for organization-level releases
  - Most users don't need this

### Step 4: Generate and Save Token

1. Scroll to bottom and click **Generate token**
2. **CRITICAL**: Copy the token immediately - you won't see it again
3. Store the token securely (see "Storing Credentials Securely" section below)

**Token Format**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 5: Verify Token Works

Test your token with a simple API call:

```bash
# Replace YOUR_TOKEN with your actual token
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Should return your GitHub user information
```

If you see your user data, the token works correctly.

---

## npm Authentication Token

### Why You Need This

npm tokens authenticate package publishing to the npm registry. Required for:
- Publishing packages to npm
- Updating package versions
- Managing package access

### Step 1: Log In to npm

**Option A: Via Website**
1. Go to https://www.npmjs.com
2. Click **Sign In** (top-right)
3. Enter your credentials

**Option B: Via CLI**
```bash
npm login

# Follow prompts:
# Username: your-npm-username
# Password: your-npm-password
# Email: your-email@example.com
```

### Step 2: Navigate to Token Settings

**Via Website**:
1. Click your profile picture (top-right)
2. Select **Access Tokens** from dropdown
3. Or visit directly: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

### Step 3: Generate New Token

1. Click **Generate New Token** button
2. Choose token type:

**Token Types**:

- **Automation** (Recommended for CI/CD)
  - Read and publish access
  - Cannot modify account settings
  - Best for release automation
  - **Choose this for Release Management System**

- **Publish** (Alternative)
  - Publish and unpublish packages
  - Cannot modify account settings
  - Use if you need unpublish capability

- **Read-only** (Not suitable)
  - Only read access
  - Cannot publish packages
  - Don't use for release management

### Step 4: Configure Token

**Token Name**:
- Enter descriptive name: `DesignerPunk Release Automation`
- Helps identify token purpose

**Packages and Scopes** (if prompted):
- Select specific packages or allow all packages
- For organization packages, ensure you have publish permissions

### Step 5: Generate and Save Token

1. Click **Generate Token**
2. **CRITICAL**: Copy the token immediately - you won't see it again
3. Store the token securely (see "Storing Credentials Securely" section below)

**Token Format**: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 6: Verify Token Works

Test your token with npm CLI:

```bash
# Set token in environment
export NPM_TOKEN="your-token-here"

# Test authentication
npm whoami --registry=https://registry.npmjs.org/

# Should return your npm username
```

If you see your username, the token works correctly.

---

## Environment Variable Setup

### Security Best Practices

**DO**:
- ✅ Store tokens in environment variables (not in code)
- ✅ Use `.env` files for local development (add to `.gitignore`)
- ✅ Use secure secret management for CI/CD (GitHub Secrets, etc.)
- ✅ Rotate tokens regularly (every 90 days recommended)
- ✅ Use different tokens for different environments (dev, staging, prod)

**DON'T**:
- ❌ Commit tokens to version control
- ❌ Share tokens via email or chat
- ❌ Use the same token across multiple projects
- ❌ Store tokens in plain text files
- ❌ Use tokens with broader permissions than needed

### Local Development Setup

#### macOS / Linux

**Option 1: Shell Profile (Persistent)**

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

```bash
# GitHub Personal Access Token
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# npm Authentication Token
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Apply changes:
```bash
# For bash
source ~/.bashrc

# For zsh
source ~/.zshrc
```

**Option 2: .env File (Project-Specific)**

Create `.env` file in project root:

```bash
# .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**CRITICAL**: Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

Load environment variables:

```bash
# Using dotenv (if installed)
npm install dotenv --save-dev

# Or manually export
export $(cat .env | xargs)
```

**Option 3: Session-Only (Temporary)**

Set for current terminal session only:

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

These expire when you close the terminal.

#### Windows

**Option 1: System Environment Variables (Persistent)**

**Via GUI**:
1. Press `Win + X` and select **System**
2. Click **Advanced system settings**
3. Click **Environment Variables**
4. Under **User variables**, click **New**
5. Add variables:
   - Variable name: `GITHUB_TOKEN`
   - Variable value: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
6. Repeat for `NPM_TOKEN`
7. Click **OK** to save

**Via PowerShell** (Administrator):
```powershell
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'User')
[System.Environment]::SetEnvironmentVariable('NPM_TOKEN', 'npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'User')
```

**Via Command Prompt** (Administrator):
```cmd
setx GITHUB_TOKEN "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
setx NPM_TOKEN "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Option 2: .env File (Project-Specific)**

Create `.env` file in project root:

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**CRITICAL**: Add `.env` to `.gitignore`:

```cmd
echo .env >> .gitignore
```

Load with PowerShell:
```powershell
Get-Content .env | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Content env:\$name $value
}
```

**Option 3: Session-Only (Temporary)**

**PowerShell**:
```powershell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:NPM_TOKEN = "npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Command Prompt**:
```cmd
set GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set NPM_TOKEN=npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

These expire when you close the terminal.

### Verify Environment Variables

**macOS / Linux**:
```bash
echo $GITHUB_TOKEN
echo $NPM_TOKEN
```

**Windows PowerShell**:
```powershell
echo $env:GITHUB_TOKEN
echo $env:NPM_TOKEN
```

**Windows Command Prompt**:
```cmd
echo %GITHUB_TOKEN%
echo %NPM_TOKEN%
```

**Security Note**: Be careful when echoing tokens - they'll appear in terminal history.

---

## CI/CD Environment Setup

### GitHub Actions

Store tokens as repository secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secrets:
   - Name: `GITHUB_TOKEN` (automatically provided by GitHub Actions)
   - Name: `NPM_TOKEN`, Value: your npm token

**Usage in workflow**:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run Release Management
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          npm ci
          npm run release:execute
```

**Note**: `GITHUB_TOKEN` is automatically provided by GitHub Actions with appropriate permissions.

### GitLab CI

Store tokens as CI/CD variables:

1. Go to your project on GitLab
2. Click **Settings** → **CI/CD**
3. Expand **Variables** section
4. Click **Add variable**
5. Add variables:
   - Key: `GITHUB_TOKEN`, Value: your GitHub token, Protected: ✅, Masked: ✅
   - Key: `NPM_TOKEN`, Value: your npm token, Protected: ✅, Masked: ✅

**Usage in pipeline**:

```yaml
# .gitlab-ci.yml
release:
  stage: deploy
  script:
    - npm ci
    - npm run release:execute
  only:
    - main
```

Variables are automatically available as environment variables.

### Jenkins

Store tokens as credentials:

1. Go to **Manage Jenkins** → **Manage Credentials**
2. Select appropriate domain
3. Click **Add Credentials**
4. Add credentials:
   - Kind: **Secret text**
   - Secret: your token
   - ID: `github-token` or `npm-token`
   - Description: descriptive name

**Usage in Jenkinsfile**:

```groovy
pipeline {
    agent any
    
    environment {
        GITHUB_TOKEN = credentials('github-token')
        NPM_TOKEN = credentials('npm-token')
    }
    
    stages {
        stage('Release') {
            steps {
                sh 'npm ci'
                sh 'npm run release:execute'
            }
        }
    }
}
```

### CircleCI

Store tokens as environment variables:

1. Go to your project on CircleCI
2. Click **Project Settings** → **Environment Variables**
3. Click **Add Environment Variable**
4. Add variables:
   - Name: `GITHUB_TOKEN`, Value: your GitHub token
   - Name: `NPM_TOKEN`, Value: your npm token

**Usage in config**:

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  release:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - run: npm ci
      - run: npm run release:execute

workflows:
  release-workflow:
    jobs:
      - release:
          filters:
            branches:
              only: main
```

Environment variables are automatically available.

---

## Storing Credentials Securely

### Password Managers (Recommended)

**1Password**:
1. Create new item → **Password**
2. Title: `GitHub PAT - DesignerPunk`
3. Paste token in password field
4. Add notes: creation date, expiration, scopes

**LastPass**:
1. Add Item → **Secure Note**
2. Name: `GitHub PAT - DesignerPunk`
3. Paste token in notes
4. Add custom fields for metadata

**Bitwarden**:
1. Add Item → **Secure Note**
2. Name: `GitHub PAT - DesignerPunk`
3. Paste token in notes
4. Add custom fields for creation date, expiration

### Encrypted Files

**Using GPG** (macOS/Linux):

```bash
# Create encrypted file
echo "GITHUB_TOKEN=ghp_xxx" > tokens.txt
echo "NPM_TOKEN=npm_xxx" >> tokens.txt
gpg -c tokens.txt  # Creates tokens.txt.gpg
rm tokens.txt      # Remove plaintext

# Decrypt when needed
gpg -d tokens.txt.gpg
```

**Using 7-Zip** (Windows):

1. Create `tokens.txt` with your tokens
2. Right-click → **7-Zip** → **Add to archive**
3. Set strong password
4. Enable **Encrypt file names**
5. Delete original `tokens.txt`

### macOS Keychain

```bash
# Store token in keychain
security add-generic-password -a "$USER" -s "github-token" -w "ghp_xxx"

# Retrieve token
security find-generic-password -a "$USER" -s "github-token" -w
```

---

## Token Rotation

### When to Rotate

- ✅ Every 90 days (recommended)
- ✅ When token may have been exposed
- ✅ When team member with access leaves
- ✅ After security incident
- ✅ When changing token permissions

### Rotation Process

**GitHub Token**:
1. Generate new token (follow steps above)
2. Update environment variables with new token
3. Test new token works
4. Delete old token from GitHub settings
5. Update documentation with rotation date

**npm Token**:
1. Generate new token (follow steps above)
2. Update environment variables with new token
3. Test new token works
4. Revoke old token from npm settings
5. Update documentation with rotation date

### Rotation Checklist

- [ ] Generate new token
- [ ] Update local environment variables
- [ ] Update CI/CD secrets
- [ ] Test new token works
- [ ] Revoke old token
- [ ] Update password manager
- [ ] Document rotation date
- [ ] Set calendar reminder for next rotation

---

## Troubleshooting

### GitHub Token Issues

**Error: "Bad credentials"**
- Token is invalid or expired
- Token doesn't have required scopes
- Token was revoked
- **Solution**: Generate new token with correct scopes

**Error: "Resource not accessible by integration"**
- Token lacks required permissions
- Repository is private and token doesn't have `repo` scope
- **Solution**: Regenerate token with `repo` scope

**Error: "API rate limit exceeded"**
- Too many API requests
- **Solution**: Wait for rate limit reset or use authenticated requests

### npm Token Issues

**Error: "Unable to authenticate"**
- Token is invalid or expired
- Token was revoked
- **Solution**: Generate new token

**Error: "You do not have permission to publish"**
- Token doesn't have publish permissions
- Package name is already taken
- Not a member of organization (for scoped packages)
- **Solution**: Check token type (use Automation or Publish), verify package name

**Error: "Package name too similar to existing package"**
- npm prevents similar package names
- **Solution**: Choose different package name

### Environment Variable Issues

**Variables not available**
- Shell profile not sourced
- Wrong shell profile file
- Typo in variable name
- **Solution**: Source profile, check spelling, restart terminal

**Variables not persisting**
- Set in session only (not in profile)
- Profile not loaded on terminal start
- **Solution**: Add to correct profile file, restart terminal

---

## Security Checklist

Before using tokens in production:

- [ ] Tokens stored securely (password manager or encrypted)
- [ ] Tokens not committed to version control
- [ ] `.env` file added to `.gitignore`
- [ ] Tokens have minimum required permissions
- [ ] Expiration dates set (90 days recommended)
- [ ] Calendar reminders set for rotation
- [ ] CI/CD secrets configured correctly
- [ ] Tokens tested and working
- [ ] Team members know rotation process
- [ ] Backup access method documented

---

## Quick Reference

### Required Tokens

| Token | Purpose | Scopes | Format |
|-------|---------|--------|--------|
| GitHub PAT | Create releases, push tags | `repo`, `write:packages` | `ghp_xxx...` |
| npm Token | Publish packages | Automation or Publish | `npm_xxx...` |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub personal access token | Yes |
| `NPM_TOKEN` | npm authentication token | Yes |

### Verification Commands

```bash
# Test GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Test npm token
npm whoami --registry=https://registry.npmjs.org/

# Check environment variables
echo $GITHUB_TOKEN  # macOS/Linux
echo $env:GITHUB_TOKEN  # Windows PowerShell
```

---

## Related Documentation

- [Release Management Guide](./release-management-guide.md) - Complete release workflow
- [Configuration Reference](./configuration-reference.md) - Release configuration options
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues and solutions

---

*This guide provides comprehensive authentication setup instructions for the Release Management System. Keep tokens secure and rotate regularly.*
