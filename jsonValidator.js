// Robust JSON Parsing and Validation System for AI-Generated Content
// Handles malformed JSON, missing fields, and intelligent error recovery

import { schema } from './schema.js';

class JSONValidator {
  constructor() {
    this.schemaFields = this.extractSchemaFields();
    this.requiredFields = ['scene']; // Minimum required fields
    this.fallbackValues = this.generateFallbackValues();
  }

  // Extract all possible fields from the schema
  extractSchemaFields() {
    const fields = new Set();
    
    schema.categories.forEach(category => {
      category.fields.forEach(field => {
        fields.add(field.key);
        
        // Add detail configuration fields
        if (field.detailConfig) {
          Object.values(field.detailConfig).forEach(detailConfig => {
            detailConfig.fields.forEach(detailField => {
              fields.add(detailField.key);
            });
          });
        }
      });
    });
    
    return Array.from(fields);
  }

  // Generate sensible fallback values for common fields
  generateFallbackValues() {
    return {
      scene: "A cinematic scene with professional composition",
      setting: "indoor studio",
      time_of_day: "afternoon",
      environment: "clear",
      character_type: "human",
      actions: "standing",
      emotions: "calm",
      angle: "eye level",
      distance: "medium shot",
      lighting_type: "natural light",
      color_palette: "balanced",
      style: "cinematic",
      tone: "professional",
      atmosphere: "polished",
      aspect_ratio: "16:9",
      duration: "30s"
    };
  }

  // Main validation method with comprehensive error recovery
  validateAndRepair(jsonString, originalJSON = null) {
    try {
      // Step 1: Try direct JSON parsing
      const parsed = this.parseJSON(jsonString);
      if (parsed.success) {
        return this.validateStructure(parsed.data, originalJSON);
      }

      // Step 2: Try repair strategies if direct parsing failed
      const repaired = this.repairJSON(jsonString);
      if (repaired.success) {
        return this.validateStructure(repaired.data, originalJSON);
      }

      // Step 3: Extract partial data if repair failed
      const extracted = this.extractPartialData(jsonString, originalJSON);
      return extracted;

    } catch (error) {
      console.error('JSON validation failed:', error);
      return this.createFallbackResult(originalJSON, error.message);
    }
  }

