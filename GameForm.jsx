import React, { useState } from 'react';
import { X } from 'lucide-react';

const GAME_THEMES = ['Fantasy', 'Sci-Fi', 'Mystery', 'Strategy', 'Party', 'Cooperative', 'Horror', 'Adventure'];

export default function GameForm({ game, onSave, onCancel }) {
  const [formData, setFormData] = useState(game || {
    name: '',
    description: '',
    min_players: 2,
    max_players: 4,
    playing_time: 30,
    difficulty: 'Medium',
    theme: '',
    price: 0,
    condition: 'Good',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Game name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.min_players < 1) newErrors.min_players = 'Minimum 1 player';
    if (formData.max_players < formData.min_players) newErrors.max_players = 'Max players must be ≥ min players';
    if (formData.playing_time < 1) newErrors.playing_time = 'Playing time must be at least 1 minute';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'min_players' || name === 'max_players' || name === 'playing_time'
        ? parseFloat(value) || 0
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">
            {game ? 'Edit Game' : 'Add New Game'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Game Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                  placeholder="e.g., Catan"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                  placeholder="Describe the game, its mechanics, and what makes it special..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="">Select a theme...</option>
                  {GAME_THEMES.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Gameplay Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Gameplay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Minimum Players
                </label>
                <input
                  type="number"
                  name="min_players"
                  value={formData.min_players}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.min_players ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                />
                {errors.min_players && <p className="text-red-500 text-sm mt-1">{errors.min_players}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Maximum Players
                </label>
                <input
                  type="number"
                  name="max_players"
                  value={formData.max_players}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.max_players ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                />
                {errors.max_players && <p className="text-red-500 text-sm mt-1">{errors.max_players}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Playing Time (minutes)
                </label>
                <input
                  type="number"
                  name="playing_time"
                  value={formData.playing_time}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.playing_time ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-purple-200'
                  }`}
                />
                {errors.playing_time && <p className="text-red-500 text-sm mt-1">{errors.playing_time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rental Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Rental Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rental Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="10"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition font-medium"
            >
              {game ? 'Update Game' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
