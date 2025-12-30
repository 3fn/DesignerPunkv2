# Security Best Practices

**Date**: November 28, 2025  
**Last Reviewed**: 2025-12-30  
**Purpose**: Security guidelines for release management system  
**Audience**: DevOps engineers, security teams, system administrators

---

## Overview

This document provides comprehensive security guidelines for deploying and operating the DesignerPunk release management system. Following these practices ensures secure token management, safe automation, and protected release workflows.

---

## Table of Contents

1. [Token Management](#token-management)
2. [Token Rotation and Lifecycle](#token-rotation-and-lifecycle)
3. [Production Deployment Security](#production-deployment-security)
4. [CI/CD Security](#cicd-security)
5. [Access Control](#access-control)
6. [Audit and Monitoring](#audit-and-monitoring)
7. [Incident Response](#incident-response)
8. [Security Checklist](#security-checklist)

---

## Token Management

### GitHub Personal Access Tokens

**Required Permissions (Minimum Scope)**:
```
repo (Full control of private repositories)
  - repo:status (Access commit status)
  - repo_deployment (Access deployment status)
  - public_repo (Access public repositories)
workflow (Update GitHub Action workflows)
```

**Security Requirements**:
- ✅ Use fine-grained personal access tokens (PATs) when available
- ✅ Set expiration dates (maximum 90 days recommended)
- ✅ Limit token scope to specific repositories
- ✅ Use separate tokens for different environments (dev, staging, prod)
- ❌ Never use classic tokens with full repo access
- ❌ Never commit tokens to version control
- ❌ Never share tokens between team members

**Token Storage**:

**Local Development**:
```bash
# Store in environment variables (not in shell history)
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Or use .env file (add to .gitignore)
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx" >> .env
echo ".env" >> .gitignore
```

**CI/CD Environments**:
```yaml
# GitHub Actions - Use encrypted secrets
- name: Release
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm run release
```

**Production Servers**:
```bash
# Use secret management systems
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id github-token

# HashiCorp Vault
vault kv get secret/github-token

# Never store in plain text files
```

### npm Authentication Tokens

**Token Types**:
- **Automation tokens**: For CI/CD pipelines (recommended)
- **Publish tokens**: For manual publishing (legacy)
- **Read-only tokens**: For package installation only

**Security Requirements**:
- ✅ Use automation tokens with IP allowlisting when possible
- ✅ Enable 2FA on npm account before creating tokens
- ✅ Set token expiration (maximum 1 year)
- ✅ Use organization-level tokens for team projects
- ❌ Never use personal tokens for organization packages
- ❌ Never store tokens in package.json or .npmrc in version control

**Token Storage**:

**Local Development**:
```bash
# Use npm login (stores in ~/.npmrc)
npm login

# Or set token via environment variable
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxx"
```

**CI/CD Environments**:
```yaml
# GitHub Actions
- name: Setup npm
  run: echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
```

**Production Servers**:
```bash
# Use secret management (same as GitHub tokens)
# Never store in ~/.npmrc on shared servers
```

---

## Token Rotation and Lifecycle

### Rotation Schedule

**Recommended Rotation Frequency**:
- **GitHub tokens**: Every 90 days (or when team member leaves)
- **npm tokens**: Every 365 days (or when team member leaves)
- **Emergency rotation**: Immediately upon suspected compromise

### Rotation Procedure

**Step 1: Generate New Token**

**GitHub**:
1. Go to Settings → Developer settings → Personal access tokens
2. Click "Generate new token (fine-grained)"
3. Set expiration date (90 days from today)
4. Select repository access (specific repositories only)
5. Set permissions (repo, workflow)
6. Generate token and copy immediately

**npm**:
1. Go to Account → Access Tokens
2. Click "Generate New Token"
3. Select "Automation" type
4. Set expiration date (1 year from today)
5. Enable IP allowlisting if possible
6. Generate token and copy immediately

**Step 2: Update Token in All Locations**

**Local Development**:
```bash
# Update environment variable
export GITHUB_TOKEN="ghp_NEW_TOKEN_HERE"
export NPM_TOKEN="npm_NEW_TOKEN_HERE"

# Update .env file
sed -i 's/GITHUB_TOKEN=.*/GITHUB_TOKEN=ghp_NEW_TOKEN_HERE/' .env
sed -i 's/NPM_TOKEN=.*/NPM_TOKEN=npm_NEW_TOKEN_HERE/' .env
```

**CI/CD Environments**:
```bash
# GitHub Actions - Update repository secrets
# Go to Settings → Secrets and variables → Actions
# Update GITHUB_TOKEN and NPM_TOKEN secrets

# Or use GitHub CLI
gh secret set GITHUB_TOKEN --body "ghp_NEW_TOKEN_HERE"
gh secret set NPM_TOKEN --body "npm_NEW_TOKEN_HERE"
```

**Production Servers**:
```bash
# Update in secret management system
aws secretsmanager update-secret --secret-id github-token --secret-string "ghp_NEW_TOKEN_HERE"
vault kv put secret/github-token value="ghp_NEW_TOKEN_HERE"
```

**Step 3: Verify New Token Works**

```bash
# Test GitHub token
curl -H "Authorization: token ghp_NEW_TOKEN_HERE" https://api.github.com/user

# Test npm token
npm whoami --registry=https://registry.npmjs.org/

# Run release dry-run
npm run release -- --dry-run
```

**Step 4: Revoke Old Token**

**GitHub**:
1. Go to Settings → Developer settings → Personal access tokens
2. Find old token in list
3. Click "Delete" or "Revoke"
4. Confirm revocation

**npm**:
1. Go to Account → Access Tokens
2. Find old token in list
3. Click "Delete"
4. Confirm deletion

**Step 5: Document Rotation**

```bash
# Create rotation log entry
echo "$(date): Rotated GitHub token (expires $(date -d '+90 days'))" >> token-rotation.log
echo "$(date): Rotated npm token (expires $(date -d '+1 year'))" >> token-rotation.log

# Store log securely (not in version control)
```

### Token Lifecycle Management

**Token Creation**:
- Document token purpose and scope
- Set expiration date
- Record creation date and creator
- Store securely immediately

**Token Usage**:
- Monitor token usage via API logs
- Track which systems use which tokens
- Review permissions regularly
- Audit access patterns

**Token Expiration**:
- Set calendar reminders 2 weeks before expiration
- Plan rotation during low-activity periods
- Communicate rotation schedule to team
- Have backup tokens ready for emergency

**Token Revocation**:
- Revoke immediately upon compromise
- Revoke when team member leaves
- Revoke unused tokens after 30 days
- Document revocation reason and date

---

## Production Deployment Security

### Pre-Deployment Security Checklist

**Environment Configuration**:
- [ ] All tokens stored in secret management system (not environment files)
- [ ] Token permissions follow principle of least privilege
- [ ] Token expiration dates set and documented
- [ ] Backup tokens generated and stored securely
- [ ] Environment variables validated and tested

**Access Control**:
- [ ] Production access limited to authorized personnel only
- [ ] 2FA enabled for all accounts with production access
- [ ] SSH keys rotated and documented
- [ ] Service accounts use dedicated tokens (not personal tokens)
- [ ] Audit logging enabled for all production access

**Network Security**:
- [ ] Firewall rules configured to allow only necessary traffic
- [ ] IP allowlisting enabled for npm tokens (if supported)
- [ ] TLS/SSL certificates valid and up to date
- [ ] VPN required for production access (if applicable)
- [ ] Rate limiting configured for API endpoints

**Code Security**:
- [ ] Dependencies audited for vulnerabilities (`npm audit`)
- [ ] No secrets committed to version control
- [ ] `.gitignore` includes all sensitive files
- [ ] Code signing enabled for releases
- [ ] Integrity checks enabled for published packages

### Deployment Procedure

**Step 1: Pre-Deployment Validation**

```bash
# Audit dependencies
npm audit --production

# Check for secrets in code
git secrets --scan

# Verify environment configuration
npm run release -- --dry-run --validate-config

# Run security tests
npm run test:security
```

**Step 2: Deploy to Staging**

```bash
# Deploy to staging environment first
ENVIRONMENT=staging npm run release

# Verify staging deployment
npm run verify:staging

# Run integration tests
npm run test:integration:staging
```

**Step 3: Production Deployment**

```bash
# Deploy to production with approval
ENVIRONMENT=production npm run release

# Verify production deployment
npm run verify:production

# Monitor for errors
npm run monitor:production
```

**Step 4: Post-Deployment Verification**

```bash
# Verify release published correctly
npm view @designerpunk/tokens version

# Check GitHub release created
gh release view v1.2.3

# Verify changelog updated
cat CHANGELOG.md | head -n 20

# Monitor error rates
npm run monitor:errors
```

### Rollback Procedure

**When to Rollback**:
- Security vulnerability discovered in release
- Critical bug affecting production users
- Token compromise detected
- Unauthorized changes detected

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
echo "$(date): Rolled back v1.2.3 due to [reason]" >> rollback.log
```

---

## CI/CD Security

### GitHub Actions Security

**Workflow Permissions**:
```yaml
# Limit permissions to minimum required
permissions:
  contents: write  # For creating releases
  packages: write  # For publishing packages
  # Don't grant unnecessary permissions
```

**Secret Management**:
```yaml
# Use encrypted secrets
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

# Never log secrets
- name: Release
  run: npm run release
  # Don't use: run: echo $GITHUB_TOKEN (logs secret!)
```

**Dependency Security**:
```yaml
# Pin action versions to specific commits
- uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab  # v3.5.2
# Don't use: uses: actions/checkout@v3 (mutable tag)

# Audit dependencies before release
- name: Audit
  run: npm audit --production --audit-level=high
```

**Branch Protection**:
```yaml
# Require approval for releases
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Require status checks to pass
# Configure in Settings → Branches → Branch protection rules
```

### Security Scanning

**Automated Security Checks**:
```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Dependency Audit
        run: npm audit --production --audit-level=high
      
      - name: Secret Scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
      
      - name: SAST Scanning
        uses: github/codeql-action/analyze@v2
```

---

## Access Control

### Role-Based Access Control (RBAC)

**Roles and Permissions**:

**Release Manager**:
- Create and publish releases
- Manage release configuration
- Access production tokens
- Approve release workflows

**Developer**:
- Create release triggers
- View release status
- Test releases in staging
- No production token access

**Viewer**:
- View release history
- Read release notes
- Monitor release status
- No write access

### Team Access Management

**GitHub Repository Access**:
```bash
# Add team member with appropriate role
gh api repos/:owner/:repo/collaborators/:username -X PUT -f permission=push

# Review team access regularly
gh api repos/:owner/:repo/collaborators

# Remove access when team member leaves
gh api repos/:owner/:repo/collaborators/:username -X DELETE
```

**npm Organization Access**:
```bash
# Add team member to organization
npm org set <org> <username> developer

# Review organization members
npm org ls <org>

# Remove member when they leave
npm org rm <org> <username>
```

### Service Account Management

**Creating Service Accounts**:
```bash
# GitHub - Create machine user account
# 1. Create new GitHub account (e.g., designerpunk-bot)
# 2. Add to organization with limited permissions
# 3. Generate token for service account only
# 4. Use service account token in CI/CD

# npm - Create automation token
# 1. Create token with "Automation" type
# 2. Enable IP allowlisting
# 3. Set expiration date
# 4. Document token purpose
```

**Service Account Security**:
- Use dedicated accounts for automation (not personal accounts)
- Limit permissions to minimum required
- Rotate tokens regularly (same schedule as personal tokens)
- Monitor service account activity
- Disable accounts when no longer needed

---

## Audit and Monitoring

### Audit Logging

**What to Log**:
- Release creation and publication
- Token usage and rotation
- Configuration changes
- Access attempts (successful and failed)
- Error conditions and failures

**Log Format**:
```json
{
  "timestamp": "2025-11-28T10:30:00Z",
  "event": "release_published",
  "user": "release-manager",
  "version": "1.2.3",
  "packages": ["@designerpunk/tokens"],
  "status": "success",
  "ip_address": "192.168.1.100"
}
```

**Log Storage**:
- Store logs in centralized logging system
- Retain logs for minimum 90 days (compliance requirement)
- Encrypt logs at rest and in transit
- Restrict log access to authorized personnel
- Regular log review and analysis

### Monitoring and Alerting

**Metrics to Monitor**:
- Release success/failure rate
- Token usage patterns
- API rate limit consumption
- Error rates and types
- Deployment frequency

**Alert Conditions**:
```yaml
# Example alert configuration
alerts:
  - name: Release Failure
    condition: release_status == "failed"
    severity: high
    notify: [release-team, on-call]
  
  - name: Token Expiration
    condition: token_expires_in < 14 days
    severity: medium
    notify: [release-manager]
  
  - name: Unusual Activity
    condition: release_count > 10 per hour
    severity: high
    notify: [security-team]
```

**Monitoring Tools**:
- GitHub Actions logs and metrics
- npm registry download statistics
- Custom monitoring dashboards
- Error tracking services (Sentry, Rollbar)
- Log aggregation (ELK, Splunk)

---

## Incident Response

### Security Incident Types

**Token Compromise**:
- Token leaked in public repository
- Token exposed in logs or error messages
- Unauthorized token usage detected
- Token stolen via phishing or social engineering

**Unauthorized Access**:
- Unauthorized release published
- Configuration changed without approval
- Production access from unknown IP
- Suspicious API usage patterns

**Supply Chain Attack**:
- Compromised dependency detected
- Malicious code in release
- Package hijacking attempt
- Typosquatting attack

### Incident Response Procedure

**Step 1: Detect and Assess**

```bash
# Check for token leaks in public repositories
git log --all --full-history --source -- '*token*' '*secret*' '*.env'

# Review recent releases
npm view @designerpunk/tokens versions --json

# Check GitHub audit log
gh api /orgs/:org/audit-log

# Review npm access logs
npm audit log
```

**Step 2: Contain**

```bash
# Immediately revoke compromised tokens
# GitHub: Settings → Developer settings → Personal access tokens → Delete
# npm: Account → Access Tokens → Delete

# Unpublish compromised release (if within 72 hours)
npm unpublish @designerpunk/tokens@1.2.3

# Delete compromised GitHub release
gh release delete v1.2.3

# Block suspicious IP addresses
# Configure in firewall or API gateway
```

**Step 3: Eradicate**

```bash
# Rotate all tokens
# Follow token rotation procedure (see above)

# Scan codebase for malicious code
npm audit
git secrets --scan

# Review and update access controls
# Remove unauthorized users
# Update permissions

# Patch vulnerabilities
npm update
npm audit fix
```

**Step 4: Recover**

```bash
# Publish clean release
npm run release

# Verify integrity
npm run verify:production

# Restore normal operations
# Monitor for continued suspicious activity
```

**Step 5: Document and Learn**

```markdown
# Incident Report Template

## Incident Summary
- Date: [YYYY-MM-DD]
- Type: [Token Compromise / Unauthorized Access / Supply Chain]
- Severity: [Low / Medium / High / Critical]

## Timeline
- [HH:MM] Incident detected
- [HH:MM] Containment actions taken
- [HH:MM] Eradication completed
- [HH:MM] Recovery verified

## Root Cause
[Description of how incident occurred]

## Impact
- Affected systems: [List]
- Affected users: [Count/Description]
- Data exposure: [Yes/No, Details]

## Response Actions
1. [Action taken]
2. [Action taken]
3. [Action taken]

## Lessons Learned
- What went well: [List]
- What could improve: [List]
- Action items: [List with owners and deadlines]

## Prevention Measures
- [Measure 1]
- [Measure 2]
- [Measure 3]
```

---

## Security Checklist

### Pre-Release Security Checklist

**Token Security**:
- [ ] All tokens stored securely (not in version control)
- [ ] Token permissions follow least privilege principle
- [ ] Token expiration dates set and documented
- [ ] Backup tokens available for emergency rotation
- [ ] Token rotation schedule documented and followed

**Code Security**:
- [ ] Dependencies audited (`npm audit` clean)
- [ ] No secrets in code or configuration files
- [ ] `.gitignore` includes all sensitive files
- [ ] Code reviewed by at least one other person
- [ ] Security tests passing

**Access Control**:
- [ ] Production access limited to authorized personnel
- [ ] 2FA enabled for all accounts with production access
- [ ] Service accounts use dedicated tokens
- [ ] Access logs reviewed regularly
- [ ] Unused accounts disabled

**Configuration Security**:
- [ ] Release configuration validated
- [ ] Environment variables set correctly
- [ ] Network security configured (firewall, VPN)
- [ ] TLS/SSL certificates valid
- [ ] Rate limiting configured

**Monitoring and Logging**:
- [ ] Audit logging enabled
- [ ] Monitoring dashboards configured
- [ ] Alert conditions defined
- [ ] Incident response plan documented
- [ ] Log retention policy followed

### Post-Release Security Checklist

**Verification**:
- [ ] Release published successfully
- [ ] Package integrity verified
- [ ] GitHub release created correctly
- [ ] Changelog updated
- [ ] No errors in production logs

**Monitoring**:
- [ ] Error rates within normal range
- [ ] No security alerts triggered
- [ ] Token usage patterns normal
- [ ] API rate limits not exceeded
- [ ] User feedback reviewed

**Documentation**:
- [ ] Release documented in changelog
- [ ] Security changes documented
- [ ] Known issues documented
- [ ] Rollback procedure tested
- [ ] Incident response plan updated

---

## Additional Resources

### Security Tools

**Dependency Scanning**:
- `npm audit` - Built-in npm vulnerability scanner
- Snyk - Continuous dependency monitoring
- Dependabot - Automated dependency updates
- WhiteSource - Enterprise dependency management

**Secret Scanning**:
- git-secrets - Prevent committing secrets
- TruffleHog - Find secrets in git history
- GitHub Secret Scanning - Automatic secret detection
- GitGuardian - Real-time secret detection

**Code Analysis**:
- ESLint security plugins - Static code analysis
- SonarQube - Code quality and security
- CodeQL - Semantic code analysis
- Semgrep - Pattern-based code scanning

### Security Standards

**Compliance Frameworks**:
- OWASP Top 10 - Web application security risks
- CIS Controls - Cybersecurity best practices
- NIST Cybersecurity Framework - Risk management
- SOC 2 - Service organization controls

**npm Security**:
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [npm Token Security](https://docs.npmjs.com/about-access-tokens)
- [npm 2FA Guide](https://docs.npmjs.com/configuring-two-factor-authentication)

**GitHub Security**:
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [GitHub Token Security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

---

## Conclusion

Security is an ongoing process, not a one-time checklist. Regularly review and update these practices as threats evolve and new security features become available.

**Key Takeaways**:
1. **Token Management**: Store securely, rotate regularly, limit scope
2. **Access Control**: Least privilege, 2FA, regular audits
3. **Monitoring**: Log everything, alert on anomalies, review regularly
4. **Incident Response**: Detect quickly, contain immediately, learn always

For questions or security concerns, contact the security team or refer to the incident response procedure.

---

**Last Updated**: November 28, 2025  
**Next Review**: February 28, 2026  
**Document Owner**: Security Team
