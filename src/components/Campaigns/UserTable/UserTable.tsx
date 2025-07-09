import React, { useEffect, useState } from 'react';
import './UserTable.css';

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const MAX_RETRIES = 60;
    const RETRY_INTERVAL = 1000; // 1 second

    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data.tokens);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          setError(`Connection error. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_INTERVAL);
        } else {
          setError('Failed to connect after multiple attempts. Please check if the server is running.');
          setLoading(false);
        }
      }
    };

    fetchTokens();
  }, [retryCount]);

  useEffect(() => {
    if (onSelectionChange) {
      const selectedTokens = tokens.filter(token => selectedIds.has(token.token));
      onSelectionChange(selectedTokens);
    }
  }, [selectedIds, tokens, onSelectionChange]);

  if (loading) return <div className="loading">Loading devices...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const handleSelect = (token: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(token)) {
        newSet.delete(token);
      } else {
        newSet.add(token);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(tokens.map(t => t.token));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

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
      setRetryCount(prev => prev + 1); // Trigger re-fetch
      console.log('Deleted token IDs:', data.deleted);
    } catch (err) {
      console.error('Error deleting tokens:', err);
    }
  };

  return (
    <div>
      <table className="user-table">
        <thead>
          <tr>
            <th>
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
            <th>ID</th>
            <th>Created At</th>
            <th>Browser</th>
            <th>Version</th>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr 
              key={token.id} 
              className={selectedIds.has(token.token) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.has(token.token)}
                  onChange={() => handleSelect(token.token)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{new Date(token.createdAt).toLocaleString()}</td>
              <td>{token.browserType}</td>
              <td>{token.browserVersion}</td>
              <td className="token">{shortenId(token.token)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="delete-button"
        disabled={selectedIds.size === 0}
        onClick={handleDeleteSelected}
      >
        Delete Selected {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
      </button>
    </div>
  );
};