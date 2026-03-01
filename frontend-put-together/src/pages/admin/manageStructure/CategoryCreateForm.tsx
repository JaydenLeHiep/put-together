type CategoryCreateFormProps = {
  newCategory: {
    name: string;
    description: string;
  };
  onChange: (value: { name: string; description: string }) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function CategoryCreateForm({
  newCategory,
  onChange,
  onSave,
  onCancel,
}: CategoryCreateFormProps) {
  return (
    <div className="bg-white border-2 border-lila-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Neue Kategorie erstellen</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            value={newCategory.name}
            onChange={(e) =>
              onChange({ ...newCategory, name: e.target.value })
            }
            placeholder="z.B. Grammatik"
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-lila-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beschreibung</label>
          <textarea
            value={newCategory.description}
            onChange={(e) =>
              onChange({ ...newCategory, description: e.target.value })
            }
            placeholder="Optionale Beschreibung"
            rows={3}
            className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-lila-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Speichern
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}