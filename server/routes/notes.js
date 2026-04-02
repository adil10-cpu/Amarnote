const express = require('express');
const router = express.Router();
const mockDb = require('../services/mockDb');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
    const { subject, topic, teacher, date, extractedText, image } = req.body;
    try {
        const note = mockDb.createNote({
            user: req.user._id,
            subject,
            topic,
            teacher,
            date,
            extractedText,
            image
        });
        res.status(201).json(note);
    } catch (error) {
        console.error('--- POST /notes ERROR ---');
        console.error(error);
        res.status(400).json({ 
            message: 'Invalid note data or storage error', 
            error: error.message 
        });
    }
});


router.get('/', protect, async (req, res) => {
    try {
        const notes = mockDb.getUserNotes(req.user._id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/search', protect, async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json([]);
    try {
        const notes = mockDb.searchUserNotes(req.user._id, query);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const deleted = mockDb.deleteNote(req.params.id, req.user._id);
        if (deleted) {
             res.json({ message: 'Note deleted successfully' });
        } else {
             res.status(404).json({ message: 'Note not found or unauthorized' });
        }
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server error during deletion' });
    }
});

module.exports = router;

