import React from 'react';

interface MessageProps {
  message: string;
  onMessageChange: (value: string) => void;
}

export const Message: React.FC<MessageProps> = ({ message, onMessageChange }) => (
  <div className="form-group">
    <label htmlFor="message">Message</label>
    <textarea
      id="message"
      placeholder="Enter notification message"
      value={message}
      onChange={e => onMessageChange(e.target.value)}
      className="form-input form-textarea"
      rows={4}
      required
    />
  </div>
);
