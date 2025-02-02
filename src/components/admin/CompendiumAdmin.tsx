import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CompendiumManager } from './CompendiumManager';

interface CompendiumAdminProps {
  onEntryAdded: () => void;
}

export function CompendiumAdmin({ onEntryAdded }: CompendiumAdminProps) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Entry
      </button>
    );
  }

  return (
    <div className="mb-6">
      <CompendiumManager />
      <button
        onClick={() => setIsAdding(false)}
        className="mt-4 text-gray-600 hover:text-gray-800"
      >
        Cancel
      </button>
    </div>
  );
}
