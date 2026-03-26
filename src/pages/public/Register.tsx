import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await authService.register({ firstName, lastName, email, password });
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to create account. That email might already be in use.');
    }
  };

  return (
    <div className="flex justify-center items-center bg-white px-6 py-12 min-h-[80vh]">
      <div className="w-full max-w-md">
        <h1 className="mb-7 font-bold text-gray-900 text-3xl text-center">Create an account</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-gray-100/50 shadow-xl p-8 border border-gray-100 rounded-3xl">
          <div className="space-y-5">
            <div className="gap-4 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">First Name</label>
                <div className="relative">
                  <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block py-3 pr-4 pl-11 border border-gray-200 focus:border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 w-full transition"
                    placeholder="Ada"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Last Name</label>
                <div className="relative">
                  <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block py-3 pr-4 pl-11 border border-gray-200 focus:border-transparent rounded-xl focus:ring-2 focus:ring-blue-600 w-full transition"
                    placeholder="Lovelace"
                    required
                  />
                </div>
              </div>
            </div>

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
              <label className="block mb-1 font-medium text-gray-700 text-sm">Password</label>
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
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-8 text-gray-500 text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}