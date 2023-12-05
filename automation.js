
const { Builder, By, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const nodemailer = require('nodemailer');

// Configure the email transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alijone754rats@gmail.com',
        pass: 'eqey mexg bmlp kjhl'
    }
});

// Function to send email
async function sendEmail(subject, text, recipientEmail) {
    let mailOptions = {
        from: 'alijone754rats@gmail.com',
        to: recipientEmail,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function automateLogin(username, password, recipientEmail) {
    let options = new firefox.Options();
    // For headless mode (no GUI), uncomment the next line
    options.headless();

    let driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    try {
        await driver.get('https://merlinswood.flowhcm.com/#/signin');
        // [Rest of your selenium code]
        // await driver.sleep(10000);
        //wait until loading element is gone
        await driver.wait(async () => {
            const elements = await driver.findElements(By.className('c-spinner2'));
            if (elements.length === 0) {
                return true;
            }
            const style = await elements[0].getAttribute('style');
            return style.includes('display: none');
        }, 100000);

        let signOutButtonPresent = await driver.findElements(By.className('btn-SignOut')).then(elements => elements.length > 0);

        if (signOutButtonPresent) {
            await driver.findElement(By.className('profile-box')).click();
            let lastDropdownItem = await driver.wait(until.elementLocated(By.css('.dropdown-menu li.last')), 10000);
            await lastDropdownItem.click();
            await driver.wait(until.elementLocated(By.id('username')), 10000);
        }

        await driver.wait(until.elementLocated(By.id('username')), 100000);
        let usernameInput = await driver.findElement(By.id('username'));
        await usernameInput.sendKeys(username);
        await driver.findElement(By.id('password')).sendKeys(password);
        await driver.findElement(By.className('sign-in-btn1')).click();
        await driver.wait(until.elementLocated(By.className('btn-SignOut')), 100000);
        // await driver.wait(until.elementLocated(By.className('sign-btn')), 100000);
        await driver.wait(async () => {
            const elements = await driver.findElements(By.className('modal-backdrop'));
            if (elements.length === 0) {
                return true;
            }
            const style = await elements[0].getAttribute('style');
            return style.includes('display: none');
        }, 10000);
        await driver.findElement(By.className('btn-SignOut')).click();
        // await driver.findElement(By.className('sign-btn')).click();
        await driver.sleep(10000);
        await sendEmail("Login Successful", "Your login was successful for account: " + username, recipientEmail);

    } catch (error) {
        await sendEmail("Login Error", "An error occurred during login for account: " + username + ". Error: " + error.message, recipientEmail);
    } finally {
        await driver.quit();
    }
}

const credentials = [
    { username: 'ali.jone@deltabluecarbon.com', password: 'Ali123', email: 'a.jone.23031@khi.iba.edu.pk' },
    // { username: 'ali.haider@deltabluecarbon.com', password: 'Ali@123', email: 'm.haider.23047@khi.iba.edu.pk' },
    // { username: 'muhammad.arham@deltabluecarbon.com', password: 'Arham123', email: 'arrhamjohar.10@gmail.com' },
    // ... other credentials
];

async function runScriptForMultipleAccounts() {
    for (const credential of credentials) {
        await automateLogin(credential.username, credential.password, credential.email);
    }
}

runScriptForMultipleAccounts();
