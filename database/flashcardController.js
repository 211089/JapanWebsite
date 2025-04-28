class FlashcardController {
    constructor(db) {
        this.db = db;
    }

    createFlashcard(req, res) {
        const { question, answer } = req.body;
        const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
        this.db.run(sql, [question, answer], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, question, answer });
        });
    }

    getFlashcards(req, res) {
        const sql = 'SELECT * FROM flashcards';
        this.db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        });
    }

    updateFlashcard(req, res) {
        const { id, question, answer } = req.body;
        const sql = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
        this.db.run(sql, [question, answer, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ id, question, answer });
        });
    }

    deleteFlashcard(req, res) {
        const { id } = req.params;
        const sql = 'DELETE FROM flashcards WHERE id = ?';
        this.db.run(sql, id, function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(204).send();
        });
    }
}

module.exports = FlashcardController;