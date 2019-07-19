const { setUp } = require('./helpers');

describe('Data rendering', () => {
  beforeAll(async () => {
    await setUp(page);
  });

  it('should have a <select> element with sorted <option> elements', () =>
    page
      .evaluate(() => {
        const nodeList = document.querySelectorAll('select > option');
        return Array.from(nodeList).map(el => el.innerText);
      })
      .then(values => {
        expect(values.length).toBeGreaterThan(0);
        if (values.length > 0) {
          const sortedValues = [...values].sort((a, b) => a.localeCompare(b));
          expect(values).toEqual(sortedValues);
        }
      }));

  it('should initially render the alumni repo from the select element', async () => {
    const result = await page.evaluate(() => {
      const root = document.querySelector('#root');
      return root.innerText.includes('Alumni Guides');
    });
    expect(result).toBe(true);
  });

  it('should display the JavaScript3 repo upon selection', async () => {
    const optionValue = await page.evaluate(() => {
      const option = Array.from(document.querySelectorAll('select > option')).find(
        opt => opt.innerText === 'JavaScript3',
      );
      return option ? option.getAttribute('value') : null;
    });

    let result = { repoNameFound: false, contributorNameFound: true };

    if (optionValue) {
      await page.select('select', optionValue);
      await page.waitFor(1000);
      result = await page.evaluate(() => {
        const root = document.querySelector('#root');
        const repoNameFound = root.innerText.includes('JavaScript3 module');
        const contributorNameFound = root.innerText.includes('mkruijt');
        return { repoNameFound, contributorNameFound };
      });
    }

    expect(result).toEqual({ repoNameFound: true, contributorNameFound: true });
  });
});
