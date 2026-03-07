import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/User/UserDashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';

const App = () => {
  return (
    <>
      <Toaster position='top-right' />

      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={ <LandingPage /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />

          {/* User Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App