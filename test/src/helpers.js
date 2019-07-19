const config = require('./config');

async function setUp(page) {
  await page.setRequestInterception(true);
  // no images needed for the tests here
  page.on('request', req => {
    if (config.blockedResourceTypes.includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
}

module.exports = {
  setUp,
};
