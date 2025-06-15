import React, { useState } from 'react';

const SendTestNotification = () => {
  const [token, setToken] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token || !title || !body) {
      setResponseMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, title, body }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(`Notification sent! Message ID: ${data.messageId}`);
      } else {
        setResponseMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setResponseMessage('Network error. Check your backend server.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Send Test Push Notification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>FCM Token:</label><br />
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={4}
            cols={40}
            required
          />
        </div>
        <div>
          <label>Title:</label><br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label><br />
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Send Notification</button>
      </form>
      {responseMessage && <p style={{ marginTop: '10px' }}>{responseMessage}</p>}
    </div>
  );
};

export default SendTestNotification;
