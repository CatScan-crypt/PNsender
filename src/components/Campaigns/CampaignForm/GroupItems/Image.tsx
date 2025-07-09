import React from 'react';

interface ImageProps {
  image: string;
  onImageChange: (value: string) => void;
}

export const Image: React.FC<ImageProps> = ({ image, onImageChange }) => (
  <div className="form-group">
    <label htmlFor="image">Image URL (optional)</label>
    <input 
      id="image"
      type="url" 
      placeholder="Enter image URL" 
      value={image}
      onChange={e => onImageChange(e.target.value)}
      className="form-input"
    />
  </div>
);
