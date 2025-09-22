# AI-Assisted ATDD to Playwright UI Automation (Generic Guide)

This guide explains how to turn Acceptance Test-Driven Development (ATDD) criteria into stable Playwright UI automation with the help of AI. It focuses on making acceptance criteria executable, quickly validating developer changes, and converting verified flows into maintainable Playwright tests.

## Why use AI for ATDD → UI automation?

- Accelerate test creation directly from acceptance criteria (AC)
- Validate developer changes match intent before writing low-level selectors
- Reduce flakiness by iterating on waits/locators with assisted troubleshooting
- Keep tests aligned with evolving requirements

## End-to-end workflow

1) Collect context
- Acceptance criteria (ticket, PR description, README, ADR)
- Screens/URLs involved, required data, user roles
- Any domain constraints and success signals

2) Ask AI to plan coverage
- Produce a coverage matrix mapping each AC → user journey steps → assertions
- Identify preconditions (data setup), invariants, and negative paths
- Propose a Page Object Model (POM) outline and selectors strategy

3) Scaffold tests with AI
- Generate page objects and test skeletons (one spec per scenario or feature)
- Prefer semantic selectors (roles/names), avoid brittle CSS/XPath
- Add stable waits (e.g., domcontentloaded, visible shell elements), not networkidle

4) Execute and iterate
- Run tests; inspect failures (trace/video/screenshots)
- Ask AI to adjust selectors/waits and retry until green
- Keep assertions aligned to AC “Then” clauses (observable behavior)

5) Codify and commit
- Convert the stabilized flows into spec files and POMs
- Commit with a short AC coverage note; open PR
- Add CI step to run the relevant specs on PRs touching the feature

6) Maintain and evolve
- When AC changes, repeat steps 2–5
- Periodically de-flake selectors and centralize waits in POMs/helpers

## How to drive this in Cursor (example prompts)

- Plan coverage
```text
You are an SDET. Based on the AC below, produce:
- AC → steps → assertions matrix
- Preconditions/data needs
- POM outline (classes, key locators)
AC:
1) Given … When … Then …
2) …
```

- Generate page objects
```text
Create Playwright POMs for the above plan. Use ARIA roles/getByRole and avoid brittle selectors. Add wait helpers for shell readiness and visible spinners.
```

- Generate tests
```text
Create Playwright specs for each AC. Use the POMs, implement Then assertions exactly. Add retries only where idempotent.
```

- Stabilize selectors/waits
```text
Here is the failing trace snapshot and error. Propose selector/wait fixes and update the POM methods, not the test.
```

- Validate dev changes
```text
Given this PR diff and AC list, identify impacted scenarios. Generate/rerun focused tests and summarize pass/fail against each AC.
```

## Best practices (generic)

- Selectors: Use roles and accessible names; scope to regions (main, dialog); avoid nth unless deterministic
- Waits: Prefer `domcontentloaded` and visible shell elements; avoid `networkidle` for apps with long polling
- Spinners: Wait for invisible/hidden spinners instead of zero spinner nodes
- Assertions: Tie directly to AC outcomes (URL, title, toast, table state, totals, permissions)
- Data: Seed via API/CLI when possible; ensure idempotency (unique names, or cleanup)
- Page Objects: Centralize selectors/waits; keep tests readable and assertion-focused
- CI: Run impacted specs on PR; capture trace/video/screenshots; surface an AC coverage summary

## From AC to code: minimal template

- POM skeleton
```ts
export class FeaturePage {
  constructor(private page: Page) {}
  readonly newButton = this.page.getByRole('button', { name: 'New', exact: true });
  async openList(url: string) { await this.page.goto(url, { waitUntil: 'domcontentloaded' }); }
  async ready() { await this.page.getByRole('button', { name: 'App Launcher' }).waitFor(); }
}
```

- Spec skeleton
```ts
test('AC-001: Given X When Y Then Z', async ({ page }) => {
  const feature = new FeaturePage(page);
  await feature.openList(baseUrl + '/list');
  await feature.ready();
  await feature.newButton.click();
  // … fill form, submit
  await expect(page).toHaveURL(/expected/);
  await expect(page.getByText('Success')).toBeVisible();
});
```

## Using MCP (optional)

- Playwright MCP: Let AI drive a live browser for discovery/trial runs; convert stabilized flows into code
- CLI/Org MCP: Generate/validate test data before UI steps (e.g., create records)

---

# Example Implementation (Salesforce + CloudSense)

The sections below illustrate one concrete implementation using Salesforce and CloudSense. Treat them as examples; adapt folder names and selectors to your app.

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

## ATDD to Playwright UI Automation

This section explains how to convert ATDD-style acceptance criteria (Given/When/Then) into maintainable Playwright tests using the Page Object Model.

### What is ATDD?

- **ATDD**: Acceptance Test-Driven Development captures user-focused behavior before implementation.
- **Goal**: Make acceptance criteria executable, living documentation.

### Conversion Workflow

