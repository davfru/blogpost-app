const puppeteer = require('puppeteer');
const { ParserError } = require('redis');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });

    page = await browser.newPage({});
    await page.goto('localhost:3000');
});

afterEach(async () => {
    // await browser.close();
});

test('the header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    console.log(url)

    expect(url.split('?')[0]).toEqual('https://accounts.google.com/o/oauth2/v2/auth');
});

test.only('When signed in, shows logout button', async () => {
    const id = '634ed895bee4d6388d254c17';

    const Buffer = require('safe-buffer').Buffer;

    const sessionObject = {
        passport: {
            user: id
        }
    };

    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    console.log(sessionString, sig);

    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
    await page.waitFor('a[href="/auth/logout"');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(text).toEqual('Logout');

});