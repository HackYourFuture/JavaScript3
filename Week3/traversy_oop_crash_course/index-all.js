'use strict';

{
  const select = document.getElementById('select');
  select.addEventListener('change', async () => {
    console.clear();
    console.log(select.value);
    const response = await fetch(select.value);
    const code = await response.text();
    // eslint-disable-next-line no-eval
    eval(code);
  });
}
