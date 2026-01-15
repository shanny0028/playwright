
import { chromium } from 'playwright';
import { execSync } from 'child_process';

type BuildCapsInput = {
  parameters?: Record<string, any>;
  env: NodeJS.ProcessEnv;
  appEnv: string;
};

export function buildBrowserStackCaps({ parameters, env, appEnv }: BuildCapsInput) {
  const bsUser = env.BROWSERSTACK_USERNAME;
  const bsKey  = env.BROWSERSTACK_ACCESS_KEY;
  if (!bsUser || !bsKey) {
    throw new Error('Missing BrowserStack credentials. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.');
  }

  const clientPlaywrightVersion = execSync('npx playwright --version')
    .toString()
    .trim()
    .split(' ')[1];

  const bsBrowser       = parameters?.bsBrowser       || env.BS_BROWSER        || 'chrome';
  const bsOS            = parameters?.bsOS            || env.BS_OS             || 'Windows';
  const bsOSVersion     = parameters?.bsOSVersion     || env.BS_OS_VERSION     || '11';
  const bsBrowserVersion= parameters?.bsBrowserVersion|| env.BS_BROWSER_VERSION|| 'latest';

  return {
    os: bsOS,
    os_version: bsOSVersion,
    browser: bsBrowser,                      // 'chrome' or 'edge' (branded)
    browser_version: bsBrowserVersion,
    'browserstack.username': bsUser,
    'browserstack.accessKey': bsKey,
    project: env.BS_PROJECT || 'Cucumber Playwright',
    build: env.BS_BUILD || `build-${appEnv}`,
    name: env.BS_NAME || 'BDD run',
    'browserstack.playwrightVersion': '1.latest',
    'client.playwrightVersion': clientPlaywrightVersion,
    // diagnostics toggles
    'browserstack.debug': 'true',
    'browserstack.console': 'info',
    'browserstack.networkLogs': 'true',
    // Uncomment if you use Local Testing:
    // 'browserstack.local': 'true',
    // 'browserstack.localIdentifier': env.BS_LOCAL_ID || 'my-tunnel'
  };
}

export async function connectBrowserStack(caps: Record<string, any>) {
  const wsEndpoint =
    `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`;
  // Playwright engine connects via Chromium to BrowserStack’s WS endpoint
  return chromium.connect(wsEndpoint);
}
