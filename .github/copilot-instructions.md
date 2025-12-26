# Copilot Instructions: Prabhupada Player

## Project Overview
Lithuanian audio player app for spiritual lectures. Vite + React 19 frontend consuming a Node.js API for streaming MP3 files. Premium dark UI with Tailwind CSS, FontAwesome icons, and smooth UX.

## Architecture

### State Management & Data Flow
- **No state management library**: Pure React `useState`/`useEffect` in [App.jsx](../src/App.jsx)
- **Top-down data flow**: `App` fetches files → passes to `FileList` → user clicks → triggers `handlePlay` → updates `currentFile` → flows to `AudioPlayer`
- **Navigation pattern**: `handleNext`/`handlePrev` in App find current index in files array, increment/decrement, set new `currentFile`

### API Integration ([api.js](../src/services/api.js))
```javascript
// Dynamic API_URL resolution
const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:4001/api' : 'https://prabhupada.lt/api');

// Data mapping from Lithuanian DB schema
const mapFile = (record) => ({
  id: record.id,
  title: record.pavadinimas,        // Lithuanian field names
  location: record.vieta,
  book: record.knyga,
  // ... all other fields mapped
});
```
**Pattern**: Always use `mapFile()` to transform API responses. Backend uses Lithuanian column names (`pavadinimas`, `vieta`, `knyga`, etc.), frontend uses English props.

### Component Structure
- **Layout**: Static header with Prabhupada image (mirrored via `scale-x-[-1]`), dark theme wrapper
- **FileList**: Sortable table with client-side search/filter. Uses `useMemo` for performance. Grid layout responsive (12-col → different spans for mobile/desktop)
- **AudioPlayer**: Fixed bottom sticky player. Uses `useRef` for HTML5 audio element, auto-plays on file change

## Key Conventions

### Styling Patterns
```jsx
// Dark theme base colors
bg-gray-900     // backgrounds
bg-gray-800     // cards/containers
bg-gray-700     // hover states
text-gray-400   // secondary text
text-indigo-500 // primary accent
```
- **Indigo/Purple gradients** for primary elements (buttons, active states)
- **Hover transitions**: Always add `transition-colors` or `transition-all` to interactive elements
- **Active file indicator**: `border-l-4 border-indigo-500` on selected row in FileList

### Lithuanian Localization
- **All UI text in Lithuanian**: Button labels, placeholders, column headers
- Example: `"Ieškoti įrašų..."` (search placeholder), `"Groti"` (play), `"Pavadinimas"` (title)
- **Date formatting**: Use `toLocaleDateString('lt-LT')` in [format.js](../src/utils/format.js)

### FontAwesome Usage
- **Icons pre-registered** in [icons.js](../src/utils/icons.js) - import from there, add to library
- Use string names: `<FontAwesomeIcon icon="play" />` (not object imports in components)
- Common icons: `play`, `pause`, `music`, `download`, `sort`, `sort-up`, `sort-down`

### ESLint Rules
- Allow unused uppercase vars: `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]`
- React 19 hooks + Vite refresh plugins enabled

## Development Workflow

### Commands
```bash
npm run dev      # Vite dev server (default port 5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Environment Variables
- `VITE_API_URL`: Override backend API URL (optional, defaults to localhost:4001 or prabhupada.lt)

## Common Tasks

### Adding a New Sortable Column
1. Add field to `mapFile()` in [api.js](../src/services/api.js)
2. Add `<div>` to FileList header grid with `onClick={() => requestSort('fieldName')}`
3. Include sort icon: `<FontAwesomeIcon icon={getSortIcon('fieldName')} />`
4. Add corresponding data cell in file rows

### Adding New Audio Controls
- Modify [AudioPlayer.jsx](../src/components/AudioPlayer.jsx) 
- Use `audioRef.current` for HTML5 audio API (e.g., `audioRef.current.playbackRate = 1.5`)
- Update state for UI reactivity (`isPlaying`, `currentTime`, etc.)

### Filtering/Search Logic
- Extend filter check in `FileList` `useMemo` block:
```javascript
sortableFiles.filter(f =>
  f.title.toLowerCase().includes(filter.toLowerCase()) ||
  f.newField?.toLowerCase().includes(filter.toLowerCase())
);
```

## Integration Points
- **Backend API**: GET `/api/get` (file list), GET `/api/play/:id` (stream), GET `/api/download/:id`
- **No authentication**: Public read-only access
- **CORS**: API must allow frontend origin

## Critical Gotchas
- **React 19**: Using latest features, ensure compatibility when adding libraries
- **Image asset**: Prabhupada photo in [assets/prabhupada.png](../src/assets/prabhupada.png), mirrored horizontally in Layout
- **Audio autoplay**: Wrapped in `.catch()` to handle browser restrictions
