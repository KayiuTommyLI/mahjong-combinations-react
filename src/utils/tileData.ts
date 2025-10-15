export type TileCategory = 'characters' | 'bamboo' | 'dots' | 'honor' | 'flower';

export interface TileDefinition {
  id: string;
  name: string;
  display: string;
  copies: number;
  category: TileCategory;
}

const createSuitTiles = ({
  prefix,
  startCodePoint,
  label,
  copies,
  category,
}: {
  prefix: string;
  startCodePoint: number;
  label: string;
  copies: number;
  category: TileCategory;
}): TileDefinition[] =>
  Array.from({ length: 9 }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    name: `${index + 1} ${label}`,
    display: String.fromCodePoint(startCodePoint + index),
    copies,
    category,
  }));

const characterTiles = createSuitTiles({
  prefix: 'W',
  startCodePoint: 0x1f007,
  label: 'Characters',
  copies: 4,
  category: 'characters',
});

const bambooTiles = createSuitTiles({
  prefix: 'B',
  startCodePoint: 0x1f010,
  label: 'Bamboo',
  copies: 4,
  category: 'bamboo',
});

const dotTiles = createSuitTiles({
  prefix: 'D',
  startCodePoint: 0x1f019,
  label: 'Dots',
  copies: 4,
  category: 'dots',
});

const winds: TileDefinition[] = [
  {
    id: 'WE',
    name: 'East Wind',
    display: String.fromCodePoint(0x1f000),
    copies: 4,
    category: 'honor',
  },
  {
    id: 'WS',
    name: 'South Wind',
    display: String.fromCodePoint(0x1f001),
    copies: 4,
    category: 'honor',
  },
  {
    id: 'WW',
    name: 'West Wind',
    display: String.fromCodePoint(0x1f002),
    copies: 4,
    category: 'honor',
  },
  {
    id: 'WN',
    name: 'North Wind',
    display: String.fromCodePoint(0x1f003),
    copies: 4,
    category: 'honor',
  },
];

const dragons: TileDefinition[] = [
  {
    id: 'DR',
    name: 'Red Dragon',
    display: String.fromCodePoint(0x1f004),
    copies: 4,
    category: 'honor',
  },
  {
    id: 'DG',
    name: 'Green Dragon',
    display: String.fromCodePoint(0x1f005),
    copies: 4,
    category: 'honor',
  },
  {
    id: 'DW',
    name: 'White Dragon',
    display: String.fromCodePoint(0x1f006),
    copies: 4,
    category: 'honor',
  },
];

const flowers: TileDefinition[] = [
  {
    id: 'F1',
    name: 'Plum (Flower 1)',
    display: String.fromCodePoint(0x1f022),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'F2',
    name: 'Orchid (Flower 2)',
    display: String.fromCodePoint(0x1f023),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'F3',
    name: 'Chrysanthemum (Flower 3)',
    display: String.fromCodePoint(0x1f024),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'F4',
    name: 'Bamboo (Flower 4)',
    display: String.fromCodePoint(0x1f025),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'S1',
    name: 'Spring (Season 1)',
    display: String.fromCodePoint(0x1f026),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'S2',
    name: 'Summer (Season 2)',
    display: String.fromCodePoint(0x1f027),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'S3',
    name: 'Autumn (Season 3)',
    display: String.fromCodePoint(0x1f028),
    copies: 1,
    category: 'flower',
  },
  {
    id: 'S4',
    name: 'Winter (Season 4)',
    display: String.fromCodePoint(0x1f029),
    copies: 1,
    category: 'flower',
  },
];

export const tileDefinitions: TileDefinition[] = [
  ...characterTiles,
  ...bambooTiles,
  ...dotTiles,
  ...winds,
  ...dragons,
  ...flowers,
];

export const getTileCombinations = (tiles: any[], combinationSize: number) => {
  const combinations: any[] = [];

  const generateCombinations = (start: number, currentCombination: any[]) => {
    if (currentCombination.length === combinationSize) {
      combinations.push([...currentCombination]);
      return;
    }

    for (let i = start; i < tiles.length; i++) {
      currentCombination.push(tiles[i]);
      generateCombinations(i + 1, currentCombination);
      currentCombination.pop();
    }
  };

  generateCombinations(0, []);
  return combinations;
};
