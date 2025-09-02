import React, { useState } from 'react';
import usePromptStore from './store';

const DirectTestApp = () => {
  console.log('🚨🚨🚨 DIRECT TEST APP LOADED - COMPLETELY BYPASSING ALL CACHE 🚨🚨🚨');
  
  const [textInput, setTextInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { setFieldValue } = usePromptStore();

  const handleConvert = async () => {
    if (!textInput.trim()) {
      setError('Please enter a scene description');
      return;
    }

    setIsConverting(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚨🚨🚨 DIRECT TEST APP making API call');
      
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Convert this to JSON: "${textInput}". Return ONLY valid JSON with fields like scene, character_type, setting, actions.`
          }],
          temperature: 0.3,
          max_tokens: 500,
          model: 'llama-3.1-8b-instant'
        })
      });
      
      console.log('🔥 DIRECT TEST APP response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API failed: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('🔥 DIRECT TEST APP response:', responseText.substring(0, 300));
      
      const apiData = JSON.parse(responseText);
      const aiContent = apiData.choices[0].message.content;
      console.log('🔥 DIRECT TEST APP AI content:', aiContent);

      // Parse JSON
      let cleanedResponse = aiContent.trim();
      cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
      
      const jsonStart = cleanedResponse.indexOf('{');
      const jsonEnd = cleanedResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      const jsonData = JSON.parse(cleanedResponse);
      console.log('🔥 DIRECT TEST APP parsed JSON:', jsonData);
      
      setResult(jsonData);
      
      // Update store
      Object.entries(jsonData).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim()) {
          setFieldValue(key, value.trim());
        }
      });

    } catch (err) {
      console.error('🚨 DIRECT TEST APP error:', err);
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>🧪 DIRECT TEST APP - NO CACHE</h1>
      <p style={{ color: '#666' }}>Direct API test bypassing all caching issues</p>
      
      <div style={{ margin: '20px 0' }}>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter scene description..."
          style={{ 
            width: '100%', 
            height: '100px', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
      </div>
      
      <button
        onClick={handleConvert}
        disabled={isConverting || !textInput.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: isConverting ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isConverting ? 'not-allowed' : 'pointer'
        }}
      >
        {isConverting ? 'Converting...' : 'Convert to JSON'}
      </button>
      
      {error && (
        <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#ffe6e6', color: '#d00', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}
      
      {result && (
        <div style={{ margin: '20px 0' }}>
          <h3>✅ Success! Generated Fields:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {Object.entries(result).map(([key, value]) => (
              <div key={key} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
                <strong style={{ color: '#333' }}>{key.replace(/_/g, ' ')}</strong>
                <div style={{ color: '#666', marginTop: '5px' }}>{value}</div>
              </div>
            ))}
          </div>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DirectTestApp;