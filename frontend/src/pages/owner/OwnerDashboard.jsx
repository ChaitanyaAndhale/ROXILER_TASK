import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

function OwnerDashboard() {
    const [storeData, setStoreData] = useState(null);
    const [raters, setRaters] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/owner/my-store')
            .then(res => setStoreData(res.data))
            .catch(() => setError('No store found for your account. Contact an admin.'));

        api.get('/owner/raters')
            .then(res => setRaters(res.data))
            .catch(() => { });
    }, []);

    const renderStars = (avg) => {
        if (!avg) return <span className="no-rating">No ratings yet</span>;
        const full = Math.round(avg);
        return (
            <span className="stars">
                {'★'.repeat(full)}{'☆'.repeat(5 - full)}
                <span className="star-value"> {avg}/5</span>
            </span>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <h2>Store Owner Dashboard</h2>

                {error && <div className="alert alert-error">{error}</div>}

                {storeData && (
                    <div className="form-card">
                        <h3>{storeData.store.name}</h3>
                        <p>📍 {storeData.store.address}</p>
                        <p>✉️ {storeData.store.email}</p>
                        <div className="stats-grid" style={{ marginTop: '16px' }}>
                            <div className="stat-card">
                                <span className="stat-number">{renderStars(storeData.averageRating)}</span>
                                <span className="stat-label">Average Rating</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">{storeData.totalRatings}</span>
                                <span className="stat-label">Total Reviews</span>
                            </div>
                        </div>
                    </div>
                )}

                <h3 style={{ marginTop: '32px' }}>Users Who Rated Your Store</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Rating</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {raters.length === 0 ? (
                            <tr><td colSpan="5" className="text-center">No ratings yet</td></tr>
                        ) : raters.map((r, i) => (
                            <tr key={r.id}>
                                <td>{i + 1}</td>
                                <td>{r.user.name}</td>
                                <td>{r.user.email}</td>
                                <td>{'⭐'.repeat(r.rating)} ({r.rating})</td>
                                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OwnerDashboard;
