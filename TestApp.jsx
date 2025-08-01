import React from 'react';

const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎉 App is Working!</h1>
      <p>If you can see this, the React app is running correctly.</p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>✅ Test Results:</h3>
        <ul>
          <li>✓ React is loaded</li>
          <li>✓ JavaScript is executing</li>
          <li>✓ Vite dev server is working</li>
          <li>✓ Components can render</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('Button works!')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Click Event
      </button>
    </div>
  );
};

export default TestApp;