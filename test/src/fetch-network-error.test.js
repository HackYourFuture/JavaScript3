const config = require('./config');

describe('Fetch network error handling', () => {
  it('should render a network error in the DOM', async () => {
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (
        config.blockedResourceTypes.includes(req.resourceType()) ||
        req.url().includes('/repos')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });

    const fetchErrorRendered = await page.evaluate(
      () => document.querySelector('.alert-error') != null,
    );

    expect(fetchErrorRendered).toBe(true);
  });
});
