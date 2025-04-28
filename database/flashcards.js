const express = require('express');
const router = express.Router();
const FlashcardController = require('../controllers/flashcardController');
const flashcardController = new FlashcardController();

// Route to create a new flashcard
router.post('/flashcards', flashcardController.createFlashcard);

// Route to get all flashcards
router.get('/flashcards', flashcardController.getFlashcards);

// Route to update a flashcard
router.put('/flashcards/:id', flashcardController.updateFlashcard);

// Route to delete a flashcard
router.delete('/flashcards/:id', flashcardController.deleteFlashcard);

module.exports = router;