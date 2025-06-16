import React, { useState } from 'react';
import './SendTestNotification.css';

const SendTestNotification = () => {
  const [token, setToken] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token || !title || !body) {
      setResponseMessage('All fields are required.');
      return;
    }

    setIsLoading(true);
    setResponseMessage('');

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, title, body }),
      });
      console.log(body,token);
      const data = await response.json();

      if (response.ok) {
        setResponseMessage(`Notification sent! Message ID: ${data.messageId}`);
      } else {
        throw new Error(data.error || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isError = responseMessage.toLowerCase().includes('error');

  return (
    <div className="notification-form">
      <h2>Send Test Push Notification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="token">FCM Token</label>
          <textarea
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter FCM token"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="body">Message</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter notification message"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
      
      {responseMessage && (
        <div className={`response-message ${isError ? 'error' : 'success'}`}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default SendTestNotification;
