import React, { useState, useRef } from 'react';
import usePromptStore from './store';

const ImportSystem = () => {
  const { importData } = usePromptStore();
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await importData(file);
      setImportResult({
        success: true,
        message: getSuccessMessage(result)
      });
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message
      });
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getSuccessMessage = (result) => {
    if (result.type === 'character') {
      return `Successfully imported character: "${result.name}"`;
    } else if (result.type === 'scene') {
      return `Successfully imported scene: "${result.name}"`;
    } else if (result.type === 'backup') {
      return `Successfully imported backup: ${result.count.characters} characters and ${result.count.scenes} scenes`;
    }
    return 'Import successful';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.name.endsWith('.json'));

    if (!jsonFile) {
      alert('Please drop a JSON file');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const result = await importData(jsonFile);
      setImportResult({
        success: true,
        message: getSuccessMessage(result)
      });
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Import Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={importing}
        className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-cinema-success dark:hover:bg-cinema-success/90 dark:hover:shadow-glow-success disabled:bg-gray-400 dark:disabled:bg-cinema-border text-white text-sm font-medium rounded-md transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        <span>{importing ? 'Importing...' : 'Import JSON File'}</span>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Compact Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-cinema-border rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-cinema-teal/50 transition-all duration-300 bg-white dark:bg-cinema-card"
      >
        <svg className="mx-auto h-8 w-8 text-gray-400 dark:text-cinema-text-muted transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        <p className="mt-1 text-sm text-gray-600 dark:text-cinema-text transition-colors duration-300">
          Drop JSON files here
        </p>
        <p className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1 transition-colors duration-300">
          Characters, scenes, or backups
        </p>
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`p-4 rounded-md transition-all duration-300 ${
          importResult.success 
            ? 'bg-green-50 dark:bg-cinema-success/10 border border-green-200 dark:border-cinema-success/30 text-green-700 dark:text-cinema-success'
            : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400'
        }`}>
          <div className="flex items-center">
            {importResult.success ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium transition-colors duration-300">{importResult.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportSystem;