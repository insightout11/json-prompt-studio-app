import React, { useState, useEffect } from 'react';
import usePromptStore from './store';
import DetailPanel from './DetailPanel';
import DialogueBuilder from './DialogueBuilder';
import CharacterManager from './CharacterManager';
import SoundDesignBuilder from './SoundDesignBuilder';

const FieldRenderer = ({ field }) => {
  const { 
    enabledFields, 
    fieldValues, 
    expandedDetails, 
    customDetails,
    expandedCustomDetails,
    toggleField, 
    updateFieldValue, 
    toggleDetailExpansion,
    toggleCustomDetailExpansion,
    updateCustomDetail 
  } = usePromptStore();
  const isEnabled = enabledFields.has(field.key);
  const fieldValue = fieldValues[field.key] || '';
  const isDetailExpanded = expandedDetails.has(field.key);
  const isCustomDetailExpanded = expandedCustomDetails.has(field.key);
  const customDetailValue = customDetails[field.key] || '';
  
  // Determine if we should show custom input based on field value
  // Show custom input if the field has a value that's not in the predefined options
  const shouldShowCustomInput = field.type === 'select' && fieldValue && 
    !field.options?.includes(fieldValue) && fieldValue !== '';
  
  const [showCustomInput, setShowCustomInput] = useState(shouldShowCustomInput);
  
  // Sync local state with computed state when field value changes
  useEffect(() => {
    setShowCustomInput(shouldShowCustomInput);
  }, [shouldShowCustomInput]);
  
  // Check if this field supports details and has a selected value that has detail config
  const canShowDetails = field.allowDetails && fieldValue && field.detailConfig?.[fieldValue];
  
  // Universal custom details are available for ALL dropdown fields when they have a value
  const canShowCustomDetails = field.type === 'select' && fieldValue && fieldValue !== 'custom...';
  
  const shouldAutoExpand = field.allowDetails && fieldValue && 
    ['tattoos', 'fantasy armor', 'sci-fi suit', 'tracking', 'dolly zoom', 'orbit'].includes(fieldValue);

  // Generate smart placeholder text for universal custom details
  const getCustomDetailsPlaceholder = () => {
    const fieldName = field.label.toLowerCase();
    const value = fieldValue.toLowerCase();
    
    const placeholderMap = {
      // Scene & Environment
      'setting/location': `Describe the ${value} in detail - architecture, atmosphere, crowd level, specific features...`,
      'time of day': `Describe the ${value} lighting, colors, mood, shadows, atmosphere...`,
      'environmental details': `Describe the ${value} conditions - intensity, visual effects, sounds, feeling...`,
      
      // Character details
      'hair color': `Describe the ${value} hair - specific shade, highlights, styling, condition...`,
      'hair style': `Describe the ${value} - length, texture, styling details, accessories...`,
      'body type': `Describe the ${value} physique - specific build, posture, presence...`,
      'gender': `Describe gender expression - presentation, style, energy...`,
      'age range': `Describe age characteristics - maturity, energy, distinctive features...`,
      'ethnicity': `Describe cultural features - bone structure, skin tone, heritage markers...`,
      'eye color': `Describe the ${value} eyes - specific shade, intensity, expression...`,
      'skin tone': `Describe the ${value} skin - texture, glow, condition, undertones...`,
      
      // Actions & emotions
      'actions': `Describe how they're ${value} - style, energy, technique, body language...`,
      'emotions/mood': `Describe the ${value} emotion - intensity, expression, body language, aura...`,
      
      // Camera & technical
      'camera angle': `Describe the ${value} shot - specific positioning, dramatic effect, visual impact...`,
      'camera distance': `Describe the ${value} framing - composition, focus, emotional effect...`,
      'depth of field': `Describe the ${value} focus - technical specs, artistic effect, visual story...`,
      'lens type': `Describe the ${value} characteristics - focal length, compression, visual style...`,
      
      // Default fallback
      'default': `Add specific details about the ${value} ${fieldName} - describe characteristics, style, mood, or technical specifications...`
    };
    
    return placeholderMap[fieldName] || placeholderMap['default'];
  };

  // Check if field should be visible based on dependencies
  const shouldShowField = () => {
    if (!field.dependency || !field.dependsOn) return true;
    
    const dependencyValue = fieldValues[field.dependency];
    return field.dependsOn.includes(dependencyValue);
  };
  
  // Check if field has unmet dependencies (for visual indicators)
  const hasUnmetDependencies = () => {
    if (!field.dependency || !field.dependsOn) return false;
    
    const dependencyValue = fieldValues[field.dependency];
    return !dependencyValue || !field.dependsOn.includes(dependencyValue);
  };

  const handleToggle = () => {
    toggleField(field.key);
    setShowCustomInput(false);
  };

  // Don't render if field has dependencies that aren't met
  if (!shouldShowField()) {
    return null;
  }

  const handleValueChange = (value) => {
    if (value === 'custom...') {
      setShowCustomInput(true);
      updateFieldValue(field.key, '');
    } else {
      setShowCustomInput(false);
      updateFieldValue(field.key, value);
    }
  };

  const handleCustomInputChange = (value) => {
    updateFieldValue(field.key, value);
  };

  const renderInput = () => {
    if (!isEnabled) return null;

    const baseClasses = "w-full px-3 py-3 lg:py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300 text-base lg:text-sm";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={field.label}
            rows={3}
            className={baseClasses}
          />
        );
      
      case 'select':
        return (
          <div>
            {!showCustomInput ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={fieldValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className={`${baseClasses} ${canShowDetails ? 'flex-1' : ''}`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option === 'custom...' ? '✏️ Write your own...' : option}
                      </option>
                    ))}
                  </select>
                  
                  {canShowDetails && (
                    <button
                      type="button"
                      onClick={() => toggleDetailExpansion(field.key)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-1 ${
                        isDetailExpanded
                          ? 'bg-blue-100 text-blue-700 dark:bg-cinema-teal/20 dark:text-cinema-teal border border-blue-200 dark:border-cinema-teal'
                          : 'bg-gray-100 text-gray-600 dark:bg-cinema-card dark:text-cinema-text-muted hover:bg-gray-200 dark:hover:bg-cinema-border border border-gray-200 dark:border-cinema-border'
                      }`}
                      title={isDetailExpanded ? 'Hide structured details' : 'Add structured details'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{isDetailExpanded ? 'Hide' : 'Details'}</span>
                    </button>
                  )}
                  
                  {canShowCustomDetails && (
                    <button
                      type="button"
                      onClick={() => toggleCustomDetailExpansion(field.key)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center space-x-1 ${
                        isCustomDetailExpanded
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700'
                          : 'bg-gray-50 text-gray-500 dark:bg-cinema-card/50 dark:text-cinema-text-muted hover:bg-gray-100 dark:hover:bg-cinema-border/50 border border-gray-150 dark:border-cinema-border/50'
                      }`}
                      title={isCustomDetailExpanded ? 'Hide custom description' : 'Add custom description'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>{isCustomDetailExpanded ? 'Hide' : 'Custom'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => handleCustomInputChange(e.target.value)}
                  placeholder={`Enter custom ${field.label.toLowerCase()}`}
                  className={baseClasses}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    updateFieldValue(field.key, '');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-cinema-teal dark:hover:text-cinema-teal/80 underline transition-colors duration-300"
                >
                  ← Back to dropdown
                </button>
              </div>
            )}
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={field.label}
            className={baseClasses}
          />
        );
      
      case 'dialogue':
        return (
          <DialogueBuilder
            fieldKey={field.key}
            value={fieldValue}
            onChange={(value) => updateFieldValue(field.key, value)}
            characters={fieldValues.characters || []}
          />
        );
      
      case 'sound_design':
        return (
          <SoundDesignBuilder
            fieldKey={field.key}
            value={fieldValue}
            onChange={(value) => updateFieldValue(field.key, value)}
          />
        );
      
      case 'character_manager':
        return (
          <CharacterManager
            value={fieldValue || []}
            onChange={(value) => updateFieldValue(field.key, value)}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={field.label}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div className="mb-3 lg:mb-4">
      <div className="flex items-center space-x-3 mb-2 py-1">
        <input
          type="checkbox"
          id={field.key}
          checked={isEnabled}
          onChange={handleToggle}
          className="h-5 w-5 lg:h-4 lg:w-4 text-blue-600 dark:text-cinema-teal focus:ring-blue-500 dark:focus:ring-cinema-teal border-gray-300 dark:border-cinema-border rounded bg-white dark:bg-cinema-card transition-colors duration-300"
        />
        <label 
          htmlFor={field.key}
          className="text-sm lg:text-sm font-medium text-gray-700 dark:text-cinema-text cursor-pointer transition-colors duration-300 flex items-center space-x-2 py-2 lg:py-0"
        >
          <span>{field.label}</span>
          {field.dependency && (
            <span className="text-xs text-gray-500 dark:text-cinema-text-muted bg-gray-100 dark:bg-cinema-card px-2 py-0.5 rounded-full transition-colors duration-300">
              requires {field.dependency === 'character_type' ? 'character type' : field.dependency}
            </span>
          )}
        </label>
      </div>
      {renderInput()}
      
      {/* Render detail panel if expanded and has details */}
      {isDetailExpanded && canShowDetails && (
        <DetailPanel field={field} selectedValue={fieldValue} />
      )}
      
      {/* Universal custom details for ALL dropdown fields */}
      {isCustomDetailExpanded && canShowCustomDetails && (
        <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-700/50 rounded-lg transition-all duration-300">
          <div className="flex items-center space-x-2 mb-3">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-400">
              Custom {field.label} Details
            </h4>
          </div>
          
          <textarea
            value={customDetailValue}
            onChange={(e) => updateCustomDetail(field.key, e.target.value)}
            placeholder={getCustomDetailsPlaceholder()}
            rows={3}
            className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-green-900/20 text-gray-900 dark:text-green-100 transition-all duration-300 text-sm resize-none"
          />
          
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            💡 Add any specific details, modifications, or creative directions for this {field.label.toLowerCase()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldRenderer;