# 5-Minute UI Automation Demo with Cursor MCP Servers
## Showcasing Playwright, Salesforce DX, and Atlassian MCP Integration

### 🎯 Demo Overview
This 5-minute demonstration showcases how Cursor's AI-powered development environment can orchestrate complex UI automation workflows using three powerful MCP (Model Context Protocol) servers:

1. **Playwright MCP Server** - Browser automation and UI testing
2. **Salesforce DX MCP Server** - Salesforce org management and data operations  
3. **Atlassian MCP Server** - Jira/Confluence integration and documentation

### ⏱️ Demo Timeline (5 minutes)

| Time | Section | Focus |
|------|---------|-------|
| 0:00-0:30 | **Setup & Context** | Show project structure, explain MCP servers |
| 0:30-2:00 | **Live Salesforce Automation** | Demonstrate Exercise 1 (Product Compilation) |
| 2:00-3:30 | **Complex Workflow** | Execute Exercise 2 (Opportunity + Solution) |
| 3:30-4:30 | **Atlassian Integration** | Create Jira issue, update Confluence |
| 4:30-5:00 | **Wrap-up & Q&A** | Highlight key benefits, take questions |

---

## 🚀 Pre-Demo Setup Checklist

### Prerequisites Verification
- [ ] Cursor IDE with MCP servers configured
- [ ] Salesforce org authenticated (`studentr36dec24c19`)
- [ ] CloudSense Solution Management app installed
- [ ] Training data loaded in Salesforce
- [ ] Atlassian workspace accessible
- [ ] Browser windows arranged for visibility

### MCP Server Configuration Status
```json
// Expected mcp.json configuration
{
  "mcpServers": {
    "Playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    },
    "Salesforce DX": {
      "command": "npx", 
      "args": ["-y", "@salesforce/mcp", "--orgs", "DEFAULT_TARGET_ORG", "--toolsets", "all"]
    },
    "Atlassian-MCP-Server": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp-server"]
    }
  }
}
```

---

## 📋 Demo Script with Talking Points

### **Section 1: Setup & Context** (0:00-0:30)

**[SHOW SCREEN: Cursor IDE with project open]**

> "Welcome! Today I'll demonstrate how Cursor transforms UI automation by orchestrating three powerful MCP servers. We have a real Salesforce DX project here with CloudSense Solution Management - a complex enterprise application."

**Key Points to Mention:**
- Show project structure (`force-app/`, `tests/`, existing Playwright specs)
- Highlight the three MCP servers in status bar
- Mention this is a live Salesforce org with real data

**[SHOW: README.md file briefly]**
> "Our project includes comprehensive automation exercises that we'll execute live using natural language prompts."

---

### **Section 2: Live Salesforce Automation** (0:30-2:00)

**[DEMO: Exercise 1 - Product Definition Compilation]**

**Prompt to Use:**
```
Using the Playwright MCP server, execute Exercise 1 from the README:

1. Open the CloudSense Solution Management App
2. Navigate to Product Definitions Tab and select "Training Product Models" view  
3. Select these specific products:
   - Training Generic Child AddOn Subscription
   - Training Generic Deliverable
   - Training Generic Main Subscription
   - Training Generic Subscription
4. Click "Compile Product Definitions" and wait for batch job initiation

Take screenshots at key steps and handle any errors gracefully.
```

**Talking Points While AI Executes:**
- "Notice how Cursor understands the complex Salesforce UI navigation"
- "The Playwright MCP server is handling browser automation in real-time"
- "Salesforce DX MCP provides org context and authentication"
- "AI is using robust selectors and proper wait strategies"

**Expected Outcome:** Browser opens, navigates to CloudSense, selects products, initiates compilation

---

### **Section 3: Complex Workflow Execution** (2:00-3:30)

**[DEMO: Exercise 2 - Opportunity Creation & Solution Configuration]**

**Prompt to Use:**
```
Now execute the more complex Exercise 2 workflow:

1. Create a new Opportunity:
   - Name: "Demo Mobile Solution Sale"  
   - Account: "Acme"
   - Stage: "Prospecting"
   - Close Date: Today
   - Currency: GBP

2. Configure Training Mobile Solution:
   - Add solution template "Training Mobile Solution"
   - Set Configuration Name and Contract Term (36 months)
   - Add Mobile Plan with Plan Type "Mobile Plan", Plan "Lx36"
   - Add at least one Add-On
   - Calculate totals and show pricing summary

Document each major step with screenshots and provide a summary.
```

**Talking Points:**
- "This demonstrates end-to-end business process automation"
- "Multiple Salesforce objects and relationships being handled"
- "Complex form interactions with dynamic UI elements"
- "Real-world enterprise application complexity"

---

### **Section 4: Atlassian Integration** (3:30-4:30)

