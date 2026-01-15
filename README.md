# Playwright Cucumber TypeScript Test Automation Framework

A robust, scalable test automation framework built with Playwright, Cucumber BDD, and TypeScript, following the Page Object Model design pattern.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Available Scripts](#available-scripts)
- [Linting and Formatting](#linting-and-formatting)
- [Reporting](#reporting)
- [BrowserStack Integration](#browserstack-integration)
- [Contributing](#contributing)

## 🎯 Overview

This project is a behavior-driven development (BDD) test automation framework that combines the power of Playwright for browser automation with Cucumber for writing human-readable test scenarios. The framework is built with TypeScript for type safety and maintainability.

**Key Features:**
- ✅ BDD with Cucumber and Gherkin syntax
- ✅ Cross-browser testing (Chrome, Firefox, Edge, WebKit)
- ✅ Page Object Model design pattern
- ✅ TypeScript for type safety
- ✅ Parallel test execution
- ✅ HTML and JSON reporting
- ✅ Screenshot capture on test failure
- ✅ BrowserStack cloud integration
- ✅ ESLint and Prettier for code quality
- ✅ Husky for pre-commit hooks
- ✅ Gherkin linting for feature files

## 🛠 Technology Stack

| Technology | Purpose |
|------------|---------|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| [Cucumber](https://cucumber.io/) | BDD framework for writing test scenarios |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe programming language |
| [Node.js](https://nodejs.org/) | JavaScript runtime environment |
| [ESLint](https://eslint.org/) | Code linting and quality checks |
| [Prettier](https://prettier.io/) | Code formatting |
| [Husky](https://typicode.github.io/husky/) | Git hooks management |
| [ts-node](https://typestrong.org/ts-node/) | TypeScript execution for Node.js |

## 📁 Project Structure

```
playwright/
├── features/                      # Test features and implementation
│   ├── config/                   # Configuration files
│   │   ├── browserstack.ts       # BrowserStack setup
│   │   ├── env.ts                # Environment configuration
│   │   ├── launch.ts             # Browser launch logic
│   │   └── monitoring.ts         # Test monitoring utilities
│   ├── data/                     # Test data files
│   │   └── config.json           # Environment-specific configs
│   ├── pageObjects/              # Element locators
│   │   └── homePageElements.json # Homepage element definitions
│   ├── pages/                    # Page Object classes
│   │   └── homepage.ts           # Homepage page object
│   ├── specs/                    # Feature files (Gherkin)
│   │   └── demo.feature          # Sample test scenarios
│   ├── step-definitions/         # Step implementation
│   │   └── homeSteps.ts          # Homepage step definitions
│   └── utils/                    # Utility functions
│       ├── hooks.ts              # Cucumber hooks (Before/After)
│       ├── testWorld.ts          # Custom World class
│       ├── pageFactory.ts        # Page object factory
│       ├── uiActions.ts          # Reusable UI actions
│       ├── loadData.ts           # Data loading utilities
│       └── generate-cucumber-report.js # Report generation
├── reports/                      # Test execution reports
├── cucumber.mjs                  # Cucumber configuration
├── eslint.config.mjs            # ESLint configuration
├── tsconfig.json                # TypeScript configuration
├── .prettierrc                  # Prettier configuration
├── .gherkin-lintrc             # Gherkin linting rules
├── package.json                # Project dependencies and scripts
└── README.md                   # This file
```

### Directory Breakdown

- **features/config/**: Browser and environment configuration logic
- **features/data/**: JSON files containing test data for different environments
- **features/pageObjects/**: Element locators stored as JSON
- **features/pages/**: Page Object Model classes encapsulating page interactions
- **features/specs/**: Gherkin feature files with test scenarios
- **features/step-definitions/**: TypeScript implementations of Gherkin steps
- **features/utils/**: Helper functions, hooks, and world configuration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 7.x or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version
npm --version
git --version
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shanny0028/playwright.git
   cd playwright
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Set up Git hooks (Husky):**
   ```bash
   npm run prepare
   ```

## ⚙️ Configuration

### Environment Configuration

The framework supports multiple environments configured in `features/data/config.json`:

```json
{
  "tst": {
    "url": "https://test-environment-url.com",
    "environment": "tst"
  },
  "sta": {
    "url": "https://staging-environment-url.com",
    "environment": "sta"
  }
}
```

### Browser Configuration

Browsers are configured in `cucumber.mjs` with profiles for:
- **default**: Chromium (headless/headed configurable)
- **chrome**: Chrome browser
- **edge**: Microsoft Edge browser
- **firefox**: Firefox browser
- **bs-chrome**: BrowserStack Chrome (cloud)

### Test Configuration

Key settings in `cucumber.mjs`:
- **Parallel execution**: 2 workers (adjustable)
- **Timeout**: 60 seconds per step
- **Formats**: HTML and JSON reports

## 🧪 Running Tests

### Run with Default Browser (Chromium)

```bash
npx cucumber-js
```

### Run with Specific Browser

**Chrome:**
```bash
npm run local -- "@testTag"
# or
cucumber-js -p chrome --tags "@testTag"
```

**Edge:**
```bash
npm run local_edge -- "@testTag"
# or
cucumber-js -p edge --tags "@testTag"
```

**Firefox:**
```bash
cucumber-js -p firefox --tags "@testTag"
```

### Run with Tags

Execute specific scenarios using Cucumber tags:

```bash
# Run all tests with @smoke tag
cucumber-js --tags "@smoke"

# Run all tests except @wip (work in progress)
cucumber-js --tags "not @wip"

# Run tests with multiple tags
cucumber-js --tags "@regression and @critical"
```

### Run on BrowserStack

```bash
cucumber-js -p bs-chrome --tags "@testTag"
```

### Clean and Run

Remove old reports before execution:
```bash
npm run clean
npm run local -- "@testTag"
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run clean` | Remove reports and allure-results directories |
| `npm run local -- "@tag"` | Run tests in Chrome with specific tag |
| `npm run local_edge -- "@tag"` | Run tests in Edge with specific tag |
| `npm run lint` | Run ESLint on TypeScript files |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run feature:lint` | Lint Gherkin feature files |
| `npm run feature:lint:fix` | Lint feature files and output JSON |
| `npm run report` | Generate HTML report from JSON |
| `npm run prepare` | Set up Husky Git hooks |

## 🎨 Linting and Formatting

### ESLint

The project uses ESLint with TypeScript and Playwright plugins for code quality.

**Run linter:**
```bash
npm run lint
```

**Auto-fix issues:**
```bash
npm run lint:fix
```

### Prettier

Code formatting is enforced using Prettier.

**Format all files:**
```bash
npm run format
```

**Configuration** (`.prettierrc`):
- Single quotes
- Semicolons required
- Trailing commas
- 100 character line width
- 2-space indentation

### Gherkin Linting

Feature files are linted to ensure BDD best practices.

**Run Gherkin lint:**
```bash
npm run feature:lint
```

**Rules enforced:**
- No empty files
- Named features and scenarios
- No trailing spaces
- No unused variables
- No duplicate scenario/feature names
- No restricted tags (@ignore, @wip)

### Pre-commit Hooks

Husky is configured to run linting on staged files before commit:
- TypeScript files: ESLint + Prettier
- Feature files: Gherkin linting

## 📊 Reporting

### Cucumber HTML Report

After test execution, reports are generated in the `reports/` directory:

- **cucumber.html**: Interactive HTML report
- **cucumber.json**: JSON format for further processing

### Generate Report Manually

```bash
npm run report
```

This runs `features/utils/generate-cucumber-report.js` to create an enhanced HTML report.

### Screenshot on Failure

The framework automatically captures screenshots when tests fail:
- Screenshots are embedded in the HTML report
- Captured using the `AfterStep` hook in `features/utils/hooks.ts`

## ☁️ BrowserStack Integration

The framework supports running tests on BrowserStack cloud.

### Configuration

Set up BrowserStack credentials and capabilities in `features/config/browserstack.ts`.

### Run on BrowserStack

```bash
cucumber-js -p bs-chrome --tags "@testTag"
```

### Supported Configurations

- Browser: Chrome, Firefox, Edge, Safari
- OS: Windows, macOS, Android, iOS
- Multiple device and version combinations

## 🤝 Contributing

### Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards

3. Run linting and formatting:
   ```bash
   npm run lint:fix
   npm run format
   ```

4. Commit your changes (pre-commit hooks will run automatically)

5. Push and create a pull request

### Coding Standards

- Follow TypeScript best practices
- Use Page Object Model for page interactions
- Write clear, descriptive Gherkin scenarios
- Add JSDoc comments for complex functions
- Maintain consistent naming conventions
- Keep functions small and focused

### Adding New Tests

1. **Create a feature file** in `features/specs/`:
   ```gherkin
   Feature: Login functionality
     Scenario: Successful login
       Given I am on the login page
       When I enter valid credentials
       Then I should be logged in
   ```

2. **Create page object** in `features/pages/`:
   ```typescript
   export default class LoginPage {
     constructor(private readonly page: Page) {}
     
     async login(username: string, password: string) {
       // Implementation
     }
   }
   ```

3. **Define step implementations** in `features/step-definitions/`:
   ```typescript
   Given("I am on the login page", async function (this: TestWorld) {
     await this.page.goto('/login');
   });
   ```

4. **Add page to factory** in `features/utils/pageFactory.ts`:
   ```typescript
   login() { 
     return new LoginPage(this.world.page); 
   }
   ```

## 📝 License

ISC

## 👤 Author

**Shantanu**

---

For questions or issues, please open an issue in the GitHub repository.
