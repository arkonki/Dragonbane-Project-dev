import React, { useState } from 'react';
import { X, Save, Eye, Code, ArrowLeft } from 'lucide-react';
import { Button } from '../shared/Button';
import { HomebrewRenderer } from './HomebrewRenderer';
import { CompendiumEntry } from '../../types/compendium';

interface CompendiumFullPageProps {
  entry: CompendiumEntry;
  onClose: () => void;
  onSave: (entry: CompendiumEntry) => Promise<void>;
  onSaveAsTemplate?: (entry: CompendiumEntry) => Promise<void>;
}

export function CompendiumFullPage({ entry, onClose, onSave, onSaveAsTemplate }: CompendiumFullPageProps) {
  const [editedEntry, setEditedEntry] = useState(entry);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(editedEntry);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (onSaveAsTemplate) {
      setLoading(true);
      try {
        await onSaveAsTemplate(editedEntry);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={onClose}
          >
            Back
          </Button>
          <h2 className="text-xl font-bold">{editedEntry.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={previewMode ? Code : Eye}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          {onSaveAsTemplate && (
            <Button
              variant="secondary"
              onClick={handleSaveAsTemplate}
              loading={loading}
            >
              Save as Template
            </Button>
          )}
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            loading={loading}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Editor */}
          {!previewMode && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editedEntry.title}
                    onChange={(e) => setEditedEntry({
                      ...editedEntry,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editedEntry.category}
                    onChange={(e) => setEditedEntry({
                      ...editedEntry,
                      category: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editedEntry.content}
                    onChange={(e) => setEditedEntry({
                      ...editedEntry,
                      content: e.target.value
                    })}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewMode && (
            <div className="flex-1 p-6 overflow-auto bg-gray-50">
              <div className="max-w-4xl mx-auto prose">
                <h1>{editedEntry.title}</h1>
                <div className="mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {editedEntry.category}
                  </span>
                </div>
                <HomebrewRenderer content={editedEntry.content} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
