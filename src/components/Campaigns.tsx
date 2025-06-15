import React, { useState } from 'react';
import { TokenTable } from './UserTable';

const Campaigns: React.FC = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<any[]>([]);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const logObject = {
      title,
      name,
      tokens: selectedTokens.map(t => t.token)
    };
    console.log(logObject);
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
          <input type="text" placeholder="Name" value={name} 
          onChange={e => setName(e.target.value)}
          style={{background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 4, padding: '0.35rem 0.75rem', fontSize: '1rem', width: 250, outline: 'none', height: 36, boxSizing: 'border-box',}}/>
          <button type="submit">Send Notification</button>
        </form>
      </div>
    </div>
  );
};

export default Campaigns;
