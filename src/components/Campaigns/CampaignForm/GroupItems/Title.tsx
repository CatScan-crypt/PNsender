import React from 'react';

interface TitleProps {
  title: string;
  onTitleChange: (value: string) => void;
}

export const Title: React.FC<TitleProps> = ({ title, onTitleChange }) => (
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input 
      id="title"
      type="text" 
      placeholder="Enter notification title" 
      value={title}
      onChange={e => onTitleChange(e.target.value)}
      className="form-input"
      required
    />
  </div>
);
