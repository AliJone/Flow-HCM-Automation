const { Builder, By, until } = require('selenium-webdriver');
const express = require('express');

const app = express();
const port = 3000; // You can use any available port

async function automateLogin(username, password) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://merlinswood.flowhcm.com/#/signin');
        // await driver.sleep(10000);
        //wait until loading element is gone
        await driver.wait(async () => {
            const elements = await driver.findElements(By.className('c-spinner2'));
            if (elements.length === 0) {
                return true;
            }
            const style = await elements[0].getAttribute('style');
            return style.includes('display: none');
        }, 10000);

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
        await driver.wait(until.elementLocated(By.className('btn-SignOut')), 10000);
        await driver.wait(async () => {
            const elements = await driver.findElements(By.className('modal-backdrop'));
            if (elements.length === 0) {
                return true;
            }
            const style = await elements[0].getAttribute('style');
            return style.includes('display: none');
        }, 10000);
        await driver.findElement(By.className('btn-SignOut')).click();
        await driver.sleep(10000);
        
    } finally {
        await driver.quit();
    }
}

// Array of credentials


// Iterate over each set of credentials
// async function runScriptForMultipleAccounts(username, password) {
//         await automateLogin(username, password);
// }

app.get('/automateLogin', async (req, res) => {
    const { id, password } = req.query;

    if (!id || !password) {
        return res.status(400).send('Missing id or password');
    }

    try {
        await automateLogin(id, password);
        res.send('Login automation completed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during automation');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// runScriptForMultipleAccounts();
