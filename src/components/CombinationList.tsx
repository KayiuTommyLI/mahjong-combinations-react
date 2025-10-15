import React, { useState } from 'react';
import { Combination } from '../hooks/useCombinations';
import { FAN_SCORING_TABLE } from '../utils/fanScoringTable';

interface CombinationListProps {
  combinations: Combination[];
  onFanChange: (id: string, fanValue: number | '') => void;
  onCheckAnswer: (id: string) => void;
  onRemove: (id: string) => void;
}

const TileGrid: React.FC<{ tiles: Combination['tiles'] }> = ({ tiles }) => {
  const sortedTiles = [...tiles].sort((a, b) => {
    const categoryOrder = ['characters', 'bamboo', 'dots', 'honor', 'flower'];
    const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);

    if (categoryDiff !== 0) return categoryDiff;

    return a.id.localeCompare(b.id);
  });

  return (
    <div className="tile-grid">
      {sortedTiles.map(tile => (
        <div
          key={tile.uid}
          className={`tile-badge tile-${tile.category}`}
          title={`${tile.name} (${tile.category})`}
        >
          <span className="tile-symbol">{tile.display}</span>
        </div>
      ))}
    </div>
  );
};

const FanScoringReference: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fan-reference">
      <button type="button" className="reference-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '▼' : '▶'} Fan Scoring Reference
      </button>
      {isExpanded && (
        <div className="reference-content">
          {FAN_SCORING_TABLE.map(category => (
            <div key={category.fan} className="fan-category">
              <h3>{category.fan} Fan</h3>
              <ul>
                {category.hands.map(hand => (
                  <li key={hand.name}>
                    <strong>{hand.name}</strong>
                    {hand.nameEn && ` (${hand.nameEn})`}: {hand.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CombinationList: React.FC<CombinationListProps> = ({
  combinations,
  onFanChange,
  onCheckAnswer,
  onRemove,
}) => {
  if (combinations.length === 0) {
    return (
      <>
        <FanScoringReference />
        <p className="empty-state">Click "Generate" to create combinations.</p>
      </>
    );
  }

  return (
    <>
      <FanScoringReference />
      <ul className="combination-list">
        {combinations.map((combo, index) => (
          <li key={combo.id} className="combination-card">
            <div className="card-header">
              <div>
                <span className="combo-label">Combination #{combinations.length - index}</span>
                <span className="tile-count">{combo.tiles.length} tiles</span>
              </div>
              <div className="card-actions">
                <label className="fan-input">
                  Your Answer
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={combo.fan}
                    onChange={event => {
                      const { value } = event.target;
                      if (value === '') {
                        onFanChange(combo.id, '');
                        return;
                      }
                      const numeric = Number(value);
                      if (!Number.isNaN(numeric)) {
                        onFanChange(combo.id, Math.max(0, Math.floor(numeric)));
                      }
                    }}
                    placeholder="?"
                    disabled={combo.isAnswerChecked}
                    className={
                      combo.isAnswerChecked ? (combo.isCorrect ? 'correct' : 'incorrect') : ''
                    }
                  />
                </label>
                {!combo.isAnswerChecked ? (
                  <button
                    type="button"
                    onClick={() => onCheckAnswer(combo.id)}
                    disabled={combo.fan === ''}
                    className="check-btn"
                  >
                    Check Answer
                  </button>
                ) : (
                  <span className={`result-badge ${combo.isCorrect ? 'correct' : 'incorrect'}`}>
                    {combo.isCorrect ? '✓ Correct!' : `✗ Wrong (${combo.suggestedFan} Fan)`}
                  </span>
                )}
                <button type="button" onClick={() => onRemove(combo.id)}>
                  Remove
                </button>
              </div>
            </div>
            <TileGrid tiles={combo.tiles} />

            {/* Show detected patterns only after checking answer */}
            {combo.isAnswerChecked && combo.detectedPatterns.length > 0 && (
              <div className={`detected-patterns ${combo.isCorrect ? 'correct' : 'incorrect'}`}>
                <h4>Correct Answer: {combo.suggestedFan} Fan</h4>
                <ul>
                  {combo.detectedPatterns.map((pattern, idx) => (
                    <li key={idx} className="pattern-item">
                      <strong>{pattern.name}</strong> {pattern.nameEn && `(${pattern.nameEn})`} -{' '}
                      {pattern.fan} Fan
                      <br />
                      <span className="pattern-desc">{pattern.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="summary-chips">
              {combo.summary.map(item => (
                <span key={item.id} className={`summary-chip chip-${item.category}`}>
                  {item.display} {item.name}
                  <span className="chip-count">×{item.count}</span>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CombinationList;
