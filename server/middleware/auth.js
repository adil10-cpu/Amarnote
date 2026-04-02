const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const protect = async (req, res, next) => {
    let token;
    const GUEST_USER = {
        _id: 'guest',
        name: 'DIU Guest Student',
        email: 'guest@diu.edu.bd'
    };

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            // Direct match for guest-token
            if (token === 'guest-token') {
                req.user = GUEST_USER;
                return next();
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                const DB_FILE = path.join(__dirname, '../db.json');
                if (fs.existsSync(DB_FILE)) {
                     const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
                     req.user = db.users.find(u => u._id === decoded.id);
                }
                
                if (!req.user) {
                    try {
                        const User = require('../models/User');
                        req.user = await User.findById(decoded.id).select('-password');
                    } catch (e) {}
                }
            } catch (jwtErr) {
                console.log('JWT Verification failed, falling back to guest');
            }
        }

        // If no user assigned yet, use Guest
        if (!req.user) {
            req.user = GUEST_USER;
        }
        
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        req.user = GUEST_USER;
        next();
    }
};



module.exports = { protect };
