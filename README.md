# Pen Viewer

A web-based renderer for `.pen` files - the design format used by [Pencil.dev](https://pencil.dev).

## What is .pen?

`.pen` is an open JSON-based design file format that describes UI designs as an object tree. It supports:

- **Vector shapes**: frames, rectangles, ellipses, paths
- **Text rendering**: with typography controls
- **Flexbox layout**: horizontal/vertical layouts with alignment
- **Variables & Themes**: design tokens for consistent styling
- **Components**: reusable elements with instance overrides

## Live Demo

👉 **[View Demo](https://pkubuntu.github.io/pen-viewer/)**

## Features

| Feature | Status |
|---------|--------|
| Frame / Rectangle | ✅ |
| Ellipse | ✅ |
| Text | ✅ |
| Fill (solid color) | ✅ |
| Stroke (border) | ✅ |
| Corner Radius | ✅ |
| Shadow Effects | ✅ |
| Variables | ✅ |
| Flexbox Layout | ✅ |
| Gap / Padding | ✅ |
| Justify / Align | ✅ |
| Icon Fonts | ✅ |
| Component Refs | ✅ |
| Theme Variables | ✅ |
| Gradient Fill | 🚧 |
| Path/SVG | 🚧 |
| Image Fill | 🚧 |

## Usage

### Load a .pen file

```javascript
// Fetch and render a .pen file
const response = await fetch('design.pen');
const doc = await response.json();
renderDocument(doc);
```

### Using the Parser Module

The `pen-parser.js` module provides a standalone parser for .pen files:

```javascript
const parser = new PenParser();
const parsed = parser.parse(penJson);
const components = parser.extractComponents(parsed);
const color = parser.resolveColor(variableRef);
```

### Parser API

- `parse(input)` - Parse a .pen document
- `resolveValue(value, context)` - Resolve variable references
- `resolveColor(color)` - Resolve color values
- `resolveStrokeThickness(thickness)` - Handle stroke thickness
- `resolveReference(refId)` - Look up component references
- `extractComponents(doc)` - Extract all components
- `validate(doc)` - Validate document structure

### Example .pen structure

```json
{
  "version": "1.0",
  "variables": {
    "color.primary": { "type": "color", "value": "#3b82f6" }
  },
  "children": [
    {
      "id": "button",
      "type": "frame",
      "width": 200,
      "height": 48,
      "fill": "$color.primary",
      "cornerRadius": 24,
      "children": [
        {
          "id": "label",
          "type": "text",
          "content": "Click Me",
          "fill": "#ffffff"
        }
      ]
    }
  ]
}
```

## Development

```bash
# Clone the repo
git clone https://github.com/PKUbuntu/pen-viewer.git
cd pen-viewer

# Start local server
python3 -m http.server 8888

# Open in browser
open http://localhost:8888/pen-viewer.html
```

## Roadmap

- [ ] Gradient fill support
- [ ] Path/SVG rendering
- [ ] Image fill
- [ ] Theme switching UI
- [ ] Interactive canvas (zoom, pan, select)
- [ ] Export to PNG/SVG
- [ ] Slot mechanism full implementation

## References

- [Pencil.dev](https://pencil.dev) - Official website
- [Pencil Documentation](https://docs.pencil.dev) - Official docs
- [.pen Format Spec](https://docs.pencil.dev/for-developers/the-pen-format) - Technical reference

## License

MIT License - feel free to use and modify.

---

Built with ❤️ by exploring the open .pen format.