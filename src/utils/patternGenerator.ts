import { TileInstance } from './tileUtils';
import { tileDefinitions } from './tileData';

// Debug flag
const DEBUG = false;
const log = (...args: any[]) => DEBUG && console.log(...args);

// Suit definitions matching tileData.ts
const SUITS = [
  { name: 'character', prefix: 'W', category: 'character' as const },
  { name: 'bamboo', prefix: 'B', category: 'bamboo' as const },
  { name: 'dot', prefix: 'D', category: 'dot' as const },
];

const HONOR_IDS = ['WE', 'WS', 'WW', 'WN', 'DR', 'DG', 'DW'];

// Helper to get tile instances
const getTileInstances = (
  tileId: string,
  count: number,
  usedInstances: Map<string, number>
): TileInstance[] => {
  const tileDef = tileDefinitions.find(t => t.id === tileId);
  if (!tileDef) {
    log(`Tile not found: ${tileId}`);
    return [];
  }

  const currentUsage = usedInstances.get(tileId) || 0;
  const availableCopies = tileDef.copies - currentUsage;

  if (availableCopies < count) {
    log(`Not enough copies of ${tileId}: need ${count}, have ${availableCopies}`);
    return [];
  }

  const instances: TileInstance[] = [];
  for (let i = 0; i < count; i++) {
    const instanceNum = currentUsage + i + 1;
    instances.push({
      uid: `${tileId}-${instanceNum}`,
      id: tileId,
      name: tileDef.name,
      display: tileDef.display,
      category: tileDef.category,
    });
  }

  usedInstances.set(tileId, currentUsage + count);
  log(`Created ${count}x ${tileDef.name}`);
  return instances;
};

// Shuffle helper
const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Helper to find unused number
const findUnusedNumber = (
  usedNumbers: Set<number>,
  min: number,
  max: number,
  maxAttempts = 20
): number | null => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!usedNumbers.has(num)) return num;
  }
  return null;
};

// Helper to find unused sequence
const findUnusedSequence = (usedNumbers: Set<number>, maxAttempts = 20): number | null => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const startNum = Math.floor(Math.random() * 7) + 1;
    if (![startNum, startNum + 1, startNum + 2].some(n => usedNumbers.has(n))) {
      return startNum;
    }
  }
  return null;
};

// Create sets
const createPung = (tileId: string, used: Map<string, number>) => getTileInstances(tileId, 3, used);
const createPair = (tileId: string, used: Map<string, number>) => getTileInstances(tileId, 2, used);
const createKong = (tileId: string, used: Map<string, number>) => getTileInstances(tileId, 4, used);

const createChow = (suit: string, startNum: number, used: Map<string, number>): TileInstance[] => {
  const tiles: TileInstance[] = [];
  for (let i = 0; i < 3; i++) {
    const tile = getTileInstances(`${suit}${startNum + i}`, 1, used);
    if (tile.length === 0) return [];
    tiles.push(...tile);
  }
  return tiles;
};

// All Honors (字一色) - 64 Fan
const generateAllHonors = (): TileInstance[] => {
  log('=== Generating All Honors ===');

  for (let attempts = 0; attempts < 100; attempts++) {
    const used = new Map<string, number>();
    const shuffledHonors = shuffle([...HONOR_IDS]);
    const hand: TileInstance[] = [];
    let numKongs = 0;

    try {
      // 5 sets (pung or kong)
      for (let i = 0; i < 5; i++) {
        const isKong = Math.random() > 0.7;
        const tiles = isKong
          ? createKong(shuffledHonors[i], used)
          : createPung(shuffledHonors[i], used);

        if (tiles.length !== (isKong ? 4 : 3)) throw new Error();
        hand.push(...tiles);
        if (isKong) numKongs++;
      }

      // 1 pair
      const pair = createPair(shuffledHonors[5], used);
      if (pair.length !== 2) throw new Error();
      hand.push(...pair);

      if (hand.length === 17 + numKongs) {
        log(`✅ Created hand: ${hand.length} tiles, ${numKongs} kongs`);
        return shuffle(hand);
      }
    } catch {}
  }

  throw new Error('Failed to generate All Honors');
};

