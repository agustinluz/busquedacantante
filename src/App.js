import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState([]);

  const handleSearch = async () => {
    if (!artist || !song) {
      alert('Por favor, ingresa un artista y una canción.');
      return;
    }

    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
      if (!response.ok) {
        throw new Error('No se encontraron letras para esta canción.');
      }

      const data = await response.json();
      if (!data.lyrics) {
        throw new Error('La API no devolvió la letra.');
      }

      setLyrics((prev)=>[...prev,{ artist, song, lyrics: data.lyrics }]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container text-center">
      <h1 className="mt-4">Buscar Letras de Canciones</h1>

      <div className="mt-3">
        <input
          type="text"
          placeholder="Grupo/Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Nombre de la Canción"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {lyrics.length > 0 && (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Artista</th>
              <th>Canción</th>
              <th>Letra</th>
            </tr>
          </thead>
          <tbody>
            {lyrics.map((item, index) => (
              <tr key={index}>
                <td>{item.artist}</td>
                <td>{item.song}</td>
                <td>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{item.lyrics}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;