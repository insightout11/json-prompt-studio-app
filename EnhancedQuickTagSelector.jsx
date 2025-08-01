import React, { useState, useMemo } from 'react';
import { enhancedQuickTags, enhancedTagCategories, trendingPresets, searchableFields } from './enhancedQuickTags';

const EnhancedQuickTagSelector = ({ onPresetSelect, currentFormData }) => {
  const [selectedCategory, setSelectedCategory] = useState('genre');
  const [selectedCollection, setSelectedCollection] = useState('horror');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favoritePresets, setFavoritePresets] = useState(new Set());

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    
    const results = [];
    const term = searchTerm.toLowerCase();
    
    // Search through all presets
    Object.keys(enhancedQuickTags).forEach(categoryKey => {
      if (categoryKey === 'genreCollections') {
        Object.keys(enhancedQuickTags.genreCollections).forEach(genreKey => {
          const genre = enhancedQuickTags.genreCollections[genreKey];
          Object.keys(genre.presets).forEach(presetKey => {
            const preset = genre.presets[presetKey];
            if (
              preset.name.toLowerCase().includes(term) ||
              preset.description.toLowerCase().includes(term) ||
              (preset.tags && preset.tags.some(tag => tag.toLowerCase().includes(term)))
            ) {
              results.push({
                ...preset,
                id: presetKey,
                category: `${genreKey} - ${categoryKey}`,
                type: 'genre'
              });
            }
          });
        });
      } else if (typeof enhancedQuickTags[categoryKey] === 'object') {
        Object.keys(enhancedQuickTags[categoryKey]).forEach(subCategoryKey => {
          const subCategory = enhancedQuickTags[categoryKey][subCategoryKey];
          if (typeof subCategory === 'object') {
            Object.keys(subCategory).forEach(presetKey => {
              const preset = subCategory[presetKey];
              if (preset.name && (
                preset.name.toLowerCase().includes(term) ||
                preset.description.toLowerCase().includes(term)
              )) {
                results.push({
                  ...preset,
                  id: presetKey,
                  category: `${subCategoryKey} - ${categoryKey}`,
                  type: categoryKey
                });
              }
            });
          }
        });
      }
    });
    
    return results.slice(0, 20); // Limit results
  }, [searchTerm]);

  // Get current collection data
  const getCurrentCollection = () => {
    if (selectedCategory === 'genre') {
      return enhancedQuickTags.genreCollections[selectedCollection]?.presets || {};
    } else {
      return enhancedQuickTags[selectedCategory]?.[selectedCollection] || {};
    }
  };

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    if (preset.autoFill) {
      onPresetSelect(preset.autoFill);
    }
  };

  // Toggle favorite
  const toggleFavorite = (presetId) => {
    const newFavorites = new Set(favoritePresets);
    if (newFavorites.has(presetId)) {
      newFavorites.delete(presetId);
    } else {
      newFavorites.add(presetId);
    }
    setFavoritePresets(newFavorites);
    localStorage.setItem('favoritePresets', JSON.stringify([...newFavorites]));
  };

  // Load favorites from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('favoritePresets');
    if (stored) {
      setFavoritePresets(new Set(JSON.parse(stored)));
    }
  }, []);

  const currentCollection = getCurrentCollection();

  return (
    <div className="enhanced-quick-tags">
      {/* Header with Search Toggle */}
      <div className="quick-tags-header">
        <h3>Enhanced Quick Tags (200+ Presets)</h3>
        <div className="header-controls">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`search-toggle ${showSearch ? 'active' : ''}`}
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Search Interface */}
      {showSearch && (
        <div className="search-section">
          <input
            type="text"
            placeholder="Search presets (e.g., 'cyberpunk', 'slow motion', 'horror')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4>Search Results ({searchResults.length})</h4>
              <div className="search-results-grid">
                {searchResults.map((preset, index) => (
                  <div key={index} className="search-result-card">
                    <div className="preset-header">
                      <span className="preset-icon">{preset.icon}</span>
                      <span className="preset-name">{preset.name}</span>
                      <button
                        onClick={() => toggleFavorite(preset.id)}
                        className={`favorite-btn ${favoritePresets.has(preset.id) ? 'favorited' : ''}`}
                      >
                        {favoritePresets.has(preset.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <p className="preset-description">{preset.description}</p>
                    <p className="preset-category">{preset.category}</p>
                    <button
                      onClick={() => handlePresetSelect(preset)}
                      className="apply-preset-btn"
                    >
                      Apply Preset
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trending Presets Section */}
      <div className="trending-section">
        <h4>🔥 Trending Presets</h4>
        <div className="trending-presets">
          {trendingPresets.slice(0, 6).map((presetId, index) => (
            <button key={index} className="trending-preset-btn">
              {presetId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="category-nav">
        {Object.keys(enhancedTagCategories).map(categoryKey => {
          const category = enhancedTagCategories[categoryKey];
          return (
            <button
              key={categoryKey}
              onClick={() => {
                setSelectedCategory(categoryKey);
                setSelectedCollection(category.collections[0]);
              }}
              className={`category-btn ${selectedCategory === categoryKey ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Collection Navigation */}
      {selectedCategory && (
        <div className="collection-nav">
          <h4>{enhancedTagCategories[selectedCategory].name}</h4>
          <p>{enhancedTagCategories[selectedCategory].description}</p>
          <div className="collection-buttons">
            {enhancedTagCategories[selectedCategory].collections.map(collectionKey => {
              let collectionData;
              if (selectedCategory === 'genre') {
                collectionData = enhancedQuickTags.genreCollections[collectionKey];
              } else {
                collectionData = { name: collectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) };
              }
              
              return (
                <button
                  key={collectionKey}
                  onClick={() => setSelectedCollection(collectionKey)}
                  className={`collection-btn ${selectedCollection === collectionKey ? 'active' : ''}`}
                >
                  {collectionData?.name || collectionKey}
                  {selectedCategory === 'genre' && collectionData?.name && (
                    <span className="collection-icon">
                      {collectionKey === 'horror' && '👻'}
                      {collectionKey === 'romance' && '💕'}
                      {collectionKey === 'scifi' && '🚀'}
                      {collectionKey === 'fantasy' && '🏰'}
                      {collectionKey === 'documentary' && '📹'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Grid */}
      <div className="presets-section">
        {selectedCategory === 'genre' && enhancedQuickTags.genreCollections[selectedCollection] && (
          <div className="genre-info">
            <h4>{enhancedQuickTags.genreCollections[selectedCollection].name}</h4>
            <p>{enhancedQuickTags.genreCollections[selectedCollection].description}</p>
          </div>
        )}
        
        <div className="presets-grid">
          {Object.keys(currentCollection).map(presetKey => {
            const preset = currentCollection[presetKey];
            return (
              <div key={presetKey} className="preset-card">
                <div className="preset-header">
                  <span className="preset-icon">{preset.icon}</span>
                  <span className="preset-name">{preset.name}</span>
                  <button
                    onClick={() => toggleFavorite(presetKey)}
                    className={`favorite-btn ${favoritePresets.has(presetKey) ? 'favorited' : ''}`}
                  >
                    {favoritePresets.has(presetKey) ? '❤️' : '🤍'}
                  </button>
                </div>
                <p className="preset-description">{preset.description}</p>
                
                {/* Auto-fill Preview */}
                {preset.autoFill && (
                  <div className="auto-fill-preview">
                    <h5>Auto-fills:</h5>
                    <div className="auto-fill-tags">
                      {Object.keys(preset.autoFill).slice(0, 4).map(field => (
                        <span key={field} className="auto-fill-tag">
                          {field}: {preset.autoFill[field]}
                        </span>
                      ))}
                      {Object.keys(preset.autoFill).length > 4 && (
                        <span className="auto-fill-more">
                          +{Object.keys(preset.autoFill).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="preset-actions">
                  <button
                    onClick={() => handlePresetSelect(preset)}
                    className="apply-preset-btn primary"
                  >
                    Apply Preset
                  </button>
                  <button
                    onClick={() => handlePresetSelect(preset, true)}
                    className="apply-preset-btn secondary"
                  >
                    Merge with Current
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tag Statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">200+</span>
            <span className="stat-label">Total Presets</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{Object.keys(enhancedQuickTags.genreCollections).length}</span>
            <span className="stat-label">Genre Collections</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{favoritePresets.size}</span>
            <span className="stat-label">Your Favorites</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">35+</span>
            <span className="stat-label">Auto-fill Fields</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .enhanced-quick-tags {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .quick-tags-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        }

        .quick-tags-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .search-toggle {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .search-toggle:hover, .search-toggle.active {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .search-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          margin-bottom: 15px;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .search-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .search-result-card {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          transition: all 0.2s;
        }

        .search-result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .trending-section {
          background: linear-gradient(135deg, #ff6b6b, #feca57);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          color: white;
        }

        .trending-section h4 {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
        }

        .trending-presets {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .trending-preset-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .trending-preset-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        .category-nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .category-btn:hover {
          border-color: #007bff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,123,255,0.1);
        }

        .category-btn.active {
          border-color: #007bff;
          background: #f8f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,123,255,0.2);
        }

        .category-icon {
          font-size: 1.5rem;
        }

        .category-name {
          font-weight: 600;
          color: #333;
        }

        .collection-nav {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .collection-nav h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .collection-nav p {
          margin: 0 0 15px 0;
          color: #666;
          font-size: 14px;
        }

        .collection-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .collection-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .collection-btn:hover {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .collection-btn.active {
          border-color: #007bff;
          background: #007bff;
          color: white;
        }

        .genre-info {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .genre-info h4 {
          margin: 0 0 8px 0;
          font-size: 1.3rem;
        }

        .genre-info p {
          margin: 0;
          opacity: 0.9;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .preset-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
          position: relative;
        }

        .preset-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #007bff;
        }

        .preset-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .preset-icon {
          font-size: 1.5rem;
        }

        .preset-name {
          font-weight: 600;
          color: #333;
          flex: 1;
        }

        .favorite-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          transition: transform 0.2s;
        }

        .favorite-btn:hover {
          transform: scale(1.2);
        }

        .preset-description {
          color: #666;
          font-size: 14px;
          margin-bottom: 15px;
          line-height: 1.4;
        }

        .auto-fill-preview {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 15px;
        }

        .auto-fill-preview h5 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .auto-fill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .auto-fill-tag {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          color: #495057;
        }

        .auto-fill-more {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .preset-actions {
          display: flex;
          gap: 10px;
        }

        .apply-preset-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          font-size: 14px;
        }

        .apply-preset-btn.primary {
          background: #007bff;
          color: white;
        }

        .apply-preset-btn.primary:hover {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .apply-preset-btn.secondary {
          background: #6c757d;
          color: white;
        }

        .apply-preset-btn.secondary:hover {
          background: #545b62;
          transform: translateY(-1px);
        }

        .stats-section {
          background: linear-gradient(135deg, #667eea, #764ba2);
          padding: 25px;
          border-radius: 12px;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .stat-card {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 10px;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .category-nav {
            grid-template-columns: 1fr;
          }
          
          .presets-grid {
            grid-template-columns: 1fr;
          }
          
          .collection-buttons {
            flex-direction: column;
          }
          
          .trending-presets {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedQuickTagSelector;