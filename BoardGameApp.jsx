import React, { useState, useEffect } from 'react';
import { Dice6, Lock, LogOut, Menu, X, Search, Plus, Edit2, Trash2, Eye, Copy, Check } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import PublicView from './components/PublicView';
import supabase from './lib/supabaseClient';

export default function BoardGameApp() {
  const [view, setView] = useState('auth'); // 'auth', 'admin', 'public'
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Initialize - check if admin is already logged in
  useEffect(() => {
    const savedAdmin = localStorage.getItem('boardGameAdminCode');
    if (savedAdmin) {
      setAdminCode(savedAdmin);
      setIsAdmin(true);
      setView('admin');
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simple admin code check (change this to your desired code)
    const ADMIN_CODE = 'ADMIN123';
    
    if (codeInput === ADMIN_CODE) {
      localStorage.setItem('boardGameAdminCode', ADMIN_CODE);
      setAdminCode(ADMIN_CODE);
      setIsAdmin(true);
      setView('admin');
      setError('');
    } else {
      setError('Invalid admin code');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('boardGameAdminCode');
    setIsAdmin(false);
    setAdminCode('');
    setCodeInput('');
    setView('auth');
    setShowMenu(false);
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}?view=public`;
    setShareableLink(link);
  };

  if (view === 'auth' && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-blue-500 p-4 rounded-xl">
                <Dice6 className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white text-center mb-2">BoardGame Café</h1>
            <p className="text-purple-200 text-center mb-8">Admin Portal</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Admin Code
                </label>
                <input
                  type="password"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Enter admin code"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-105 active:scale-95"
              >
                Enter Admin Portal
              </button>
            </form>

            <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/50">
              <p className="text-xs text-purple-200 text-center">
                <strong>Demo Code:</strong> ADMIN123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
                <Dice6 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">BoardGame Café</h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={generateShareableLink}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Generate Share Link
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden border-t border-slate-200 p-4 space-y-2">
              <button
                onClick={generateShareableLink}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 justify-center"
              >
                <Eye className="w-4 h-4" /> Generate Share Link
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 justify-center"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}

          {/* Share Link Display */}
          {shareableLink && (
            <div className="border-t border-slate-200 p-4 bg-green-50">
              <div className="max-w-7xl mx-auto">
                <p className="text-sm font-medium text-slate-900 mb-2">Public Shareable Link:</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareableLink);
                    }}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <AdminPanel />
        </main>
      </div>
    );
  }

  return <PublicView />;
}
