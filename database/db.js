const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
});

const createFlashcardTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
    )`;
    db.run(sql, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

const addFlashcard = (question, answer) => {
    const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
    db.run(sql, [question, answer], function(err) {
        if (err) {
            console.error(err.message);
        }
        return this.lastID;
    });
};

const getFlashcards = (callback) => {
    const sql = 'SELECT * FROM flashcards';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        callback(rows);
    });
};

const updateFlashcard = (id, question, answer) => {
    const sql = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
    db.run(sql, [question, answer, id], (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

const deleteFlashcard = (id) => {
    const sql = 'DELETE FROM flashcards WHERE id = ?';
    db.run(sql, id, (err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

module.exports = {
    createFlashcardTable,
    addFlashcard,
    getFlashcards,
    updateFlashcard,
    deleteFlashcard
};