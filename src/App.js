import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLyrics, setModalLyrics] = useState('');
  const [page, setPage] = useState(1);
  const lyricsPerPage = 500;

  const handleSearch = async () => {
    if (artist && song) {
      setLoading(true);
      try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`);
        const lyricsText = response.data.lyrics;
        const paginatedLyrics = paginateLyrics(lyricsText, lyricsPerPage);
        setLyrics(prevLyrics => [
          ...prevLyrics,
          { artist, song, lyrics: paginatedLyrics }
        ]);
      } catch (error) {
        alert('Error al obtener la letra. Intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  const paginateLyrics = (lyricsText, limit) => {
    const pages = [];
    for (let i = 0; i < lyricsText.length; i += limit) {
      pages.push(lyricsText.slice(i, i + limit));
    }
    return pages;
  };

  const handleClickRow = (lyrics) => {
    const fullLyrics = lyrics.join('\n\n');
    setModalLyrics(fullLyrics); // Setea la letra completa en el modal
    setModalOpen(true); // Abre el modal
  };

  const closeModal = () => {
    setModalOpen(false); // Cierra el modal
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxvzqpvFF23f-_9rIy6qCcnzsCagR_kJgJWQ&s"
          alt="Spotify"
          className="App-logo"
        />
        <h1>¡Encuentra la Letra de tu Canción!</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Grupo/Artista"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Nombre de la Canción"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          className="input-field"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`search-btn ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div className="lyrics-table">
        <table>
          <thead>
            <tr>
              <th>Artista</th>
              <th>Canción</th>
              <th>Ver Letra</th>
            </tr>
          </thead>
          <tbody>
            {lyrics.map((item, index) => (
              <tr key={index}>
                <td>{item.artist}</td>
                <td>{item.song}</td>
                <td>
                  <button onClick={() => handleClickRow(item.lyrics)}>
                    Ver Letra
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pagination-btn"
        >
          Anterior
        </button>
        <span>Página {page}</span>
        <button
          disabled={lyrics[0]?.lyrics?.length <= page * lyricsPerPage}
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Siguiente
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>X</button>
            <h2>Letra Completa</h2>
            <pre>{modalLyrics}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
