import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">⭐ Store Rating Platform</Link>
            </div>
            <div className="navbar-links">
                {user?.role === 'ADMIN' && (
                    <>
                        <Link to="/admin">Dashboard</Link>
                        <Link to="/admin/stores">Stores</Link>
                        <Link to="/admin/users">Users</Link>
                    </>
                )}
                {user?.role === 'USER' && (
                    <Link to="/user/stores">Browse Stores</Link>
                )}
                {user?.role === 'STORE_OWNER' && (
                    <Link to="/owner">My Store</Link>
                )}
                <Link to="/update-password">Change Password</Link>
                <span className="navbar-user">{user?.name?.split(' ')[0]}</span>
                <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
