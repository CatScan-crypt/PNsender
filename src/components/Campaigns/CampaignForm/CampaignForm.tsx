import React from 'react';
import { handleSendNotification } from './handlers/notificationHandler';
import { handlePostCampaignAnalytics } from './handlers/analyticsHandler';
import './CampaignForm.css';

interface CampaignFormProps {
  title: string;
  setTitle: (title: string) => void;
  body: string;
  setBody: (body: string) => void;
  selectedTokens: any[];
  sendResults: string[];
  isSending: boolean;
  setSendResults: (results: string[]) => void;
  setIsSending: (isSending: boolean) => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  title,
  setTitle,
  body,
  setBody,
  selectedTokens,
  sendResults,
  isSending,
  setSendResults,
  setIsSending
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSendNotification({
        title,
        body,
        selectedTokens,
        setSendResults,
        setIsSending
      });
      
      // Post campaign analytics after successful notification send
      await handlePostCampaignAnalytics();
    } catch (error) {
      console.error('Error in notification process:', error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="notification-form">
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
  );
}; 