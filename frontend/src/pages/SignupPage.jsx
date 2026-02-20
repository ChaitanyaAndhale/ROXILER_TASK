import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

function SignupPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/auth/signup', form);
            setSuccess('Account created! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1>Store Rating Platform</h1>
                <h2>Create Account</h2>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name <span className="hint">(20–60 chars)</span></label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password <span className="hint">(8–16 chars, 1 uppercase, 1 special)</span></label>
                        <input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address <span className="hint">(max 400 chars)</span></label>
                        <textarea
                            id="address"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
