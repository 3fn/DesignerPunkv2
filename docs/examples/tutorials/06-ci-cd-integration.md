# Tutorial: CI/CD Integration

**Difficulty**: Intermediate  
**Time**: 30 minutes  
**Prerequisites**: Completed [First Release](./01-first-release.md), CI/CD experience

---

## Overview

Learn how to integrate the Release Management System with CI/CD pipelines for automated releases.

## Supported CI/CD Platforms

- GitHub Actions (recommended)
- GitLab CI
- CircleCI
- Jenkins
- Any CI/CD with Node.js support

## GitHub Actions Integration

### Step 1: Create Workflow File

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  release:
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Execute release
        run: npm run release:cli release auto --skip-confirmation
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Step 2: Configure Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets:
   - `NPM_TOKEN`: Your npm authentication token
   - `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Step 3: Create CI/CD Configuration

Create `.kiro/release-config.json`:

```json
{
  "skipConfirmation": true,
  "verbose": true,
  "github": {
    "owner": "${GITHUB_OWNER}",
    "repo": "${GITHUB_REPO}",
    "token": "${GITHUB_TOKEN}"
  },
  "npm": {
    "token": "${NPM_TOKEN}",
    "publish": true
  }
}
```

### Step 4: Test Workflow

```bash
# Commit workflow file
git add .github/workflows/release.yml
git commit -m "Add release workflow"
git push origin main

# Monitor workflow execution
# Go to: https://github.com/owner/repo/actions
```

## GitLab CI Integration

### Step 1: Create Pipeline File

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - release

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
  only:
    - main

release:
  stage: release
  image: node:18
  script:
    - npm ci
    - npm run release:cli release auto --skip-confirmation
  only:
    - main
  variables:
    GITHUB_TOKEN: $GITHUB_TOKEN
    NPM_TOKEN: $NPM_TOKEN
```

### Step 2: Configure Variables

1. Go to Settings → CI/CD → Variables
2. Add variables:
   - `GITHUB_TOKEN`: Your GitHub token
   - `NPM_TOKEN`: Your npm token
   - Mark as "Protected" and "Masked"

## Best Practices

### 1. Test Before Release

Always run tests before releasing:

```yaml
- name: Run tests
  run: npm test

- name: Execute release
  run: npm run release:cli release auto --skip-confirmation
  if: success()  # Only release if tests pass
```

### 2. Use Dry Run for Testing

Test CI/CD configuration with dry run:

```yaml
- name: Test release (dry run)
  run: npm run release:cli release auto --dry-run --skip-confirmation
```

### 3. Conditional Releases

Only release when completion documents exist:

```yaml
- name: Check for completion documents
  id: check
  run: |
    if [ -n "$(find .kiro/specs/*/completion -name '*.md' -newer .git/FETCH_HEAD 2>/dev/null)" ]; then
      echo "has_changes=true" >> $GITHUB_OUTPUT
    fi

- name: Execute release
  if: steps.check.outputs.has_changes == 'true'
  run: npm run release:cli release auto --skip-confirmation
```

### 4. Notification on Failure

Send notifications when releases fail:

```yaml
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'Release failed',
        body: 'Automated release failed. Check workflow logs.'
      })
```

### 5. Manual Approval Gate

Require manual approval for production releases:

```yaml
release:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://github.com/${{ github.repository }}/releases
  steps:
    - name: Execute release
      run: npm run release:cli release auto --skip-confirmation
```

## Advanced Scenarios

### Scenario 1: Multi-Environment Releases

Release to staging first, then production:

```yaml
jobs:
  release-staging:
    runs-on: ubuntu-latest
    steps:
      - name: Release to staging
        run: npm run release:cli release auto --npm-tag staging
  
  release-production:
    needs: release-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Release to production
        run: npm run release:cli release auto --npm-tag latest
```

### Scenario 2: Scheduled Releases

Release on a schedule (e.g., weekly):

```yaml
on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM
  workflow_dispatch:
```

### Scenario 3: Release on Tag

Trigger release when tag is pushed:

```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Execute release
        run: npm run release:cli release auto --skip-confirmation
```

## Monitoring and Debugging

### View Workflow Logs

```bash
# GitHub Actions
# Go to: https://github.com/owner/repo/actions

# GitLab CI
# Go to: https://gitlab.com/owner/repo/-/pipelines
```

### Debug Failed Releases

1. **Check workflow logs** for error messages
2. **Review release manager logs**:
   ```yaml
   - name: Upload logs
     if: failure()
     uses: actions/upload-artifact@v3
     with:
       name: release-logs
       path: .kiro/logs/
   ```

3. **Test locally** with same configuration:
   ```bash
   export GITHUB_TOKEN=xxx
   export NPM_TOKEN=xxx
   npm run release:cli release auto --skip-confirmation --verbose
   ```

## Security Considerations

### 1. Protect Secrets

- ✅ Use CI/CD secret management
- ✅ Mark secrets as "Protected" and "Masked"
- ✅ Rotate tokens regularly
- ❌ Never commit tokens to repository

### 2. Limit Permissions

Use minimal required permissions:

```yaml
permissions:
  contents: write    # For creating releases
  packages: write    # For publishing packages
  # Don't grant unnecessary permissions
```

### 3. Verify Workflow Source

Only run workflows from trusted branches:

```yaml
on:
  push:
    branches: [main]  # Only main branch
```

### 4. Use Dependabot

Keep dependencies updated:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Troubleshooting

### Issue: "GITHUB_TOKEN permissions insufficient"

**Solution:** Update workflow permissions:
```yaml
permissions:
  contents: write
  packages: write
```

### Issue: "npm authentication failed"

**Solution:** Verify NPM_TOKEN secret is set correctly

### Issue: "Release triggered but nothing published"

**Solution:** Check if completion documents exist:
```bash
ls -la .kiro/specs/*/completion/*.md
```

## Next Steps

- **Monitor releases**: Set up notifications
- **Optimize workflow**: Add caching, parallel jobs
- **Add quality gates**: Code coverage, linting
- **Implement rollback**: Automatic rollback on failure

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Configuration Reference](../../configuration-reference.md)
- [Troubleshooting Guide](../../troubleshooting-guide.md)

---

**Previous**: [Multi-Package](./05-multi-package.md) | **Back to Examples**: [README](../README.md)
