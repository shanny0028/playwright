# Playwright Cucumber TypeScript Framework

BDD test automation framework using Playwright, Cucumber, and TypeScript with Page Object Model.

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

## Installation

```bash
# Clone repository
git clone https://github.com/shanny0028/playwright.git
cd playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Basic Execution

```bash
# Run tests with environment and tag
ENV=TST npm run local @testTag

# Run in Chrome browser
ENV=TST npm run local @testTag

# Run in Edge browser
ENV=STA npm run local_edge @testTag
```

### Environment Options
- `TST` - Test environment
- `STA` - Staging environment

### Browser Profiles
- `npm run local` - Chrome browser
- `npm run local_edge` - Edge browser
- `cucumber-js -p firefox` - Firefox browser

### Using Tags
```bash
# Run specific tagged scenarios
ENV=TST npm run local @smoke
ENV=TST npm run local @regression
```

## Project Structure

```
features/
├── config/           # Configuration (browser, env, browserstack)
├── data/             # Test data (config.json)
├── pageObjects/      # Element locators (JSON)
├── pages/            # Page Object classes
├── specs/            # Feature files (.feature)
├── step-definitions/ # Step implementations
└── utils/            # Hooks, helpers, factories
```

## Available Commands

```bash
# Clean reports
npm run clean

# Linting & Formatting
npm run lint              # Check code quality
npm run lint:fix          # Fix linting issues
npm run format            # Format code with Prettier
npm run feature:lint      # Lint feature files

# Generate reports
npm run report            # Create HTML report
```

## Reporting

Test reports are generated in the `reports/` directory:
- **cucumber.html** - Interactive HTML report
- **cucumber.json** - JSON format
- Screenshots automatically attached on test failures

## Configuration

Environment settings in `features/data/config.json`:
```json
{
  "tst": { "url": "...", "environment": "tst" },
  "sta": { "url": "...", "environment": "sta" }
}
```

Browser profiles in `cucumber.mjs`:
- Chrome, Edge, Firefox, BrowserStack

## Author

**Shantanu**
