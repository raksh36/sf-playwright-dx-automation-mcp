# CloudSense Test Automation Suite

This repository contains a comprehensive Playwright test automation suite for testing the CloudSense Product Definition compilation workflow in Salesforce.

## 🏗️ Test Suite Architecture

```
tests/
├── pages/                          # Page Object Models
│   ├── SalesforceBasePage.ts       # Base page functionality
│   ├── CloudSenseAppPage.ts        # CloudSense app navigation
│   └── ProductDefinitionsPage.ts   # Product definitions interactions
├── utils/                          # Utility classes
│   ├── SalesforceAuth.ts           # Salesforce authentication
│   └── TestHelpers.ts              # Test helper functions
├── cloudsense-product-compilation.spec.ts  # Main test scenarios
└── cloudsense-error-handling.spec.ts       # Error handling tests
```

## 🚀 Quick Start

### Prerequisites

1. **Salesforce CLI** installed and authenticated
2. **Node.js** (LTS version)
3. **CloudSense Solution Management** app installed in your Salesforce org

### Setup

1. **Authenticate with Salesforce:**
   ```bash
   sf org login web -a studentr36dec24c19
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

### Running Tests

#### Option 1: Using npm scripts
```bash
# Run all CloudSense tests
npm run test:cloudsense

# Run with headed browser (visible)
npm run test:cloudsense:headed

# Run error handling tests
npm run test:errors

# View test report
npm run test:report
```

#### Option 2: Using execution scripts
```bash
# Windows
run-cloudsense-tests.bat

# Linux/Mac
chmod +x run-cloudsense-tests.sh
./run-cloudsense-tests.sh
```

#### Option 3: Direct Playwright commands
```bash
# Run specific test file
npx playwright test cloudsense-product-compilation.spec.ts

# Run with debug mode
npx playwright test --debug

# Run with specific browser
npx playwright test --project=chromium
```

## 📋 Test Coverage

### Acceptance Criteria Covered

- **AC-001:** Salesforce Org Authentication
- **AC-002:** CloudSense App Access
- **AC-003:** Navigate to Product Definitions
- **AC-004:** Select Training Product Models View
- **AC-005:** Verify Training Product Data
- **AC-006:** Compile Product Definitions - No Selection Error
- **AC-007:** Compile Product Definitions - With Selection
- **AC-008:** Select Specific Products Only
- **AC-009:** End-to-End Workflow Validation
- **AC-010:** Handle Network Timeouts
- **AC-011:** Handle Missing Data Gracefully
- **AC-012:** Verify Page Refresh Handling
- **AC-013:** Handle Authentication Failures
- **AC-014:** Verify Element Interaction Retry Logic

### Test Scenarios

1. **Authentication Tests**
   - Verify Salesforce org connection
   - Handle authentication failures
   - Session management

2. **Navigation Tests**
   - CloudSense app access
   - Product Definitions navigation
   - List view selection

3. **Data Validation Tests**
   - Training product models verification
   - Required products presence
   - Data integrity checks

4. **Compilation Tests**
   - No selection error handling
   - Successful batch job initiation
   - Specific product selection

5. **Error Handling Tests**
   - Network timeout handling
   - Missing data scenarios
   - Page refresh recovery

## 🔧 Configuration

### Environment Variables

```bash
# Set Salesforce instance URL
export SF_INSTANCE_URL="https://your-org.my.salesforce.com"

# Set test environment
export NODE_ENV="test"
```

### Test Configuration

Update `test-config.json` to match your org settings:

```json
{
  "salesforce": {
    "orgAlias": "your-org-alias",
    "instanceUrl": "https://your-org.my.salesforce.com"
  },
  "cloudsense": {
    "expectedTotalItems": 10,
    "requiredProducts": [
      "Training Generic Child AddOn Subscription",
      "Training Generic Deliverable",
      "Training Generic Main Subscription",
      "Training Generic Subscription"
    ]
  }
}
```

## 📊 Test Reports

After running tests, view results in:

- **HTML Report:** `playwright-report/index.html`
- **JSON Results:** `test-results.json`
- **JUnit XML:** `test-results.xml`
- **Screenshots:** `screenshots/` (on failure)

## 🔄 CI/CD Integration

The test suite is configured to run automatically via GitHub Actions:

- **Triggers:** Push to main/master/develop, Pull requests, Scheduled runs
- **Environment:** Ubuntu with Salesforce CLI
- **Artifacts:** Test reports, screenshots, and results

### Required GitHub Secrets

```
SF_AUTH_URL=force://PlatformCLI::...
SF_INSTANCE_URL=https://your-org.my.salesforce.com
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failures**
   ```bash
   # Re-authenticate with Salesforce
   sf org login web -a studentr36dec24c19
   ```

2. **Browser Installation Issues**
   ```bash
   # Reinstall Playwright browsers
   npx playwright install --with-deps --force
   ```

3. **Test Timeouts**
   - Check network connectivity
   - Verify Salesforce org is accessible
   - Review timeout configurations in `playwright.config.ts`

4. **Element Not Found Errors**
   - Verify CloudSense app is installed
   - Check if training data exists in the org
   - Review page object locators

### Debug Mode

Run tests in debug mode for step-by-step execution:

```bash
npx playwright test --debug cloudsense-product-compilation.spec.ts
```

## 📈 Performance Metrics

- **Target Execution Time:** < 2 minutes per test suite
- **Success Rate:** 95%+ across multiple runs
- **Browser Support:** Chromium (primary), Firefox/Safari (optional)

## 🤝 Contributing

1. Follow the Page Object Model pattern
2. Add comprehensive error handling
3. Include meaningful assertions
4. Update test documentation
5. Maintain screenshot capabilities for debugging

## 📝 Test Data Requirements

- CloudSense Solution Management app installed
- Training Product Models view with 10+ items
- All 4 target training products present and active
- Appropriate user permissions for Product Definitions

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Salesforce DX CLI Guide](https://developer.salesforce.com/tools/sfdxcli)
- [CloudSense Documentation](https://cloudsense.com/documentation)
