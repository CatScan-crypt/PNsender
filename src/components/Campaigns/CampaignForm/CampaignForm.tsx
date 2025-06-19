import * as React from 'react';
import { handleSendNotification } from './handlers/notificationHandler';
import { handlePostCampaignAnalytics } from './handlers/analyticsHandler';
import { Title, Message, Image } from './GroupItems';
import './CampaignForm.css';
import type { CampaignFormProps } from './types/types';


export const CampaignForm: React.FC<CampaignFormProps> = ({
  title,
  setTitle,
  message,
  setMessage,
  selectedTokens,
  sendResults,
  isSending,
  setSendResults,
  setIsSending,
  image,
  setImage
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSendNotification({
        title,
        message,
        selectedTokens,
        setSendResults,
        setIsSending,
        image
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
      
      <Title 
        title={title}
        onTitleChange={setTitle}
      />
      
      <Message 
        message={message}
        onMessageChange={setMessage}
      />
      
      <Image
        image={image}
        onImageChange={setImage}
      />
      
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