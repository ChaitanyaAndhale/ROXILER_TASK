import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function UpdatePasswordPage() {
    const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.put('/auth/update-password', form);
            setSuccess('Password updated successfully!');
            setForm({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="auth-card" style={{ maxWidth: '480px', margin: '40px auto' }}>
                    <h2>Update Password</h2>
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Current Password</label>
                            <input
                                id="oldPassword"
                                type="password"
                                value={form.oldPassword}
                                onChange={e => setForm({ ...form, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password <span className="hint">(8–16 chars, 1 uppercase, 1 special)</span></label>
                            <input
                                id="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatePasswordPage;
