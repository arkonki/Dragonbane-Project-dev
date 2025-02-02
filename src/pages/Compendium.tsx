import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Book, Search, Plus, Edit2, Trash2, Save, X, AlertCircle, Maximize2, FileText } from 'lucide-react';
import { CompendiumAdmin } from '../components/admin/CompendiumAdmin';
import { CompendiumFullPage } from '../components/compendium/CompendiumFullPage';
import { useAuth } from '../contexts/AuthContext';
import { CompendiumEntry, CompendiumTemplate } from '../types/compendium';
import { Button } from '../components/shared/Button';
import { useNavigate } from 'react-router-dom';

const templates: Record<string, CompendiumTemplate> = {
  monster: {
    name: 'Monster Stat Block',
    description: 'Template for monster statistics and abilities',
    content: `# [Monster Name]\n\n## Statistics\n- **Armor Class:** [AC]\n- **Hit Points:** [HP]\n- **Speed:** [Speed]\n\n## Attributes\n- **STR:** [Strength]\n- **CON:** [Constitution]\n- **AGL:** [Agility]\n- **INT:** [Intelligence]\n- **WIL:** [Willpower]\n- **CHA:** [Charisma]\n\n## Skills\n[List of skills]\n\n## Special Abilities\n[List of special abilities]\n\n## Actions\n[List of actions]\n\n## Description\n[Monster description]`
  },
  spell: {
    name: 'Spell Description',
    description: 'Template for magical spells and effects',
    content: `# [Spell Name]\n\n**School:** [School of Magic]\n**Rank:** [Spell Rank]\n**Casting Time:** [Time]\n**Range:** [Range]\n**Duration:** [Duration]\n**WP Cost:** [Cost]\n\n## Description\n[Spell description]\n\n## Effects\n[Spell effects]\n\n## Requirements\n[Special requirements if any]`
  },
  item: {
    name: 'Magic Item',
    description: 'Template for magical items and artifacts',
    content: `# [Item Name]\n\n**Type:** [Type of item]\n**Rarity:** [Common/Uncommon/Rare/Unique]\n**Value:** [Cost]\n\n## Description\n[Item description]\n\n## Properties\n[Magical properties]\n\n## Requirements\n[Usage requirements if any]`
  }
};

export function Compendium() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<CompendiumEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CompendiumEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<CompendiumEntry | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [fullPageEntry, setFullPageEntry] = useState<CompendiumEntry | null>(null);
  const [templates, setTemplates] = useState<CompendiumTemplate[]>([]);

  useEffect(() => {
    loadCompendiumEntries();
    loadTemplates();
  }, []);

  async function loadCompendiumEntries() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compendium')
        .select('*')
        .order('category')
        .order('title');

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load compendium');
    } finally {
      setLoading(false);
    }
  }

  async function loadTemplates() {
    try {
      const { data, error } = await supabase
        .from('compendium_templates')
        .select('*')
        .order('category')
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    }
  }

  const handleTemplateSelect = (templateKey: string) => {
    const template = templates.find(t => t.name === templateKey);
    if (template && editingEntry) {
      setEditingEntry({
        ...editingEntry,
        content: template.content,
        template: templateKey
      });
    }
  };

  const handleSave = async () => {
    if (!editingEntry) return;

    try {
      const { error } = await supabase
        .from('compendium')
        .upsert(editingEntry)
        .eq('id', editingEntry.id);

      if (error) throw error;

      await loadCompendiumEntries();
      setEditingEntry(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    }
  };

  const handleSaveAsTemplate = async (entry: CompendiumEntry) => {
    try {
      const template: CompendiumTemplate = {
        name: entry.title,
        category: entry.category,
        description: 'Template created from entry',
        content: entry.content
      };

      const { error } = await supabase
        .from('compendium_templates')
        .insert([template]);

      if (error) throw error;

      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const handleCreateTemplate = async (template: CompendiumTemplate) => {
    try {
      const { error } = await supabase
        .from('compendium_templates')
        .insert([template]);

      if (error) throw error;

      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
    }
  };

  const handleUpdateTemplate = async (template: CompendiumTemplate) => {
    try {
      const { error } = await supabase
        .from('compendium_templates')
        .update(template)
        .eq('id', template.id);

      if (error) throw error;

      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('compendium_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Loading compendium...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Compendium</h1>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate('/settings', { state: { section: 'compendium' } })}
            >
              Create Template
            </Button>
          )}
          {isAdmin && <CompendiumAdmin onEntryAdded={loadCompendiumEntries} />}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search the compendium..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Full Page Editor */}
      {fullPageEntry && (
        <CompendiumFullPage
          entry={fullPageEntry}
          onClose={() => setFullPageEntry(null)}
          onSave={handleSave}
          onSaveAsTemplate={handleSaveAsTemplate}
        />
      )}

      {/* TODO: Implement the new layout with sidebar and main content area */}
    </div>
  );
}
