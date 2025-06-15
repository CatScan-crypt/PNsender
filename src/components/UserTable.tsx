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

interface TokenTableProps {
  onSelectionChange?: (selectedTokens: Token[]) => void;
}

export const TokenTable: React.FC<TokenTableProps> = ({ onSelectionChange }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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

  // Handler for selecting/deselecting a single row
  const handleSelect = (token: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(token)) {
        newSet.delete(token);
      } else {
        newSet.add(token);
      }
      if (onSelectionChange) {
        const selected = tokens.filter(t => newSet.has(t.token));
        onSelectionChange(selected);
      }
      return newSet;
    });
  };

  // Handler for select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(tokens.map(t => t.token));
      setSelectedIds(allIds);
      if (onSelectionChange) {
        onSelectionChange(tokens);
      }
    } else {
      setSelectedIds(new Set());
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    }
  };

  // Handler for deleting selected
  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;
    try {
      const response = await fetch('/api/tokens/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      });
      if (!response.ok) {
        throw new Error('Failed to delete tokens');
      }
      const data = await response.json();
      setTokens(prev => prev.filter(token => !idsToDelete.includes(token.token)));
      setSelectedIds(new Set());
      console.log('Deleted token IDs:', data.deleted);
    } catch (err) {
      console.error('Error deleting tokens:', err);
      // Optionally, show a user-facing error message here
    }
  };


  return (
    <div>

      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '500px' }}>
        <thead>
          <tr style={{ backgroundColor: 'black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>
              <input
                type="checkbox"
                ref={el => {
                  if (el) {
                    el.indeterminate = selectedIds.size > 0 && selectedIds.size < tokens.length;
                  }
                }}
                checked={selectedIds.size === tokens.length && tokens.length > 0}
                onChange={e => handleSelectAll(e.target.checked)}
              />
            </th>
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
              <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(token.token)}
                  onChange={() => handleSelect(token.token)}
                />
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(token.createdAt).toLocaleString()}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{token.browserType}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{token.browserVersion}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{shortenId(token.token)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{ marginBottom: '10px' }}
        disabled={selectedIds.size === 0}
        onClick={handleDeleteSelected}
      >
        Delete Selected
      </button>
    </div>
  );
};