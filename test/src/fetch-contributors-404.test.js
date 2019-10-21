const config = require('./config');

describe('Fetch contributors 404 error handling', () => {
  it('should render an HTTP error when fetching contributors in the DOM', async () => {
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (config.blockedResourceTypes.includes(req.resourceType())) {
        req.abort();
      } else if (req.url().includes('/contributors')) {
        req.respond({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Not Found',
            documentation_url: 'https://developer.github.com/v3',
          }),
        });
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
