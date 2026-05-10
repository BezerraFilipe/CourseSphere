import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import { ToastProvider } from './contexts/ToastContext'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyCourses from './pages/MyCourses'
import CourseForm from './pages/CourseForm'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider> 
          <Routes>
            <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
            <Route path="/courses/new" element={<PrivateRoute><CourseForm /></PrivateRoute>} />
            <Route path="/courses/:id/edit" element={<PrivateRoute><CourseForm /></PrivateRoute>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}