// Seven Pairs (七對子) - 24 Fan
const generateSevenPairs = (): TileInstance[] => {
  log('=== Generating Seven Pairs ===');
  const allNonFlower = tileDefinitions.filter(t => t.category !== 'flower');

  for (let attempts = 0; attempts < 100; attempts++) {
    const used = new Map<string, number>();
    const shuffled = shuffle(allNonFlower.map(t => t.id)).slice(0, 9);
    const hand: TileInstance[] = [];

    try {
      // 8 pairs (16 tiles)
      for (let i = 0; i < 8; i++) {
        const pair = createPair(shuffled[i], used);
        if (pair.length !== 2) throw new Error();
        hand.push(...pair);
      }

      // 1 single tile (17 total)
      const single = getTileInstances(shuffled[8], 1, used);
      if (single.length !== 1) throw new Error();
      hand.push(...single);

      if (hand.length === 17) {
        log(`✅ Created hand: ${hand.length} tiles`);
        return shuffle(hand);
      }
    } catch {}
  }

  throw new Error('Failed to generate Seven Pairs');
};

// Full Flush (清一色) - 24 Fan
const generateFullFlush = (): TileInstance[] => {
  log('=== Generating Full Flush ===');

  for (let attempts = 0; attempts < 100; attempts++) {
    const used = new Map<string, number>();
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const usedNumbers = new Set<number>();
    const hand: TileInstance[] = [];
    let numKongs = 0;

    try {
      // 5 sets
      for (let i = 0; i < 5; i++) {
        const type = Math.random();

        if (type > 0.7) {
          // Kong
          const num = findUnusedNumber(usedNumbers, 1, 9);
          if (!num) throw new Error();
          usedNumbers.add(num);

          const tiles = createKong(`${suit.prefix}${num}`, used);
          if (tiles.length !== 4) throw new Error();
          hand.push(...tiles);
          numKongs++;
        } else if (type > 0.35) {
          // Pung
          const num = findUnusedNumber(usedNumbers, 1, 9);
          if (!num) throw new Error();
          usedNumbers.add(num);

          const tiles = createPung(`${suit.prefix}${num}`, used);
          if (tiles.length !== 3) throw new Error();
          hand.push(...tiles);
        } else {
          // Chow
          const start = findUnusedSequence(usedNumbers);
          if (!start) throw new Error();
          usedNumbers.add(start);
          usedNumbers.add(start + 1);
          usedNumbers.add(start + 2);

          const tiles = createChow(suit.prefix, start, used);
          if (tiles.length !== 3) throw new Error();
          hand.push(...tiles);
        }
      }

      // 1 pair
      const pairNum = findUnusedNumber(usedNumbers, 1, 9);
      if (!pairNum) throw new Error();

      const pair = createPair(`${suit.prefix}${pairNum}`, used);
      if (pair.length !== 2) throw new Error();
      hand.push(...pair);

      if (hand.length === 17 + numKongs) {
        log(`✅ Created hand: ${hand.length} tiles, ${numKongs} kongs`);
        return shuffle(hand);
      }
    } catch {}
  }

  throw new Error('Failed to generate Full Flush');
};

