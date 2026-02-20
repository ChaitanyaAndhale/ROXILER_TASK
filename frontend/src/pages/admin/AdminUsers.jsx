import { useState, useEffect } from 'react';
import api from '../../api/api';
import Navbar from '../../components/Navbar';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterEmail, setFilterEmail] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [sort, setSort] = useState('asc');
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchUsers = () => {
        api.get('/admin/users', { params: { name: filterName, email: filterEmail, role: filterRole, sort } })
            .then(res => setUsers(res.data))
            .catch(() => setError('Failed to load users'));
    };

    useEffect(() => {
        fetchUsers();
    }, [filterName, filterEmail, filterRole, sort]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/admin/users', form);
            setSuccess('User added successfully!');
            setForm({ name: '', email: '', password: '', address: '', role: 'USER' });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user');
        } finally {
            setLoading(false);
        }
    };

    const roleBadge = (role) => {
        const map = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };
        return <span className={`badge ${map[role] || ''}`}>{role}</span>;
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="page-header">
                    <h2>Users</h2>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add User'}
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {showForm && (
                    <div className="form-card">
                        <h3>Add New User</h3>
                        <form onSubmit={handleAddUser}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name <span className="hint">(20–60 chars)</span></label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Password <span className="hint">(8–16, 1 uppercase, 1 special)</span></label>
                                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        <option value="USER">USER</option>
                                        <option value="STORE_OWNER">STORE_OWNER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} required />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Adding...' : 'Add User'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="filter-bar">
                    <input type="text" placeholder="Filter by name..." value={filterName} onChange={e => setFilterName(e.target.value)} />
                    <input type="text" placeholder="Filter by email..." value={filterEmail} onChange={e => setFilterEmail(e.target.value)} />
                    <select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                        <option value="">All Roles</option>
                        <option value="USER">USER</option>
                        <option value="STORE_OWNER">STORE_OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="asc">Name A→Z</option>
                        <option value="desc">Name Z→A</option>
                    </select>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Role</th>
                            <th>Store Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No users found</td></tr>
                        ) : users.map((user, i) => (
                            <tr key={user.id}>
                                <td>{i + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address}</td>
                                <td>{roleBadge(user.role)}</td>
                                <td>{user.storeRating ? `⭐ ${user.storeRating.toFixed(2)}` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;
