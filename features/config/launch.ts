import {
  chromium,
  firefox,
  webkit,
  type Browser,
  type BrowserContext,
  type Page,
} from 'playwright';
import { resolveAppEnv } from '../config/env';
import { buildBrowserStackCaps, connectBrowserStack } from '../config/browserstack';

interface Inputs {
  parameters?: Record<string, any>;
  env: NodeJS.ProcessEnv;
}

interface LaunchResult {
  browser: Browser;
  context: BrowserContext;
  page: Page;
}

const getType = (name?: string) => {
  switch ((name || 'chromium').toLowerCase()) {
    case 'firefox':
      return firefox;
    case 'webkit':
      return webkit;
    default:
      return chromium;
  }
};

export async function launchSession({ parameters, env }: Inputs): Promise<LaunchResult> {
  const target = (parameters?.target || env.TARGET || 'local').toLowerCase();
  const { baseUrl, appEnv } = resolveAppEnv(env);

  if (target === 'browserstack') {
    const caps = buildBrowserStackCaps({ parameters, env, appEnv });
    const browser = await connectBrowserStack(caps); // chromium.connect(wsEndpoint)
    const context = await browser.newContext();
    const page = await context.newPage();
    // await page.goto(baseUrl);
    return { browser, context, page };
  }

  // local
  const browserName = parameters?.browser || env.BROWSER || 'chromium';
  const channel = parameters?.channel || env.CHANNEL; // "chrome" | "msedge" for Chromium only
  const browserType = getType(browserName);
  const commonLaunch = { headless: false, args: ['--start-maximized'] as string[] };

  const browser =
    browserType === chromium && channel
      ? await chromium.launch({ ...commonLaunch, channel })
      : await browserType.launch(commonLaunch);

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  //   await page.goto(baseUrl);
  return { browser, context, page };
}

export async function closeSession({ browser, context, page }: Partial<LaunchResult>) {
  await page?.close();
  await context?.close();
  await browser?.close();
}
