import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import Expectations from './pages/Expectations';
import ProfileList from './pages/ProfileList';
import ProfileDetail from './pages/ProfileDetail';
import AdminPanel from './pages/admin/AdminPanel';
import DeveloperPanel from './pages/developer/DeveloperPanel';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/expectations" element={<PrivateRoute><Expectations /></PrivateRoute>} />
            <Route path="/profiles" element={<PrivateRoute><ProfileList /></PrivateRoute>} />
            <Route path="/profiles/:id" element={<PrivateRoute><ProfileDetail /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute roles={['admin', 'developer']}><AdminPanel /></PrivateRoute>} />
            <Route path="/developer" element={<PrivateRoute roles={['developer']}><DeveloperPanel /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
