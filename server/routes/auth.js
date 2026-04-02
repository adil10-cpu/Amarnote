const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mockDb = require('../services/mockDb');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email.endsWith('@diu.edu.bd')) {
        return res.status(400).json({ message: 'Only DIU students allowed' });
    }

    try {
        const userExists = mockDb.findUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await mockDb.createUser({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Invalid user data' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = mockDb.findUserByEmail(email);

    if (user && (await mockDb.matchUserPassword(user, password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

module.exports = router;
