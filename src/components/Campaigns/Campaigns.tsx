import React, { useState } from 'react';
import { TokenTable } from './UserTable/UserTable';
import { CampaignForm } from './CampaignForm/CampaignForm';
import './Campaigns.css';

const Campaigns: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<any[]>([]);
  const [sendResults, setSendResults] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  return (
    <div className="campaigns-container">
      <h2 className="campaigns-title">Notification Campaign</h2>
      
      <div className="campaigns-layout">
        <div className="tokens-section">
          <TokenTable onSelectionChange={setSelectedTokens} />
        </div>
        
        <CampaignForm
          title={title}
          setTitle={setTitle}
          body={body}
          setBody={setBody}
          selectedTokens={selectedTokens}
          sendResults={sendResults}
          isSending={isSending}
          setSendResults={setSendResults}
          setIsSending={setIsSending}
        />
      </div>
    </div>
  );
};

export default Campaigns;
