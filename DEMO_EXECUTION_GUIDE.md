# Demo Execution Guide - Ready-to-Use Prompts

## 🎬 Pre-Demo Setup Commands

### 1. Verify MCP Server Status
```
Check the status of all three MCP servers:
1. Playwright MCP Server
2. Salesforce DX MCP Server  
3. Atlassian MCP Server

Confirm they are connected and ready for automation.
```

### 2. Verify Salesforce Authentication
```
Using Salesforce DX MCP, verify authentication status for org alias "studentr36dec24c19" and show me the org details including instance URL and connection status.
```

### 3. Pre-flight Check
```
Navigate to the Salesforce org and verify that:
1. CloudSense Solution Management app is accessible
2. Product Definitions tab loads successfully
3. Training Product Models view contains the expected data

Take a screenshot to confirm readiness.
```

---

## 🚀 Live Demo Prompts (Copy-Paste Ready)

### **DEMO SECTION 1: Product Definition Compilation**

```
Execute Exercise 1 from the README using Playwright MCP:

GOAL: Automate CloudSense product definition compilation

STEPS:
1. Open browser and navigate to the CloudSense Solution Management App
2. Click on the "Product Definitions" tab
3. Select the "Training Product Models" view from the list view dropdown
4. Wait for data to load and take a screenshot
5. Select these specific products by checking their checkboxes:
   - Training Generic Child AddOn Subscription
   - Training Generic Deliverable  
   - Training Generic Main Subscription
   - Training Generic Subscription
6. Click the "Compile Product Definitions" button
7. Wait for and confirm batch job initiation
8. Take a final screenshot showing success

REQUIREMENTS:
- Use robust selectors that work with Salesforce Lightning UI
- Handle loading states and spinners appropriately
- Provide status updates as you progress through each step
- Take screenshots at key milestones
- Handle any errors gracefully with retry logic

START NOW.
```

### **DEMO SECTION 2: Complex Opportunity Workflow**

```
Execute Exercise 2 from the README using Playwright MCP:

GOAL: Create opportunity and configure Training Mobile Solution

DETAILED STEPS:
1. Navigate to Opportunities tab in Salesforce
2. Click "New" to create a new Opportunity
3. Fill in the form with these EXACT values:
   - Opportunity Name: "Demo Mobile Solution Sale [current timestamp]"
   - Account Name: "Acme" 
   - Stage: "Prospecting"
   - Close Date: Today's date
   - Opportunity Currency: "GBP" (if field is available)
4. Save the opportunity
5. Click "Create Solution" button on the opportunity record
6. Click "Add New Solution" 
7. Select "Training Mobile Solution" from the solution templates
8. Click "Add" to add the template
9. Enter configuration details:
   - Configuration Name: "Training Mobile Solution"
   - Contract Term: "36"
10. Navigate to "Training Mobile Plan" tab
11. Click "+ Mobile Plan" button
12. Fill in plan details:
    - Plan Type: "Mobile Plan"
    - Plan: "Lx36" 
    - Tariff: "Default Rate Card"
13. Save the plan
14. Go to "Add-Ons" tab
15. Click "+Add new" button
16. Select the first available add-on by checking its checkbox
17. Click "Add to configuration"
18. Return to "Details" tab
19. Click "Calculate Totals" button
20. Click the "Pricing Summary" panel to expand it
21. Click "Back to basket" if the button is available

REQUIREMENTS:
- Take screenshots after completing major sections (opportunity creation, solution setup, plan configuration)
- Handle dynamic UI elements and loading states
- Use retry logic for any failing interactions
- Provide running commentary on progress
- If any step fails, adapt and continue with remaining steps

BEGIN EXECUTION NOW.
```

### **DEMO SECTION 3: Atlassian Integration**

