import { useEffect, useState } from 'react';

interface Token {
  id: string;
  token: string;
  browserType: string;
  browserVersion: string;
  createdAt: string;
}

const shortenId = (id: string | undefined) => {
  if (!id) return '';
  if (id.length <= 8) return id;
  return `${id.slice(0, 2)}...${id.slice(-2)}`;
};

export const TokenTable = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data.tokens);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '500px' }}>
      <thead>
        <tr style={{ backgroundColor: 'black' }}>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Created At</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Browser</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Version</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Token</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => (
          <tr key={token.id} style={{ border: '1px solid black', padding: '8px' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(token.createdAt).toLocaleString()}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{token.browserType}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{token.browserVersion}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{shortenId(token.token)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};