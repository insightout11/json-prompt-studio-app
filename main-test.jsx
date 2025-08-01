import React from 'react'
import ReactDOM from 'react-dom/client'

// Simple test component
const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, React is loading correctly.</p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>✅ Test Results:</h3>
        <ul>
          <li>✓ React is loaded</li>
          <li>✓ JSX is compiling</li>
          <li>✓ JavaScript is executing</li>
          <li>✓ Styles are applied</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('Button click works!')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Test Click Event
      </button>
      <div style={{ marginTop: '30px', fontSize: '14px', opacity: '0.8' }}>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        <p>If this works, we can proceed to debug the main app!</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)