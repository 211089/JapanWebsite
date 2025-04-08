// server.js - Main server file

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up the database
const db = new sqlite3.Database('./flashcards.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the flashcards database.');
    
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deck_id) REFERENCES decks (id)
    )`);
  }
});

// Routes

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all decks
app.get('/api/decks', (req, res) => {
  db.all('SELECT * FROM decks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ decks: rows });
  });
});

// Create a new deck
app.post('/api/decks', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Deck name is required' });
    return;
  }
  
  db.run('INSERT INTO decks (name) VALUES (?)', [name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

// Get a specific deck with its cards
app.get('/api/decks/:id', (req, res) => {
  const deckId = req.params.id;
  
  db.get('SELECT * FROM decks WHERE id = ?', [deckId], (err, deck) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!deck) {
      res.status(404).json({ error: 'Deck not found' });
      return;
    }
    
    db.all('SELECT * FROM cards WHERE deck_id = ?', [deckId], (err, cards) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({ deck, cards });
    });
  });
});

// Create a new card in a deck
app.post('/api/decks/:id/cards', (req, res) => {
  const deckId = req.params.id;
  const { question, answer } = req.body;
  
  if (!question || !answer) {
    res.status(400).json({ error: 'Question and answer are required' });
    return;
  }
  
  db.run(
    'INSERT INTO cards (deck_id, question, answer) VALUES (?, ?, ?)',
    [deckId, question, answer],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, deck_id: deckId, question, answer });
    }
  );
});

// Delete a card
app.delete('/api/cards/:id', (req, res) => {
  const cardId = req.params.id;
  
  db.run('DELETE FROM cards WHERE id = ?', [cardId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    
    res.json({ message: 'Card deleted' });
  });
});

// Delete a deck and all its cards
app.delete('/api/decks/:id', (req, res) => {
  const deckId = req.params.id;
  
  db.run('DELETE FROM cards WHERE deck_id = ?', [deckId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.run('DELETE FROM decks WHERE id = ?', [deckId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Deck not found' });
        return;
      }
      
      res.json({ message: 'Deck and all its cards deleted' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});