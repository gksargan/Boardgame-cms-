import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, ChevronDown, BarChart3, Calendar, MessageSquare } from 'lucide-react';
import supabase from '../lib/supabaseClient';
import GameForm from './GameForm';
import GameCard from './GameCard';
import AnalyticsDashboard from './AnalyticsDashboard';
import BookingsManager from './BookingsManager';
import ReviewsManager from './ReviewsManager';

export default function AdminPanel() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activeTab, setActiveTab] = useState('games');

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
                           game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (game.theme && game.theme.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = filterDifficulty === 'all' || game.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
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
  }, [games, searchTerm, filterDifficulty, sortBy]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const { error } = await supabase
        .from('board_games')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGames(games.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleSaveGame = async (gameData) => {
    try {
      if (editingGame) {
        // Update existing game
        const { error } = await supabase
          .from('board_games')
          .update(gameData)
          .eq('id', editingGame.id);

        if (error) throw error;
        setGames(games.map(g => g.id === editingGame.id ? { ...g, ...gameData } : g));
      } else {
        // Add new game
        const { data, error } = await supabase
          .from('board_games')
          .insert([gameData])
          .select();

        if (error) throw error;
        if (data) setGames([...games, ...data]);
      }

      setShowForm(false);
      setEditingGame(null);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-3 font-medium border-b-2 transition ${
            activeTab === 'games'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Games Library
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === 'bookings'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" /> Bookings
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-3 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Reviews
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'games' && (
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Game Library</h2>
          <p className="text-slate-600 mt-1">{filteredGames.length} games available</p>
        </div>
        <button
          onClick={() => {
            setEditingGame(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Game
        </button>
      </div>

      {/* Game Form Modal */}
      {showForm && (
        <GameForm
          game={editingGame}
          onSave={handleSaveGame}
          onCancel={() => {
            setShowForm(false);
            setEditingGame(null);
          }}
        />
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        >
          <option value="name">Sort by Name</option>
          <option value="players">Sort by Players</option>
          <option value="time">Sort by Time</option>
        </select>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-slate-600 mt-4">Loading games...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-600">No games found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="relative">
              <GameCard game={game} />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditingGame(game);
                    setShowForm(true);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && <AnalyticsDashboard />}
      {activeTab === 'bookings' && <BookingsManager />}
      {activeTab === 'reviews' && <ReviewsManager />}
    </div>
  );
}
