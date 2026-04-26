import React, { useState, useEffect } from 'react';
import { Search, Users, Clock, Tag, Dice6 } from 'lucide-react';
import supabase from '../lib/supabaseClient';
import GameCard from './GameCard';

export default function PublicView() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  // Fetch games from Supabase
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('board_games')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setGames(data || []);

      // Extract unique themes
      const uniqueThemes = [...new Set(data.map(g => g.theme).filter(Boolean))];
      setThemes(uniqueThemes.sort());
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort games
  useEffect(() => {
    let filtered = games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || game.difficulty === filterDifficulty;
      const matchesTheme = filterTheme === 'all' || game.theme === filterTheme;
      return matchesSearch && matchesDifficulty && matchesTheme;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'players':
          return a.min_players - b.min_players;
        case 'time':
          return a.playing_time - b.playing_time;
        default:
          return 0;
      }
    });

    setFilteredGames(filtered);
  }, [games, searchTerm, filterDifficulty, filterTheme, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
              <Dice6 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">BoardGame Café</h1>
              <p className="text-slate-600">Explore our game collection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Games</p>
                <p className="text-3xl font-bold text-slate-900">{games.length}</p>
              </div>
              <Dice6 className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Average Players</p>
                <p className="text-3xl font-bold text-slate-900">
                  {games.length > 0 
                    ? Math.round(games.reduce((acc, g) => acc + (g.min_players + g.max_players) / 2, 0) / games.length)
                    : 0
                  }
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Avg Play Time</p>
                <p className="text-3xl font-bold text-slate-900">
                  {games.length > 0 
                    ? Math.round(games.reduce((acc, g) => acc + g.playing_time, 0) / games.length)
                    : 0
                  } min
                </p>
              </div>
              <Clock className="w-12 h-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search games by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-base"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Themes</option>
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="name">Sort by Name</option>
                <option value="players">Sort by Players</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-slate-600 mt-4">Loading games...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Dice6 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No games found. Try adjusting your filters!</p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-4">
              Showing <strong>{filteredGames.length}</strong> of <strong>{games.length}</strong> games
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-slate-600 text-sm">
          <p>© 2024 BoardGame Café. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
