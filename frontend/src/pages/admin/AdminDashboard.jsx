import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(res => setStats(res.data))
            .catch(() => setError('Failed to load dashboard stats'));
    }, []);

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <h2>Admin Dashboard</h2>
                {error && <div className="alert alert-error">{error}</div>}
                {stats ? (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">{stats.totalUsers}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{stats.totalStores}</span>
                            <span className="stat-label">Total Stores</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">{stats.totalRatings}</span>
                            <span className="stat-label">Total Ratings</span>
                        </div>
                    </div>
                ) : (
                    !error && <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
