import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/User/UserDashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminPosts from './pages/Admin/AdminPosts';
import Habits from './pages/User/Habits';
import Goals from './pages/User/Goals';
import CarbonCalculator from './pages/User/CarbonCalculator';
import Community from './pages/User/Community';
import MainLayout from './components/layout/MainLayout';
import { SocketProvider } from './context/SocketContext';
import EcoSuggestions from './pages/User/EcoSuggestions';
import UserProfile from './pages/User/UserProfile';
import AdminProfile from './pages/Admin/AdminProfile';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';

import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Toaster position='top-right' />

      <SocketProvider>
        <BrowserRouter>

          <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User Routes with MainLayout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <MainLayout role="user" />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/carbon" element={<CarbonCalculator />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/eco-suggestions" element={<EcoSuggestions />} />
          </Route>

          {/* Admin Routes with MainLayout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MainLayout role="admin" />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
          </Route>

        </Routes>
      </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App