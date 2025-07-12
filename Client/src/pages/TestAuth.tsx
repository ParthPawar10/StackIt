import { useAuth } from '../contexts/AuthContext';

export default function TestAuth() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <div className="space-y-2">
        <p><strong>Is Authenticated:</strong> {isAuthenticated.toString()}</p>
        <p><strong>User exists:</strong> {user ? 'Yes' : 'No'}</p>
        {user && (
          <>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        )}
      </div>
    </div>
  );
}
