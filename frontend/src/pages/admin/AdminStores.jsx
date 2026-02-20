import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

function AdminStores() {
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('asc');
    const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchStores = () => {
        api.get('/admin/stores', { params: { name: search, sort } })
            .then(res => setStores(res.data))
            .catch(() => setError('Failed to load stores'));
    };

    const fetchOwners = () => {
        api.get('/admin/users', { params: { role: 'STORE_OWNER' } })
            .then(res => setOwners(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchStores();
        fetchOwners();
    }, [search, sort]);

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/admin/stores', { ...form, ownerId: parseInt(form.ownerId) });
            setSuccess('Store added successfully!');
            setForm({ name: '', email: '', address: '', ownerId: '' });
            setShowForm(false);
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add store');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <h2>Stores</h2>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add Store'}
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {showForm && (
                    <div className="form-card">
                        <h3>Add New Store</h3>
                        <form onSubmit={handleAddStore}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Store Name <span className="hint">(20–60 chars)</span></label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} required />
                            </div>
                            <div className="form-group">
                                <label>Owner</label>
                                <select value={form.ownerId} onChange={e => setForm({ ...form, ownerId: e.target.value })} required>
                                    <option value="">-- Select Store Owner --</option>
                                    {owners.map(o => (
                                        <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Store'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="asc">Name A→Z</option>
                        <option value="desc">Name Z→A</option>
                    </select>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Store Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Owner</th>
                            <th>Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No stores found</td></tr>
                        ) : stores.map((store, i) => (
                            <tr key={store.id}>
                                <td>{i + 1}</td>
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address}</td>
                                <td>{store.owner?.name || '-'}</td>
                                <td>{store.averageRating ? `⭐ ${store.averageRating}` : 'No ratings'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminStores;
