import React, { useState } from 'react';
import { useCharacterCreation } from '../../../stores/characterCreation';
import { Package, AlertCircle, Info, CheckCircle2, Shield, Sword, Backpack } from 'lucide-react';

interface EquipmentOption {
  option: number;
  items: string[];
}

const professionEquipment: Record<string, EquipmentOption[]> = {
  Artisan: [
    {
      option: 1,
      items: ["Warhammer (small)", "Leather Armor", "Blacksmith's Tools", "Torch", "Flint & Tinder", "D8 Food Rations", "D8 Silver"]
    },
    {
      option: 2,
      items: ["Handaxe", "Leather Armor", "Carpentry Tools", "Torch", "Rope (hemp)", "Flint & Tinder", "D8 Food Rations", "D8 Silver"]
    },
    {
      option: 3,
      items: ["Knife", "Leather Armor", "Tanner's Tools", "Lantern", "Lamp Oil", "Flint & Tinder", "D8 Food Rations", "D8 Silver"]
    }
  ],
  Bard: [
    {
      option: 1,
      items: ["Lyre", "Knife", "Oil Lamp", "Lamp Oil", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 2,
      items: ["Flute", "Dagger", "Rope (hemp)", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 3,
      items: ["Horn", "Knife", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    }
  ],
  Fighter: [
    {
      option: 1,
      items: ["Broadsword/Battle Axe/Morning Star", "Small Shield", "Chainmail", "Torch", "Flint & Tinder", "D6 Food Rations", "D6 Silver"]
    },
    {
      option: 2,
      items: ["Short Sword/Handaxe/Short Spear", "Light Crossbow", "Quiver", "Leather Armor", "Torch", "Flint & Tinder", "D6 Food Rations", "D6 Silver"]
    },
    {
      option: 3,
      items: ["Long Spear", "Studded Leather Armor", "Open Helmet", "Torch", "Flint & Tinder", "D6 Food Rations", "D6 Silver"]
    }
  ],
  Hunter: [
    {
      option: 1,
      items: ["Dagger", "Short Bow", "Quiver", "Leather Armor", "Sleeping Pelt", "Torch", "Flint & Tinder", "Rope (hemp)", "Snare", "D8 Food Rations", "D6 Silver"]
    },
    {
      option: 2,
      items: ["Knife", "Longbow", "Quiver", "Leather Armor", "Sleeping Pelt", "Torch", "Flint & Tinder", "Rope (hemp)", "Fishing Rod", "D8 Food Rations", "D6 Silver"]
    },
    {
      option: 3,
      items: ["Dagger", "Sling", "Leather Armor", "Sleeping Pelt", "Torch", "Flint & Tinder", "Rope (hemp)", "Snare", "D8 Food Rations", "D6 Silver"]
    }
  ],
  Knight: [
    {
      option: 1,
      items: ["Longsword", "Plate Armor", "Shield", "Lantern", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 2,
      items: ["Morningstar", "Chainmail", "Shield", "Oil Lamp", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 3,
      items: ["Battle Axe", "Studded Leather Armor", "Small Shield", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    }
  ],
  Mage: [
    {
      option: 1,
      items: ["Staff", "Orbuculum", "Grimoire", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 2,
      items: ["Knife", "Wand", "Grimoire", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    },
    {
      option: 3,
      items: ["Amulet", "Grimoire", "Sleeping Pelt", "Torch", "Flint & Tinder", "D6 Food Rations", "D8 Silver"]
    }
  ],
  Mariner: [
    {
      option: 1,
      items: ["Dagger", "Short Bow", "Quiver", "Rope (hemp)", "Grappling Hook", "Sleeping Pelt", "Torch", "Flint & Tinder", "D8 Food Rations", "D10 Silver"]
    },
    {
      option: 2,
      items: ["Scimitar", "Leather Armor", "Rope (hemp)", "Grappling Hook", "Torch", "Flint & Tinder", "D8 Food Rations", "D10 Silver"]
    },
    {
      option: 3,
      items: ["Trident", "Spyglass", "Rope (hemp)", "Grappling Hook", "Torch", "Flint & Tinder", "D8 Food Rations", "D10 Silver"]
    }
  ],
  Merchant: [
    {
      option: 1,
      items: ["Dagger", "Coin Pouch", "Fine Garments", "Rope (silk)", "Oil Lamp", "Flint & Tinder", "D10 Silver"]
    },
    {
      option: 2,
      items: ["Knife", "Lantern", "Lamp Oil", "Flint & Tinder", "Fine Clothing", "D6 Food Rations", "D10 Silver"]
    },
    {
      option: 3,
      items: ["Sling", "Torch", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    }
  ],
  Scholar: [
    {
      option: 1,
      items: ["Quill & Ink", "Notebook", "Lantern", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    },
    {
      option: 2,
      items: ["Book", "Oil Lamp", "Lamp Oil", "D6 Food Rations", "D10 Silver"]
    },
    {
      option: 3,
      items: ["Scroll Case", "Torch", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    }
  ],
  Thief: [
    {
      option: 1,
      items: ["Dagger", "Sling", "Rope (hemp)", "Grappling Hook", "Torch", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    },
    {
      option: 2,
      items: ["Knife", "Lockpicks (simple)", "Torch", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    },
    {
      option: 3,
      items: ["Two Daggers", "Marbles", "Rope (hemp)", "Torch", "Flint & Tinder", "D6 Food Rations", "D10 Silver"]
    }
  ]
};

const getKitDescription = (profession: string, option: number): string => {
  const descriptions: Record<string, Record<number, string>> = {
    Artisan: {
      1: "A blacksmith's essentials with basic armor and tools",
      2: "A carpenter's kit with versatile tools and protection",
      3: "A tanner's setup with leather working equipment"
    },
    Bard: {
      1: "A classic bard's kit with a lyre for performances",
      2: "A lightweight traveler's set with a flute",
      3: "A minimalist kit with a horn for battlefield inspiration"
    },
    Fighter: {
      1: "Heavy combat gear with chainmail and shield",
      2: "Ranged combat focus with crossbow and leather armor",
      3: "Defensive setup with spear and studded leather"
    },
    Hunter: {
      1: "Short-range hunting kit with bow and survival gear",
      2: "Long-range hunting setup with fishing equipment",
      3: "Light hunting gear with sling and traps"
    },
    Knight: {
      1: "Heavy combat gear with plate armor",
      2: "Balanced protection with chainmail",
      3: "Mobile combat setup with lighter armor"
    },
    Mage: {
      1: "Traditional mage's kit with staff and orbuculum",
      2: "Combat-oriented setup with wand",
      3: "Mystical focus with amulet and comfort items"
    },
    Mariner: {
      1: "Versatile sailor's kit with ranged capability",
      2: "Close combat focus with armor",
      3: "Navigator's kit with spyglass"
    },
    Merchant: {
      1: "Wealthy trader's setup with fine clothes",
      2: "Practical merchant's kit with lantern",
      3: "Basic traveling merchant's gear"
    },
    Scholar: {
      1: "Writer's kit with quality materials",
      2: "Reader's setup with good lighting",
      3: "Basic scholar's equipment"
    },
    Thief: {
      1: "Versatile thief's kit with ranged option",
      2: "Specialized burglar's tools",
      3: "Stealthy setup with backup weapons"
    }
  };

  return descriptions[profession]?.[option] || "Standard adventuring gear";
};

const getKitIcon = (profession: string, option: number) => {
  const icons: Record<string, Record<number, React.ReactNode>> = {
    Fighter: {
      1: <Sword className="w-6 h-6 text-red-500" />,
      2: <Sword className="w-6 h-6 text-blue-500" />,
      3: <Shield className="w-6 h-6 text-green-500" />
    },
    // Add more profession-specific icons as needed
  };

  return icons[profession]?.[option] || <Package className="w-6 h-6 text-gray-500" />;
};

export function GearSelection() {
  const { character, updateCharacter } = useCharacterCreation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!character.profession) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">
          Please select a profession before choosing equipment.
        </p>
      </div>
    );
  }

  const availableOptions = professionEquipment[character.profession] || [];

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
    const selectedGear = availableOptions.find(gear => gear.option === option);
    if (selectedGear) {
      updateCharacter({
        startingEquipment: {
          option,
          items: selectedGear.items
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose">
        <h3 className="text-xl font-bold mb-4">Choose Starting Equipment</h3>
        <p className="text-gray-600">
          Select one of the available equipment packages for your {character.profession}.
          Each option provides different tools and gear to start your adventure.
        </p>
      </div>

      {/* Equipment Selection Info */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-800">Equipment Selection</h4>
          <p className="text-sm text-blue-700">
            Choose carefully - this will be your starting gear for the adventure.
            Each package is designed for different playstyles.
          </p>
        </div>
      </div>

      {/* Equipment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableOptions.map((option) => (
          <div
            key={option.option}
            onClick={() => handleOptionSelect(option.option)}
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              selectedOption === option.option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {getKitIcon(character.profession, option.option)}
              <div>
                <h4 className="font-semibold">Option {option.option}</h4>
                <p className="text-sm text-gray-600">
                  {getKitDescription(character.profession, option.option)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Equipment List:</h5>
              <ul className="space-y-1">
                {option.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {selectedOption === option.option && (
              <div className="mt-4 flex items-center gap-2 text-blue-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Selected</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selection Warning */}
      {!selectedOption && (
        <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Equipment Required</h4>
            <p className="text-sm text-amber-700">
              Please select a starting equipment package to continue.
            </p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={() => {
          if (selectedOption) {
            const selectedGear = availableOptions.find(gear => gear.option === selectedOption);
            if (selectedGear) {
              updateCharacter({
                startingEquipment: {
                  option: selectedOption,
                  items: selectedGear.items
                }
              });
            }
          }
        }}
        disabled={!selectedOption}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Backpack className="w-5 h-5" />
        Confirm Equipment Selection
      </button>
    </div>
  );
}
