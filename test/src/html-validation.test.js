const validator = require('html-validator');
const { setUp } = require('./helpers');

describe('HTML validation', () => {
  beforeAll(async () => {
    await setUp(page);
  });

  it('should generate valid HTML', async () => {
    const outerHtml = await page.evaluate(() => document.documentElement.outerHTML);
    const options = {
      data: `<!DOCTYPE html>\n${outerHtml}`,
      format: 'text',
      ignore: 'Warning:',
    };

    const report = await validator(options);
    expect(report).toBe('The document validates according to the specified schema(s).');
  });
});
