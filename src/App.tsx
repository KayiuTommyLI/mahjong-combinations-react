import React, { useState } from 'react';
import './App.css';
import TileSelector from './components/TileSelector';
import CombinationList from './components/CombinationList';
import useCombinations from './hooks/useCombinations';
import { HAND_SIZE } from './utils/tileUtils';

const App: React.FC = () => {
  const [includeFlowers, setIncludeFlowers] = useState<boolean>(true);
  const [minFan, setMinFan] = useState<number>(2);
  const [maxFan, setMaxFan] = useState<number>(88);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const {
    combinations,
    createRandomCombination,
    updateFanValue,
    checkAnswer,
    removeCombination,
    clearCombinations,
  } = useCombinations();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await createRandomCombination(includeFlowers, minFan, maxFan);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mahjong Combination Generator</h1>
        <p>
          Generate random {HAND_SIZE}-tile Mahjong hands and test your knowledge of Fan scoring
          patterns.
        </p>
        <TileSelector
          includeFlowers={includeFlowers}
          onIncludeFlowersChange={setIncludeFlowers}
          minFan={minFan}
          onMinFanChange={setMinFan}
          maxFan={maxFan}
          onMaxFanChange={setMaxFan}
          onGenerate={handleGenerate}
          onClear={clearCombinations}
          disableClear={combinations.length === 0}
          isGenerating={isGenerating}
        />
      </header>
      <main className="app-main">
        <CombinationList
          combinations={combinations}
          onFanChange={updateFanValue}
          onCheckAnswer={checkAnswer}
          onRemove={removeCombination}
        />
      </main>
    </div>
  );
};

export default App;
