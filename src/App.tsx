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
import BaseProfile from './pages/common/BaseProfile';
import MainLayout from './components/layout/MainLayout';
import { SocketProvider } from './context/SocketContext';
import EcoSuggestions from './pages/User/EcoSuggestions';


const App = () => {
  return (
    <>
      <Toaster position='top-right' />

      <SocketProvider>
        <BrowserRouter>

          <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

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
            <Route path="/profile" element={<BaseProfile role="user" />} />
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
            <Route path="/admin/profile" element={<BaseProfile role="admin" />} />
          </Route>

        </Routes>
      </BrowserRouter>
      </SocketProvider>
    </>
  )
}

export default App