#!/bin/bash

# CloudSense Test Automation Script for Linux/Mac

echo "================================================"
echo "CloudSense Product Definition Compilation Tests"
echo "================================================"

# Set environment variables
export SF_INSTANCE_URL="https://studentr36dec24c19.my.salesforce.com"
export NODE_ENV="test"

# Check if Salesforce CLI is authenticated
echo "Checking Salesforce authentication..."
sf org display --target-org studentr36dec24c19 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "ERROR: Salesforce org not authenticated. Please run 'sf org login web' first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps

# Create screenshots directory
mkdir -p screenshots

# Run CloudSense tests
echo ""
echo "Running CloudSense Product Definition Compilation Tests..."
npx playwright test cloudsense-product-compilation.spec.ts --reporter=html

# Check if CloudSense tests passed
CLOUDSENSE_EXIT_CODE=$?

# Run error handling tests
echo ""
echo "Running Error Handling Tests..."
npx playwright test cloudsense-error-handling.spec.ts --reporter=html

# Generate and open test report
echo ""
echo "Generating test report..."
npx playwright show-report

echo ""
echo "Test execution complete!"

# Exit with CloudSense test result
exit $CLOUDSENSE_EXIT_CODE
