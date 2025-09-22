# Salesforce DX Project: The Art of Possible

This document provides a comprehensive overview of the setup, configuration, and capabilities of this Salesforce DX project, with a focus on the automated demonstrations that can be performed.

## Table of Contents
- [Salesforce DX Project: The Art of Possible](#salesforce-dx-project-the-art-of-possible)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Initial Setup](#initial-setup)
    - [1. Install Cursor](#1-install-cursor)
    - [2. Set up Salesforce Repository](#2-set-up-salesforce-repository)
    - [3. Push Repository Content to GitHub](#3-push-repository-content-to-github)
  - [Salesforce Configuration](#salesforce-configuration)
  - [MCP Server Configuration](#mcp-server-configuration)
    - [Playwright MCP Server](#playwright-mcp-server)
    - [Salesforce DX MCP Server](#salesforce-dx-mcp-server)
  - [Demonstration Walkthrough](#demonstration-walkthrough)
    - [Exercise 1: Product Definitions \& Cache](#exercise-1-product-definitions--cache)
    - [Exercise 2: Create Opportunity \& Solution](#exercise-2-create-opportunity--solution)
    - [Exercise 3: Developer Console](#exercise-3-developer-console)
  - [Advanced Automation: Using Instruction Files](#advanced-automation-using-instruction-files)
  - [Troubleshooting](#troubleshooting)

## Introduction

This project demonstrates the power of Salesforce DX and automation in a modern development workflow. It showcases the "art of possible" by combining the capabilities of Salesforce, Git, and various development tools to create a streamlined and efficient development process.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Git](https://git-scm.com/downloads)
*   [Node.js and npm](https://nodejs.org/en/download/)
*   [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

## Initial Setup

### 1. Install Cursor

Cursor is an AI-powered code editor that can help you write, understand, and refactor code. To install it, follow these steps:

1.  Go to the [Cursor website](https://cursor.sh/).
2.  Download the installer for your operating system.
3.  Run the installer and follow the on-screen instructions.

### 2. Set up Salesforce Repository

To get started with this project, you need to clone the repository and install the necessary dependencies.

1.  Open a terminal or command prompt.
2.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
3.  Navigate to the project directory:
    ```sh
    cd <project-directory>
    ```
4.  Install the project dependencies:
    ```sh
    npm install
    ```

### 3. Push Repository Content to GitHub

To collaborate with others and keep track of your changes, you should push the repository to GitHub.

1.  Create a new repository on [GitHub](https://github.com/new).
2.  In your local terminal, add the GitHub repository as a remote:
    ```sh
    git remote add origin <github-repository-url>
    ```
3.  Push the repository to GitHub:
    ```sh
    git push -u origin main
    ```

## Salesforce Configuration

To connect this project to your Salesforce org, you need to authenticate with the Salesforce CLI.

1.  In your terminal, run the following command to open the Salesforce login page in your browser:
    ```sh
    sf org login web
    ```
2.  Log in to your Salesforce org.
3.  Once you have successfully logged in, you can close the browser window. The Salesforce CLI is now authenticated with your org.

## MCP Server Configuration

The MCP (Multi-modal Co-pilot) servers are required to run the automated demonstrations.

### Playwright MCP Server
The Playwright MCP Server allows Cursor to control a web browser for UI automation. To install and configure it, please refer to the official Cursor documentation on MCP servers:

*   [Cursor MCP Servers Documentation](https://docs.cursor.com/en/tools/mcp)

### Salesforce DX MCP Server
The Salesforce DX MCP Server allows Cursor to interact with your Salesforce org using the Salesforce CLI. To configure it, you need to add a snippet to your Cursor `mcp.json` file.

1.  Open your Cursor settings.
2.  Locate and open the `mcp.json` file.
3.  Add the following configuration, as described in the [official Salesforce MCP repository](https://github.com/salesforcecli/mcp?tab=readme-ov-file#configure-other-clients-to-use-the-salesforce-dx-mcp-server):

    ```json
    {
      "mcpServers": {
        "Salesforce DX": {
          "command": "npx",
          "args": ["-y", "@salesforce/mcp", "--orgs", "DEFAULT_TARGET_ORG", "--toolsets", "all"]
        }
      }
    }
    ```

## Demonstration Walkthrough

This project includes several automated demonstrations that showcase the power of Salesforce DX and automation.

### Exercise 1: Product Definitions & Cache

This exercise demonstrates how to use Playwright to automate the process of compiling product definitions in the CloudSense Solution Management app.

**To run this exercise, provide the following instructions to Cursor as a prompt:**

1.  Open the CloudSense Solution Management App.
2.  Open the Product Definitions Tab. Select the “Training Product Models” view.
3.  Select the following Product Definitions from the list:
    *   Training Generic Child AddOn Subscription
    *   Training Generic Deliverable
    *   Training Generic Main Subscription
    *   Training Generic Subscription
4.  Click [Compile Product Definitions] and wait for the batch job to be initiated.

### Exercise 2: Create Opportunity & Solution

This exercise demonstrates how to create a new Opportunity and configure a solution using Playwright.

**To run this exercise, provide the following instructions to Cursor as a prompt:**

1.  Use your Salesforce Admin skills to create a new Opportunity with the following details:
    *   Name: My Mobile Solution Sale
    *   Account Name: Acme
    *   Stage: Prospecting
    *   Opportunity Currency: GBP
    *   Close Date: Today
2.  After saving the new Opportunity, click [Create Solution].
3.  Click [Add New Solution].
4.  Select “Training Mobile Solution” from the list of active solution templates.
5.  Click [Add].
6.  Enter the following details into the highlighted Training Mobile Solution:
    *   Configuration Name: Training Mobile Solution
    *   Contract Term: 36
7.  Click the Training Mobile Plan Tab.
8.  Click [+ Mobile Plan].
9.  Enter the following details:
    *   Plan Type: Mobile Plan
    *   Plan: Lx36
    *   Tariff: Default Rate Card
10. Click Add-Ons.
11. Click [+Add new].
12. Check the Checkbox next to an Add-On and click [Add to configuration].
13. Click the Details Tab to return to the Parent Plan.
14. Click [Calculate Totals].
15. Click the vertical Pricing Summary bar to show the Pricing Summary panel.
16. Click [Back to basket].

### Exercise 3: Developer Console

This exercise demonstrates how to use the Developer Console to execute Apex code.

**To run this exercise, provide the following instruction to Cursor as a prompt:**
```
go to setup. click on developer console. run this code in anonymous window - System.debug("hello");
```

## Advanced Automation: Using Instruction Files

For more complex automation scenarios, you can provide a text file with a set of instructions for Cursor to follow. This is a powerful way to execute a series of steps without having to type them all into the chat.

1.  **Create an instruction file:** Create a new file in your project directory (e.g., `instructions.txt`).
2.  **Write the instructions:** In the text file, write a clear, step-by-step list of the tasks you want Cursor to perform.
3.  **Provide the file to Cursor:** In the chat, simply say "follow the instructions in `instructions.txt`".

**Example `instructions.txt`:**
```
1. Log in to the default Salesforce org.
2. Navigate to the "Accounts" tab.
3. Create a new Account with the following details:
   - Account Name: "Global Innovations Inc."
   - Phone: "555-123-4567"
   - Industry: "Technology"
4. Verify that the account was created successfully.
```

## Troubleshooting

*   **Authentication Issues:** If you are having trouble authenticating with your Salesforce org, make sure you are using the correct login URL and that your user has the necessary permissions.
*   **Playwright Errors:** If you encounter errors while running the Playwright scripts, make sure you have installed the necessary browsers (`npx playwright install`).
*   **Data Not Found:** If the scripts are unable to find the required data (e.g., product definitions, accounts), make sure the necessary data has been loaded into your Salesforce org.

## Additional Guides

- See TESTING.md: ATDD to Playwright UI Automation for how we convert Given/When/Then acceptance criteria into maintainable Playwright tests.
