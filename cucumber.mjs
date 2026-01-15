
// cucumber.mjs
export default function () {
  const common = {
    // Compile TS on the fly (and optionally load env from dotenv if you like)
    requireModule: ['ts-node/register'],
    // Load hooks/world/step-definitions. Use a broad glob to avoid “Undefined” issues.
    // If your steps live under features/specs/step-definitions, this pattern will catch them.
    require: [
      'features/**/step-definitions/**/*.ts',
      'features/utils/hooks.ts',
      'features/utils/testWorld.ts'
    ],
    // Feature file paths
    paths: ['features/**/*.feature'],
    // Runner settings
    parallel: 2,
    timeout: 60_000,
    // Console + file reporters (built-in)
    format: [
      'progress-bar',
      ['html', 'reports/cucumber.html'],
      ['json', 'reports/cucumber.json']
    ],
    // Example app config read by your hooks/world
    worldParameters: {
      // appUrl: process.env.MY_APP_URL || 'http://localhost:3000/' recent 
    },
    publishQuiet: true
  };

  return {
    // local default (Chromium via Playwright; your hooks decide channel if set)
    default: {
      ...common
    },

    // CI profile: publish + maybe fewer console logs
    ci: {
      ...common,
      format: [['html', 'reports/cucumber.html']], // only HTML file in CI
      publish: true
    },

    // Local Chrome (branded channel)
    chrome: {
      ...common,
      worldParameters: {
        ...common.worldParameters,
        browser: 'chromium',
        channel: 'chrome'
      }
    },

    // Local Edge (branded channel)
    edge: {
      ...common,
      worldParameters: {
        ...common.worldParameters,
        browser: 'chromium',
        channel: 'msedge'
      }
    },

    // Local Firefox
    firefox: {
      ...common,
      worldParameters: {
        ...common.worldParameters,
        browser: 'firefox'
      }
    },

    // BrowserStack Chrome
    'bs-chrome': {
      ...common,
      worldParameters: {
        ...common.worldParameters,
        target: 'browserstack',
        bsBrowser: 'chrome',
        bsOS: 'Windows',
        bsOSVersion: '11',
        bsBrowserVersion: 'latest'
      }
    }
  };
}
  