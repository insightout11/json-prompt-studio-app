import React, { useState, useEffect } from 'react';
import usePromptStore from './store';

const AvatarCreator = ({ isOpen, onClose, onSave }) => {
  const { setFieldValue } = usePromptStore();
  
  // Avatar customization state
  const [avatar, setAvatar] = useState({
    // Basic Info
    gender: 'male',
    age_range: 'adult',
    ethnicity: 'caucasian',
    
    // Physical Features
    body_type: 'average',
    height: 'average',
    skin_tone: 'light',
    
    // Face
    face_shape: 'oval',
    eye_color: 'brown',
    eye_shape: 'almond',
    
    // Hair
    hair_color: 'brown',
    hair_style: 'short',
    hair_texture: 'straight',
    
    // Facial Hair (if applicable)
    facial_hair: 'none',
    
    // Distinguishing Features
    distinguishing_features: '',
    
    // Style
    clothing_style: 'casual',
    accessories: ''
  });

  // Avatar options
  const avatarOptions = {
    gender: ['male', 'female', 'non-binary'],
    age_range: ['child', 'teenager', 'young adult', 'adult', 'middle-aged', 'elderly'],
    ethnicity: ['caucasian', 'african', 'asian', 'hispanic', 'middle eastern', 'mixed', 'other'],
    body_type: ['slim', 'average', 'athletic', 'curvy', 'heavy-set', 'muscular'],
    height: ['short', 'average', 'tall'],
    skin_tone: ['very light', 'light', 'medium light', 'medium', 'medium dark', 'dark', 'very dark'],
    face_shape: ['oval', 'round', 'square', 'heart', 'long', 'diamond'],
    eye_color: ['brown', 'blue', 'green', 'hazel', 'gray', 'amber'],
    eye_shape: ['almond', 'round', 'hooded', 'monolid', 'upturned', 'downturned'],
    hair_color: ['black', 'brown', 'blonde', 'red', 'gray', 'white', 'Auburn', 'strawberry blonde'],
    hair_style: ['short', 'medium', 'long', 'buzz cut', 'pixie', 'bob', 'ponytail', 'braids', 'curly', 'wavy', 'straight', 'bald'],
    hair_texture: ['straight', 'wavy', 'curly', 'coily'],
    facial_hair: ['none', 'mustache', 'beard', 'goatee', 'stubble', 'full beard'],
    clothing_style: ['casual', 'formal', 'business', 'sporty', 'vintage', 'gothic', 'bohemian', 'punk', 'minimalist']
  };

  // Update avatar state
  const updateAvatar = (field, value) => {
    setAvatar(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate character description from avatar
  const generateCharacterDescription = () => {
    const description = [];
    
    // Basic info
    description.push(`${avatar.age_range} ${avatar.gender}`);
    description.push(`${avatar.ethnicity} ethnicity`);
    description.push(`${avatar.body_type} build`);
    description.push(`${avatar.height} height`);
    description.push(`${avatar.skin_tone} skin tone`);
    
    // Face features
    description.push(`${avatar.face_shape} face shape`);
    description.push(`${avatar.eye_color} ${avatar.eye_shape} eyes`);
    
    // Hair
    if (avatar.hair_style !== 'bald') {
      description.push(`${avatar.hair_color} ${avatar.hair_texture} ${avatar.hair_style} hair`);
    } else {
      description.push('bald');
    }
    
    // Facial hair
    if (avatar.facial_hair !== 'none') {
      description.push(`${avatar.facial_hair}`);
    }
    
    // Style
    description.push(`${avatar.clothing_style} clothing style`);
    
    return description.join(', ');
  };

  // Apply avatar to character fields
  const applyToCharacter = () => {
    const description = generateCharacterDescription();
    
    // Set individual fields
    setFieldValue('gender', avatar.gender);
    setFieldValue('age_range', avatar.age_range);
    setFieldValue('ethnicity', avatar.ethnicity);
    setFieldValue('body_type', avatar.body_type);
    setFieldValue('skin_tone', avatar.skin_tone);
    setFieldValue('hair_color', avatar.hair_color);
    setFieldValue('hair_style', avatar.hair_style);
    setFieldValue('eye_color', avatar.eye_color);
    setFieldValue('clothing', `${avatar.clothing_style} attire`);
    
    // Set combined description
    setFieldValue('character', description);
    
    if (avatar.distinguishing_features) {
      setFieldValue('distinguishing_features', avatar.distinguishing_features);
    }
    
    if (avatar.accessories) {
      setFieldValue('accessories', avatar.accessories);
    }
    
    if (onSave) {
      onSave(avatar, description);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-cinema-panel border-b border-gray-200 dark:border-cinema-border p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              🎨 Avatar Creator
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Create and customize your character's appearance
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👤 Character Preview</h3>
            <div className="bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border">
              <p className="text-sm text-gray-700 dark:text-cinema-text leading-relaxed">
                {generateCharacterDescription()}
              </p>
            </div>
          </div>

          {/* Customization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-cinema-border pb-2">
                👤 Basic Information
              </h3>
              
              {['gender', 'age_range', 'ethnicity', 'body_type', 'height'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <select
                    value={avatar[field]}
                    onChange={(e) => updateAvatar(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {avatarOptions[field]?.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Physical Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-cinema-border pb-2">
                👁️ Physical Features
              </h3>
              
              {['skin_tone', 'face_shape', 'eye_color', 'eye_shape'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <select
                    value={avatar[field]}
                    onChange={(e) => updateAvatar(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {avatarOptions[field]?.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Hair & Style */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-cinema-border pb-2">
                💇 Hair & Style
              </h3>
              
              {['hair_color', 'hair_style', 'hair_texture', 'facial_hair'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <select
                    value={avatar[field]}
                    onChange={(e) => updateAvatar(field, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {avatarOptions[field]?.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-cinema-border pb-2">
                ✨ Additional Details
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clothing Style
                </label>
                <select
                  value={avatar.clothing_style}
                  onChange={(e) => updateAvatar('clothing_style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  {avatarOptions.clothing_style?.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distinguishing Features
                </label>
                <textarea
                  value={avatar.distinguishing_features}
                  onChange={(e) => updateAvatar('distinguishing_features', e.target.value)}
                  placeholder="e.g., scar on left cheek, tattoo on arm, dimples..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accessories
                </label>
                <textarea
                  value={avatar.accessories}
                  onChange={(e) => updateAvatar('accessories', e.target.value)}
                  placeholder="e.g., glasses, watch, necklace, hat..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-cinema-panel border-t border-gray-200 dark:border-cinema-border p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applyToCharacter}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              🎯 Apply to Character
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;