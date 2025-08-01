import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';

const DialogueBuilder = ({ fieldKey, value, onChange, characters = [] }) => {
  const { fieldValues } = usePromptStore();
  const [dialogueMode, setDialogueMode] = useState('simple'); // simple, conversation, template
  const [dialogueLines, setDialogueLines] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);

  // Dialogue Templates
  const dialogueTemplates = {
    podcast: {
      name: "Podcast Interview",
      icon: "🎙️",
      lines: [
        { speaker: "Host", text: "Welcome back to the show. Today we have an incredible guest with us...", tone: "enthusiastic", delivery: "conversational" },
        { speaker: "Guest", text: "Thanks for having me on. I'm excited to be here.", tone: "confident", delivery: "conversational" },
        { speaker: "Host", text: "So let's dive right in - tell us about [topic]...", tone: "curious", delivery: "interview" }
      ]
    },
    documentary: {
      name: "Documentary",
      icon: "📹",
      lines: [
        { speaker: "Narrator", text: "In a world where [subject] changes everything...", tone: "dramatic", delivery: "voice-over" },
        { speaker: "Expert", text: "What most people don't realize is that [insight]...", tone: "serious", delivery: "interview" },
        { speaker: "Narrator", text: "But the story doesn't end there...", tone: "mysterious", delivery: "voice-over" }
      ]
    },
    commercial: {
      name: "Commercial",
      icon: "📺",
      lines: [
        { speaker: "Announcer", text: "Are you tired of [problem]?", tone: "urgent", delivery: "dramatic" },
        { speaker: "Customer", text: "I was struggling with [issue] until I found [solution]!", tone: "excited", delivery: "conversational" },
        { speaker: "Announcer", text: "Don't wait - call now!", tone: "urgent", delivery: "fast-paced" }
      ]
    },
    tutorial: {
      name: "Tutorial",
      icon: "📚",
      lines: [
        { speaker: "Instructor", text: "Today we're going to learn how to [skill]...", tone: "confident", delivery: "instructional" },
        { speaker: "Student", text: "What if I make a mistake?", tone: "nervous", delivery: "conversational" },
        { speaker: "Instructor", text: "Don't worry - mistakes are part of learning. Let's try again.", tone: "encouraging", delivery: "supportive" }
      ]
    },
    drama: {
      name: "Drama Scene",
      icon: "🎭",
      lines: [
        { speaker: "Character A", text: "I can't believe you would do this to me...", tone: "sad", delivery: "emotional" },
        { speaker: "Character B", text: "You don't understand - I had no choice!", tone: "desperate", delivery: "intense" },
        { speaker: "Character A", text: "There's always a choice. You just made the wrong one.", tone: "angry", delivery: "dramatic" }
      ]
    },
    comedy: {
      name: "Comedy Sketch",
      icon: "😂",
      lines: [
        { speaker: "Comedian", text: "So I went to the store to buy [item]...", tone: "playful", delivery: "comedic" },
        { speaker: "Straight Man", text: "That seems normal enough.", tone: "neutral", delivery: "conversational" },
        { speaker: "Comedian", text: "Yeah, but then [absurd situation happened]!", tone: "excited", delivery: "comedic" }
      ]
    }
  };

  // Initialize dialogue from existing value
  useEffect(() => {
    if (value && typeof value === 'string' && value.trim()) {
      // Convert simple text to structured format
      setDialogueLines([{
        id: 1,
        speaker: 'Character',
        text: value,
        tone: 'neutral',
        delivery: 'conversational',
        notes: ''
      }]);
    } else if (value && typeof value === 'object' && value.lines) {
      setDialogueLines(value.lines);
    } else {
      setDialogueLines([]);
    }
  }, [value]);

  // Available characters from character presets or field values
  const availableSpeakers = React.useMemo(() => {
    const speakers = ['Narrator', 'Voice-over'];
    
    // Add characters from the new multi-character system
    if (characters && Array.isArray(characters) && characters.length > 0) {
      characters.forEach(character => {
        if (character.name && character.name.trim()) {
          speakers.push(character.name.trim());
        }
      });
    }
    
    // Fallback: Add character from legacy single character field values
    if (fieldValues.character_name && fieldValues.character_name.trim()) {
      const legacyCharacterName = fieldValues.character_name.trim();
      if (!speakers.includes(legacyCharacterName)) {
        speakers.push(legacyCharacterName);
      }
    } else if (fieldValues.character_type && fieldValues.character_type !== 'custom...') {
      const characterName = fieldValues.character_type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      if (!speakers.includes(characterName)) {
        speakers.push(characterName);
      }
    }
    
    // If no characters are defined, add a default
    if (speakers.length === 2) { // Only Narrator and Voice-over
      speakers.push('Character');
    }
    
    return speakers;
  }, [characters, fieldValues.character_name, fieldValues.character_type]);

  const emotionalTones = [
    'neutral', 'happy', 'sad', 'angry', 'excited', 'nervous', 'confident', 
    'mysterious', 'romantic', 'dramatic', 'comedic', 'sarcastic', 'whispered', 
    'shouted', 'urgent', 'calm', 'intense', 'playful'
  ];

  const deliveryStyles = [
    'conversational', 'formal', 'dramatic', 'comedic', 'documentary', 
    'interview', 'monologue', 'voice-over', 'fast-paced', 'slow-paced',
    'rhythmic', 'natural', 'scripted'
  ];

  const addDialogueLine = () => {
    const newLine = {
      id: Date.now(),
      speaker: availableSpeakers[0],
      text: '',
      tone: 'neutral',
      delivery: 'conversational',
      notes: ''
    };
    
    const newLines = [...dialogueLines, newLine];
    setDialogueLines(newLines);
    setActiveLineIndex(newLines.length - 1);
    updateValue(newLines);
  };

  const updateDialogueLine = (index, field, value) => {
    const newLines = [...dialogueLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setDialogueLines(newLines);
    updateValue(newLines);
  };

  const removeDialogueLine = (index) => {
    const newLines = dialogueLines.filter((_, i) => i !== index);
    setDialogueLines(newLines);
    setActiveLineIndex(Math.max(0, Math.min(activeLineIndex, newLines.length - 1)));
    updateValue(newLines);
  };

  const updateValue = (lines) => {
    if (dialogueMode === 'simple' && lines.length === 1) {
      // For simple mode, just return the text
      onChange(lines[0]?.text || '');
    } else {
      // For complex mode, return structured object
      onChange({
        mode: dialogueMode,
        lines: lines,
        metadata: {
          totalCharacters: lines.reduce((sum, line) => sum + line.text.length, 0),
          estimatedDuration: Math.ceil(lines.reduce((sum, line) => sum + line.text.length, 0) / 120), // ~2 chars per second
          speakerCount: new Set(lines.map(line => line.speaker)).size
        }
      });
    }
  };

  const switchToSimpleMode = () => {
    setDialogueMode('simple');
    if (dialogueLines.length > 0) {
      const combinedText = dialogueLines.map(line => 
        line.speaker !== 'Narrator' ? `${line.speaker}: ${line.text}` : line.text
      ).join('\n');
      onChange(combinedText);
    }
  };

  const switchToConversationMode = () => {
    setDialogueMode('conversation');
    if (typeof value === 'string' && value.trim()) {
      const lines = [{
        id: 1,
        speaker: availableSpeakers[0],
        text: value,
        tone: 'neutral',
        delivery: 'conversational',
        notes: ''
      }];
      setDialogueLines(lines);
      updateValue(lines);
    } else if (dialogueLines.length === 0) {
      addDialogueLine();
    }
  };

  const switchToTemplateMode = () => {
    setDialogueMode('template');
    setShowTemplates(true);
  };

  const applyTemplate = (templateKey) => {
    const template = dialogueTemplates[templateKey];
    const lines = template.lines.map((line, index) => ({
      id: Date.now() + index,
      speaker: line.speaker,
      text: line.text,
      tone: line.tone,
      delivery: line.delivery,
      notes: ''
    }));
    
    setDialogueLines(lines);
    setActiveLineIndex(0);
    updateValue(lines);
    setShowTemplates(false);
    setDialogueMode('conversation');
  };

  const getEstimatedTiming = (text) => {
    const wordsPerMinute = 150; // Average speaking pace
    const words = text.split(' ').length;
    const seconds = Math.ceil((words / wordsPerMinute) * 60);
    return seconds;
  };

  return (
    <div className="dialogue-builder space-y-4">
      {/* Mode Selector */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={switchToSimpleMode}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            dialogueMode === 'simple'
              ? 'bg-blue-500 text-white dark:bg-cinema-teal'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Simple Text
        </button>
        <button
          onClick={switchToConversationMode}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            dialogueMode === 'conversation'
              ? 'bg-blue-500 text-white dark:bg-cinema-teal'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Conversation
        </button>
        <button
          onClick={switchToTemplateMode}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            dialogueMode === 'template'
              ? 'bg-blue-500 text-white dark:bg-cinema-teal'
              : 'bg-gray-200 text-gray-700 dark:bg-cinema-card dark:text-cinema-text hover:bg-gray-300 dark:hover:bg-cinema-border'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Simple Mode */}
      {dialogueMode === 'simple' && (
        <div className="space-y-2">
          <textarea
            value={typeof value === 'string' ? value : (dialogueLines[0]?.text || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter dialogue, voice-over, or narration text..."
            className="w-full p-3 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal focus:border-transparent bg-white dark:bg-cinema-panel text-gray-900 dark:text-cinema-text resize-vertical min-h-[100px]"
            rows={4}
          />
          <div className="text-sm text-gray-500 dark:text-cinema-text-muted">
            Characters: {(typeof value === 'string' ? value : dialogueLines[0]?.text || '').length} | 
            Estimated: ~{getEstimatedTiming(typeof value === 'string' ? value : dialogueLines[0]?.text || '')}s
          </div>
        </div>
      )}

      {/* Conversation Mode */}
      {dialogueMode === 'conversation' && (
        <div className="space-y-4">
          {dialogueLines.map((line, index) => (
            <div 
              key={line.id} 
              className={`border rounded-lg p-4 transition-all ${
                activeLineIndex === index 
                  ? 'border-blue-500 dark:border-cinema-teal bg-blue-50 dark:bg-cinema-teal/10' 
                  : 'border-gray-200 dark:border-cinema-border bg-white dark:bg-cinema-panel'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-cinema-text-muted">
                    Line {index + 1}
                  </span>
                  <select
                    value={line.speaker}
                    onChange={(e) => updateDialogueLine(index, 'speaker', e.target.value)}
                    className="text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal"
                  >
                    {availableSpeakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeDialogueLine(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove line"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <textarea
                value={line.text}
                onChange={(e) => updateDialogueLine(index, 'text', e.target.value)}
                placeholder={`Enter ${line.speaker}'s dialogue...`}
                className="w-full p-3 border border-gray-300 dark:border-cinema-border rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text resize-vertical min-h-[80px]"
                rows={3}
                onFocus={() => setActiveLineIndex(index)}
              />

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Emotional Tone
                  </label>
                  <select
                    value={line.tone}
                    onChange={(e) => updateDialogueLine(index, 'tone', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal"
                  >
                    {emotionalTones.map(tone => (
                      <option key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-cinema-text mb-1">
                    Delivery Style
                  </label>
                  <select
                    value={line.delivery}
                    onChange={(e) => updateDialogueLine(index, 'delivery', e.target.value)}
                    className="w-full text-sm border border-gray-300 dark:border-cinema-border rounded px-2 py-1 bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal"
                  >
                    {deliveryStyles.map(delivery => (
                      <option key={delivery} value={delivery}>
                        {delivery.charAt(0).toUpperCase() + delivery.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={line.notes}
                  onChange={(e) => updateDialogueLine(index, 'notes', e.target.value)}
                  placeholder="Direction notes (e.g., 'pauses dramatically', 'whispers', 'off-screen')..."
                  className="w-full text-sm p-2 border border-gray-300 dark:border-cinema-border rounded bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text focus:ring-2 focus:ring-blue-500 dark:focus:ring-cinema-teal placeholder-gray-500 dark:placeholder-cinema-text-muted"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-2">
                {line.text.length} characters | ~{getEstimatedTiming(line.text)}s
              </div>
            </div>
          ))}

          <button
            onClick={addDialogueLine}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-cinema-border rounded-lg text-gray-500 dark:text-cinema-text-muted hover:border-gray-400 dark:hover:border-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text transition-colors"
          >
            + Add Dialogue Line
          </button>

          {dialogueLines.length > 0 && (
            <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-3">
              <div className="text-sm text-gray-700 dark:text-cinema-text">
                <strong>Conversation Summary:</strong>
              </div>
              <div className="text-sm text-gray-600 dark:text-cinema-text-muted mt-1">
                {dialogueLines.length} lines | {new Set(dialogueLines.map(line => line.speaker)).size} speakers | 
                Total: {dialogueLines.reduce((sum, line) => sum + line.text.length, 0)} characters |
                Estimated: ~{Math.ceil(dialogueLines.reduce((sum, line) => sum + getEstimatedTiming(line.text), 0))}s
              </div>
            </div>
          )}
        </div>
      )}

      {/* Template Mode */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-cinema-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-cinema-text">
                Choose Dialogue Template
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-cinema-text-muted dark:hover:text-cinema-text"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(dialogueTemplates).map(([key, template]) => (
                  <div
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className="p-4 border border-gray-200 dark:border-cinema-border rounded-lg hover:border-blue-500 dark:hover:border-cinema-teal cursor-pointer transition-all duration-200 bg-white dark:bg-cinema-card hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{template.icon}</span>
                      <h4 className="font-semibold text-gray-900 dark:text-cinema-text">
                        {template.name}
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {template.lines.slice(0, 2).map((line, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-blue-600 dark:text-cinema-teal">
                            {line.speaker}:
                          </span>
                          <span className="text-gray-600 dark:text-cinema-text-muted ml-2">
                            {line.text.substring(0, 50)}...
                          </span>
                        </div>
                      ))}
                      {template.lines.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                          + {template.lines.length - 2} more lines
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DialogueBuilder;