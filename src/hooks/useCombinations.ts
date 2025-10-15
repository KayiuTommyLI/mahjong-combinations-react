import { useCallback, useState } from 'react';
import { summarizeTiles, TileInstance, TileSummary } from '../utils/tileUtils';
import { detectFanPatterns, DetectedPattern, calculateTotalFan } from '../utils/fanDetector';
import { generatePatternBasedHand } from '../utils/patternGenerator';

export interface Combination {
  id: string;
  tiles: TileInstance[];
  summary: TileSummary[];
  fan: number | '';
  detectedPatterns: DetectedPattern[];
  suggestedFan: number;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
}

const createCombinationId = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const useCombinations = () => {
  const [combinations, setCombinations] = useState<Combination[]>([]);

  const addCombination = useCallback((tiles: TileInstance[]) => {
    console.log('🎯 addCombination called with tiles:', tiles.length);
    console.log('Tiles:', tiles.map(t => `${t.display}(${t.name})`).join(', '));

    const detectedPatterns = detectFanPatterns(tiles);
    const suggestedFan = calculateTotalFan(detectedPatterns);

    console.log('Detected patterns:', detectedPatterns);
    console.log('Suggested Fan:', suggestedFan);

    setCombinations(previous => [
      {
        id: createCombinationId(),
        tiles,
        summary: summarizeTiles(tiles),
        fan: '',
        detectedPatterns,
        suggestedFan,
        isAnswerChecked: false,
        isCorrect: null,
      },
      ...previous,
    ]);
  }, []);

  const createRandomCombination = useCallback(
    async (includeFlowers: boolean, minFan: number = 0, maxFan: number = 88) => {
      console.log('🎲 createRandomCombination called');
      console.log('Parameters:', { includeFlowers, minFan, maxFan });

      return new Promise<void>(resolve => {
        let tiles: TileInstance[];
        let attempts = 0;
        const maxAttempts = 100;

        // Always use pattern-based generation to ensure valid hands
        console.log('Using pattern-based generation');

        do {
          tiles = generatePatternBasedHand(includeFlowers, minFan, maxFan);
          const patterns = detectFanPatterns(tiles);
          const totalFan = calculateTotalFan(patterns);

          console.log(
            `Attempt ${attempts + 1}: Generated ${totalFan} Fan (target: ${minFan}-${maxFan})`
          );

          // Check if the generated hand matches the Fan range
          if (totalFan >= minFan && totalFan <= maxFan) {
            console.log('✅ Found valid hand!');
            break;
          }

          attempts++;

          if (attempts === maxAttempts) {
            console.warn(`Using hand with ${totalFan} Fan after ${maxAttempts} attempts`);
            break;
          }
        } while (attempts < maxAttempts);

        console.log('Final tiles before adding:', tiles);
        addCombination(tiles);
        resolve();
      });
    },
    [addCombination]
  );

  const updateFanValue = useCallback((id: string, fanValue: number | '') => {
    setCombinations(previous =>
      previous.map(combo =>
        combo.id === id
          ? {
              ...combo,
              fan: fanValue,
              isAnswerChecked: false,
              isCorrect: null,
            }
          : combo
      )
    );
  }, []);

  const checkAnswer = useCallback((id: string) => {
    setCombinations(previous =>
      previous.map(combo => {
        if (combo.id === id) {
          const userAnswer = typeof combo.fan === 'number' ? combo.fan : 0;
          const isCorrect = userAnswer === combo.suggestedFan;
          console.log('Checking answer:', {
            userAnswer,
            suggestedFan: combo.suggestedFan,
            isCorrect,
          });
          return {
            ...combo,
            isAnswerChecked: true,
            isCorrect,
          };
        }
        return combo;
      })
    );
  }, []);

  const removeCombination = useCallback((id: string) => {
    setCombinations(previous => previous.filter(combo => combo.id !== id));
  }, []);

  const clearCombinations = useCallback(() => {
    setCombinations([]);
  }, []);

  return {
    combinations,
    createRandomCombination,
    updateFanValue,
    checkAnswer,
    removeCombination,
    clearCombinations,
  };
};

export default useCombinations;
