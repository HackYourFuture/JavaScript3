/* eslint-disable no-console */
const devices = require('puppeteer/DeviceDescriptors');
const config = require('./config');

describe('Responsiveness for Mobile', () => {
  it('should look responsive on a mobile phone', async () => {
    console.log('Check the iPhoneX.png file in the root folder for responsiveness.');
    await page.emulate(devices['iPhone X']);
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'iPhoneX.png' });
  });
});
