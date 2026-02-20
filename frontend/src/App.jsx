import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';
import AdminUsers from './pages/admin/AdminUsers';
import UserHome from './pages/user/UserHome';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const RoleRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'USER') return <Navigate to="/user/stores" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RoleRedirect />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/update-password" element={
                        <ProtectedRoute allowedRoles={['ADMIN', 'USER', 'STORE_OWNER']}>
                            <UpdatePasswordPage />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/stores" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminStores />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminUsers />
                        </ProtectedRoute>
                    } />

                    {/* User Routes */}
                    <Route path="/user/stores" element={
                        <ProtectedRoute allowedRoles={['USER']}>
                            <UserHome />
                        </ProtectedRoute>
                    } />

                    {/* Store Owner Routes */}
                    <Route path="/owner" element={
                        <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
