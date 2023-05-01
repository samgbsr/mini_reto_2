const url = 'http://localhost:8080/playlist';

// Tags para relacionar los objetos con las acciones que deseamos realizar
const playlistForm = document.querySelector('#playlist-form');
const songList = document.querySelector('#song-list');
const playlistNameInput = document.querySelector('#playlist-name');
const bandIdInput = document.querySelector('#band-id');
const addSongBtn = document.querySelector('#add-song-btn');
const playlistUL = document.querySelector('#playlist');

let songIds = [];
let playlists = [];

// Agregar cancion a la lista
addSongBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const bandId = bandIdInput.value;
  if (!bandId) return;
  
  fetch(`http://localhost:8080/band/${bandId}/highest_song`)
    .then(response => response.json())
    .then(data => {
      const song = `${data.band} - ${data.song}`;
      const songId = data.song_id;
      if (songIds.includes(songId)) return;
      songIds.push(songId);
      const li = document.createElement('li');
      li.textContent = song;
      songList.appendChild(li);
    })
    .catch(error => console.error(error));
});

// Crear Playlist
playlistForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const playlistName = playlistNameInput.value;
  if (!playlistName || songIds.length === 0) return;

  const playlist = {
    name: playlistName,
    songs: songIds
  };

  fetch('http://localhost:8080/playlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playlist)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    playlistNameInput.value = '';
    bandIdInput.value = '';
    songIds = [];
    songList.innerHTML = '';
    fetchAllPlaylists();
  })
  .catch(error => console.error(error));
});

// Eliminar Cancion de la Lista
songList.addEventListener('click', (event) => {
  if (!event.target.matches('li')) return;
  const songId = event.target.dataset.id;
  const index = songIds.indexOf(songId);
  if (index > -1) {
    songIds.splice(index, 1);
  }
  event.target.remove();
});

// Eliminar Playlist
playlistUL.addEventListener('click', (event) => {
  if (!event.target.matches('button')) return;
  const playlistId = event.target.dataset.id;
  fetch(`http://localhost:8080/playlist/${playlistId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    fetchAllPlaylists();
  })
  .catch(error => console.error(error));
});

// Obtener todas las playlists
function fetchAllPlaylists() {
  fetch('http://localhost:8080/playlist')
    .then(response => response.json())
    .then(data => {
      playlistUL.innerHTML = '';
      data.forEach(playlist => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${playlist.name}</span>
          <button data-id="${playlist.id}">Eliminar</button>
        `;
        playlistUL.appendChild(li);
      });
    })
    .catch(error => console.error(error));
}

// Inicializar aplicación
fetchAllPlaylists();
