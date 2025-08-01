import React, { useState } from 'react';
import usePromptStore from './store';
import { characterPresets } from './characterPresetsData';

const CharacterPresets = () => {
  const { applyCharacterPresetData } = usePromptStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPreset, setPreviewPreset] = useState(null);

  // Group presets by category
  const categories = {
    all: 'All Characters',
    professional: 'Professional & Corporate',
    lifestyle: 'Lifestyle & Consumer', 
    service: 'Service & Hospitality',
    creative: 'Creative & Artistic',
    fantasy: 'Fantasy & Medieval',
    scifi: 'Sci-Fi & Future',
    historical: 'Historical & Cultural',
    quirky: 'Quirky & Unique',
    villains: 'Villains & Antiheroes',
    mystical: 'Mystical & Otherworldly'
  };

  // Filter presets based on category and search
  const filteredPresets = Object.entries(characterPresets).filter(([key, preset]) => {
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleApplyPreset = (presetKey) => {
    const preset = characterPresets[presetKey];
    if (preset) {
      applyCharacterPresetData(preset);
      setPreviewPreset(null);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      professional: '🏢',
      lifestyle: '🌟', 
      service: '🤝',
      creative: '🎨',
      fantasy: '🏰',
      scifi: '🚀',
      historical: '📜',
      quirky: '🎭',
      villains: '🦹',
      mystical: '🔮'
    };
    return icons[category] || '👤';
  };

  const getCategoryColor = (category) => {
    const colors = {
      professional: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      lifestyle: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      service: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      fantasy: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      scifi: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      historical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      quirky: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
      villains: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      mystical: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
  };

  return (
    <div className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Character Presets</h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-300">Quick-start with professional and creative character archetypes</p>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search presets by name, description, or tags..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300 text-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text transition-all duration-300 text-sm min-w-[180px]"
        >
          {Object.entries(categories).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-3 text-sm text-gray-600 dark:text-cinema-text-muted">
        {filteredPresets.length} character{filteredPresets.length !== 1 ? 's' : ''} available
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {filteredPresets.map(([presetKey, preset]) => (
          <div
            key={presetKey}
            className="relative group bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg p-3 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setPreviewPreset(preset)}
            onMouseLeave={() => setPreviewPreset(null)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getCategoryIcon(preset.category)}</span>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-cinema-text line-clamp-1">
                    {preset.name}
                  </h4>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getCategoryColor(preset.category)}`}>
                    {preset.category}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-cinema-text-muted mb-2 line-clamp-2">
              {preset.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {preset.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted rounded">
                  {tag}
                </span>
              ))}
              {preset.tags.length > 2 && (
                <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-cinema-border text-gray-600 dark:text-cinema-text-muted rounded">
                  +{preset.tags.length - 2}
                </span>
              )}
            </div>
            
            <button
              onClick={() => handleApplyPreset(presetKey)}
              className="w-full px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-md transition-all duration-300"
            >
              Apply Character
            </button>
          </div>
        ))}
      </div>

      {/* Preview Panel */}
      {previewPreset && (
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 flex items-center space-x-2">
                <span>{getCategoryIcon(previewPreset.category)}</span>
                <span>{previewPreset.name}</span>
              </h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">{previewPreset.description}</p>
            </div>
            <button
              onClick={() => setPreviewPreset(null)}
              className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-3">
            <div className="text-xs font-medium text-indigo-800 dark:text-indigo-200 mb-2">Use Case:</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-300">{previewPreset.useCase}</div>
          </div>
          
          <div className="mb-3">
            <div className="text-xs font-medium text-indigo-800 dark:text-indigo-200 mb-2">Character Details:</div>
            <div className="text-xs text-indigo-600 dark:text-indigo-300 bg-white dark:bg-indigo-900/30 p-2 rounded border">
              {previewPreset.customDetails}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(previewPreset.fields).slice(0, 6).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-indigo-900/30 p-2 rounded border">
                <div className="font-medium text-indigo-800 dark:text-indigo-200 capitalize">
                  {key.replace(/_/g, ' ')}:
                </div>
                <div className="text-indigo-600 dark:text-indigo-300">{value}</div>
              </div>
            ))}
          </div>
          
          {Object.keys(previewPreset.fields).length > 6 && (
            <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-300">
              + {Object.keys(previewPreset.fields).length - 6} more character attributes
            </div>
          )}
        </div>
      )}

      {filteredPresets.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-cinema-text-muted">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>No characters found matching your search criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default CharacterPresets;