1. **Capture criteria**: Write scenarios in Given/When/Then or bullet ACs.
2. **Identify pages and data**:
   - Pages, key UI elements, and preconditions (e.g., required records).
   - Prefer data setup via CLI (SOQL/Apex) when possible for speed and reliability.
3. **Map steps to POM methods**:
   - Create/reuse page objects in `tests/pages/`.
   - Keep selectors robust (roles, accessible names).
4. **Write a test skeleton**:
   - Use `test.beforeEach` for auth and baseline navigation.
   - Translate Given/When/Then to arrange/act/assert blocks.
5. **Stabilize waits**:
   - Avoid `networkidle` in Salesforce; use `domcontentloaded` + visible shell elements.
   - Wait for visible spinners to hide (not total absence of spinner nodes).
6. **Assertions**:
   - Align each Then with explicit `expect` checks.
7. **CI-ready**:
   - Keep tests idempotent; ensure reruns won’t fail due to existing records.
   - Use project config (`SF_INSTANCE_URL`, org alias) and GitHub Actions.

### Mapping Given/When/Then

Example ATDD scenario (README Exercise 2):

```gherkin
Scenario: Create Opportunity and configure Training Mobile Solution
  Given I am authenticated in Lightning Experience
  When I create an Opportunity named "My Mobile Solution Sale" for Account "Acme"
    And I set Stage to "Prospecting" and Close Date to today in GBP
    And I click Create Solution and Add New Solution
    And I select the "Training Mobile Solution" template and Add
    And I set Configuration Name to "Training Mobile Solution" and Contract Term to 36
    And I open the Training Mobile Plan tab and click + Mobile Plan
    And I choose Plan Type "Mobile Plan", Plan "Lx36", Tariff "Default Rate Card", and Save
    And I open Add-Ons, click +Add new, select an Add-On, and Add to configuration
    And I return to Details and click Calculate Totals, then open Pricing Summary and go back to basket
  Then I remain on the configured Solution and see expected UI
```

Equivalent Playwright test (excerpt):

```ts
// tests/cloudsense-exercise-2.spec.ts (see repo for full test)
test('Create Opportunity and Configure Solution', async ({ page }) => {
  await page.goto(`${testConfig.salesforce.instanceUrl}/lightning/o/Opportunity/list`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Opportunities', exact: true })).toBeVisible();
  await page.getByRole('main').getByRole('button', { name: 'New', exact: true }).click();

  await page.getByLabel('Opportunity Name').fill('My Mobile Solution Sale');
  await page.getByLabel('Account Name').fill('Acme');
  await page.getByLabel('Stage').click();
  await page.getByRole('option', { name: /Prospecting/ }).click();
  await page.getByLabel('Close Date').fill(new Date().toISOString().slice(0, 10));
  await page.getByRole('button', { name: /^Save$/ }).click();

  await page.getByRole('button', { name: /Create Solution/ }).click();
  await page.getByRole('button', { name: /Add New Solution/ }).click();
  await page.getByRole('row', { name: /Training Mobile Solution/ }).getByRole('button', { name: /Select|Add/ }).click();
  await page.getByRole('button', { name: /^Add$/ }).click();

  await page.getByLabel(/Configuration Name/).fill('Training Mobile Solution');
  await page.getByLabel(/Contract Term/).fill('36');
  // ... (rest of steps)
});
```

### Best Practices

- **Page Objects**: Encapsulate navigation and element access in `tests/pages/`.
- **Selectors**:
  - Prefer ARIA roles + names: `getByRole('button', { name: 'New' })`.
  - Avoid brittle CSS/XPath; avoid `nth()` unless stable.
- **Waits**:
  - Use `waitUntil: 'domcontentloaded'` + shell readiness (e.g., App Launcher).
  - Prefer visibility waits over `networkidle` in Salesforce.
- **Flakiness**:
  - Use `TestHelpers.waitForNoSpinners()` which waits for visible spinners to hide.
  - Implement `retryAction` for transient actions.
- **Data**:
  - Use `SalesforceData` (`soql`, `apex`) to seed or validate when needed.
  - Keep tests idempotent (e.g., unique names, cleanup if necessary).
- **Auth**:
  - `SalesforceAuth.authenticateInBrowser()` uses frontdoor URL; avoid typing creds.

### Repo Utilities and Patterns

- `tests/utils/SalesforceAuth.ts`: Auth via CLI frontdoor.
- `tests/utils/TestHelpers.ts`: Spinner waits, retries, screenshot dir.
- `tests/utils/SalesforceData.ts`: SOQL/Apex helpers (optional setup/teardown).
- `tests/pages/*`: Page Objects for Salesforce/CloudSense.

### Checklist (per scenario)

- **Given**: Authenticated, baseline page loaded, seed data if required.
- **When**: Actions scripted via POM + robust selectors.
- **Then**: Assertions match acceptance criteria; include URL/title/state checks.
- **Stability**: Proper waits; handle spinners; avoid network idle; add retries if needed.
- **CI**: Independent of other tests; no manual steps; artifacts captured on failure.
