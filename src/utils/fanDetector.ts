import { TileInstance } from './tileUtils';

export interface DetectedPattern {
  name: string;
  nameEn?: string;
  fan: number;
  description: string;
}

// Helper function to group tiles by ID
const groupTilesById = (tiles: TileInstance[]): Map<string, number> => {
  const grouped = new Map<string, number>();
  tiles.forEach(tile => {
    grouped.set(tile.id, (grouped.get(tile.id) || 0) + 1);
  });
  return grouped;
};

// Helper function to check if tiles are all from the same suit
const isOneSuit = (tiles: TileInstance[]): boolean => {
  const suits = new Set(
    tiles.filter(t => t.category !== 'honor' && t.category !== 'flower').map(t => t.category)
  );
  return suits.size === 1 && suits.size > 0;
};

// Helper function to detect pairs
const detectPairs = (grouped: Map<string, number>): string[] => {
  const pairs: string[] = [];
  grouped.forEach((count, id) => {
    if (count >= 2) {
      pairs.push(id);
    }
  });
  return pairs;
};

// Helper function to detect pungs (3 of a kind)
const detectPungs = (grouped: Map<string, number>): string[] => {
  const pungs: string[] = [];
  grouped.forEach((count, id) => {
    if (count >= 3) {
      pungs.push(id);
    }
  });
  return pungs;
};

// Helper function to detect kongs (4 of a kind)
const detectKongs = (grouped: Map<string, number>): string[] => {
  const kongs: string[] = [];
  grouped.forEach((count, id) => {
    if (count === 4) {
      kongs.push(id);
    }
  });
  return kongs;
};

// Check for Seven Pairs (七對子)
const checkSevenPairs = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  if (nonFlowerTiles.length !== 14) return null;

  const grouped = groupTilesById(nonFlowerTiles);
  const pairs = detectPairs(grouped);

  if (pairs.length === 7 && Array.from(grouped.values()).every(count => count === 2)) {
    return {
      name: '七對子',
      nameEn: 'Seven Pairs',
      fan: 24,
      description: 'A hand of seven different pairs',
    };
  }

  return null;
};

// Check for All Pungs (碰碰胡)
const checkAllPungs = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  if (nonFlowerTiles.length < 14) return null;

  const grouped = groupTilesById(nonFlowerTiles);
  const pungs = detectPungs(grouped);

  if (pungs.length >= 4) {
    return {
      name: '碰碰胡',
      nameEn: 'All Pungs',
      fan: 8,
      description: 'Four Pungs/Kongs and a pair',
    };
  }

  return null;
};

// Check for Full Flush (清一色)
const checkFullFlush = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  const nonHonorTiles = nonFlowerTiles.filter(t => t.category !== 'honor');

  if (
    nonHonorTiles.length === nonFlowerTiles.length &&
    nonFlowerTiles.length >= 14 &&
    isOneSuit(nonFlowerTiles)
  ) {
    return {
      name: '清一色',
      nameEn: 'Full Flush',
      fan: 24,
      description: 'All tiles are from the same suit',
    };
  }

  return null;
};

// Check for Half Flush (湊一色)
const checkHalfFlush = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  const nonHonorTiles = nonFlowerTiles.filter(t => t.category !== 'honor');
  const honorTiles = nonFlowerTiles.filter(t => t.category === 'honor');

  if (honorTiles.length > 0 && nonHonorTiles.length > 0 && isOneSuit(nonHonorTiles)) {
    return {
      name: '湊一色',
      nameEn: 'Half Flush',
      fan: 24,
      description: 'Tiles from one suit plus honor tiles',
    };
  }

  return null;
};

// Check for All Simples (斷么九)
const checkAllSimples = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  if (nonFlowerTiles.length < 14) return null;

  const hasTerminalOrHonor = nonFlowerTiles.some(t => {
    if (t.category === 'honor') return true;
    const match = t.id.match(/\d+/);
    if (!match) return true;
    const num = Number(match[0]);
    return num === 1 || num === 9;
  });

  if (!hasTerminalOrHonor) {
    return {
      name: '斷么九',
      nameEn: 'All Simples',
      fan: 4,
      description: 'No terminal (1,9) or honor tiles',
    };
  }

  return null;
};

