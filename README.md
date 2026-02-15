# Binary Relations Visualizer

A modern, interactive web-based binary relations visualizer for educational purposes. Create, manipulate, and analyze binary relations through an intuitive graphical interface with automatic property detection and analysis.

## Features

- **Interactive Canvas**: Click to create nodes, drag between nodes to create relations
- **Force-Directed Layout**: Nodes automatically arrange themselves aesthetically
- **Self-Loops**: Support for reflexive relations
- **Text Parsing**: Edit relations as mathematical text notation
- **Bidirectional Sync**: Changes in canvas update text, and vice versa
- **Property Detection**: Automatically detects 10 binary relation properties:
  - Reflexive, Irreflexive, Symmetric, Antisymmetric, Asymmetric
  - Transitive, Intransitive, Total, Trichotomous, Euclidean
- **Dual Notation Styles**:
  - **Roster Notation**: Simple enumeration format (default)
  - **Set-Builder Notation**: Formal mathematical notation
- **Derived Relations**: Automatically computes identity, inverse, and composition
- **URL Sharing**: Share graph state via URL
- **Internationalization**: Easy to add new languages
- **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

```bash
# Clone the repository
git clone https://github.com/ClassTerr/BinaryRelationsWeb.git
cd BinaryRelationsWeb

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### Creating Nodes and Relations

1. **Add Node**: Click on empty space in the canvas
2. **Edit Node Label**: Double-click on a node
3. **Create Relation**: Click and drag from one node to another
4. **Self-Loop**: Drag from a node back to itself
5. **Delete Node**: Right-click on a node (removes all connected relations)
6. **Delete Relation**: Click to select a relation, then press Delete key
7. **Move Node**: Drag a node to reposition it

### Text Input

Enter relations in the text area using standard mathematical notation:

```
R = { (a, b), (c, d) }
```

Or simply:

```
(a,b), (c,d)
```

The parser is flexible and accepts various formats.

### Notation Styles

Toggle between two notation styles using the "Notation" button:

**Roster Notation (Default)**:
```
R = { (2, 1), (4, 2) }
D(R) = { 2, 4 }
E(R) = { 1, 2 }
```

**Set-Builder Notation**:
```
Let A = {1, 2, 4}.
Define a binary relation R ⊆ A × A by:
R = { (2,1), (4,2) }
Domain:
dom(R) = {2, 4}
```

### Controls

- **Load Example**: Load a pre-configured example relation
- **Copy Link**: Copy current graph state to clipboard for sharing
- **Clear All**: Remove all nodes and relations
- **Notation Toggle**: Switch between roster and set-builder notation

### URL Sharing

The graph state is automatically encoded in the URL. Share the URL to let others view your graph:

```
https://example.com/?graph=eyJub2Rlc...
```

## Property Definitions

### Reflexive
∀a ∈ O(R), (a, a) ∈ R

Every element is related to itself.

### Irreflexive (Anti-reflexive)
∀a ∈ O(R), (a, a) ∉ R

No element is related to itself.

### Symmetric
∀a,b, (a, b) ∈ R ⇒ (b, a) ∈ R

If a is related to b, then b is related to a.

### Antisymmetric
∀a,b, (a, b) ∈ R ∧ (b, a) ∈ R ⇒ a = b

If a is related to b and b is related to a, then a equals b.

### Asymmetric
∀a,b, (a, b) ∈ R ⇒ (b, a) ∉ R

If a is related to b, then b is not related to a.

### Transitive
∀a,b,c, (a, b) ∈ R ∧ (b, c) ∈ R ⇒ (a, c) ∈ R

If a is related to b and b is related to c, then a is related to c.

### Intransitive
∀a,b,c, (a, b) ∈ R ∧ (b, c) ∈ R ⇒ (a, c) ∉ R

If a is related to b and b is related to c, then a is not related to c.

### Total (Complete)
∀a≠b ∈ O(R), (a, b) ∈ R ∨ (b, a) ∈ R

For any two distinct elements, at least one is related to the other.

### Trichotomous
∀a,b ∈ O(R), exactly one of {a=b, (a,b)∈R, (b,a)∈R} holds

For any two elements, exactly one of three conditions holds.

### Euclidean
∀a,b,c, (a, b) ∈ R ∧ (a, c) ∈ R ⇒ (b, c) ∈ R

If a is related to both b and c, then b is related to c.

## Adding New Translations

To add a new language:

1. Create a new JSON file in `src/i18n/locales/` (e.g., `es.json` for Spanish)
2. Copy the structure from `en.json`
3. Translate all strings (keep mathematical symbols unchanged)
4. Import and register the new language in `src/i18n/index.ts`:

```typescript
import es from './locales/es.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },  // Add your language
  },
  // ...
});
```

5. Add language selector UI (optional enhancement)

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **D3.js** - Force-directed graph layout and SVG manipulation
- **i18next** - Internationalization
- **HTML5 SVG** - Graph rendering

## Project Structure

```
src/
├── components/          # React components
│   ├── GraphCanvas.tsx  # Interactive SVG graph canvas
│   ├── TextInput.tsx    # Relation text input/parser
│   └── AnalysisPanel.tsx # Property detection display
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── relationUtils.ts # Mathematical operations
│   ├── parserUtils.ts   # Text parsing
│   ├── formatterUtils.ts # Notation formatting
│   └── storageUtils.ts  # localStorage & URL serialization
├── i18n/                # Internationalization
│   └── locales/         # Translation files
├── App.tsx              # Main application component
└── main.tsx             # Entry point
```

## Development

```bash
# Run development server with hot reload
npm run dev

# Type check
npm run build

# Lint code
npm run lint
```

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Educational Use

This tool is designed for educational purposes to help students understand:
- Binary relations and their properties
- Graph theory visualization
- Mathematical notation
- Set theory concepts

Perfect for discrete mathematics, computer science, and logic courses.
