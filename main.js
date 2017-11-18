const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const { linkedins, write_oneline } = require('./file_processor');
const CREDS = require('./creds');

async function parse_page(page, selector) {
    const username = await page.evaluate((sel) => {
        let element = document.querySelector(sel);
        return element && element.innerHTML;
    }, selector);
    return username && username.replace(/\n|\s/g, '');
}

let extract_page = async function (browser, url) {
    console.log('deal url: ' + url);
    const page2 = await browser.newPage();
    const wait_times = Math.random() * (10 - 2) + 2;
    await page2.waitFor(wait_times * 1000);
    await page2.goto(url);
    await page2.waitForNavigation();
    const name_selector = '.pv-top-card-section__name';
    const title_selector = '.pv-top-card-section__headline';
    const company_sel = '.pv-top-card-section__company';
    const school_sel = '.pv-top-card-section__school';
    const degree_sel = '.pv-entity__comma-item';
    await page2.waitFor(2 * 1000);
    let degree;
    let timeout = 5;
    while ((degree = await parse_page(page2, degree_sel)) === null && timeout--) {
        await page2.waitFor(2 * 1000)
    }
    const user = {
        name: await parse_page(page2, name_selector),
        title: await parse_page(page2, title_selector),
        company: await parse_page(page2, company_sel),
        school: await parse_page(page2, school_sel),
        degree,
    };
    const user_line = [
        await parse_page(page2, name_selector),
        await parse_page(page2, title_selector),
        await parse_page(page2, company_sel),
        await parse_page(page2, school_sel),
        degree,
    ].join(",");
    page2.close()
    return {user, user_line};
};

function wire_to_file(url, obj) {
    const file = `./all/${url}.json`;
    jsonfile.writeFile(file, obj, function (err) {
        console.error(err);
    });
}

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com');
    // await page.goto('https://github.com/login');
    const USERNAME_SELECTOR = '#login-email';
    const PASSWORD_SELECTOR = '#login-password';
    const BUTTON_SELECTOR = '#login-submit';
    await page.screenshot({ path: 'screenshots/start.png' });
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    await page.screenshot({ path: 'screenshots/user.png' });
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.screenshot({ path: 'screenshots/password.png' });
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation({ 'timeout': 0 });
    for( let linkedin of linkedins) {
        try {
            const {user, user_line} = await extract_page(browser, linkedin);
            write_oneline(linkedin, user_line);
        } catch (err) {
            console.log(`${linkedin} fail`)
            write_oneline(linkedin, 'fail');
        }
        // wire_to_file(linkedin, user);
    }
    // await page2.screenshot({ path: 'screenshots/github.png' });
    // browser.close();
}

run();
