import React from 'react';

const Placeholder: React.FC<{ name: string }> = ({ name }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }} className="glass animate-fade-in">
    <h2>{name}</h2>
    <p>This tool is currently under development. Stay tuned!</p>
  </div>
);

export default Placeholder;
