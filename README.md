# Amar Note - DIU Digital Notes App

Amar Note is a web application designed for students of Daffodil International University (DIU). It allows students to capture photos of classroom board notes, extract the text using OCR, and organize them into digital notes.

## 🎯 Features
- **Secure Auth:** Login/Register restricted to `@diu.edu.bd` emails.
- **OCR Engine:** Powered by Tesseract.js to convert board images to text.
- **Smart Organization:** Categorize notes by Subject, Topic, and Teacher.
- **PDF Export:** Download any digital note as a PDF document.
- **Responsive UI:** Modern, blue-green themed dashboard optimized for mobile and desktop.

## 🛠️ Tech Stack
- **Frontend:** React + Tailwind CSS + Lucide Icons + Framer Motion
- **Backend:** Node.js + Express + MongoDB
- **OCR:** Tesseract.js
- **PDF:** jsPDF

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally (or use MongoDB Atlas)

### 1. Backend Setup
1. Open a terminal in the `server` folder.
2. The `.env` file is already created with default local MongoDB URI.
3. Start the server:
   ```bash
   cd server
   npm i
   node index.js
   ```

### 2. Frontend Setup
1. Open another terminal in the `client` folder.
2. Start the development server:
   ```bash
   cd client
   npm i
   npm run dev
   ```

### 3. Usage
- Go to `http://localhost:5173` (Vite's default port).
- Register with your `@diu.edu.bd` email.
- Start capturing and digitizing your notes!

---
Developed for Daffodil International University Students.
