import React from 'react';

const TextBox = ({ label, value, onChange = () => {}, disabled }) => (
  <div className="textbox-progress">
    <label htmlFor={name} className="textarea-label">
      {label}
    </label>
    <textarea
      className="textarea"
      autoComplete="off"
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      value={value}
    />
  </div>
);

export default TextBox;
