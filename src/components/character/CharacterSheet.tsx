import React, { useState } from 'react';
import { Character } from '../../types/character';
import { supabase } from '../../lib/supabase';
import { 
  Shield, 
  Heart, 
  Swords, 
  Brain, 
  Zap, 
  Users,
  Moon,
  Sun,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useDice } from '../dice/DiceContext';

interface CharacterSheetProps {
  character: Character;
  onUpdate: (character: Character) => void;
}

export function CharacterSheet({ character, onUpdate }: CharacterSheetProps) {
  const { toggleDiceRoller } = useDice();
  const [showRestDialog, setShowRestDialog] = useState<'round' | 'stretch' | 'shift' | null>(null);
  const [healingRoll, setHealingRoll] = useState<number | null>(null);
  const [healerPresent, setHealerPresent] = useState(false);

  const getBaseChance = (value: number): number => {
    if (value <= 5) return 3;
    if (value <= 8) return 4;
    if (value <= 12) return 5;
    if (value <= 15) return 6;
    return 7;
  };

  const handleConditionToggle = async (condition: keyof typeof character.conditions) => {
    try {
      const newConditions = {
        ...character.conditions,
        [condition]: !character.conditions[condition]
      };

      const { error } = await supabase
        .from('characters')
        .update({ conditions: newConditions })
        .eq('id', character.id);

      if (error) throw error;

      onUpdate({
        ...character,
        conditions: newConditions
      });
    } catch (err) {
      console.error('Error updating condition:', err);
    }
  };

  const handleRest = async (type: 'round' | 'stretch' | 'shift') => {
    try {
      let updates: Partial<Character> = {};
      
      switch (type) {
        case 'round':
          // Roll D6 for WP recovery
          const wpRecovery = Math.floor(Math.random() * 6) + 1;
          const newWP = Math.min(character.attributes.WIL, (character.currentWP || 0) + wpRecovery);
          updates = { currentWP: newWP };
          break;

        case 'stretch':
          // Roll for HP recovery (1D6 or 2D6 if healer present)
          const diceCount = healerPresent ? 2 : 1;
          const hpRecovery = Array(diceCount)
            .fill(0)
            .reduce((sum) => sum + Math.floor(Math.random() * 6) + 1, 0);
          const newHP = Math.min(character.attributes.CON, (character.currentHP || 0) + hpRecovery);
          setHealingRoll(hpRecovery);
          updates = { currentHP: newHP };
          break;

        case 'shift':
          // Recover all HP, WP and conditions
          updates = {
            currentHP: character.attributes.CON,
            currentWP: character.attributes.WIL,
            conditions: {
              exhausted: false,
              sickly: false,
              dazed: false,
              angry: false,
              scared: false,
              disheartened: false
            }
          };
          break;
      }

      const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', character.id);

      if (error) throw error;

      onUpdate({
        ...character,
        ...updates
      });

      setShowRestDialog(null);
      setHealingRoll(null);
      setHealerPresent(false);
    } catch (err) {
      console.error('Error during rest:', err);
    }
  };

  const renderAttribute = (
    name: string, 
    value: number, 
    icon: React.ReactNode, 
    condition: keyof typeof character.conditions
  ) => (
    <div className="relative">
      <div className="p-4 bg-gray-800 rounded-lg text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{name}</span>
          <span className="text-xl">{value}</span>
        </div>
        <div className="text-sm">
          <div>Base Chance: {getBaseChance(value)}</div>
          {(name === 'STR' || name === 'AGL') && value > 12 && (
            <div className="text-blue-400">
              Damage Bonus: {value <= 15 ? '+D4' : '+D6'}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => handleConditionToggle(condition)}
        className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-medium ${
          character.conditions[condition]
            ? 'bg-red-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {condition}
      </button>
    </div>
  );

  const renderRestDialog = () => {
    if (!showRestDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">
            {showRestDialog === 'round' && 'Round Rest'}
            {showRestDialog === 'stretch' && 'Stretch Rest'}
            {showRestDialog === 'shift' && 'Shift Rest'}
          </h3>

          {showRestDialog === 'stretch' && (
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={healerPresent}
                  onChange={(e) => setHealerPresent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Healer present with successful HEALING roll</span>
              </label>
            </div>
          )}

          {healingRoll && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              Recovered {healingRoll} HP
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setShowRestDialog(null);
                setHealingRoll(null);
                setHealerPresent(false);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => handleRest(showRestDialog)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Rest
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rest Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowRestDialog('round')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Moon className="w-5 h-5" />
          Round Rest
        </button>
        <button
          onClick={() => setShowRestDialog('stretch')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          <Sun className="w-5 h-5" />
          Stretch Rest
        </button>
        <button
          onClick={() => setShowRestDialog('shift')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Clock className="w-5 h-5" />
          Shift Rest
        </button>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {renderAttribute('STR', character.attributes.STR, <Shield />, 'exhausted')}
        {renderAttribute('CON', character.attributes.CON, <Heart />, 'sickly')}
        {renderAttribute('AGL', character.attributes.AGL, <Swords />, 'dazed')}
        {renderAttribute('INT', character.attributes.INT, <Brain />, 'angry')}
        {renderAttribute('WIL', character.attributes.WIL, <Zap />, 'scared')}
        {renderAttribute('CHA', character.attributes.CHA, <Users />, 'disheartened')}
      </div>

      {/* HP and WP Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Hit Points
            </h3>
            <span className="text-lg font-medium">
              {character.currentHP || character.attributes.CON} / {character.attributes.CON}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const newHP = Math.max(0, (character.currentHP || character.attributes.CON) - 1);
                await supabase
                  .from('characters')
                  .update({ currentHP: newHP })
                  .eq('id', character.id);
                onUpdate({ ...character, currentHP: newHP });
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Damage
            </button>
            <button
              onClick={async () => {
                const newHP = Math.min(
                  character.attributes.CON,
                  (character.currentHP || character.attributes.CON) + 1
                );
                await supabase
                  .from('characters')
                  .update({ currentHP: newHP })
                  .eq('id', character.id);
                onUpdate({ ...character, currentHP: newHP });
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Heal
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Willpower Points
            </h3>
            <span className="text-lg font-medium">
              {character.currentWP || character.attributes.WIL} / {character.attributes.WIL}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const newWP = Math.max(0, (character.currentWP || character.attributes.WIL) - 1);
                await supabase
                  .from('characters')
                  .update({ currentWP: newWP })
                  .eq('id', character.id);
                onUpdate({ ...character, currentWP: newWP });
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Strain
            </button>
            <button
              onClick={async () => {
                const newWP = Math.min(
                  character.attributes.WIL,
                  (character.currentWP || character.attributes.WIL) + 1
                );
                await supabase
                  .from('characters')
                  .update({ currentWP: newWP })
                  .eq('id', character.id);
                onUpdate({ ...character, currentWP: newWP });
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Recover
            </button>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Skills */}
        <div>
          <h3 className="font-bold mb-4">General Skills</h3>
          <div className="space-y-2">
            {[
              { name: 'Acrobatics', attr: 'AGL' },
              { name: 'Awareness', attr: 'INT' },
              { name: 'Bartering', attr: 'CHA' },
              { name: 'Beast Lore', attr: 'INT' },
              { name: 'Bluffing', attr: 'CHA' },
              { name: 'Bushcraft', attr: 'INT' },
              { name: 'Crafting', attr: 'STR' },
              { name: 'Evade', attr: 'AGL' },
              { name: 'Healing', attr: 'INT' },
              { name: 'Hunting & Fishing', attr: 'AGL' },
              { name: 'Languages', attr: 'INT' },
              { name: 'Myths & Legends', attr: 'INT' },
              { name: 'Performance', attr: 'CHA' },
              { name: 'Persuasion', attr: 'CHA' },
              { name: 'Riding', attr: 'AGL' },
              { name: 'Seamanship', attr: 'INT' },
              { name: 'Sleight of Hand', attr: 'AGL' },
              { name: 'Sneaking', attr: 'AGL' },
              { name: 'Spot Hidden', attr: 'INT' },
              { name: 'Swimming', attr: 'AGL' }
            ].map(skill => {
              const isTrained = character.trainedSkills.includes(skill.name);
              const baseChance = getBaseChance(character.attributes[skill.attr as keyof typeof character.attributes]);
              const skillValue = isTrained ? baseChance * 2 : baseChance;
              const isAffected = character.conditions[getConditionForAttribute(skill.attr)];

              return (
                <div
                  key={skill.name}
                  className={`flex items-center justify-between p-2 rounded ${
                    isAffected ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleDiceRoller()}
                >
                  <span className={`${isTrained ? 'font-bold' : ''} ${isAffected ? 'text-red-600' : ''}`}>
                    {skill.name} ({skill.attr})
                  </span>
                  <span className={isAffected ? 'text-red-600' : ''}>
                    {skillValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weapon Skills */}
        <div>
          <h3 className="font-bold mb-4">Weapon Skills</h3>
          <div className="space-y-2">
            {[
              { name: 'Axes', attr: 'STR' },
              { name: 'Bows', attr: 'AGL' },
              { name: 'Brawling', attr: 'STR' },
              { name: 'Crossbows', attr: 'AGL' },
              { name: 'Hammers', attr: 'STR' },
              { name: 'Knives', attr: 'AGL' },
              { name: 'Slings', attr: 'AGL' },
              { name: 'Spears', attr: 'STR' },
              { name: 'Staves', attr: 'AGL' },
              { name: 'Swords', attr: 'STR' }
            ].map(skill => {
              const isTrained = character.trainedSkills.includes(skill.name);
              const baseChance = getBaseChance(character.attributes[skill.attr as keyof typeof character.attributes]);
              const skillValue = isTrained ? baseChance * 2 : baseChance;
              const isAffected = character.conditions[getConditionForAttribute(skill.attr)];

              return (
                <div
                  key={skill.name}
                  className={`flex items-center justify-between p-2 rounded ${
                    isAffected ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleDiceRoller()}
                >
                  <span className={`${isTrained ? 'font-bold' : ''} ${isAffected ? 'text-red-600' : ''}`}>
                    {skill.name} ({skill.attr})
                  </span>
                  <span className={isAffected ? 'text-red-600' : ''}>
                    {skillValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {renderRestDialog()}
    </div>
  );
}

function getConditionForAttribute(attr: string): keyof Character['conditions'] {
  const conditionMap: Record<string, keyof Character['conditions']> = {
    'STR': 'exhausted',
    'CON': 'sickly',
    'AGL': 'dazed',
    'INT': 'angry',
    'WIL': 'scared',
    'CHA': 'disheartened'
  };
  return conditionMap[attr];
}
