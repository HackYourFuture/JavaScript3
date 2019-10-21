'use strict';

{
  function loadUser() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'user.json', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const user = JSON.parse(xhr.responseText);

        let output = '';

        output +=
          `<ul>` +
          `<li> ID: ${user.id}</li >` +
          `<li>Name: ${user.name}</li>` +
          `<li>Email: ${user.email}</li>` +
          `</ul>`;

        document.getElementById('user').innerHTML = output;
      }
    };

    xhr.send();
  }

  function loadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'users.json', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const users = JSON.parse(xhr.responseText);

        let output = '';

        for (const user of users) {
          output +=
            `<ul>` +
            `<li> ID: ${user.id}</li >` +
            `<li>Name: ${user.name}</li>` +
            `<li>Email: ${user.email}</li>` +
            `</ul>`;
        }

        document.getElementById('users').innerHTML = output;
      }
    };

    xhr.send();
  }

  document.getElementById('button1').addEventListener('click', loadUser);
  document.getElementById('button2').addEventListener('click', loadUsers);
}
