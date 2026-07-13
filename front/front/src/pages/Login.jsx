import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', loginForm.username);
      formData.append('password', loginForm.password);

      const response = await axios.post('http://localhost:8000/auth/login', formData);
      
      localStorage.setItem('access_token', response.data.access_token);
      
      navigate('/dashboard');
    } catch (err) {
      setError('Login yoki parol xato!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        
        {/* Logotip / Sarlavha */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#374151] mb-2">EdTech Platform</h1>
          <p className="text-gray-500">Tizimga kirish uchun login va parolingizni kiriting</p>
        </div>

        {/* Xatolik xabari */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Forma */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input 
              type="text" 
              name="username"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="Loginingizni kiriting"
              value={loginForm.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA] transition-all"
              placeholder="••••••••"
              value={loginForm.password}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-[#A78BFA] hover:bg-[#8b5cf6] text-white font-semibold rounded-xl transition-colors duration-200 shadow-md shadow-purple-200"
          >
            Tizimga kirish
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Hisobingiz yo'qmi? <span className="text-[#A78BFA] hover:underline cursor-pointer font-medium">Ro'yxatdan o'tish</span>
        </div>
      </div>
    </div>
  );
}