```
Using Atlassian MCP server, create documentation for our automation demo:

GOAL: Demonstrate cross-platform integration by documenting our Salesforce automation in Atlassian tools

TASKS:
1. CREATE JIRA ISSUE:
   - Search for available projects and select an appropriate one
   - Create a new Story with these details:
     * Summary: "Automated CloudSense Demo - Product Compilation & Opportunity Creation"
     * Description: "Successfully demonstrated UI automation using Cursor MCP servers. Completed:
       - Product Definition compilation for 4 training products
       - End-to-end opportunity creation with mobile solution configuration  
       - Cross-platform integration between Salesforce and Atlassian
       
       This proves the viability of natural language driven enterprise automation."
     * Priority: Medium
     * Labels: automation, demo, cloudsense

2. SEARCH CONFLUENCE:
   - Search for pages containing "automation" or "testing" 
   - Show me the top 3 most relevant results

3. CREATE CONFLUENCE COMMENT:
   - If you find a relevant automation or testing page, add a comment:
     "✅ Successfully completed live UI automation demo using Cursor MCP servers. Automated complex CloudSense workflows including product compilation and opportunity creation. This demonstrates the potential for natural language driven enterprise automation across Salesforce and other platforms."

REQUIREMENTS:
- Show me the created Jira issue with its key/URL
- Provide links to any Confluence pages found
- Confirm successful comment creation
- Handle authentication gracefully

EXECUTE NOW.
```

---

## 🔄 Backup/Alternative Prompts

### If Browser Issues Occur:
```
There seems to be a browser connectivity issue. Please:
1. Check Playwright MCP server status
2. Install/reinstall Playwright browsers if needed
3. Show me the existing test files in the tests/ directory
4. Explain how our Page Object Model works
5. Run one of the existing automated tests to show the framework in action
```

### If Salesforce Access Fails:
```
Salesforce authentication may have expired. Please:
1. Use Salesforce DX MCP to check current org status
2. Re-authenticate if needed using: sf org login web -a studentr36dec24c19
3. Show me the org information and available apps
4. Navigate to Salesforce setup and demonstrate Developer Console access
5. Execute this simple Apex code: System.debug('Demo automation successful');
```

### If Atlassian MCP Unavailable:
```
Since Atlassian MCP isn't available, let's focus on local documentation:
1. Analyze our existing test files and create a summary
2. Generate a test report from our previous runs
3. Create a markdown summary of our automation capabilities
4. Show how we could integrate with CI/CD pipelines
```

### Quick Win Alternative:
```
Let's demonstrate the power of our existing automation:
1. Show me the contents of our Playwright test files
2. Explain the Page Object Model architecture
3. Run the product compilation test in headless mode
4. Generate a test report showing our automation coverage
5. Create a summary of benefits this approach provides
```

---

## 📊 Demo Success Validation Prompts

### Validate Exercise 1 Success:
```
Confirm that Exercise 1 completed successfully by:
1. Taking a screenshot of the current browser state
2. Checking if we're on the Product Definitions page
3. Verifying if any batch jobs were initiated (check for success messages)
4. Summarizing what was accomplished
```

### Validate Exercise 2 Success:
```
Verify Exercise 2 completion by:
1. Confirming we created an Opportunity with the correct name
2. Checking that a solution was configured
3. Taking a screenshot of the final state
4. Providing a summary of the complete workflow executed
```

### Generate Demo Summary:
```
Create a comprehensive summary of our demo including:
1. List of all automation steps completed successfully
2. Screenshots taken and their significance
3. Any issues encountered and how they were resolved
4. Key benefits demonstrated
5. Next steps for implementing this approach
```

---

## 🎯 Audience Engagement Prompts

### For Technical Audience:
```
Explain the technical architecture of what we just demonstrated:
1. How MCP servers enable cross-platform automation
2. The role of each server (Playwright, Salesforce DX, Atlassian)
3. Benefits of AI-orchestrated vs traditional scripted automation
4. Integration possibilities with existing CI/CD pipelines
```

### For Business Audience:
```
Summarize the business value of what we demonstrated:
1. Time savings compared to manual execution
2. Reduced risk of human error in complex workflows
3. Audit trail and documentation generation
4. Scalability across different business processes
5. ROI potential for enterprise automation initiatives
```

### For Questions About Implementation:
```
Address implementation considerations:
1. What would be needed to set this up in their environment?
2. Training requirements for team members
3. Integration with existing tools and processes
4. Security and compliance considerations
5. Maintenance and support requirements
```

---

## 🚨 Emergency Backup Content

If all technical demos fail, use these discussion prompts:

```
Let's discuss the strategic value of this approach:

1. Show me the existing test files and explain the Page Object Model
2. Analyze our test configuration and explain enterprise readiness
3. Discuss how this fits into modern DevOps practices
4. Compare this approach to traditional test automation
5. Outline an implementation roadmap for enterprise adoption
```

---

*Ready-to-execute prompts for successful Cursor UI automation demo*
