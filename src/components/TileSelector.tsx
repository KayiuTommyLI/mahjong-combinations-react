import React from 'react';
import { HAND_SIZE } from '../utils/tileUtils';

interface TileSelectorProps {
  includeFlowers: boolean;
  onIncludeFlowersChange: (value: boolean) => void;
  minFan: number;
  onMinFanChange: (value: number) => void;
  maxFan: number;
  onMaxFanChange: (value: number) => void;
  onGenerate: () => void;
  onClear: () => void;
  disableClear: boolean;
  isGenerating: boolean;
}

const TileSelector: React.FC<TileSelectorProps> = ({
  includeFlowers,
  onIncludeFlowersChange,
  minFan,
  onMinFanChange,
  maxFan,
  onMaxFanChange,
  onGenerate,
  onClear,
  disableClear,
  isGenerating,
}) => (
  <div className="control-section">
    <div className="control-bar">
      <label className="toggle">
        <input
          type="checkbox"
          checked={includeFlowers}
          onChange={event => onIncludeFlowersChange(event.target.checked)}
          disabled={isGenerating}
        />
        <span>Include flowers & seasons</span>
      </label>
    </div>

    <div className="fan-range-controls">
      <div className="fan-range-group">
        <label className="fan-range-label">
          <span>Min Fan:</span>
          <input
            type="number"
            min="0"
            max={maxFan}
            value={minFan}
            onChange={e => onMinFanChange(Math.max(0, parseInt(e.target.value) || 0))}
            disabled={isGenerating}
            className="fan-range-input"
          />
        </label>

        <label className="fan-range-label">
          <span>Max Fan:</span>
          <input
            type="number"
            min={minFan}
            max="88"
            value={maxFan}
            onChange={e =>
              onMaxFanChange(Math.min(88, Math.max(minFan, parseInt(e.target.value) || 88)))
            }
            disabled={isGenerating}
            className="fan-range-input"
          />
        </label>
      </div>

      <div className="preset-buttons">
        <button
          type="button"
          className="preset-btn"
          onClick={() => {
            onMinFanChange(2);
            onMaxFanChange(8);
          }}
          disabled={isGenerating}
        >
          Easy (2-8)
        </button>
        <button
          type="button"
          className="preset-btn"
          onClick={() => {
            onMinFanChange(8);
            onMaxFanChange(24);
          }}
          disabled={isGenerating}
        >
          Medium (8-24)
        </button>
        <button
          type="button"
          className="preset-btn"
          onClick={() => {
            onMinFanChange(24);
            onMaxFanChange(88);
          }}
          disabled={isGenerating}
        >
          Hard (24-88)
        </button>
      </div>
    </div>

    <div className="action-buttons">
      <button type="button" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : `Generate ${HAND_SIZE}-tile combination`}
      </button>
      <button type="button" onClick={onClear} disabled={disableClear || isGenerating}>
        Clear all
      </button>
    </div>
  </div>
);

export default TileSelector;
