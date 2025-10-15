export interface HandPattern {
  name: string;
  nameEn?: string;
  description: string;
}

export interface FanCategory {
  fan: number;
  hands: HandPattern[];
}

export const FAN_SCORING_TABLE: FanCategory[] = [
  {
    fan: 88,
    hands: [
      {
        name: '大四喜',
        nameEn: 'Great Four Winds',
        description: 'Four Pungs/Kongs of the four wind tiles',
      },
      {
        name: '大三元',
        nameEn: 'Great Three Dragons',
        description: 'Three Pungs/Kongs of the three dragon tiles',
      },
      {
        name: '綠一色',
        nameEn: 'All Green',
        description: 'Hand composed entirely of green tiles (2,3,4,6,8 Bamboo + Green Dragon)',
      },
      {
        name: '九蓮寶燈',
        nameEn: 'Nine Gates',
        description: 'Concealed hand of 1112345678999 in one suit',
      },
      { name: '四槓', nameEn: 'Four Kongs', description: 'A hand with four Kongs' },
      {
        name: '連七對',
        nameEn: 'Seven Consecutive Pairs',
        description: 'Seven pairs with consecutive numbers in the same suit',
      },
      { name: '天胡', nameEn: 'Heavenly Hand', description: 'Dealer wins with initial 14 tiles' },
      {
        name: '地胡',
        nameEn: 'Earthly Hand',
        description: "Non-dealer wins on dealer's first discard",
      },
      {
        name: '人胡',
        nameEn: 'Humanly Hand',
        description: 'Winning on the first tile drawn before first discard',
      },
    ],
  },
  {
    fan: 64,
    hands: [
      {
        name: '小四喜',
        nameEn: 'Lesser Four Winds',
        description: 'Three Pungs of winds + pair of fourth wind',
      },
      {
        name: '字一色',
        nameEn: 'All Honors',
        description: 'Hand composed entirely of honor tiles (Winds and Dragons)',
      },
      {
        name: '清老頭',
        nameEn: 'All Terminals',
        description: 'Hand composed entirely of terminal tiles (1s and 9s)',
      },
      { name: '四暗刻', nameEn: 'Four Concealed Pungs', description: 'Four self-drawn Pungs' },
    ],
  },
  {
    fan: 48,
    hands: [
      {
        name: '一色四順',
        nameEn: 'Four Identical Chows',
        description: 'Four identical Chows in the same suit',
      },
      {
        name: '一色四節高',
        nameEn: 'Four Sequential Pungs',
        description: 'Four Pungs of the same suit with consecutive numbers',
      },
    ],
  },
  {
    fan: 32,
    hands: [
      {
        name: '一色三節高',
        nameEn: 'Three Sequential Pungs',
        description: 'Three Pungs of the same suit with consecutive numbers',
      },
      { name: '大三風', nameEn: 'Three Great Winds', description: 'Three Pungs of wind tiles' },
    ],
  },
  {
    fan: 24,
    hands: [
      { name: '七對子', nameEn: 'Seven Pairs', description: 'A hand of seven different pairs' },
      { name: '清一色', nameEn: 'Full Flush', description: 'All tiles are from the same suit' },
      { name: '湊一色', nameEn: 'Half Flush', description: 'Tiles from one suit plus honor tiles' },
      {
        name: '地聽',
        nameEn: 'Ready on First Turn',
        description: 'Declaring a ready hand after the first discard',
      },
    ],
  },
  {
    fan: 16,
    hands: [
      {
        name: '三色同順',
        nameEn: 'Mixed Triple Chow',
        description: 'Three Chows of the same number sequence in all three suits',
      },
      {
        name: '三色同刻',
        nameEn: 'Mixed Triple Pung',
        description: 'Three Pungs of the same number in all three suits',
      },
      { name: '三槓', nameEn: 'Three Kongs', description: 'A hand with three Kongs' },
    ],
  },
  {
    fan: 12,
    hands: [
      {
        name: '小三元',
        nameEn: 'Lesser Three Dragons',
        description: 'Two Pungs of dragons and a pair of the third',
      },
      {
        name: '全求人',
        nameEn: 'All Melded Hand',
        description: 'Winning by claiming a discard with all other sets melded',
      },
      {
        name: '海底撈月',
        nameEn: 'Last Tile Win',
        description: 'Winning on the very last tile from the wall',
      },
      {
        name: '槓上開花',
        nameEn: 'Win on Kong Replacement',
        description: 'Winning on the replacement tile after declaring a Kong',
      },
    ],
  },
  {
    fan: 8,
    hands: [
      { name: '碰碰胡', nameEn: 'All Pungs', description: 'Four Pungs/Kongs and a pair' },
      {
        name: '混老頭',
        nameEn: 'All Terminals and Honors',
        description: 'Hand composed only of terminal (1,9) and honor tiles',
      },
    ],
  },
  {
    fan: 6,
    hands: [
      { name: '三暗刻', nameEn: 'Three Concealed Pungs', description: 'Three self-drawn Pungs' },
    ],
  },
  {
    fan: 5,
    hands: [
      {
        name: '門清自摸',
        nameEn: 'Concealed Hand Self-Draw',
        description: 'Winning by self-drawing with a fully concealed hand',
      },
    ],
  },
  {
    fan: 4,
    hands: [
      {
        name: '平胡',
        nameEn: 'Common Hand / All Chows',
        description: 'Four Chows and a non-honor pair',
      },
      { name: '斷么九', nameEn: 'All Simples', description: 'No terminal (1,9) or honor tiles' },
    ],
  },
  {
    fan: 2,
    hands: [
      {
        name: '圈風',
        nameEn: 'Round Wind',
        description: 'A Pung/Kong of the prevailing round wind',
      },
      {
        name: '門風',
        nameEn: 'Seat Wind',
        description: "A Pung/Kong of the player's own seat wind",
      },
      { name: '三元牌', nameEn: 'Dragon Pung', description: 'A Pung/Kong of any dragon tile' },
    ],
  },
  {
    fan: 1,
    hands: [
      {
        name: '自摸',
        nameEn: 'Self-Drawn Win',
        description: 'Winning by drawing the tile yourself (if not concealed)',
      },
      { name: '門清', nameEn: 'Concealed Hand', description: 'A concealed hand won by a discard' },
      { name: '獨聽', nameEn: 'Single Wait', description: 'Waiting for only one specific tile' },
      {
        name: '邊張',
        nameEn: 'Edge Wait',
        description: 'Waiting on a 3 for 1-2 or 7 for 8-9 Chow',
      },
      {
        name: '嵌張',
        nameEn: 'Middle Wait',
        description: 'Waiting on the middle tile of a Chow (e.g., 5 for 4-6)',
      },
      {
        name: '單吊',
        nameEn: 'Pair Wait',
        description: 'Waiting for a single tile to complete a pair',
      },
    ],
  },
];
