import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CaptureNote from './pages/CaptureNote';
import MyNotes from './pages/MyNotes';
import SearchNotes from './pages/SearchNotes';
import GeminiChat from './components/GeminiChat';
import './index.css';

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/capture" element={<CaptureNote />} />
        <Route path="/notes" element={<MyNotes />} />
        <Route path="/search" element={<SearchNotes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <GeminiChat />
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
