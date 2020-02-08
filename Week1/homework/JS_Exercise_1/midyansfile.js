

// Block 1

const url = 'https://randomuser.me/api/?results=20&exc=login&noinfo';
fetch(url)
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);

// Block 2

    for (let person of data.results) {
      const tableRow = document.createElement('tr');      const image = document.createElement('img');
      image.setAttribute('src', person.picture.thumbnail);


      tableRow.appendChild(image);      const name = document.createElement('td');
      name.innerHTML = `${person.name.first} ${person.name.last}`;
      tableRow.appendChild(name);      const gender = document.createElement('td');
      gender.innerHTML = person.gender;
      tableRow.appendChild(gender);      const location = document.createElement('td');
      
      
      location.innerHTML = `${person.location.city}, ${person.location.state}, ${person.location.country}`;
      tableRow.appendChild(location);      table.appendChild(tableRow);
    }
  });
  
  //Block3
  
  const table = document.createElement('table');
document.body.appendChild(table);