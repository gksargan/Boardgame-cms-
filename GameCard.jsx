import React from 'react';
import { Users, Clock, Zap, Tag } from 'lucide-react';

const difficultyColor = {
  'Easy': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Hard': 'bg-red-100 text-red-800',
};

const conditionColor = {
  'Like New': 'bg-blue-100 text-blue-800',
  'Good': 'bg-green-100 text-green-800',
  'Fair': 'bg-yellow-100 text-yellow-800',
  'Needs Repair': 'bg-red-100 text-red-800',
};

export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-slate-200 overflow-hidden h-full flex flex-col">
      {/* Header with difficulty badge */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{game.name}</h3>
        <div className="flex gap-2 flex-wrap">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor[game.difficulty]}`}>
            {game.difficulty}
          </span>
          {game.theme && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
              {game.theme}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {game.description}
        </p>

        {/* Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="text-sm">
              <strong>{game.min_players}-{game.max_players}</strong> players
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-sm">
              <strong>{game.playing_time}</strong> minutes
            </span>
          </div>

          {game.price > 0 && (
            <div className="flex items-center gap-2 text-slate-700">
              <Tag className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">
                <strong>₹{game.price}</strong> rental
              </span>
            </div>
          )}

          {game.condition && (
            <div className="flex items-center gap-2">
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${conditionColor[game.condition]}`}>
                {game.condition}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
