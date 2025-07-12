import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthTest() {
  const { user, login, loading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('Password123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      console.log('Login successful');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
      <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
      
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="font-semibold">Current State:</h3>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>User: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
        <p>Token: {localStorage.getItem('token') ? 'Exists' : 'None'}</p>
      </div>

      {!isAuthenticated && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {isAuthenticated && (
        <div className="text-green-600">
          ✅ Successfully authenticated as {user?.username}
        </div>
      )}
    </div>
  );
}
