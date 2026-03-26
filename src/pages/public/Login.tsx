import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      login(response.user, response.token);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-white px-6 min-h-[80vh]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">Welcome back</h1>
          <p className="text-gray-500">Sign in to manage your tech events</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-gray-100/50 shadow-xl p-8 border border-gray-100 rounded-3xl">
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Email Address</label>
              <div className="relative">
                <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block py-3 pr-4 pl-11 border border-gray-200 focus:border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 w-full transition"
                  placeholder="developer@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-gray-700 text-sm">Password</label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 text-sm">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-3 pr-4 pl-11 border border-gray-200 focus:border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 w-full transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 shadow-sm mt-6 px-4 py-3 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full font-bold text-white text-sm transition"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}