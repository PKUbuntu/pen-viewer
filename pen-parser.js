/**
 * .pen File Parser
 * 
 * Parses Pencil.dev .pen files according to the official spec:
 * https://docs.pencil.dev/for-developers/the-pen-format
 * 
 * Features:
 * - JSON structure parsing
 * - Variable resolution (including theme-aware variables)
 * - Component reference resolution
 * - Slot mechanism support
 * - Icon font support
 * - Type-safe node traversal
 */

class PenParser {
  constructor() {
    this.variables = {};
    this.rawVariables = {};
    this.components = new Map();
    this.currentTheme = { Mode: 'Light', Base: 'Neutral', Accent: 'Default' };
  }

  /**
   * Parse a .pen document
   * @param {string|object} input - JSON string or parsed object
   * @returns {object} Parsed document with resolved variables
   */
  parse(input) {
    const doc = typeof input === 'string' ? JSON.parse(input) : input;
    
    // Reset state
    this.variables = {};
    this.rawVariables = {};
    this.components = new Map();
    
    // Extract theme from first child if present
    if (doc.children && doc.children[0] && doc.children[0].theme) {
      this.currentTheme = { ...this.currentTheme, ...doc.children[0].theme };
    }
    
    // Parse variables
    if (doc.variables) {
      this.rawVariables = doc.variables;
      this.resolveVariables();
    }
    
    // Build component registry (reusable components)
    this.buildComponentRegistry(doc);
    
    return {
      version: doc.version || '1.0',
      variables: this.variables,
      rawVariables: this.rawVariables,
      theme: this.currentTheme,
      children: doc.children || [],
      components: this.components
    };
  }

  /**
   * Resolve all variables including theme-aware ones
   */
  resolveVariables() {
    for (const [key, varDef] of Object.entries(this.rawVariables)) {
      if (!varDef) {
        this.variables[key] = null;
        continue;
      }

      // Handle simple value
      if (varDef.value !== undefined) {
        const values = Array.isArray(varDef.value) ? varDef.value : [{ value: varDef.value }];
        this.variables[key] = this.resolveThemeVariable(values);
      }
    }
  }

  /**
   * Resolve a theme-aware variable
   * @param {array} values - Array of value objects with optional theme conditions
   * @returns {*} The matched value or default fallback
   */
  resolveThemeVariable(values) {
    let matchedValue = null;
    let defaultFallback = null;

    for (const item of values) {
      // Store default (non-themed) value as fallback
      if (!item.theme && defaultFallback === null) {
        defaultFallback = item.value;
      }

      // Check if theme matches
      if (item.theme) {
        let matches = true;
        for (const [themeKey, themeValue] of Object.entries(item.theme)) {
          if (this.currentTheme[themeKey] !== themeValue) {
            matches = false;
            break;
          }
        }
        if (matches) {
          matchedValue = item.value;
          break;
        }
      }
    }

    return matchedValue !== null ? matchedValue : defaultFallback;
  }

  /**
   * Build a registry of reusable components
   * @param {object} doc - Parsed document
   */
  buildComponentRegistry(doc) {
    const traverse = (node) => {
      if (!node) return;
      
      // Register reusable components
      if (node.reusable && node.id && node.name) {
        this.components.set(node.id, {
          id: node.id,
          name: node.name,
          type: node.type,
          node: node
        });
      }

      // Traverse children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };

    if (doc.children) {
      doc.children.forEach(traverse);
    }
  }

  /**
   * Resolve a value that may reference a variable
   * @param {*} value - The value to resolve
   * @param {object} context - Context for size resolution (parent dimensions)
   * @returns {*} Resolved value
   */
  resolveValue(value, context = {}) {
    if (value === undefined || value === null) return null;

    // Variable reference (starts with $)
    if (typeof value === 'string' && value.startsWith('$')) {
      const varName = value.slice(1);
      return this.variables[varName] !== undefined ? this.variables[varName] : value;
    }

    // Special size keywords
    if (value === 'fill_container') {
      return context.parentSize || null;
    }
    if (value === 'fit_content') {
      return 'auto';
    }

    return value;
  }

  /**
   * Resolve color value
   * @param {*} color - Color value (string, object, or variable reference)
   * @returns {string} Resolved color
   */
  resolveColor(color) {
    if (!color) return null;
    
    if (typeof color === 'string') {
      if (color.startsWith('$')) {
        return this.variables[color.slice(1)] || '#888888';
      }
      return color;
    }

    // Handle color object format
    if (typeof color === 'object') {
      if (color.colors && Array.isArray(color.colors)) {
        return color.colors[0]?.color || '#888888';
      }
      if (color.value) {
        return this.resolveColor(color.value);
      }
    }

    return '#888888';
  }

  /**
   * Resolve stroke thickness (can be number or object with sides)
   * @param {*} thickness - Thickness value
   * @returns {number} Resolved thickness
   */
  resolveStrokeThickness(thickness) {
    if (thickness === undefined || thickness === null) return 1;
    if (typeof thickness === 'number') return thickness;
    if (typeof thickness === 'object') {
      return Math.max(
        thickness.top || 0,
        thickness.right || 0,
        thickness.bottom || 0,
        thickness.left || 0
      ) || 1;
    }
    return 1;
  }

  /**
   * Get stroke sides configuration
   * @param {*} stroke - Stroke object
   * @returns {object} Stroke sides configuration
   */
  resolveStrokeSides(stroke) {
    if (!stroke || !stroke.thickness) {
      return { top: 1, right: 1, bottom: 1, left: 1 };
    }

    if (typeof stroke.thickness === 'number') {
      const t = stroke.thickness;
      return { top: t, right: t, bottom: t, left: t };
    }

    if (typeof stroke.thickness === 'object') {
      return {
        top: stroke.thickness.top || 0,
        right: stroke.thickness.right || 0,
        bottom: stroke.thickness.bottom || 0,
        left: stroke.thickness.left || 0
      };
    }

    return { top: 1, right: 1, bottom: 1, left: 1 };
  }

  /**
   * Resolve component reference
   * @param {string} refId - Component ID to reference
   * @returns {object|null} Referenced component or null
   */
  resolveReference(refId) {
    return this.components.get(refId) || null;
  }

  /**
   * Traverse all nodes in the document
   * @param {object} doc - Parsed document
   * @param {function} callback - Function to call for each node
   */
  traverse(doc, callback) {
    const traverseNode = (node, parent = null, depth = 0) => {
      if (!node) return;

      callback(node, parent, depth);

      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverseNode(child, node, depth + 1));
      }
    };

