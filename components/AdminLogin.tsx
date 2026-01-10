
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError('');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-[#E5E0D5] shadow-sm">
      <h2 className="text-3xl serif mb-8 text-center">Studio Access</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-widest mb-2 text-[#706C61]">Access Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-[#E5E0D5] outline-none focus:border-[#A09885] transition-colors"
            placeholder="••••••"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <button
          type="submit"
          className="w-full py-4 bg-[#2C2C2C] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
        >
          Unlock Dashboard
        </button>
      </form>
      <p className="mt-8 text-[10px] text-center text-[#A09885] uppercase tracking-tighter">Authorized Personnel Only</p>
    </div>
  );
};

export default AdminLogin;
