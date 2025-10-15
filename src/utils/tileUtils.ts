import { tileDefinitions, TileCategory } from './tileData';

export const HAND_SIZE = 17;

export interface TileInstance {
  uid: string;
  id: string;
  name: string;
  display: string;
  category: TileCategory;
}

export interface TileSummary {
  id: string;
  name: string;
  display: string;
  category: TileCategory;
  count: number;
}

const CATEGORY_ORDER: TileCategory[] = ['characters', 'bamboo', 'dots', 'honor', 'flower'];

export const buildDeck = (includeFlowers: boolean = true): TileInstance[] => {
  const definitions = includeFlowers
    ? tileDefinitions
    : tileDefinitions.filter(tile => tile.category !== 'flower');

  const deck: TileInstance[] = [];
  definitions.forEach(tile => {
    for (let copy = 0; copy < tile.copies; copy += 1) {
      deck.push({
        uid: `${tile.id}-${copy + 1}`,
        id: tile.id,
        name: tile.name,
        display: tile.display,
        category: tile.category,
      });
    }
  });
  return deck;
};

export const shuffle = <T>(source: T[]): T[] => {
  const array = [...source];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
};

export const drawTiles = (
  count: number = HAND_SIZE,
  includeFlowers: boolean = true
): TileInstance[] => {
  const deck = buildDeck(includeFlowers);
  if (count > deck.length) {
    throw new Error('Not enough tiles available to generate the requested combination.');
  }
  const shuffled = shuffle(deck);
  return shuffled.slice(0, count);
};

const parseTileValue = (tileId: string): number => {
  const match = tileId.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export const summarizeTiles = (tiles: TileInstance[]): TileSummary[] => {
  const grouped = new Map<string, TileSummary>();

  tiles.forEach(tile => {
    if (!grouped.has(tile.id)) {
      grouped.set(tile.id, {
        id: tile.id,
        name: tile.name,
        display: tile.display,
        category: tile.category,
        count: 0,
      });
    }
    const entry = grouped.get(tile.id);
    if (entry) {
      entry.count += 1;
    }
  });

  return Array.from(grouped.values()).sort((a, b) => {
    const categoryDifference =
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (categoryDifference !== 0) {
      return categoryDifference;
    }

    const valueDifference = parseTileValue(a.id) - parseTileValue(b.id);
    if (valueDifference !== 0) {
      return valueDifference;
    }

    return a.name.localeCompare(b.name);
  });
};
