import React, { useState } from 'react';
import Logo from './Logo.jsx';

const LogoDemo = () => {
  const [neonColor, setNeonColor] = useState('#00ffff');
  const [glowIntensity, setGlowIntensity] = useState(3);
  const [showBackground, setShowBackground] = useState(true);

  const colorOptions = [
    { name: 'Cyan', value: '#00ffff' },
    { name: 'Purple', value: '#ff00ff' },
    { name: 'Green', value: '#00ff00' },
    { name: 'Orange', value: '#ff8000' },
    { name: 'Pink', value: '#ff0080' },
    { name: 'Yellow', value: '#ffff00' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
                 <h1 className="text-4xl font-bold mb-8 text-center">JSON PROMPT STUDIO Logo Demo</h1>
        
        {/* Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Customization Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Neon Color:</label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNeonColor(color.value)}
                    className={`p-2 rounded border-2 transition-all ${
                      neonColor === color.value 
                        ? 'border-white scale-110' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value + '20' }}
                  >
                    <div 
                      className="w-full h-4 rounded"
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span className="text-xs mt-1 block">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Glow Intensity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Glow Intensity: {glowIntensity}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={glowIntensity}
                onChange={(e) => setGlowIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Background Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Background:</label>
              <button
                onClick={() => setShowBackground(!showBackground)}
                className={`px-4 py-2 rounded transition-colors ${
                  showBackground 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {showBackground ? 'Show Background' : 'Hide Background'}
              </button>
            </div>
          </div>
        </div>

        {/* Logo Display */}
        <div className="bg-gray-800 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Current Logo</h2>
          <div className="flex justify-center">
                         <Logo
               width={400}
               height={200}
               neonColor={neonColor}
               glowIntensity={glowIntensity}
               showBackground={showBackground}
             />
          </div>
        </div>

        {/* Logo Variations */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Logo Variations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Small Logo */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Small</h3>
                             <Logo
                 width={200}
                 height={100}
                 neonColor={neonColor}
                 glowIntensity={glowIntensity}
                 showBackground={showBackground}
               />
            </div>

            {/* Medium Logo */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Medium</h3>
                             <Logo
                 width={300}
                 height={150}
                 neonColor={neonColor}
                 glowIntensity={glowIntensity}
                 showBackground={showBackground}
               />
            </div>

            {/* Large Logo */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Large</h3>
                             <Logo
                 width={500}
                 height={250}
                 neonColor={neonColor}
                 glowIntensity={glowIntensity}
                 showBackground={showBackground}
               />
            </div>

            {/* No Background */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No Background</h3>
              <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-4 rounded">
                                 <Logo
                   width={300}
                   height={150}
                   neonColor="#00ffff"
                   glowIntensity={4}
                   showBackground={false}
                 />
              </div>
            </div>

            {/* Different Colors */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Purple Variant</h3>
                             <Logo
                 width={300}
                 height={150}
                 neonColor="#ff00ff"
                 glowIntensity={3}
                 showBackground={showBackground}
               />
            </div>

            {/* Green Variant */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Green Variant</h3>
                             <Logo
                 width={300}
                 height={150}
                 neonColor="#00ff00"
                 glowIntensity={3}
                 showBackground={showBackground}
               />
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-bold mb-4">Usage Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic Usage:</h3>
              <code className="bg-gray-700 p-2 rounded block">
                {`import Logo from './Logo.jsx';

<Logo />`}
              </code>
            </div>
            
                         <div>
               <h3 className="text-lg font-semibold mb-2">With Customization:</h3>
               <code className="bg-gray-700 p-2 rounded block">
                 {`<Logo 
   width={400}
   height={200}
   neonColor="#ff00ff"
   glowIntensity={5}
   showBackground={false}
   className="my-custom-class"
 />`}
               </code>
             </div>

             <div>
               <h3 className="text-lg font-semibold mb-2">Available Props:</h3>
               <ul className="list-disc list-inside space-y-1 text-sm">
                 <li><code>width</code> - Logo width (default: 400)</li>
                 <li><code>height</code> - Logo height (default: 200)</li>
                 <li><code>neonColor</code> - Neon glow color (default: "#00ffff")</li>
                 <li><code>glowIntensity</code> - Glow blur radius (default: 3)</li>
                 <li><code>showBackground</code> - Show/hide background (default: true)</li>
                 <li><code>className</code> - Additional CSS classes</li>
               </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDemo; 