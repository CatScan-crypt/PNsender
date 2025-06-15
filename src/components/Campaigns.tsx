import React, { useState } from 'react';
import { TokenTable } from './UserTable';

const Campaigns: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<any[]>([]);
  const [sendResults, setSendResults] = useState<string[]>([]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body || selectedTokens.length === 0) {
      setSendResults(["Please fill title, body, and select at least one token."]);
      return;
    }
    const results: string[] = [];
    for (const t of selectedTokens) {
      try {
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: t.token, title, body })
        });
        const data = await response.json();
        if (response.ok) {
          results.push(`Token ${t.token.slice(0, 8)}...: Sent! Message ID: ${data.messageId || ''}`);
        } else {
          results.push(`Token ${t.token.slice(0, 8)}...: Error: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        results.push(`Token ${t.token.slice(0, 8)}...: Network error`);
      }
    }
    setSendResults(results);
  };

  return (
    <div>
      <h2>Campaigns</h2>
      <div style={{display:'flex',flexDirection:'row', gap:'2.5rem', alignItems:'flex-start', marginTop:'2rem', width:'100%'}}>
        <div style={{flex:'1 1 520px', minWidth: 400, maxWidth: 650, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
          <TokenTable onSelectionChange={setSelectedTokens}/>
        </div>
        <form onSubmit={handleSendNotification} style={{display:'flex',flexDirection:'column',gap:'1rem',alignItems:'flex-start',flex:'1 1 260px',minWidth:220,maxWidth:350,marginTop:5}}>
          <input type="text" placeholder="Title" value={title} 
          onChange={e => setTitle(e.target.value)}
          style={{background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '0.35rem 0.75rem', fontSize: '1rem', width: 250, outline: 'none', height: 36, boxSizing: 'border-box',}}/>
          <input type="text" placeholder="body" value={body} 
          onChange={e => setBody(e.target.value)}
          style={{background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '0.35rem 0.75rem', fontSize: '1rem', width: 250, outline: 'none', height: 36, boxSizing: 'border-box',}}/>
          <button type="submit">Send Notification</button>
        </form>
      </div>
      {sendResults.length > 0 && (
          <div style={{marginTop: '1rem'}}>
            <h4>Send Results:</h4>
            <ul style={{paddingLeft: '1.2em'}}>
              {sendResults.map((msg, i) => <li key={i} style={{fontSize:'0.95em'}}>{msg}</li>)}
            </ul>
          </div>
        )}
    </div>
  );
};

export default Campaigns;
