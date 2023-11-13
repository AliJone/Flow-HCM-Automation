const { Builder, By, until } = require('selenium-webdriver');

async function automateLogin(username, password) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://merlinswood.flowhcm.com/#/signin');
        await driver.sleep(10000);
        
        let signOutButtonPresent = await driver.findElements(By.className('btn-SignOut')).then(elements => elements.length > 0);
        
        if (signOutButtonPresent) {
            await driver.findElement(By.className('profile-box')).click();
            let lastDropdownItem = await driver.wait(until.elementLocated(By.css('.dropdown-menu li.last')), 10000);
            await lastDropdownItem.click();
            await driver.wait(until.elementLocated(By.id('username')), 10000);
        }

        await driver.wait(until.elementLocated(By.id('username')), 10000);
        let usernameInput = await driver.findElement(By.id('username'));
        await usernameInput.sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(password);
        await driver.findElement(By.className('sign-in-btn1')).click();
        await driver.sleep(10000);
        await driver.wait(until.elementLocated(By.className('btn-SignOut')), 10000);
        await driver.findElement(By.className('btn-SignOut')).click();
        await driver.sleep(10000);
        
    } finally {
        await driver.quit();
    }
}

// Array of credentials
const credentials = [
    { username: 'ali.jone@deltabluecarbon.com', password: 'Ali123' },
    // { username: 'ali.jone@deltabluecarbon.com', password: 'Ali123' },
    // { username: 'ali.jone@deltabluecarbon.com', password: 'Ali123' },
];

// Iterate over each set of credentials
async function runScriptForMultipleAccounts() {
    for (const credential of credentials) {
        await automateLogin(credential.username, credential.password);
    }
}

runScriptForMultipleAccounts();