  // Safe JSON parsing with error details
  parseJSON(jsonString) {
    try {
      // Clean the string first
      const cleaned = this.cleanJSONString(jsonString);
      const parsed = JSON.parse(cleaned);
      
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Parsed JSON is not an object');
      }

      return {
        success: true,
        data: parsed,
        method: 'direct_parse'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        method: 'direct_parse'
      };
    }
  }

  // Clean JSON string of common AI output issues
  cleanJSONString(str) {
    if (typeof str !== 'string') {
      throw new Error('Input is not a string');
    }

    let cleaned = str.trim();

    // Remove markdown code blocks
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
    cleaned = cleaned.replace(/```\s*/gi, '');

    // Remove leading/trailing text that's not JSON
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }

    // Fix common JSON formatting issues
    cleaned = this.fixCommonJSONIssues(cleaned);

    return cleaned;
  }

  // Fix common JSON formatting problems
  fixCommonJSONIssues(str) {
    let fixed = str;

    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

    // Fix unquoted keys
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

    // Fix single quotes to double quotes
    fixed = fixed.replace(/'/g, '"');

    // Fix escaped quotes in strings
    fixed = fixed.replace(/\\"/g, '\\"');

    // Fix line breaks in strings
    fixed = fixed.replace(/"([^"]*)\n([^"]*)"/g, '"$1\\n$2"');

    // Fix boolean values
    fixed = fixed.replace(/:\s*True\b/gi, ': true');
    fixed = fixed.replace(/:\s*False\b/gi, ': false');
    fixed = fixed.replace(/:\s*None\b/gi, ': null');

    return fixed;
  }

  // Advanced JSON repair strategies
  repairJSON(jsonString) {
    const repairStrategies = [
      this.repairWithBracketCompletion.bind(this),
      this.repairWithQuoteFixing.bind(this),
      this.repairWithFieldReconstruction.bind(this),
      this.repairWithTemplateMatching.bind(this)
    ];

    for (const strategy of repairStrategies) {
      try {
        const result = strategy(jsonString);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn(`Repair strategy failed: ${error.message}`);
      }
    }

    return {
      success: false,
      error: 'All repair strategies failed',
      method: 'repair_failed'
    };
  }

  // Repair by completing missing brackets
  repairWithBracketCompletion(str) {
    let cleaned = this.cleanJSONString(str);
    
    // Count brackets to find missing ones
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;

    // Add missing closing braces
    for (let i = 0; i < openBraces - closeBraces; i++) {
      cleaned += '}';
    }

    // Add missing closing brackets
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      cleaned += ']';
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        success: true,
        data: parsed,
        method: 'bracket_completion'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        method: 'bracket_completion'
      };
    }
  }

  // Repair by fixing quote issues
  repairWithQuoteFixing(str) {
    let cleaned = this.cleanJSONString(str);
    
    // Try to fix unmatched quotes
    const lines = cleaned.split('\n');
    const fixedLines = lines.map(line => {
      // If line has an odd number of quotes, try to fix it
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        // Try adding a quote at the end of string values
        if (line.includes(':') && !line.trim().endsWith('"') && !line.trim().endsWith(',')) {
          line = line.trim() + '"';
        }
      }
      return line;
    });

    try {
      const repaired = fixedLines.join('\n');
      const parsed = JSON.parse(repaired);
      return {
        success: true,
        data: parsed,
        method: 'quote_fixing'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        method: 'quote_fixing'
      };
    }
  }

  // Repair by reconstructing fields from fragments
  repairWithFieldReconstruction(str) {
    const fieldPattern = /"([^"]+)":\s*"([^"]*)"/g;
    const reconstructed = {};
    let match;

    while ((match = fieldPattern.exec(str)) !== null) {
      const [, key, value] = match;
      reconstructed[key] = value;
    }

    // Also try to extract simple key-value pairs
    const simplePattern = /(\w+):\s*([^,\n}]+)/g;
    while ((match = simplePattern.exec(str)) !== null) {
      const [, key, value] = match;
      if (!reconstructed[key]) {
        reconstructed[key] = value.trim().replace(/['"]/g, '');
      }
    }

    if (Object.keys(reconstructed).length > 0) {
      return {
        success: true,
        data: reconstructed,
        method: 'field_reconstruction'
      };
    }

    return {
      success: false,
      error: 'No fields could be reconstructed',
      method: 'field_reconstruction'
    };
  }

  // Repair using template matching
  repairWithTemplateMatching(str) {
    // Extract content between first { and last }
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    
    if (start === -1 || end === -1 || end <= start) {
      return {
        success: false,
        error: 'No JSON structure found',
        method: 'template_matching'
      };
    }

    const content = str.substring(start + 1, end);
    const lines = content.split(/[,\n]/);
    const reconstructed = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim().replace(/['"]/g, '');
        const value = line.substring(colonIndex + 1).trim().replace(/['"]/g, '');
        
        if (key && value) {
          reconstructed[key] = value;
        }
      }
    }

    if (Object.keys(reconstructed).length > 0) {
      return {
        success: true,
        data: reconstructed,
        method: 'template_matching'
      };
    }

    return {
      success: false,
      error: 'Template matching failed',
      method: 'template_matching'
    };
  }

  // Extract whatever data we can from malformed JSON
  extractPartialData(jsonString, originalJSON) {
    const extracted = {};
    
    // Try to extract field-value pairs using various patterns
    const patterns = [
      /"(\w+)":\s*"([^"]*)"/g,
      /"(\w+)":\s*([^,}\n]+)/g,
      /(\w+):\s*"([^"]*)"/g,
      /(\w+):\s*([^,}\n]+)/g
    ];

    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0; // Reset regex
      
      while ((match = pattern.exec(jsonString)) !== null) {
        const [, key, value] = match;
        if (this.schemaFields.includes(key) && !extracted[key]) {
          extracted[key] = value.trim().replace(/['"]/g, '');
        }
      }
    }

    // If we got some data, merge with original if available
    if (Object.keys(extracted).length > 0) {
      const result = originalJSON ? { ...originalJSON, ...extracted } : extracted;
      return this.validateStructure(result, originalJSON);
    }

    // Last resort: return original or fallback
    return this.createFallbackResult(originalJSON, 'Could not extract any valid data');
  }

  // Validate and repair the structure of parsed JSON
  validateStructure(data, originalJSON = null) {
    const result = {
      success: true,
      data: { ...data },
      warnings: [],
      repairs: []
    };

    // Ensure required fields exist
    for (const field of this.requiredFields) {
      if (!result.data[field]) {
        if (originalJSON && originalJSON[field]) {
          result.data[field] = originalJSON[field];
          result.repairs.push(`Restored missing field '${field}' from original`);
        } else if (this.fallbackValues[field]) {
          result.data[field] = this.fallbackValues[field];
          result.repairs.push(`Added fallback value for missing field '${field}'`);
        } else {
          result.warnings.push(`Missing required field '${field}'`);
        }
      }
    }

    // Validate field types and values
    result.data = this.validateFieldTypes(result.data, result);

    // Remove invalid fields not in schema (but preserve AI extension fields)
    const validFields = new Set(this.schemaFields);
    
    // AI Extension fields that should always be preserved
    const aiExtensionFields = new Set([
      'continuation_type', 'character_focus', 'development_type', 'internal_state',
      'narrative_connection', 'twist_type', 'optimization_type', 'quality_improvements',
      'creative_additions', 'viral_elements', 'engagement_hooks', 'platform_adaptations',
      'target_platform', 'technical_specifications', 'style_elements', 'aesthetic_enhancements',
      'optimization_notes', 'ai_message', 'visual_enhancements', 'cinematic_techniques',
      'technical_upgrades', 'production_notes', 'story_structure', 'character_motivations',
      'narrative_improvements', 'trending_adaptations', 'shareability_factors',
      'stylistic_influences', 'engagement_strategy'
    ]);
    
    const dataKeys = Object.keys(result.data);
    
    for (const key of dataKeys) {
      const isValidField = validFields.has(key);
      const isMetadataField = key.startsWith('_');
      const isNotesOrMessage = key.includes('_notes') || key.includes('_message');
      const isAIExtension = aiExtensionFields.has(key);
      
      if (!isValidField && !isMetadataField && !isNotesOrMessage && !isAIExtension) {
        delete result.data[key];
        result.repairs.push(`Removed invalid field '${key}'`);
      }
    }

    return result;
  }

  // Validate and fix field types
  validateFieldTypes(data, result) {
    const validated = { ...data };

    // Get field definitions from schema
    const fieldDefinitions = this.getFieldDefinitions();

    for (const [key, value] of Object.entries(validated)) {
      const fieldDef = fieldDefinitions[key];
      
      if (fieldDef) {
        const validatedValue = this.validateFieldValue(key, value, fieldDef, result);
        validated[key] = validatedValue;
      }
    }

    return validated;
  }

  // Get field definitions from schema
  getFieldDefinitions() {
    const definitions = {};
    
    schema.categories.forEach(category => {
      category.fields.forEach(field => {
        definitions[field.key] = field;
        
        // Add detail configuration fields
        if (field.detailConfig) {
          Object.values(field.detailConfig).forEach(detailConfig => {
            detailConfig.fields.forEach(detailField => {
              definitions[detailField.key] = detailField;
            });
          });
        }
      });
    });
    
    return definitions;
  }

  // Validate individual field value
  validateFieldValue(key, value, fieldDef, result) {
    // Handle different field types
    switch (fieldDef.type) {
      case 'select':
        if (fieldDef.options && !fieldDef.options.includes(value)) {
          // Try to find closest match
          const closest = this.findClosestOption(value, fieldDef.options);
          if (closest) {
            result.repairs.push(`Changed '${key}' from '${value}' to '${closest}' (closest match)`);
            return closest;
          }
        }
        return value;
        
      case 'number':
        const num = Number(value);
        if (!isNaN(num)) {
          return num;
        }
        result.warnings.push(`Invalid number value for '${key}': ${value}`);
        return 0;
        
      case 'text':
      case 'textarea':
        return String(value);
        
      default:
        return value;
    }
  }

  // Find closest matching option using fuzzy matching
  findClosestOption(value, options) {
    if (!value || !options) return null;
    
    const valueStr = String(value).toLowerCase();
    
    // Exact match first
    const exactMatch = options.find(opt => opt.toLowerCase() === valueStr);
    if (exactMatch) return exactMatch;
    
    // Partial match
    const partialMatch = options.find(opt => 
      opt.toLowerCase().includes(valueStr) || valueStr.includes(opt.toLowerCase())
    );
    if (partialMatch) return partialMatch;
    
    // Fuzzy match using Levenshtein distance
    let bestMatch = null;
    let bestDistance = Infinity;
    
    for (const option of options) {
      const distance = this.levenshteinDistance(valueStr, option.toLowerCase());
      if (distance < bestDistance && distance <= 3) { // Max distance of 3
        bestDistance = distance;
        bestMatch = option;
      }
    }
    
    return bestMatch;
  }

  // Calculate Levenshtein distance for fuzzy matching
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Create fallback result when all else fails
  createFallbackResult(originalJSON, errorMessage) {
    const fallback = originalJSON ? { ...originalJSON } : { ...this.fallbackValues };
    
    return {
      success: false,
      data: fallback,
      error: errorMessage,
      fallback: true,
      warnings: ['Using fallback data due to parsing failure'],
      repairs: []
    };
  }

  // Quick validation for simple JSON strings
  isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Get validation statistics
  getValidationStats(result) {
    return {
      success: result.success,
      fieldCount: Object.keys(result.data).length,
      warningCount: result.warnings ? result.warnings.length : 0,
      repairCount: result.repairs ? result.repairs.length : 0,
      method: result.method || 'unknown',
      fallback: result.fallback || false
    };
  }
}

// Create and export singleton instance
const jsonValidator = new JSONValidator();
export default jsonValidator;

// Export class for testing
export { JSONValidator };