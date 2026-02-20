import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

function UserHome() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [addressSearch, setAddressSearch] = useState('');
    const [sort, setSort] = useState('asc');
    const [ratings, setRatings] = useState({});
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState('');

    const fetchStores = () => {
        api.get('/user/stores', { params: { name: search, address: addressSearch, sort } })
            .then(res => {
                setStores(res.data);
                // Initialize ratings from existing user ratings
                const initial = {};
                res.data.forEach(s => {
                    if (s.myRating != null) initial[s.id] = s.myRating;
                });
                setRatings(prev => ({ ...initial, ...prev }));
            })
            .catch(() => setError('Failed to load stores'));
    };

    useEffect(() => {
        fetchStores();
    }, [search, addressSearch, sort]);

    const handleRatingChange = (storeId, value) => {
        setRatings(prev => ({ ...prev, [storeId]: parseInt(value) }));
    };

    const submitRating = async (storeId) => {
        const rating = ratings[storeId];
        if (!rating) return;
        setFeedback('');
        setError('');
        try {
            await api.post('/user/ratings', { storeId, rating });
            setFeedback('Rating submitted!');
            fetchStores();
            setTimeout(() => setFeedback(''), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        }
    };

    const renderStars = (avg) => {
        if (!avg) return <span className="no-rating">Not rated yet</span>;
        const full = Math.round(avg);
        return (
            <span className="stars">
                {'★'.repeat(full)}{'☆'.repeat(5 - full)}
                <span className="star-value"> {avg}</span>
            </span>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <h2>Browse Stores</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {feedback && <div className="alert alert-success">{feedback}</div>}

                <div className="filter-bar">
                    <input type="text" placeholder="Search by store name..." value={search} onChange={e => setSearch(e.target.value)} />
                    <input type="text" placeholder="Search by address..." value={addressSearch} onChange={e => setAddressSearch(e.target.value)} />
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="asc">Name A→Z</option>
                        <option value="desc">Name Z→A</option>
                    </select>
                </div>

                <div className="store-grid">
                    {stores.length === 0 ? (
                        <p>No stores found.</p>
                    ) : stores.map(store => (
                        <div key={store.id} className="store-card">
                            <h3>{store.name}</h3>
                            <p className="store-address">📍 {store.address}</p>
                            <p className="store-email">✉️ {store.email}</p>
                            <div className="store-rating">
                                <strong>Avg Rating:</strong> {renderStars(store.averageRating)}
                            </div>
                            <div className="rating-form">
                                <label>Your Rating:</label>
                                <select
                                    value={ratings[store.id] || ''}
                                    onChange={e => handleRatingChange(store.id, e.target.value)}
                                    id={`rating-${store.id}`}
                                >
                                    <option value="">-- Select --</option>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>{n} ⭐</option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => submitRating(store.id)}
                                    disabled={!ratings[store.id]}
                                >
                                    {store.myRating ? 'Update' : 'Submit'}
                                </button>
                                {store.myRating && (
                                    <span className="my-rating-badge">Your current: {store.myRating}⭐</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserHome;