// Half Flush (湊一色) - 24 Fan
const generateHalfFlush = (): TileInstance[] => {
  log('=== Generating Half Flush ===');

  for (let attempts = 0; attempts < 100; attempts++) {
    const used = new Map<string, number>();
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const usedHonors = new Set<string>();
    const usedNumbers = new Set<number>();
    const hand: TileInstance[] = [];
    let numKongs = 0;

    try {
      // 1-2 honor sets
      const numHonorSets = Math.random() > 0.5 ? 2 : 1;
      const shuffledHonors = shuffle([...HONOR_IDS]);

      for (let i = 0; i < numHonorSets; i++) {
        const honorId = shuffledHonors[i];
        usedHonors.add(honorId);

        const isKong = Math.random() > 0.7;
        const tiles = isKong ? createKong(honorId, used) : createPung(honorId, used);

        if (tiles.length !== (isKong ? 4 : 3)) throw new Error();
        hand.push(...tiles);
        if (isKong) numKongs++;
      }

      // Remaining suit sets
      const numSuitSets = 5 - numHonorSets;

      for (let i = 0; i < numSuitSets; i++) {
        const type = Math.random();

        if (type > 0.7) {
          // Kong
          const num = findUnusedNumber(usedNumbers, 1, 9);
          if (!num) throw new Error();
          usedNumbers.add(num);

          const tiles = createKong(`${suit.prefix}${num}`, used);
          if (tiles.length !== 4) throw new Error();
          hand.push(...tiles);
          numKongs++;
        } else if (type > 0.35) {
          // Pung
          const num = findUnusedNumber(usedNumbers, 1, 9);
          if (!num) throw new Error();
          usedNumbers.add(num);

          const tiles = createPung(`${suit.prefix}${num}`, used);
          if (tiles.length !== 3) throw new Error();
          hand.push(...tiles);
        } else {
          // Chow
          const start = findUnusedSequence(usedNumbers);
          if (!start) throw new Error();
          usedNumbers.add(start);
          usedNumbers.add(start + 1);
          usedNumbers.add(start + 2);

          const tiles = createChow(suit.prefix, start, used);
          if (tiles.length !== 3) throw new Error();
          hand.push(...tiles);
        }
      }

      // 1 pair (honor or suit)
      if (Math.random() > 0.5 && usedHonors.size < HONOR_IDS.length) {
        const unusedHonor = HONOR_IDS.find(id => !usedHonors.has(id))!;
        const pair = createPair(unusedHonor, used);
        if (pair.length !== 2) throw new Error();
        hand.push(...pair);
      } else {
        const pairNum = findUnusedNumber(usedNumbers, 1, 9);
        if (!pairNum) throw new Error();

        const pair = createPair(`${suit.prefix}${pairNum}`, used);
        if (pair.length !== 2) throw new Error();
        hand.push(...pair);
      }

      if (hand.length === 17 + numKongs) {
        log(`✅ Created hand: ${hand.length} tiles, ${numKongs} kongs`);
        return shuffle(hand);
      }
    } catch {}
  }

  throw new Error('Failed to generate Half Flush');
};

// All Pungs (碰碰胡) - 8 Fan
const generateAllPungs = (): TileInstance[] => {
  log('=== Generating All Pungs ===');
  const allNonFlower = tileDefinitions.filter(t => t.category !== 'flower');

  for (let attempts = 0; attempts < 100; attempts++) {
    const used = new Map<string, number>();
    const shuffled = shuffle(allNonFlower.map(t => t.id)).slice(0, 6);
    const hand: TileInstance[] = [];
    let numKongs = 0;

    try {
      // 5 pungs/kongs
      for (let i = 0; i < 5; i++) {
        const isKong = Math.random() > 0.7;
        const tiles = isKong ? createKong(shuffled[i], used) : createPung(shuffled[i], used);

        if (tiles.length !== (isKong ? 4 : 3)) throw new Error();
        hand.push(...tiles);
        if (isKong) numKongs++;
      }

      // 1 pair
      const pair = createPair(shuffled[5], used);
      if (pair.length !== 2) throw new Error();
      hand.push(...pair);

      if (hand.length === 17 + numKongs) {
        log(`✅ Created hand: ${hand.length} tiles, ${numKongs} kongs`);
        return shuffle(hand);
      }
    } catch {}
  }

  throw new Error('Failed to generate All Pungs');
};

// Main generator
export const generatePatternBasedHand = (
  includeFlowers: boolean,
  minFan: number,
  maxFan: number
): TileInstance[] => {
  log(`🎲 Generating hand: ${minFan}-${maxFan} Fan`);

  const generators = [
    { fn: generateAllHonors, fan: 64 },
    { fn: generateFullFlush, fan: 24 },
    { fn: generateHalfFlush, fan: 24 },
    { fn: generateSevenPairs, fan: 24 },
    { fn: generateAllPungs, fan: 8 },
  ];

  const valid = generators.filter(g => g.fan >= minFan && g.fan <= maxFan);

  if (valid.length === 0) {
    const closest = generators.reduce((prev, curr) =>
      Math.abs(curr.fan - minFan) < Math.abs(prev.fan - minFan) ? curr : prev
    );
    log(`No exact match, using ${closest.fan} Fan`);
    return closest.fn();
  }

  const selected = valid[Math.floor(Math.random() * valid.length)];
  log(`Selected: ${selected.fan} Fan`);
  return selected.fn();
};
