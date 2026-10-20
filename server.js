const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint di test
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Backend attivo e veloce!' });
});

// Ricerca brani tramite API Jamendo (Gratuita e veloce)
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Termine di ricerca mancante' });

  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: '56631f22', // Client ID pubblico demo Jamendo
        format: 'json',
        limit: 20,
        search: query,
        include: 'musicinfo'
      }
    });

    const items = response.data.results.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      duration: Math.floor(track.duration / 60) + ':' + ('0' + Math.floor(track.duration % 60)).slice(-2),
      thumbnail: track.image || 'https://via.placeholder.com/150',
      audioUrl: track.audio
    }));

    res.json(items);
  } catch (error) {
    console.error('Errore nella ricerca:', error.message);
    res.status(500).json({ error: 'Errore durante la ricerca' });
  }
});

app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
