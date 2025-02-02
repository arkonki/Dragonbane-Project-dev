import React, { useState } from 'react';
import { useCharacterCreation } from '../../../stores/characterCreation';
import { Sparkles, AlertCircle, Info, Filter } from 'lucide-react';

interface Spell {
  name: string;
  school: string;
  rank: number | string;
  requirement: string;
  casting_time: string;
  range: string;
  duration: string;
  description: string;
}

// Complete spell list
const spells: Spell[] = [
  // General Magic
  {
    name: "Fetch",
    school: "General Magic",
    rank: 1,
    requirement: "None",
    casting_time: "Action",
    range: "10 meters",
    duration: "Instant",
    description: "You make a loose object (no heavier than weight 1) within 10 meters float to you."
  },
  // ... Add all spells from the list
  {
    name: "Flick",
    school: "General Magic",
    rank: 1,
    requirement: "None",
    casting_time: "Action",
    range: "10 meters",
    duration: "Instant",
    description: "You give an object or creature within 10 meters a magical flick. The 'attack' inflicts 1 point of damage and can shatter glass."
  },
  {
    name: "Light",
    school: "General Magic",
    rank: 1,
    requirement: "None",
    casting_time: "Action",
    range: "10 meters",
    duration: "One shift",
    description: "You create a bright light that shines from a focus of your choice, illuminating a 10-meter radius."
  },
  // ... Add all other spells from the list
];

const schoolNames = {
  "General Magic": "General",
  "Animism": "Animist",
  "Elementalism": "Elementalist",
  "Mentalism": "Mentalist"
};

export function MagicSelection() {
  const { character, updateCharacter } = useCharacterCreation();
  const [selectedTricks, setSelectedTricks] = useState<string[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [spellFilter, setSpellFilter] = useState<'all' | 'general' | 'school'>('all');

  if (character.profession !== 'Mage') {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">
          Only mages can learn and cast spells. Continue to the next step.
        </p>
      </div>
    );
  }

  // Get the selected magic school from the character data
  const selectedSchool = character.magicSchool;

  if (!selectedSchool) {
    return (
      <div className="p-6">
        <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Magic School Required</h4>
            <p className="text-sm text-amber-700">
              Please go back to the Profession step and select a magic school before choosing spells.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tricks = spells.filter(spell => spell.rank === "Magic Trick" || spell.rank === 0);
  const availableSpells = spells.filter(spell => {
    const isRankOne = spell.rank === 1;
    const matchesFilter = spellFilter === 'all' || 
      (spellFilter === 'general' && spell.school === "General Magic") ||
      (spellFilter === 'school' && spell.school === selectedSchool);
    return isRankOne && matchesFilter;
  });

  const handleSpellSelection = (spellName: string, type: 'trick' | 'spell') => {
    if (type === 'trick') {
      if (selectedTricks.includes(spellName)) {
        setSelectedTricks(selectedTricks.filter(name => name !== spellName));
      } else if (selectedTricks.length < 3) {
        setSelectedTricks([...selectedTricks, spellName]);
      }
    } else {
      if (selectedSpells.includes(spellName)) {
        setSelectedSpells(selectedSpells.filter(name => name !== spellName));
      } else if (selectedSpells.length < 3) {
        setSelectedSpells([...selectedSpells, spellName]);
      }
    }
  };

  const handleSave = () => {
    updateCharacter({
      spells: {
        general: [...selectedTricks, ...selectedSpells.filter(spell => 
          spells.find(s => s.name === spell)?.school === 'General Magic'
        )],
        school: {
          name: selectedSchool,
          spells: selectedSpells.filter(spell => 
            spells.find(s => s.name === spell)?.school === selectedSchool
          )
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="prose">
        <h3 className="text-xl font-bold mb-4">Select Magic</h3>
        <p className="text-gray-600">
          As a newly created mage, you may choose three rank 1 spells and three magic tricks.
          You can select spells from both General Magic and your chosen school of magic ({schoolNames[selectedSchool as keyof typeof schoolNames]}).
        </p>
      </div>

      {/* Magic School Notice */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-800">Your Magic School</h4>
          <p className="text-sm text-blue-700">
            {schoolNames[selectedSchool as keyof typeof schoolNames]}
          </p>
        </div>
      </div>

      {/* Magic Tricks Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Magic Tricks</h4>
          <span className="text-sm text-gray-600">
            Selected: {selectedTricks.length}/3
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tricks.map((trick) => (
            <div
              key={trick.name}
              onClick={() => handleSpellSelection(trick.name, 'trick')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedTricks.includes(trick.name)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${
                  selectedTricks.includes(trick.name) ? 'text-purple-500' : 'text-gray-400'
                }`} />
                <div>
                  <h5 className="font-medium">{trick.name}</h5>
                  <span className="text-xs text-gray-500">{trick.school}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{trick.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Range: {trick.range}</p>
                <p>Duration: {trick.duration}</p>
                {trick.requirement !== "None" && (
                  <p>Requirement: {trick.requirement}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rank 1 Spells Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold">Rank 1 Spells</h4>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={spellFilter}
                onChange={(e) => setSpellFilter(e.target.value as 'all' | 'general' | 'school')}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Spells</option>
                <option value="general">General Magic</option>
                <option value="school">School Spells</option>
              </select>
            </div>
          </div>
          <span className="text-sm text-gray-600">
            Selected: {selectedSpells.length}/3
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSpells.map((spell) => (
            <div
              key={spell.name}
              onClick={() => handleSpellSelection(spell.name, 'spell')}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedSpells.includes(spell.name)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`w-5 h-5 ${
                  selectedSpells.includes(spell.name) ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <div>
                  <h5 className="font-medium">{spell.name}</h5>
                  <span className="text-xs text-gray-500">{spell.school}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{spell.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                <p>Range: {spell.range}</p>
                <p>Duration: {spell.duration}</p>
                {spell.requirement !== "None" && (
                  <p>Requirement: {spell.requirement}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Warning */}
      {(selectedTricks.length < 3 || selectedSpells.length < 3) && (
        <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Incomplete Selection</h4>
            <p className="text-sm text-amber-700">
              Please select 3 magic tricks and 3 rank 1 spells to continue.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={selectedTricks.length < 3 || selectedSpells.length < 3}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5" />
        Save Spell Selections
      </button>
    </div>
  );
}
