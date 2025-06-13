import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

const UserTable = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // We fetch from a relative path. Vite/Vercel handles routing it to our API.
        const response = await fetch('/api/user/1');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // The empty dependency array ensures this effect runs only once.

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p>Error fetching user: {error}</p>;
  }

  if (!user) {
    return <p>No user data found.</p>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '500px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Username</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.id}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.username}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{user.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
