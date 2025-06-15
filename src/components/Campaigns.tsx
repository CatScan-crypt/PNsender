import React, { useState } from 'react';
import { TokenTable } from './UserTable';
import './Campaigns.css';

const Campaigns: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<any[]>([]);
  const [sendResults, setSendResults] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || selectedTokens.length === 0) {
      setSendResults(["Please fill title, body, and select at least one token."]);
      return;
    }
    
    setIsSending(true);
    const results: string[] = [];
    
    try {
      for (const t of selectedTokens) {
        try {
          const response = await fetch('/api/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: t.token, title, body })
          });
          const data = await response.json();
          if (response.ok) {
            results.push(`✅ Token ${t.token.slice(0, 8)}...: Sent! Message ID: ${data.messageId || ''}`);
          } else {
            results.push(`❌ Token ${t.token.slice(0, 8)}...: Error: ${data.error || 'Unknown error'}`);
          }
        } catch (err) {
          results.push(`❌ Token ${t.token.slice(0, 8)}...: Network error`);
        }
      }
    } finally {
      setIsSending(false);
    }
    
    setSendResults(results);
  };

  return (
    <div className="campaigns-container">
      <h2 className="campaigns-title">Notification Campaign</h2>
      
      <div className="campaigns-layout">
        <div className="tokens-section">
          <TokenTable onSelectionChange={setSelectedTokens} />
        </div>
        
        <form onSubmit={handleSendNotification} className="notification-form">
          <h3 className="form-title">Create Notification</h3>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              id="title"
              type="text" 
              placeholder="Enter notification title" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Message</label>
            <textarea
              id="body"
              placeholder="Enter notification message"
              value={body}
              onChange={e => setBody(e.target.value)}
              className="form-input form-textarea"
              rows={4}
              required
            />
          </div>
          
          <div className="form-footer">
            <button 
              type="submit" 
              className="send-button"
              disabled={isSending || selectedTokens.length === 0}
            >
              {isSending ? 'Sending...' : `Send to ${selectedTokens.length} Device${selectedTokens.length !== 1 ? 's' : ''}`}
            </button>
            {selectedTokens.length > 0 && (
              <span className="selection-count">
                {selectedTokens.length} device{selectedTokens.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          
          {sendResults.length > 0 && (
            <div className="results-container">
              <h4>Send Results:</h4>
              <div className="results-list">
                {sendResults.map((result, index) => (
                  <div key={index} className={`result-item ${result.startsWith('✅') ? 'success' : 'error'}`}>
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Campaigns;
