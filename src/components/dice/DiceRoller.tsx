import React, { useState } from 'react';
import { Dices, RotateCcw, ArrowRight, History, Plus } from 'lucide-react';
import { Button } from '../shared/Button';

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

interface DiceRoll {
  type: DiceType;
  results: number[];
  sum?: number;
  timestamp: Date;
  pushed?: boolean;
}

export function DiceRoller() {
  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [quantity, setQuantity] = useState(1);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [canPush, setCanPush] = useState(false);
  const [showSum, setShowSum] = useState(false);

  const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

  const rollDice = (dice: DiceType, count: number = 1, isPush: boolean = false) => {
    const sides = parseInt(dice.substring(1));
    const results: number[] = [];

    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }

    const newRoll: DiceRoll = {
      type: dice,
      results,
      timestamp: new Date(),
      pushed: isPush
    };

    setLastRoll(newRoll);
    setRollHistory(prev => [newRoll, ...prev]);
    setCanPush(!isPush && dice === 'd20');
    setShowSum(false);
  };

  const pushRoll = () => {
    if (lastRoll && !lastRoll.pushed) {
      rollDice(lastRoll.type, 1, true);
      setCanPush(false);
    }
  };

  const clearHistory = () => {
    setRollHistory([]);
    setLastRoll(null);
    setCanPush(false);
    setShowSum(false);
  };

  const calculateSum = (results: number[]) => {
    return results.reduce((a, b) => a + b, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Dices className="w-6 h-6 text-blue-600" />
          Dice Roller
        </h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <History className="w-4 h-4" />
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Dice Selection */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {diceTypes.map(dice => (
              <button
                key={dice}
                onClick={() => setSelectedDice(dice)}
                className={`p-2 rounded-lg text-center ${
                  selectedDice === dice
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {dice}
              </button>
            ))}
          </div>

          {/* Quantity Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Dice
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Roll Button */}
          <div className="flex gap-2">
            <button
              onClick={() => rollDice(selectedDice, quantity)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Dices className="w-5 h-5" />
              Roll {quantity > 1 ? `${quantity}${selectedDice}` : selectedDice}
            </button>
            {canPush && (
              <button
                onClick={pushRoll}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                <ArrowRight className="w-5 h-5" />
                Push
              </button>
            )}
          </div>

          {/* Last Roll Result */}
          {lastRoll && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Results:</p>
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {lastRoll.results.map((result, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-lg font-medium text-gray-700"
                    >
                      {result}
                    </span>
                  ))}
                </div>
                {!showSum && lastRoll.results.length > 1 && (
                  <button
                    onClick={() => setShowSum(true)}
                    className="flex items-center gap-1 mx-auto text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Calculate Sum
                  </button>
                )}
                {showSum && (
                  <p className="text-lg font-bold text-blue-600">
                    Total: {calculateSum(lastRoll.results)}
                  </p>
                )}
                {lastRoll.pushed && (
                  <p className="text-sm text-amber-600 mt-1">Pushed Roll</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Roll History */}
        {showHistory && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Roll History</h3>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {rollHistory.length > 0 ? (
                <div className="space-y-2">
                  {rollHistory.map((roll, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        roll.pushed ? 'bg-amber-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{roll.type}</span>
                        <span className="text-sm text-gray-600">
                          {roll.pushed && '(Pushed)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {roll.results.map((result, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center w-6 h-6 bg-white border border-gray-300 rounded text-sm"
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                      {roll.results.length > 1 && (
                        <p className="text-sm text-gray-600">
                          Sum: {calculateSum(roll.results)}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        {roll.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No rolls yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
