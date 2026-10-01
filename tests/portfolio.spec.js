import { test, expect } from '@playwright/test';

test('all local links and assets resolve under the GitHub Pages repository path', async ({ page, request }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('./');
    await expect(page.locator('h1')).toContainText('Georges');
    const pages = ['./', 'projects/shadowwatch.html', 'projects/tracezero.html', 'projects/crypto-scalping-bot.html'];
    for (const route of pages) {
        await page.goto(route);
        const targets = await page.locator('a[href], link[href], script[src]').evaluateAll((elements) => elements.map((element) => element.href || element.src));
        for (const target of targets) {
            const url = new URL(target);
            if (url.origin !== 'http://127.0.0.1:4173') continue;
            expect(url.pathname).toMatch(/^\/portfolio\//);
            const response = await request.get(url.href);
            expect(response.ok(), url.href).toBeTruthy();
            if (url.hash && url.pathname === new URL(page.url()).pathname) await expect(page.locator(url.hash)).toHaveCount(1);
        }
    }
    expect(errors).toEqual([]);
});

test('project filters show the requested category and restore all projects', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Research', exact: true }).click();
    await expect(page.locator('[data-category]:visible')).toHaveCount(1);
    await expect(page.locator('[data-category]:visible')).toContainText('Crypto Scalping Bot');
    await page.getByRole('button', { name: 'Security', exact: true }).click();
    await expect(page.locator('[data-category]:visible')).toHaveCount(2);
    await page.getByRole('button', { name: 'All projects' }).click();
    await expect(page.locator('[data-category]:visible')).toHaveCount(3);
});

test('contact validates fields and builds an encoded draft without sending a request', async ({ page }) => {
    const requests = [];
    page.on('request', (request) => { if (request.method() === 'POST') requests.push(request.url()); });
    await page.goto('./');
    await page.getByRole('button', { name: 'Prepare email' }).click();
    await expect(page.locator('#contact-result')).toBeHidden();
    await page.locator('#contact-name').fill('  ');
    await page.locator('#contact-email').fill('alex@example.com');
    await page.locator('#contact-subject').fill('Project & collaboration?');
    await page.locator('#contact-message').fill('Hello Georges,\nLet’s discuss <a project>.');
    await page.getByRole('button', { name: 'Prepare email' }).click();
    await expect(page.locator('#contact-result')).toBeHidden();
    await page.locator('#contact-name').fill('Alex');
    await page.getByRole('button', { name: 'Prepare email' }).click();
    await expect(page.locator('#contact-status')).toContainText('has not been sent');
    const draft = new URL(await page.locator('#email-draft').getAttribute('href'));
    expect(draft.protocol).toBe('mailto:');
    expect(draft.pathname).toBe('georgesyouhannna@hotmail.com');
    expect(draft.searchParams.get('subject')).toBe('Project & collaboration?');
    expect(draft.searchParams.get('body')).toContain('<a project>');
    await page.locator('#contact-message').fill('Updated message');
    await expect(page.locator('#contact-result')).toBeHidden();
    expect(requests).toEqual([]);
});

test('terminal treats markup as text and supports history and clearing', async ({ page }) => {
    await page.goto('./');
    const input = page.locator('#terminal-input');
    await input.fill('<img src=x onerror=alert(1)>');
    await input.press('Enter');
    await expect(page.locator('#terminal-output img')).toHaveCount(0);
    await expect(page.locator('#terminal-output')).toContainText('Unknown command');
    await input.fill('constructor');
    await input.press('Enter');
    await expect(page.locator('#terminal-output')).toContainText('Unknown command: constructor');
    await expect(page.locator('#terminal-output a')).toHaveCount(0);
    await input.fill('projects');
    await input.press('Enter');
    await expect(page.locator('#terminal-output')).toContainText('TRACEZERO');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('projects');
    await input.fill('clear');
    await input.press('Enter');
    await expect(page.locator('#terminal-output')).toHaveText('Terminal cleared. Type help to explore.');
});

test('mobile menu supports keyboard dismissal and navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    const menu = page.getByRole('button', { name: 'Menu' });
    await expect(page.locator('#main-nav')).toBeHidden();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(page.locator('#main-nav')).toBeHidden();
    await menu.click();
    await page.locator('#main-nav').getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator('#main-nav')).toBeHidden();
});

test('pages fit mobile and desktop viewports and respect reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [360, 390, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        for (const route of ['./', 'projects/shadowwatch.html', 'projects/tracezero.html', 'projects/crypto-scalping-bot.html']) {
            await page.goto(route);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBeTruthy();
            if (route === './' && [390, 1440].includes(width)) await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
            if (route === 'projects/shadowwatch.html' && width === 1440) await page.screenshot({ path: 'test-results/project-1440.png', fullPage: true });
        }
    }
    await page.goto('./');
    await expect(page.locator('.orbit')).toHaveCSS('animation-name', 'none');
});

test('essential content and navigation work without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/portfolio/');
    await expect(page.locator('#main-nav')).toBeVisible();
    await expect(page.locator('[data-category]:visible')).toHaveCount(3);
    await expect(page.getByRole('link', { name: 'georgesyouhannna@hotmail.com', exact: true })).toBeVisible();
    await expect(page.locator('#terminal')).toBeHidden();
    await page.getByRole('link', { name: 'Explore ShadowWatch' }).click();
    await expect(page.locator('h1')).toHaveText('ShadowWatch');
    await context.close();
});
