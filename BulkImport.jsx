import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';

export default function BulkImport({ onImport, onCancel }) {
  const [csvText, setCsvText] = useState('');
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      setErrors(['CSV must have at least header and one data row']);
      setPreview([]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredFields = ['name', 'description', 'min_players', 'max_players', 'playing_time'];
    const missingFields = requiredFields.filter(f => !headers.includes(f));

    if (missingFields.length > 0) {
      setErrors([`Missing required columns: ${missingFields.join(', ')}`]);
      setPreview([]);
      return;
    }

    const games = [];
    const newErrors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        newErrors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });

      // Validate required fields
      if (!row.name) {
        newErrors.push(`Row ${i + 1}: Name is required`);
        continue;
      }
      if (!row.description) {
        newErrors.push(`Row ${i + 1}: Description is required`);
        continue;
      }

      // Create game object
      const game = {
        name: row.name,
        description: row.description,
        min_players: parseInt(row.min_players) || 2,
        max_players: parseInt(row.max_players) || 4,
        playing_time: parseInt(row.playing_time) || 30,
        difficulty: row.difficulty || 'Medium',
        theme: row.theme || null,
        price: parseFloat(row.price) || 0,
        condition: row.condition || 'Good',
      };

      // Validate numbers
      if (game.min_players < 1) {
        newErrors.push(`Row ${i + 1}: min_players must be at least 1`);
        continue;
      }
      if (game.max_players < game.min_players) {
        newErrors.push(`Row ${i + 1}: max_players must be >= min_players`);
        continue;
      }
      if (game.playing_time < 1) {
        newErrors.push(`Row ${i + 1}: playing_time must be at least 1`);
        continue;
      }

      games.push(game);
    }

    setErrors(newErrors);
    setPreview(games);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setCsvText(text);
        parseCSV(text);
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setCsvText(text);
    parseCSV(text);
  };

  const handleImport = () => {
    if (preview.length === 0) {
      alert('No valid games to import');
      return;
    }

    if (!window.confirm(`Import ${preview.length} games?`)) return;

    onImport(preview);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-6 h-6" /> Bulk Import Games
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Required:</h3>
            <code className="bg-white p-3 rounded block text-xs font-mono text-slate-700 overflow-x-auto">
              name,description,min_players,max_players,playing_time,difficulty,theme,price,condition
            </code>
            <p className="text-blue-800 text-sm mt-3">
              ⚠️ Required: name, description, min_players, max_players, playing_time
            </p>
          </div>

          {/* Example */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">Example:</h3>
            <code className="text-xs text-slate-700 block whitespace-pre-wrap">
{`Catan,Build settlements and trade resources,2,4,60,Medium,Strategy,500,Good
Ticket to Ride,Rail network building game,2,5,45,Easy,Adventure,400,Like New`}
            </code>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload CSV File (or paste below)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          {/* Paste CSV */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Or Paste CSV Text
            </label>
            <textarea
              value={csvText}
              onChange={handleTextChange}
              placeholder="name,description,min_players,max_players,playing_time,difficulty,theme,price,condition&#10;Game Name,Description,2,4,60,Medium,Strategy,500,Good"
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 font-mono text-sm"
            />
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Validation Errors
              </h3>
              <ul className="text-red-800 text-sm space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Preview: {preview.length} valid games
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {preview.map((game, idx) => (
                  <div key={idx} className="bg-white p-2 rounded text-sm border border-green-200">
                    <div className="font-semibold text-green-900">{idx + 1}. {game.name}</div>
                    <div className="text-green-800 text-xs">
                      {game.min_players}-{game.max_players} players • {game.playing_time}m • {game.difficulty}
                      {game.price > 0 && ` • ₹${game.price}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {preview.length > 0 ? preview.length : ''} Games
          </button>
        </div>
      </div>
    </div>
  );
}