    if (doc.children) {
      doc.children.forEach(child => traverseNode(child));
    }
  }

  /**
   * Extract all components with their metadata
   * @param {object} doc - Parsed document
   * @returns {array} Array of component metadata
   */
  extractComponents(doc) {
    const components = [];

    this.traverse(doc, (node) => {
      if (node.name && node.id && node.type && 
          ['frame', 'rectangle', 'ellipse', 'text', 'icon_font'].includes(node.type)) {
        // Skip generic names
        const skipNames = ['Frame', 'Rectangle', 'Ellipse', 'Text', 'Group', 'Vector', 'Line', 'Circle'];
        if (!skipNames.includes(node.name)) {
          components.push({
            id: node.id,
            name: node.name,
            type: node.type,
            reusable: node.reusable || false,
            x: node.x || 0,
            y: node.y || 0,
            width: node.width || 100,
            height: node.height || 100
          });
        }
      }
    });

    return components;
  }

  /**
   * Get node type category
   * @param {string} type - Node type
   * @returns {string} Category
   */
  static getCategory(type) {
    const categories = {
      // Basic shapes
      frame: 'shape',
      rectangle: 'shape',
      ellipse: 'shape',
      circle: 'shape',
      line: 'shape',
      path: 'shape',
      
      // Text
      text: 'text',
      
      // Media
      image: 'media',
      video: 'media',
      
      // Icons
      icon: 'icon',
      icon_font: 'icon',
      
      // Components
      ref: 'component',
      instance: 'component',
      
      // Layout
      group: 'layout',
      stack: 'layout'
    };

    return categories[type] || 'unknown';
  }

  /**
   * Validate a .pen document structure
   * @param {object} doc - Document to validate
   * @returns {object} Validation result with errors array
   */
  validate(doc) {
    const errors = [];
    const warnings = [];

    // Check version
    if (!doc.version) {
      warnings.push('Missing version field');
    }

    // Check children
    if (!doc.children || !Array.isArray(doc.children)) {
      errors.push('Missing or invalid children array');
    }

    // Validate nodes
    const validateNode = (node, path = 'root') => {
      if (!node) return;

      // Check required fields
      if (!node.type) {
        errors.push(`${path}: Missing node type`);
      }

      // Check for valid type
      const validTypes = ['frame', 'rectangle', 'ellipse', 'circle', 'line', 'path', 'text', 'image', 'video', 'icon', 'icon_font', 'ref', 'instance', 'group', 'stack'];
      if (node.type && !validTypes.includes(node.type)) {
        warnings.push(`${path}: Unknown node type "${node.type}"`);
      }

      // Check ref nodes have ref field
      if (node.type === 'ref' && !node.ref) {
        errors.push(`${path}: Ref node missing "ref" field`);
      }

      // Check text nodes have content
      if (node.type === 'text' && !node.content) {
        warnings.push(`${path}: Text node missing content`);
      }

      // Recurse into children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child, index) => {
          validateNode(child, `${path}.children[${index}]`);
        });
      }
    };

    if (doc.children) {
      doc.children.forEach((child, index) => {
        validateNode(child, `children[${index}]`);
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PenParser;
}

// Browser global
if (typeof window !== 'undefined') {
  window.PenParser = PenParser;
}
