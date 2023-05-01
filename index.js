const url = 'http://localhost:8080/bands';

// Imprime todos los Datos de todas las canciones
fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const tableBody = document.querySelector('#bands-table tbody');
    data.forEach(band => {
      const row = tableBody.insertRow();
      const idBanda = row.insertCell();
      const bandCell = row.insertCell();
      const highestSongCell = row.insertCell();
      idBanda.innerText = band.band_id;
      bandCell.innerText = band.band;
      highestSongCell.innerText = band.highest_song;      
    });
  })
  .catch(error => console.error(error));