// Check for All Honors (字一色)
const checkAllHonors = (tiles: TileInstance[]): DetectedPattern | null => {
  const nonFlowerTiles = tiles.filter(t => t.category !== 'flower');
  if (nonFlowerTiles.length < 14) return null;

  const allHonors = nonFlowerTiles.every(t => t.category === 'honor');

  if (allHonors) {
    return {
      name: '字一色',
      nameEn: 'All Honors',
      fan: 64,
      description: 'Hand composed entirely of honor tiles (Winds and Dragons)',
    };
  }

  return null;
};

// Check for Dragon Pungs (三元牌)
const checkDragonPung = (tiles: TileInstance[]): DetectedPattern[] => {
  const grouped = groupTilesById(tiles);
  const patterns: DetectedPattern[] = [];

  const dragons = [
    { id: 'DR', name: '紅中', nameEn: 'Red Dragon' },
    { id: 'DG', name: '青發', nameEn: 'Green Dragon' },
    { id: 'DW', name: '白板', nameEn: 'White Dragon' },
  ];

  dragons.forEach(dragon => {
    if ((grouped.get(dragon.id) || 0) >= 3) {
      patterns.push({
        name: `${dragon.name}`,
        nameEn: dragon.nameEn,
        fan: 2,
        description: `A Pung/Kong of ${dragon.nameEn}`,
      });
    }
  });

  return patterns;
};

// Check for Wind Pungs (圈風/門風)
const checkWindPung = (tiles: TileInstance[]): DetectedPattern[] => {
  const grouped = groupTilesById(tiles);
  const patterns: DetectedPattern[] = [];

  const winds = [
    { id: 'WE', name: '東風', nameEn: 'East Wind' },
    { id: 'WS', name: '南風', nameEn: 'South Wind' },
    { id: 'WW', name: '西風', nameEn: 'West Wind' },
    { id: 'WN', name: '北風', nameEn: 'North Wind' },
  ];

  winds.forEach(wind => {
    if ((grouped.get(wind.id) || 0) >= 3) {
      patterns.push({
        name: `${wind.name}`,
        nameEn: wind.nameEn,
        fan: 2,
        description: `A Pung/Kong of ${wind.nameEn}`,
      });
    }
  });

  return patterns;
};

// Check for Three/Four Kongs
const checkKongs = (tiles: TileInstance[]): DetectedPattern | null => {
  const grouped = groupTilesById(tiles);
  const kongs = detectKongs(grouped);

  if (kongs.length === 4) {
    return {
      name: '四槓',
      nameEn: 'Four Kongs',
      fan: 88,
      description: 'A hand with four Kongs',
    };
  }

  if (kongs.length === 3) {
    return {
      name: '三槓',
      nameEn: 'Three Kongs',
      fan: 16,
      description: 'A hand with three Kongs',
    };
  }

  return null;
};

// Main detection function
export const detectFanPatterns = (tiles: TileInstance[]): DetectedPattern[] => {
  const patterns: DetectedPattern[] = [];

  // Check single-result patterns
  const singleChecks = [
    checkAllHonors,
    checkKongs,
    checkSevenPairs,
    checkFullFlush,
    checkHalfFlush,
    checkAllPungs,
    checkAllSimples,
  ];

  singleChecks.forEach(check => {
    try {
      const result = check(tiles);
      if (result) {
        patterns.push(result);
      }
    } catch (error) {
      console.error('Error checking pattern:', error);
    }
  });

  // Check multi-result patterns (can have multiple dragon/wind pungs)
  try {
    const dragonPatterns = checkDragonPung(tiles);
    patterns.push(...dragonPatterns);
  } catch (error) {
    console.error('Error checking dragon patterns:', error);
  }

  try {
    const windPatterns = checkWindPung(tiles);
    patterns.push(...windPatterns);
  } catch (error) {
    console.error('Error checking wind patterns:', error);
  }

  return patterns;
};

// Calculate total Fan from detected patterns (SUM instead of MAX)
export const calculateTotalFan = (patterns: DetectedPattern[]): number => {
  if (patterns.length === 0) return 0;

  // Sum all fan values
  const totalFan = patterns.reduce((sum, pattern) => sum + pattern.fan, 0);
  return totalFan;
};
