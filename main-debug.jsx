import React from 'react'
import ReactDOM from 'react-dom/client'

// Debug component to test imports one by one
const DebugApp = () => {
  const [currentTest, setCurrentTest] = React.useState('basic');
  const [error, setError] = React.useState(null);

  const runTest = (testName, testFn) => {
    setCurrentTest(testName);
    setError(null);
    try {
      testFn();
    } catch (err) {
      setError(`${testName}: ${err.message}`);
      console.error(`Test ${testName} failed:`, err);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🔍 Debug Mode - Testing Components</h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Current Test: {currentTest}</h3>
        {error && (
          <div style={{ 
            background: 'rgba(255,0,0,0.2)', 
            padding: '10px', 
            borderRadius: '5px',
            marginTop: '10px',
            border: '1px solid rgba(255,0,0,0.5)'
          }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => runTest('schema', () => {
            import('./schema.js').then(() => console.log('✓ schema.js loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Schema
        </button>

        <button 
          onClick={() => runTest('store', () => {
            import('./store.js').then(() => console.log('✓ store.js loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Store
        </button>

        <button 
          onClick={() => runTest('ThemeContext', () => {
            import('./ThemeContext.jsx').then(() => console.log('✓ ThemeContext.jsx loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test ThemeContext
        </button>

        <button 
          onClick={() => runTest('AIOptimizer', () => {
            import('./AIOptimizer.jsx').then(() => console.log('✓ AIOptimizer.jsx loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test AIOptimizer
        </button>

        <button 
          onClick={() => runTest('StripeIntegration', () => {
            import('./StripeIntegration.jsx').then(() => console.log('✓ StripeIntegration.jsx loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test StripeIntegration
        </button>

        <button 
          onClick={() => runTest('Full App', () => {
            import('./App.jsx').then(() => console.log('✓ App.jsx loaded'));
          })}
          style={{
            padding: '10px 15px',
            background: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Full App
        </button>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click each test button to check for import errors</li>
          <li>Watch the console (F12) for detailed error messages</li>
          <li>If a test fails, we'll fix that specific component</li>
          <li>Work through them systematically until we find the issue</li>
        </ol>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DebugApp />
  </React.StrictMode>
)