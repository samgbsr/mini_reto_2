const url = 'http://localhost:8080/boys';

// Imprime todos los Datos de todas las canciones
fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const tableBody = document.querySelector('#boys-table tbody');
    data.forEach(boy => {
      const row = tableBody.insertRow();
      const boyNameCell = row.insertCell();
      const boyIdCell = row.insertCell();
      const boyBandCell = row.insertCell();
      boyNameCell.innerText = boy.name;
      boyIdCell.innerText = boy.boy_id;
      boyBandCell.innerText = boy.band_id;
    });
  })
  .catch(error => console.error(error));
