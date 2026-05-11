import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE}/auth/admin/login`, form);
      dispatch(setCredentials(data));
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl tracking-widest text-white mb-2">CAPZYY</h1>
        <p className="text-textMuted text-xs tracking-widest uppercase mb-8">Admin Access</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" placeholder="admin@capzyy.com" required /></div>
          <div><label className="text-xs tracking-widest uppercase text-textSecondary block mb-2">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="input-field" placeholder="••••••••" required /></div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
