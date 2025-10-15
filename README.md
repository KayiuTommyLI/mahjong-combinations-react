# 🀄 Taiwan Mahjong Pattern Generator & Quiz

A React-based educational tool for learning Taiwan Mahjong (台灣麻將) scoring patterns and fan calculations. Generate random hands with specific patterns, identify winning combinations, and test your knowledge of fan scoring rules.

---

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Scoring Patterns](#scoring-patterns)
- [Project Structure](#project-structure)
- [Development](#development)
- [Scripts](#scripts)
- [Technical Details](#technical-details)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎲 **Pattern-Based Hand Generation**
- Generates valid Taiwan Mahjong hands based on specific scoring patterns
- Supports multiple high-value patterns:
  - **All Honors (字一色)** - 64 Fan
  - **Full Flush (清一色)** - 24 Fan
  - **Half Flush (湊一色)** - 24 Fan
  - **Seven Pairs (七對子)** - 24 Fan
  - **All Pungs (碰碰胡)** - 8 Fan

### 🧠 **Interactive Quiz Mode**
- Test your pattern recognition skills
- Get instant feedback on correct/incorrect answers
- Learn fan calculation through practice

### 🎯 **Accurate Tile Management**
- Respects the 4-copy limit for each tile (except flowers: 1 each)
- Handles Kong (槓) correctly: **17 + number of Kongs = total tiles**
- Unique tile instance tracking prevents duplicates

### 🎨 **Clean UI**
- Visual tile display using Unicode Mahjong symbols (🀇🀈🀉...)
- Color-coded tile categories (Characters, Bamboo, Dots, Honors)
- Responsive design for desktop and mobile

---

## 🎮 Demo

### Example Generated Hand (Full Flush - 清一色)

```
🀙 🀙 🀙  🀛 🀛 🀛  🀜 🀜 🀜 🀜  🀞 🀞 🀞  🀟 🀟
```

**Pattern:** Full Flush (清一色) - All tiles from Dots suit  
**Composition:**
- 1-Dot Pung (3 tiles)
- 3-Dot Pung (3 tiles)
- 4-Dot Kong (4 tiles) ← Kong adds +1 tile
- 6-Dot Pung (3 tiles)
- 7-Dot Pair (2 tiles)

**Total:** 15 tiles (5 sets) + 2 (pair) + 1 (Kong bonus) = **18 tiles**

---

## 📦 Installation

### Prerequisites
- **Node.js** 16+ and npm/yarn
- Modern browser with ES2017+ support

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/KayiuTommyLI/mahjong-combinations-react.git
cd mahjong-combinations-react

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

---

## 🎯 Usage

### Basic Workflow

1. **Generate Hand**  
   Click "Generate New Combination" to create a random hand

2. **Analyze the Hand**  
   Study the tiles and identify the pattern

3. **Check Detected Patterns**  
   View automatically detected fan patterns below the hand

4. **Quiz Mode** (Coming Soon)  
   Select the correct pattern from multiple choices

### Understanding Tile Counts

Taiwan Mahjong hands follow this formula:

```
Base Hand: 17 tiles (5 sets of 3 + 1 pair)
+ Each Kong adds +1 tile

Examples:
- 0 Kongs: 17 tiles
- 1 Kong:  18 tiles (17 + 1)
- 2 Kongs: 19 tiles (17 + 2)
- 3 Kongs: 20 tiles (17 + 3)
```

**Why?** When you declare a Kong (4 identical tiles), you draw a replacement tile, extending your hand by 1.

---

## 🏆 Scoring Patterns

### High-Value Patterns (Currently Supported)

| Pattern | Chinese | Fan | Description |
|---------|---------|-----|-------------|
| All Honors | 字一色 | 64 | All tiles are Winds/Dragons |
| Full Flush | 清一色 | 24 | All tiles from one suit (no honors) |
| Half Flush | 湊一色 | 24 | One suit + honors mixed |
| Seven Pairs | 七對子 | 24 | Seven different pairs + 1 extra tile |
| All Pungs | 碰碰胡 | 8 | All sets are Pungs/Kongs (no Chows) |

### Pattern Detection

The app automatically detects these patterns using `fanDetector.ts`:

```typescript
// Example detection
const patterns = detectFanPatterns(tiles);
// Returns: [{ name: "Full Flush", fan: 24, ... }]
```

---

## 📁 Project Structure

```
mahjong-combinations-react/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── CombinationList.tsx # Main hand display
│   │   └── TileSelector.tsx    # (Future) Manual tile selection
│   ├── hooks/
│   │   └── useCombinations.ts  # Hand generation logic
│   ├── utils/
│   │   ├── tileData.ts         # Tile definitions (144 tiles)
│   │   ├── tileUtils.ts        # Tile instance management
│   │   ├── patternGenerator.ts # Pattern-based hand generator ⭐
│   │   ├── fanDetector.ts      # Pattern recognition
│   │   └── fanScoringTable.ts  # Scoring rules
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # React entry point
│   └── styles.css              # Global styles
├── .prettierrc                 # Code formatting rules
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

### Key Files Explained

#### `tileData.ts`
Defines all 144 tiles in the set:
- 36 Characters (萬) `W1-W9` × 4 copies
- 36 Bamboo (條) `B1-B9` × 4 copies
- 36 Dots (筒) `D1-D9` × 4 copies
- 16 Winds (風) `WE/WS/WW/WN` × 4 copies
- 12 Dragons (箭牌) `DR/DG/DW` × 4 copies
- 8 Flowers (花牌) `F1-F8` × 1 copy each

#### `patternGenerator.ts` ⭐
**Core algorithm** that generates valid hands:

```typescript
export const generatePatternBasedHand = (
  includeFlowers: boolean,
  minFan: number,
  maxFan: number
): TileInstance[] => {
  // Selects a pattern matching the fan range
  // Returns 17-20 tiles depending on Kongs
}
```

**Key Features:**
- **No shared state** - Each generation uses isolated `Map<string, number>`
- **Retry logic** - Attempts up to 100 times to build valid hands
- **Helper functions** - `findUnusedNumber`, `findUnusedSequence` for cleaner code
- **Debug mode** - Set `DEBUG = true` for verbose logging

#### `fanDetector.ts`
Analyzes a hand and returns detected patterns:

```typescript
export const detectFanPatterns = (
  tiles: TileInstance[]
): DetectedPattern[] => {
  // Checks for All Honors, Full Flush, etc.
  // Returns array of { name, fan, description }
}
```

---

## 🛠️ Development

### Running Locally

```bash
# Development server (hot reload)
npm start

# Production build
npm run build

# Run tests
npm test
```

### Code Quality

```bash
# Lint TypeScript/React code
npm run lint

# Auto-format code with Prettier
npm run format
```

**Linting Rules:**
- Extends `react-app` and `react-app/jest` configs
- Enforces TypeScript strict mode
- Requires explicit types for function parameters

**Formatting Rules (`.prettierrc`):**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Adding New Patterns

1. **Define the pattern** in `fanScoringTable.ts`:
```typescript
{ 
  id: 'new-pattern',
  name: 'New Pattern',
  fan: 16,
  description: 'Pattern rules...'
}
```

2. **Add generator** in `patternGenerator.ts`:
```typescript
const generateNewPattern = (): TileInstance[] => {
  const used = new Map<string, number>();
  // ... build hand logic
  return shuffle(hand);
};
```

3. **Add detector** in `fanDetector.ts`:
```typescript
if (/* detection logic */) {
  patterns.push({ name: 'New Pattern', fan: 16 });
}
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Create production bundle in `build/` |
| `npm test` | Run Jest tests in watch mode |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Auto-format with Prettier |
| `npm run eject` | Eject from Create React App (⚠️ irreversible) |

---

## 🔧 Technical Details

### Technology Stack

- **React 18.2** - UI framework with hooks
- **TypeScript 4.9** - Type-safe JavaScript
- **Create React App 5.0** - Zero-config build setup
- **ESLint + Prettier** - Code quality tools

### TypeScript Configuration

```json
{
  "target": "ES2017",        // Modern JS features (Map, Set, async/await)
  "strict": true,            // Strict type checking
  "jsx": "react-jsx",        // New JSX transform
  "moduleResolution": "node" // Node-style imports
}
```

### Browser Support

**Production:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- No Internet Explorer

**Development:**
- Latest Chrome/Firefox/Safari

### Performance Optimizations

- **Retry Logic:** Max 100 attempts per hand generation
- **Early Exit:** Throws error if impossible to generate
- **Memoization:** (Future) Cache tile summaries in `useCombinations`

---

## 🐛 Known Issues & Limitations

1. **Pattern Coverage**  
   Currently supports only 5 patterns. Full Taiwan Mahjong has 80+ patterns.

2. **No Manual Tile Selection**  
   Users cannot build custom hands yet (planned feature).

3. **No Multiplayer**  
   Single-player quiz mode only.

4. **Flower Tiles**  
   Not yet integrated into pattern generation (`includeFlowers` parameter unused).

5. **Performance**  
   Very rare patterns (e.g., All Kongs) may fail to generate after 100 attempts.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS details

### Suggesting Features

- Check existing issues first
- Describe use case clearly
- Reference Taiwan Mahjong rules if applicable

### Pull Requests

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-pattern`
3. Make changes and format: `npm run format`
4. Test thoroughly: `npm test`
5. Commit with clear message: `git commit -m "Add All Kongs pattern"`
6. Push and open PR

**Coding Standards:**
- Follow existing code style (Prettier will auto-format)
- Add TypeScript types for all functions
- Write JSDoc comments for complex logic
- Update README if adding user-facing features

---

## 📚 Resources

### Taiwan Mahjong Rules
- [Wikipedia: Taiwanese Mahjong](https://en.wikipedia.org/wiki/Taiwanese_Mahjong)
- [台灣麻將計分規則 (Chinese)](https://zh.wikipedia.org/wiki/台灣麻將)

### Scoring References
- See `ref/Taiwan_Mahjong_Scoring.ipynb` for detailed fan calculations
- Full scoring table in `src/utils/fanScoringTable.ts`

### Unicode Mahjong Tiles
- [Unicode Block: Mahjong Tiles (U+1F000–U+1F02F)](https://unicode.org/charts/PDF/U1F000.pdf)

---

## 📄 License

This project is licensed under the **MIT License**.

See [LICENSE](LICENSE) file for full text.

---

## 👏 Acknowledgments

- **Unicode Consortium** for Mahjong tile symbols
- **React Team** for amazing developer experience
- **Taiwan Mahjong Community** for rule clarifications

---

---

**⭐ Star this repo if you find it useful!**

**🀄 Happy Mahjong Learning! 🀄**