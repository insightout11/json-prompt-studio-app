import React, { useState, useMemo } from 'react';
import usePromptStore from './store';

const CharacterManager = ({ value = [], onChange }) => {
  const { savedCharacters, loadCharacter } = usePromptStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [expandedCharacter, setExpandedCharacter] = useState(null);

  // Character presets for quick creation
  const characterPresets = {
    human: {
      type: 'human',
      appearance: {
        age_range: 'young adult (18-25)',
        gender: 'unspecified',
        ethnicity: 'ambiguous ethnicity',
        body_type: 'average'
      }
    },
    robot: {
      type: 'robot',
      appearance: {
        robot_style: 'humanoid android',
        robot_material: 'metallic chrome'
      }
    },
    animal: {
      type: 'animal',
      appearance: {
        animal_type: 'cat'
      }
    },
    creature: {
      type: 'creature',
      appearance: {
        creature_type: 'fantasy'
      }
    }
  };

  // Name pools for random generation
  const namePool = {
    male: ['Alex', 'Marcus', 'David', 'James', 'Ryan', 'Noah', 'Ethan', 'Lucas', 'Mason', 'Logan'],
    female: ['Sarah', 'Emma', 'Luna', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper'],
    neutral: ['Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Rowan', 'Phoenix'],
    robot: ['ARIA', 'ZETA', 'NOVA', 'AXIOM', 'CIPHER', 'ECHO', 'FLUX', 'NEXUS', 'VERTEX', 'ZENITH'],
    creature: ['Shadowmere', 'Thornweaver', 'Mistral', 'Emberstar', 'Whisperwind', 'Crystalfang', 'Moonshadow', 'Starfire']
  };

  const roles = ['protagonist', 'antagonist', 'supporting', 'background', 'narrator'];
  const personalities = ['confident', 'shy', 'mysterious', 'cheerful', 'serious', 'playful', 'wise', 'rebellious', 'caring', 'ambitious'];

  // Generate random character
  const generateRandomCharacter = (type = 'human') => {
    const preset = characterPresets[type] || characterPresets.human;
    let nameCategory = 'neutral';
    
    if (type === 'robot') nameCategory = 'robot';
    else if (type === 'creature') nameCategory = 'creature';
    else if (preset.appearance?.gender === 'male') nameCategory = 'male';
    else if (preset.appearance?.gender === 'female') nameCategory = 'female';
    
    const names = namePool[nameCategory] || namePool.neutral;
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    return {
      id: Date.now().toString(),
      name: randomName,
      type: preset.type,
      role: roles[Math.floor(Math.random() * roles.length)],
      personality: personalities[Math.floor(Math.random() * personalities.length)],
      appearance: { ...preset.appearance },
      description: '',
      voiceNotes: ''
    };
  };

  // Add new character
  const addCharacter = (characterData = null) => {
    const newCharacter = characterData || generateRandomCharacter();
    const updatedCharacters = [...value, newCharacter];
    onChange(updatedCharacters);
    setShowAddModal(false);
    setExpandedCharacter(newCharacter.id);
  };

  // Update character
  const updateCharacter = (characterId, updates) => {
    const updatedCharacters = value.map(char => 
      char.id === characterId ? { ...char, ...updates } : char
    );
    onChange(updatedCharacters);
  };

  // Remove character
  const removeCharacter = (characterId) => {
    const updatedCharacters = value.filter(char => char.id !== characterId);
    onChange(updatedCharacters);
    if (expandedCharacter === characterId) {
      setExpandedCharacter(null);
    }
  };

  // Duplicate character
  const duplicateCharacter = (character) => {
    const duplicated = {
      ...character,
      id: Date.now().toString(),
      name: `${character.name} Copy`
    };
    const updatedCharacters = [...value, duplicated];
    onChange(updatedCharacters);
  };

  // Import from saved character
  const importSavedCharacter = (savedCharacterId) => {
    const savedChar = savedCharacters.find(c => c.id === savedCharacterId);
    if (savedChar && savedChar.json) {
      // Convert saved character format to new multi-character format
      const importedCharacter = {
        id: Date.now().toString(),
        name: savedChar.json.character_name || savedChar.name || 'Imported Character',
        type: savedChar.json.character_type || 'human',
        role: 'supporting',
        personality: savedChar.json.mood || 'neutral',
        appearance: {
          ...savedChar.json
        },
        description: '',
        voiceNotes: ''
      };
      addCharacter(importedCharacter);
    }
  };

  // Character type icons
  const getCharacterIcon = (type) => {
    const icons = {
      human: '👤',
      robot: '🤖',
      animal: '🐾',
      creature: '👹',
      object: '📦',
      stylized: '🎨'
    };
    return icons[type] || '👤';
  };

  // Role colors
  const getRoleColor = (role) => {
    const colors = {
      protagonist: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      antagonist: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      supporting: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      background: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
      narrator: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[role] || colors.supporting;
  };

  return (
    <div className="character-manager space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">👥</span>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text">
            Characters ({value.length})
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addCharacter(generateRandomCharacter())}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
            title="Add random character"
          >
            🎲 Random
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
          >
            + Add Character
          </button>
        </div>
      </div>

      {/* Character List */}
      {value.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-cinema-border rounded-lg">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-gray-600 dark:text-cinema-text-muted mb-4">
            No characters added yet
          </div>
          <button
            onClick={() => addCharacter(generateRandomCharacter())}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Add Your First Character
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((character) => (
            <div
              key={character.id}
              className="bg-white dark:bg-cinema-card border border-gray-200 dark:border-cinema-border rounded-lg overflow-hidden"
            >
              {/* Character Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCharacterIcon(character.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-cinema-text">
                        {character.name || 'Unnamed Character'}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(character.role)}`}>
                          {character.role}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-cinema-text-muted">
                          {character.type}
                        </span>
                        {character.personality && (
                          <span className="text-sm text-gray-500 dark:text-cinema-text-muted">
                            • {character.personality}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedCharacter(
                        expandedCharacter === character.id ? null : character.id
                      )}
                      className="text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text"
                      title="Edit character"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => duplicateCharacter(character)}
                      className="text-gray-500 hover:text-gray-700 dark:text-cinema-text-muted dark:hover:text-cinema-text"
                      title="Duplicate character"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeCharacter(character.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove character"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {character.description && (
                  <p className="text-sm text-gray-600 dark:text-cinema-text-muted mt-2">
                    {character.description}
                  </p>
                )}
              </div>

              {/* Expanded Character Details */}
              {expandedCharacter === character.id && (
                <div className="border-t border-gray-200 dark:border-cinema-border p-4 bg-gray-50 dark:bg-cinema-panel">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Character Name
                      </label>
                      <input
                        type="text"
                        value={character.name || ''}
                        onChange={(e) => updateCharacter(character.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                        placeholder="Enter character name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Role
                      </label>
                      <select
                        value={character.role}
                        onChange={(e) => updateCharacter(character.id, { role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Character Type
                      </label>
                      <select
                        value={character.type}
                        onChange={(e) => updateCharacter(character.id, { type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                      >
                        <option value="human">Human</option>
                        <option value="robot">Robot</option>
                        <option value="animal">Animal</option>
                        <option value="creature">Creature</option>
                        <option value="object">Object</option>
                        <option value="stylized">Stylized</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Personality
                      </label>
                      <select
                        value={character.personality}
                        onChange={(e) => updateCharacter(character.id, { personality: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm"
                      >
                        {personalities.map(personality => (
                          <option key={personality} value={personality}>
                            {personality.charAt(0).toUpperCase() + personality.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Description
                      </label>
                      <textarea
                        value={character.description || ''}
                        onChange={(e) => updateCharacter(character.id, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm resize-none"
                        rows={2}
                        placeholder="Brief character description..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                        Voice/Dialogue Notes
                      </label>
                      <textarea
                        value={character.voiceNotes || ''}
                        onChange={(e) => updateCharacter(character.id, { voiceNotes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text text-sm resize-none"
                        rows={2}
                        placeholder="How does this character speak? Accent, tone, speech patterns..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Character Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
                  Add Character
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-cinema-text-muted dark:hover:text-cinema-text"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {/* Quick Add Options */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(characterPresets).map(type => (
                    <button
                      key={type}
                      onClick={() => addCharacter(generateRandomCharacter(type))}
                      className="p-3 border border-gray-200 dark:border-cinema-border rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
                    >
                      <div className="text-2xl mb-1">{getCharacterIcon(type)}</div>
                      <div className="text-sm font-medium text-gray-700 dark:text-cinema-text">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Import from Saved Characters */}
                {savedCharacters.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-cinema-text mb-2">
                      Import from Saved Characters:
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {savedCharacters.slice(0, 5).map(savedChar => (
                        <button
                          key={savedChar.id}
                          onClick={() => importSavedCharacter(savedChar.id)}
                          className="w-full text-left px-3 py-2 text-sm border border-gray-200 dark:border-cinema-border rounded hover:bg-gray-50 dark:hover:bg-cinema-border transition-colors"
                        >
                          {savedChar.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;