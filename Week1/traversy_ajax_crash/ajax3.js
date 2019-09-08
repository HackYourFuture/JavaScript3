'use strict';

{
  // Load Github Users
  function loadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.github.com/users', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const users = JSON.parse(xhr.responseText);

        let output = '';
        for (const user of users) {
          output +=
            `<div class="user"> <img src="${user.avatar_url} width="70" height="70">` +
            `<ul>` +
            `<li>ID: ${user.id}</li>` +
            `<li>Login: ${user.login}</li>` +
            `</ul>` +
            `</div>`;
        }

        document.getElementById('users').innerHTML = output;
      }
    };

    xhr.send();
  }

  document.getElementById('button').addEventListener('click', loadUsers);
}
