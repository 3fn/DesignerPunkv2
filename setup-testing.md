# Testing Setup Guide

## Prerequisites: Install Node.js

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Click the green "LTS" button (Long Term Support version)
3. Download the installer for macOS
4. Run the downloaded `.pkg` file
5. Follow the installation wizard (click "Continue" and "Install")

### Step 2: Verify Installation
1. Open Terminal (Applications → Utilities → Terminal)
2. Type: `node --version` and press Enter
3. Type: `npm --version` and press Enter
4. You should see version numbers (like v20.x.x and 10.x.x)

## Install Testing Dependencies

### Step 3: Install Project Dependencies
1. In Terminal, navigate to your project folder:
   ```bash
   cd /path/to/your/DesignerPunk-v2/project
   ```
2. Install the testing packages:
   ```bash
   npm install
   ```
3. Wait for installation to complete (you'll see a progress bar)

## Run Tests

### Step 4: Run Your Tests
Once installation is complete, you can run tests with:

```bash
# Run all tests once
npm test

# Run tests and watch for changes
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## What Gets Installed

The following packages will be installed:
- **jest**: Testing framework
- **@types/jest**: TypeScript support for Jest
- **ts-jest**: Jest transformer for TypeScript
- **typescript**: TypeScript compiler

## Troubleshooting

### If you get permission errors:
Try using `sudo` before the npm command:
```bash
sudo npm install
```

### If installation is slow:
This is normal - npm downloads packages from the internet.

### If tests don't run:
Make sure you're in the correct project directory where `package.json` exists.

---

**Need help?** Come back to Kiro and let me know what step you're on!