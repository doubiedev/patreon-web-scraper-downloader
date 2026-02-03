import { connect } from 'puppeteer-real-browser';
import path from 'path';

(async () => {
    const { page } = await connect({
        headless: false,
        args: [`--user-data-dir=${path.join(process.cwd(), '../browser-data')}`],
        customConfig: {},
        turnstile: true,
        connectOption: {},
        disableXvfb: false,
    });
    await page.goto('https://www.patreon.com/login');
})();
