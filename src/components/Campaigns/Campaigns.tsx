import React, { useState } from 'react';
import { TokenTable } from './UserTable/UserTable';
import { CampaignForm } from './CampaignForm/CampaignForm';
import './Campaigns.css';

const Campaigns: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
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
          message={message}
          setMessage={setMessage}
          image={image}
          setImage={setImage}
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
