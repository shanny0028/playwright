import type { Locator, Page } from 'playwright';
type LoadStateName = 'load' | 'domcontentloaded' | 'networkidle';

/**
 * UI actions helper with ergonomic methods.
 * Instantiate per scenario: `const ui = new UIActions(page);`
 */
export class UIActions {
  constructor(private readonly page: Page) {}

  /** Resolve either a string selector or a Locator to a Locator */
  private toLocator(selectorOrLocator: string | Locator): Locator {
    return typeof selectorOrLocator === 'string'
      ? this.page.locator(selectorOrLocator)
      : selectorOrLocator;
  }

  /** descriptor for error messages */
  private describe(selectorOrLocator: string | Locator): string {
    return typeof selectorOrLocator === 'string' ? selectorOrLocator : '[Locator]';
  }

  /** Center the element in viewport (optional, useful for sticky headers/footers overlaps) */
  async scrollIntoCenter(selectorOrLocator: string | Locator): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator
      .evaluate((el: Element) => el.scrollIntoView({ block: 'center', inline: 'center' }))
      .catch(() => {
        /* non-fatal if transient */
      });
  }

  /** Click with explicit waits*/
  async click(selectorOrLocator: string | Locator): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const desc = this.describe(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'attached' });
      await locator.waitFor({ state: 'visible' });
      await this.scrollIntoCenter(locator);
      await locator.click();
    } catch (error) {
      throw new Error(`Failed to click "${desc}": ${(error as Error).message}`);
    }
  }

  /** Click with retry, useful for flaky UI or transient overlays */
  async clickWithRetry(
    selectorOrLocator: string | Locator,
    retries = 2,
    delayMs = 300,
  ): Promise<void> {
    const desc = this.describe(selectorOrLocator);
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.click(selectorOrLocator);
        return;
      } catch (err) {
        if (attempt === retries) {
          throw new Error(
            `Failed to click "${desc}" after ${retries + 1} attempts: ${(err as Error).message}`,
          );
        }
        await this.wait(delayMs);
      }
    }
  }

  /** Type into an input; keeps existing content unless clear=true */
  async type(selectorOrLocator: string | Locator, text: string, clear = false): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const desc = this.describe(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'visible' });
      await this.scrollIntoCenter(locator);
      if (clear) {
        await locator.fill(''); // clear
      }
      await locator.type(text);
    } catch (error) {
      throw new Error(`Failed to type into "${desc}": ${(error as Error).message}`);
    }
  }

  /** Set value (clears then fills, replaces content) */
  async setValue(selectorOrLocator: string | Locator, value: string | number): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const desc = this.describe(selectorOrLocator);
    try {
      if (value === undefined || value === null) {
        throw new Error('Value cannot be undefined or null');
      }
      const text = String(value);
      await locator.waitFor({ state: 'visible' });
      await this.scrollIntoCenter(locator);
      await locator.fill(''); // explicit clear
      await locator.fill(text); // set new value
    } catch (error) {
      throw new Error(`Failed to set value "${value}" in "${desc}": ${(error as Error).message}`);
    }
  }

  /** Clear an input/textarea value */
  async clearValue(selectorOrLocator: string | Locator): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const desc = this.describe(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'visible' });
      await this.scrollIntoCenter(locator);
      await locator.fill('');
    } catch (error) {
      throw new Error(`Failed to clear value in "${desc}": ${(error as Error).message}`);
    }
  }

  /** Get textContent of an element (empty string if null) */
  async getText(selectorOrLocator: string | Locator): Promise<string> {
    const locator = this.toLocator(selectorOrLocator);
    const desc = this.describe(selectorOrLocator);
    try {
      await locator.waitFor({ state: 'visible' });
      await this.scrollIntoCenter(locator);
      const text = await locator.textContent();
      return text ?? '';
    } catch (error) {
      throw new Error(`Failed to get text from "${desc}": ${(error as Error).message}`);
    }
  }

  /** Wait until visible */
  async waitForVisible(selectorOrLocator: string | Locator, timeoutMs = 5000): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /** Wait until NOT visible */
  async waitForNotVisible(selectorOrLocator: string | Locator, timeoutMs = 5000): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator.waitFor({ state: 'hidden', timeout: timeoutMs });
  }

  /** Wait until element is enabled (interactable) */
  async waitForEnabled(selectorOrLocator: string | Locator, timeoutMs = 5000): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const deadline = Date.now() + timeoutMs;
    // Playwright doesn't have a direct "enabled" wait; poll isEnabled()
    while (Date.now() < deadline) {
      if (await locator.isEnabled().catch(() => false)) return;
      await this.wait(100);
    }
    throw new Error(
      `Element "${this.describe(selectorOrLocator)}" did not become enabled within ${timeoutMs}ms`,
    );
  }

  /** Wait until element is disabled */
  async waitForDisabled(selectorOrLocator: string | Locator, timeoutMs = 5000): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (!(await locator.isEnabled().catch(() => true))) return;
      await this.wait(100);
    }
    throw new Error(
      `Element "${this.describe(selectorOrLocator)}" did not become disabled within ${timeoutMs}ms`,
    );
  }

  /** Wait until element is detached from DOM (removed) */
  async waitForDetached(selectorOrLocator: string | Locator, timeoutMs = 5000): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator.waitFor({ state: 'detached', timeout: timeoutMs });
  }

  /** Wait until page URL matches (string exact or RegExp) */
  async waitForURL(urlOrPattern: string | RegExp, timeoutMs = 5000): Promise<void> {
    await this.page.waitForURL(urlOrPattern, { timeout: timeoutMs });
  }

  /** Wait until locator contains the desired text (exact match by default) */
  async waitForText(
    selectorOrLocator: string | Locator,
    expected: string | RegExp,
    timeoutMs = 5000,
  ): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const text = (await locator.textContent().catch(() => null)) ?? '';
      if (expected instanceof RegExp ? expected.test(text) : text.trim() === expected) return;
      await this.wait(100);
    }
    throw new Error(
      `Text did not match "${expected}" on "${this.describe(
        selectorOrLocator,
      )}" within ${timeoutMs}ms`,
    );
  }

  /** Hover over an element */
  async hover(selectorOrLocator: string | Locator): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  /** Press a keyboard key (e.g., 'Enter', 'Escape', 'Tab') */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /** Upload a file into an `<input type="file">` */
  async uploadFile(
    selectorOrLocator: string | Locator,
    filePaths: string | string[],
  ): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    await locator.setInputFiles(filePaths);
  }

  /** Scroll the window to top or bottom */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    );
  }

  /** Select <select> option by value */
  async selectDropdownByValue(selectorOrLocator: string | Locator, value: string): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const result = await locator.selectOption({ value });
    if (!result || result.length === 0) {
      throw new Error(`Failed to select value "${value}" on "${this.describe(selectorOrLocator)}"`);
    }
  }

  /** Select <select> option by label/text */
  async selectDropdownByLabel(selectorOrLocator: string | Locator, label: string): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    const result = await locator.selectOption({ label });
    if (!result || result.length === 0) {
      throw new Error(`Failed to select label "${label}" on "${this.describe(selectorOrLocator)}"`);
    }
  }

  /** Select <select> option by index (0-based) */
  async selectDropdownByIndex(selectorOrLocator: string | Locator, index: number): Promise<void> {
    const locator = this.toLocator(selectorOrLocator);
    // Fetch options, pick nth option's value
    const values = await locator.locator('option').evaluateAll((opts, i) => {
      const target = opts[i];
      return target ? (target.getAttribute('value') ?? target.textContent ?? '') : null;
    }, index);

    if (!values) {
      throw new Error(
        `No option found at index ${index} for "${this.describe(selectorOrLocator)}"`,
      );
    }
    const result = await locator.selectOption(values);
    if (!result || result.length === 0) {
      throw new Error(`Failed to select index ${index} on "${this.describe(selectorOrLocator)}"`);
    }
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /** Refresh the current page and wait for a load state (default: 'load') */
  async refreshPage(state: LoadStateName = 'load'): Promise<void> {
    await this.page.reload();
    await this.page.waitForLoadState(state);
  }

  /** Wait for a specific load state */
  async waitForLoadState(state: LoadStateName = 'load', timeoutMs = 10000): Promise<void> {
    await this.page.waitForLoadState(state, { timeout: timeoutMs });
  }

  async isVisible(selectorOrLocator: string | Locator): Promise<boolean> {
    const locator = this.toLocator(selectorOrLocator);
    try {
      return await locator.isVisible();
    } catch {
      // If locator is detached or invalid, return false
      return false;
    }
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
