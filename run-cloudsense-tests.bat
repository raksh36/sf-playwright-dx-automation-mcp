@echo off
REM CloudSense Test Automation Script for Windows

echo ================================================
echo CloudSense Product Definition Compilation Tests
echo ================================================

REM Set environment variables
set SF_INSTANCE_URL=https://studentr36dec24c19.my.salesforce.com
set NODE_ENV=test

REM Check if Salesforce CLI is authenticated
echo Checking Salesforce authentication...
sf org display --target-org studentr36dec24c19 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Salesforce org not authenticated. Please run 'sf org login web' first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Install Playwright browsers if needed
echo Installing Playwright browsers...
npx playwright install

REM Create screenshots directory
if not exist screenshots mkdir screenshots

REM Run CloudSense tests
echo.
echo Running CloudSense Product Definition Compilation Tests...
npx playwright test cloudsense-product-compilation.spec.ts --reporter=html

REM Run error handling tests
echo.
echo Running Error Handling Tests...
npx playwright test cloudsense-error-handling.spec.ts --reporter=html

REM Open test report
echo.
echo Opening test report...
npx playwright show-report

echo.
echo Test execution complete!
pause
