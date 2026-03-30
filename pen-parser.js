/**
 * .pen File Parser
 * 
 * Parses Pencil.dev .pen files according to the official spec:
 * https://docs.pencil.dev/for-developers/the-pen-format
 */

class PenParser {
  constructor() {
    this.variables = {};
    this.rawVariables = {};
    this.components = new Map();
    this.currentTheme = { Mode: 'Light', Base: 'Neutral', Accent: 'Default' };
  }

  parse(input) {
    const doc = typeof input === 'string' ? JSON.parse(input) : input;
    this.variables = {};
    this.rawVariables = {};
    this.components = new Map();
    
    if (doc.children && doc.children[0] && doc.children[0].theme) {
      this.currentTheme = { ...this.currentTheme, ...doc.children[0].theme };
    }
    
    if (doc.variables) {
      this.rawVariables = doc.variables;
      this.resolveVariables();
    }
    
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

  resolveVariables() {
    for (const [key, varDef] of Object.entries(this.rawVariables)) {
      if (!varDef) { this.variables[key] = null; continue; }
      if (varDef.value !== undefined) {
        const values = Array.isArray(varDef.value) ? varDef.value : [{ value: varDef.value }];
        this.variables[key] = this.resolveThemeVariable(values);
      }
    }
  }

  resolveThemeVariable(values) {
    let matchedValue = null, defaultFallback = null;
    for (const item of values) {
      if (!item.theme && defaultFallback === null) defaultFallback = item.value;
      if (item.theme) {
        let matches = true;
        for (const [tk, tv] of Object.entries(item.theme)) {
          if (this.currentTheme[tk] !== tv) { matches = false; break; }
        }
        if (matches) { matchedValue = item.value; break; }
      }
    }
    return matchedValue !== null ? matchedValue : defaultFallback;
  }

  buildComponentRegistry(doc) {
    const traverse = (node) => {
      if (!node) return;
      if (node.reusable && node.id && node.name) {
        this.components.set(node.id, { id: node.id, name: node.name, type: node.type, node });
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };
    if (doc.children) doc.children.forEach(traverse);
  }

  resolveValue(value, context = {}) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string' && value.startsWith('$')) {
      const varName = value.slice(1);
      return this.variables[varName] !== undefined ? this.variables[varName] : value;
    }
    if (value === 'fill_container') return context.parentSize || null;
    if (value === 'fit_content') return 'auto';
    return value;
  }

  resolveColor(color) {
    if (!color) return null;
    if (typeof color === 'string') {
      if (color.startsWith('$')) return this.variables[color.slice(1)] || '#888888';
      return color;
    }
    if (typeof color === 'object') {
      if (color.colors && Array.isArray(color.colors)) return color.colors[0]?.color || '#888888';
      if (color.value) return this.resolveColor(color.value);
    }
    return '#888888';
  }

  resolveStrokeThickness(thickness) {
    if (thickness === undefined || thickness === null) return 1;
    if (typeof thickness === 'number') return thickness;
    if (typeof thickness === 'object') {
      return Math.max(thickness.top || 0, thickness.right || 0, thickness.bottom || 0, thickness.left || 0) || 1;
    }
    return 1;
  }

  resolveReference(refId) {
    return this.components.get(refId) || null;
  }

  extractComponents(doc) {
    const components = [];
    const traverse = (node, parentX = 0, parentY = 0) => {
      if (!node) return;
      const x = parentX + (node.x || 0);
      const y = parentY + (node.y || 0);
      const width = typeof node.width === 'number' && node.width > 0 ? node.width : 100;
      const height = typeof node.height === 'number' && node.height > 0 ? node.height : 100;
      
      if (node.name && node.id && node.type && ['frame', 'rectangle', 'ellipse', 'text', 'icon_font'].includes(node.type)) {
        const skipNames = ['Frame', 'Rectangle', 'Ellipse', 'Text', 'Group', 'Vector', 'Line', 'Circle'];
        if (!skipNames.includes(node.name)) {
          components.push({ id: node.id, name: node.name, type: node.type, reusable: node.reusable || false, x, y, width, height });
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => traverse(child, x, y));
      }
    };
    if (doc.children) doc.children.forEach(traverse);
    return components;
  }

  validate(doc) {
    const errors = [], warnings = [];
    if (!doc.version) warnings.push('Missing version field');
    if (!doc.children || !Array.isArray(doc.children)) errors.push('Missing or invalid children array');
    const validateNode = (node, path = 'root') => {
      if (!node) return;
      if (!node.type) errors.push(`${path}: Missing node type`);
      if (node.type === 'ref' && !node.ref) errors.push(`${path}: Ref node missing "ref" field`);
      if (node.type === 'text' && !node.content) warnings.push(`${path}: Text node missing content`);
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child, i) => validateNode(child, `${path}.children[${i}]`));
      }
    };
    if (doc.children) doc.children.forEach((child, i) => validateNode(child, `children[${i}]`));
    return { valid: errors.length === 0, errors, warnings };
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = PenParser;
if (typeof window !== 'undefined') window.PenParser = PenParser;
