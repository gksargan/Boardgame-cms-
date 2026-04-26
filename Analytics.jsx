import React from 'react';
import { X, BarChart3, TrendingUp, Users, Clock, DollarSign, Zap } from 'lucide-react';

export default function Analytics({ games, onClose }) {
  const difficultyBreakdown = {
    Easy: games.filter(g => g.difficulty === 'Easy').length,
    Medium: games.filter(g => g.difficulty === 'Medium').length,
    Hard: games.filter(g => g.difficulty === 'Hard').length,
  };

  const themeBreakdown = {};
  games.forEach(g => {
    if (g.theme) {
      themeBreakdown[g.theme] = (themeBreakdown[g.theme] || 0) + 1;
    }
  });

  const sortedThemes = Object.entries(themeBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const avgPlayTime = games.length > 0 
    ? Math.round(games.reduce((sum, g) => sum + g.playing_time, 0) / games.length)
    : 0;

  const avgPlayers = games.length > 0 
    ? (games.reduce((sum, g) => sum + (g.min_players + g.max_players) / 2, 0) / games.length).toFixed(1)
    : 0;

  const totalValue = games.reduce((sum, g) => sum + (g.price || 0), 0);

  const mostExpensive = [...games].sort((a, b) => b.price - a.price).slice(0, 5);
  const longestGames = [...games].sort((a, b) => b.playing_time - a.playing_time).slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" /> Analytics Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Total Games</p>
                  <p className="text-3xl font-bold text-purple-900">{games.length}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Total Catalog Value</p>
                  <p className="text-3xl font-bold text-blue-900">₹{totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Avg Players</p>
                  <p className="text-3xl font-bold text-green-900">{avgPlayers}</p>
                </div>
                <Users className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">Avg Play Time</p>
                  <p className="text-3xl font-bold text-orange-900">{avgPlayTime}m</p>
                </div>
                <Clock className="w-10 h-10 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Difficulty Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(difficultyBreakdown).map(([difficulty, count]) => (
                <div key={difficulty}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{difficulty}</span>
                    <span className="text-slate-600">{count} games ({Math.round(count / games.length * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        difficulty === 'Easy' ? 'bg-green-500' :
                        difficulty === 'Medium' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / games.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Breakdown */}
          {sortedThemes.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Top Themes</h3>
              <div className="space-y-2">
                {sortedThemes.map(([theme, count]) => (
                  <div key={theme} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span className="font-medium text-slate-900">{theme}</span>
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Expensive */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">💰 Most Valuable</h3>
              <div className="space-y-2">
                {mostExpensive.map((game, idx) => (
                  <div key={game.id} className="flex justify-between items-center p-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-600 text-lg">{idx + 1}</span>
                      <span className="text-slate-700 truncate">{game.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">₹{game.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Longest Games */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">⏱️ Longest Games</h3>
              <div className="space-y-2">
                {longestGames.map((game, idx) => (
                  <div key={game.id} className="flex justify-between items-center p-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-orange-600 text-lg">{idx + 1}</span>
                      <span className="text-slate-700 truncate">{game.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{game.playing_time}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Quick Insights
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• {difficultyBreakdown.Medium} medium difficulty games ({Math.round(difficultyBreakdown.Medium / games.length * 100)}%) - most common difficulty level</li>
              <li>• Average game accommodates {avgPlayers} players and takes {avgPlayTime} minutes to play</li>
              <li>• Total catalog value: ₹{totalValue.toLocaleString()}</li>
              {sortedThemes.length > 0 && <li>• Most popular theme: <strong>{sortedThemes[0][0]}</strong> with {sortedThemes[0][1]} games</li>}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
