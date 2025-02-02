import React, { useState } from 'react';
import { Character } from '../../types/character';
import { Navigation } from '../Navigation';
import { CharacterSheet } from './CharacterSheet';
import { InventoryModal } from './InventoryModal';
import { EquipmentModal } from './EquipmentModal';
import { ConditionsModal } from './ConditionsModal';
import { ExperienceModal } from './ExperienceModal';
import { SpellsView } from './SpellsView';
import { HeroicAbilitiesView } from './HeroicAbilitiesView';
import { AdvancementSystem } from './AdvancementSystem';
import { 
  Dices, 
  ScrollText, 
  Package,
  User,
  PenTool,
  GraduationCap,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Edit,
  Plus,
  Check,
  AlertTriangle,
  Sparkles,
  Swords
} from 'lucide-react';

interface CharacterViewProps {
  character: Character;
}

export function CharacterView({ character }: CharacterViewProps) {
  const [activeTab, setActiveTab] = useState<'sheet' | 'spells' | 'heroic' | 'advancement'>('sheet');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // Check if any conditions are active
  const hasActiveConditions = Object.values(character.conditions).some(condition => condition);

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    // Reload the page to reflect changes
    // In a real application, you'd want to use proper state management
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Character Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
          <p className="text-gray-600">
            Level {character.experience?.markedSkills?.length || 0} {character.kin} {character.profession}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowConditionsModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              hasActiveConditions
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {hasActiveConditions ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            Conditions
          </button>
          <button
            onClick={() => setShowExperienceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <GraduationCap className="w-5 h-5" />
            Experience
          </button>
          <button
            onClick={() => setShowEquipModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ScrollText className="w-5 h-5" />
            Equipment
          </button>
          <button
            onClick={() => setShowInventoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Package className="w-5 h-5" />
            Inventory
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('sheet')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'sheet'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Character Sheet
        </button>
        {character.profession === 'Mage' && (
          <button
            onClick={() => setActiveTab('spells')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'spells'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Spells
            </div>
          </button>
        )}
        {character.profession !== 'Mage' && (
          <button
            onClick={() => setActiveTab('heroic')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'heroic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5" />
              Heroic Abilities
            </div>
          </button>
        )}
        <button
          onClick={() => setActiveTab('advancement')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'advancement'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Advancement
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'sheet' && <CharacterSheet character={character} onUpdate={handleCharacterUpdate} />}
      {activeTab === 'spells' && <SpellsView character={character} onUpdate={handleCharacterUpdate} />}
      {activeTab === 'heroic' && <HeroicAbilitiesView character={character} onUpdate={handleCharacterUpdate} />}
      {activeTab === 'advancement' && <AdvancementSystem character={character} onUpdate={handleCharacterUpdate} />}

      {/* Modals */}
      {showInventoryModal && (
        <InventoryModal
          character={character}
          onClose={() => setShowInventoryModal(false)}
          onUpdate={handleCharacterUpdate}
        />
      )}

      {showEquipModal && (
        <EquipmentModal
          character={character}
          onClose={() => setShowEquipModal(false)}
          onUpdate={handleCharacterUpdate}
        />
      )}

      {showConditionsModal && (
        <ConditionsModal
          character={character}
          onClose={() => setShowConditionsModal(false)}
          onUpdate={handleCharacterUpdate}
        />
      )}

      {showExperienceModal && (
        <ExperienceModal
          character={character}
          onClose={() => setShowExperienceModal(false)}
          onUpdate={handleCharacterUpdate}
        />
      )}
    </div>
  );
}
