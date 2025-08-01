import React from 'react'
import ReactDOM from 'react-dom/client'

const ProgressiveTest = () => {
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState(null);

  const steps = [
    {
      name: "Basic App Import",
      test: async () => {
        const { default: App } = await import('./App.jsx');
        return "App component imported successfully";
      }
    },
    {
      name: "ThemeProvider Import",
      test: async () => {
        const { default: ThemeProvider } = await import('./ThemeContext.jsx');
        return "ThemeProvider imported successfully";
      }
    },
    {
      name: "CSS Import Test",
      test: async () => {
        await import('./index.css');
        return "CSS imported successfully";
      }
    },
    {
      name: "App Component Render Test",
      test: async () => {
        const { default: App } = await import('./App.jsx');
        const { default: ThemeProvider } = await import('./ThemeContext.jsx');
        
        // Try to render in a test container
        const testDiv = document.createElement('div');
        const root = ReactDOM.createRoot(testDiv);
        
        return new Promise((resolve, reject) => {
          try {
            root.render(
              React.createElement(React.StrictMode, null,
                React.createElement(ThemeProvider, null,
                  React.createElement(App, null)
                )
              )
            );
            setTimeout(() => resolve("App component renders without crashing"), 100);
          } catch (err) {
            reject(err);
          }
        });
      }
    }
  ];

  const runStep = async (stepIndex) => {
    setError(null);
    try {
      const result = await steps[stepIndex].test();
      console.log(`✅ Step ${stepIndex + 1}: ${result}`);
      setStep(stepIndex + 1);
    } catch (err) {
      console.error(`❌ Step ${stepIndex + 1} failed:`, err);
      setError(`Step ${stepIndex + 1} (${steps[stepIndex].name}): ${err.message}`);
    }
  };

  const loadRealApp = async () => {
    try {
      const { default: App } = await import('./App.jsx');
      const { default: ThemeProvider } = await import('./ThemeContext.jsx');
      await import('./index.css');
      
      // Replace current content with real app
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(ThemeProvider, null,
            React.createElement(App, null)
          )
        )
      );
    } catch (err) {
      setError(`Failed to load real app: ${err.message}`);
      console.error('Real app loading failed:', err);
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
      <h1>🧪 Progressive App Loading Test</h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Current Step: {step} / {steps.length}</h3>
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

      <div style={{ marginBottom: '20px' }}>
        {steps.map((stepInfo, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => runStep(index)}
              disabled={step > index}
              style={{
                padding: '10px 15px',
                background: step > index ? '#28a745' : index === step ? '#ffc107' : '#6c757d',
                color: step > index ? 'white' : index === step ? 'black' : 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: step > index ? 'default' : 'pointer',
                marginRight: '10px',
                minWidth: '200px'
              }}
            >
              {step > index ? '✅' : index === step ? '▶️' : '⏸️'} Step {index + 1}: {stepInfo.name}
            </button>
          </div>
        ))}
      </div>

      {step >= steps.length && !error && (
        <div style={{ 
          background: 'rgba(0,255,0,0.2)', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(0,255,0,0.5)'
        }}>
          <h3>🎉 All Tests Passed!</h3>
          <p>The App component should work. Click below to load the real app:</p>
          <button
            onClick={loadRealApp}
            style={{
              padding: '15px 30px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🚀 Load Real App
          </button>
        </div>
      )}

      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Click Step 1, wait for it to complete (turns green)</li>
          <li>Continue with Step 2, then Step 3, then Step 4</li>
          <li>If any step fails, we'll see the exact error</li>
          <li>If all steps pass, click "Load Real App"</li>
        </ol>
        <p><strong>Check the browser console (F12) for detailed logs!</strong></p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProgressiveTest />
  </React.StrictMode>
)