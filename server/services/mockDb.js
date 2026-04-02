const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../db.json');

const initDb = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], notes: [] }, null, 2));
    }
};

const readDb = () => {
    initDb();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
};

const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// User Operations
const createUser = async (userData) => {
    const db = readDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
        _id: Date.now().toString(),
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
};

const findUserByEmail = (email) => {
    const db = readDb();
    return db.users.find(u => u.email === email);
};

const matchUserPassword = async (user, password) => {
    return await bcrypt.compare(password, user.password);
};

// Note Operations
const createNote = (noteData) => {
    try {
        const db = readDb();
        let imageUrl = null;

        // Save image if present
        if (noteData.image) {
            console.log('Attemping to save image...');
            const base64Data = noteData.image.replace(/^data:image\/\w+;base64,/, '');
            const filename = `note_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
            const filePath = path.join(__dirname, '../uploads', filename);
            fs.writeFileSync(filePath, base64Data, 'base64');
            imageUrl = `/uploads/${filename}`;
            console.log('Image saved successfully at:', imageUrl);
        }

        const { image, ...otherData } = noteData; 

        const newNote = {
            _id: Date.now().toString(),
            ...otherData,
            imageUrl,
            createdAt: new Date()
        };
        db.notes.push(newNote);
        writeDb(db);
        console.log('Note saved in database successfully!');
        return newNote;
    } catch (error) {
        console.error('CRITICAL ERROR in createNote:', error);
        throw error;
    }
};



const getUserNotes = (userId) => {
    const db = readDb();
    return db.notes.filter(n => n.user === userId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const searchUserNotes = (userId, query) => {
    const db = readDb();
    const lowerQuery = query.toLowerCase();
    return db.notes.filter(n => 
        n.user === userId && 
        (n.subject.toLowerCase().includes(lowerQuery) || 
         n.topic.toLowerCase().includes(lowerQuery) || 
         n.teacher.toLowerCase().includes(lowerQuery) || 
         n.extractedText.toLowerCase().includes(lowerQuery))
    ).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const deleteNote = (noteId, userId) => {
    const db = readDb();
    const noteIndex = db.notes.findIndex(n => n._id === noteId && n.user === userId);
    
    if (noteIndex === -1) return false;

    const note = db.notes[noteIndex];
    
    // Delete physical image file if exists
    if (note.imageUrl) {
        try {
            const fileName = note.imageUrl.split('/').pop();
            const filePath = path.join(__dirname, '../uploads', fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted image file: ${filePath}`);
            }
        } catch (err) {
            console.error('Failed to delete physical image file:', err);
        }
    }

    db.notes.splice(noteIndex, 1);
    writeDb(db);
    return true;
};

module.exports = {
    createUser,
    findUserByEmail,
    matchUserPassword,
    createNote,
    getUserNotes,
    searchUserNotes,
    deleteNote
};