**[DEMO: Cross-Platform Integration]**

**Prompt to Use:**
```
Using the Atlassian MCP server, create documentation for what we just automated:

1. Create a new Jira issue:
   - Project: [Your project key]
   - Issue Type: "Story" 
   - Summary: "Automated CloudSense Product Compilation and Opportunity Creation"
   - Description: Document the two exercises we just completed with key steps

2. Search for existing Confluence pages about "automation" or "testing"

3. If found, add a comment about our successful automation demo

Show the integration between our Salesforce automation and Atlassian documentation.
```

**Talking Points:**
- "Now we're bridging platforms - from Salesforce execution to Atlassian documentation"
- "This creates a complete audit trail of our automation"
- "Teams can track automation progress in their existing workflow tools"
- "Cross-platform integration without manual context switching"

---

### **Section 5: Wrap-up & Key Benefits** (4:30-5:00)

**[SHOW: Results Summary]**

**Key Benefits Demonstrated:**

1. **Natural Language Automation**
   - Complex workflows described in plain English
   - No need to write detailed test scripts upfront

2. **Multi-Platform Orchestration**
   - Salesforce + Browser + Atlassian integration
   - Single AI context across all platforms

3. **Enterprise-Ready Reliability**
   - Robust error handling and retry logic
   - Screenshot documentation for audit trails
   - Real Salesforce org with production-like complexity

4. **Developer Productivity**
   - From idea to execution in minutes, not hours
   - Automatic best practices (waits, selectors, error handling)
   - Living documentation that stays current

**Closing Statement:**
> "This demonstrates the future of test automation - where business users can describe workflows in natural language, and AI orchestrates the technical implementation across multiple enterprise platforms."

---

## 🎪 Alternative Demo Scenarios

### Scenario A: Error Handling Focus
If something goes wrong, pivot to show error handling:
```
The previous step encountered an issue. Please:
1. Analyze what went wrong using browser dev tools
2. Implement a retry strategy  
3. Add better error handling to our automation
4. Document the issue in Jira for the team
```

### Scenario B: Data-Driven Testing
If time permits, show data integration:
```
Using Salesforce DX MCP, query for existing Opportunities and use that data to create a parameterized test that works with real org data.
```

### Scenario C: Confluence Documentation
Alternative Atlassian demo:
```
Create a new Confluence page documenting our automation approach, including:
1. Screenshots from our Salesforce automation
2. Code snippets from our Playwright tests  
3. Benefits and ROI of this approach
```

---

## 🛠️ Troubleshooting Guide

### Common Issues & Solutions

| Issue | Quick Fix | Prompt to Use |
|-------|-----------|---------------|
| Browser won't open | Check Playwright installation | "Install Playwright browsers and verify MCP server connection" |
| Salesforce auth fails | Re-authenticate org | "Re-authenticate with Salesforce org using sf CLI" |
| Elements not found | Update selectors | "The UI has changed, please update selectors using more robust strategies" |
| Timeout errors | Increase waits | "Add longer waits and better element visibility checks" |

### Backup Prompts
If live demo fails, use these to show capabilities:
```
1. "Show me the existing Playwright test files and explain how they work"
2. "Analyze our test results and create a summary report" 
3. "Generate a new test case based on our existing patterns"
```

---

## 📊 Success Metrics

### What Success Looks Like
- [ ] Browser opens and navigates to Salesforce successfully
- [ ] At least one complete workflow executes (Exercise 1 or 2)
- [ ] Atlassian integration demonstrates cross-platform capability
- [ ] Screenshots and documentation generated automatically
- [ ] Audience understands the natural language → automation concept

### Backup Success Criteria
If technical issues arise:
- [ ] Show existing test files and explain the approach
- [ ] Demonstrate AI code analysis and explanation capabilities
- [ ] Discuss the architecture and benefits conceptually
- [ ] Show test reports and documentation already generated

---

## 🎯 Key Messages for Audience

1. **"Automation Through Conversation"** - Complex enterprise workflows described in natural language
2. **"Multi-Platform Intelligence"** - Single AI context spanning Salesforce, browsers, and Atlassian
3. **"Enterprise Ready"** - Real org, real data, production-grade error handling
4. **"Developer Productivity Revolution"** - From manual scripting to AI-orchestrated automation

---

## 📝 Post-Demo Follow-up

### Materials to Share
- [ ] This demo script
- [ ] Project repository access
- [ ] MCP server setup instructions  
- [ ] Sample test configurations
- [ ] Links to documentation

### Next Steps Discussion
- Implementation planning for their environment
- Training and onboarding approach
- Integration with existing CI/CD pipelines
- ROI and success metrics definition

---

*Demo prepared for Cursor UI Automation showcase - showcasing the art of possible with MCP servers*
