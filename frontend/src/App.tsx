import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { AIChat } from './components/AIChat';
import { About } from './components/About';
import { Leaf, BarChart3, MessageSquare, Info, Menu, X } from 'lucide-react';

const tabs = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: Leaf },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai', path: '/ai', label: 'AI Assistant', icon: MessageSquare },
  { id: 'about', path: '/about', label: 'About', icon: Info },
];

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between lg:justify-start">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.15"/>
                  <path d="M24 12C24 12 18 16 18 22C18 25.314 20.686 28 24 28C27.314 28 30 25.314 30 22C30 16 24 12 24 12Z" fill="white" fillOpacity="0.9"/>
                  <path d="M24 18C24 18 20 20.5 20 24C20 26.209 21.791 28 24 28C26.209 28 28 26.209 28 24C28 20.5 24 18 24 18Z" fill="#22c55e"/>
                  <rect x="22" y="26" width="4" height="12" rx="1" fill="white" fillOpacity="0.9"/>
                  <ellipse cx="24" cy="38" rx="6" ry="2" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <h1 className="text-white text-2xl">Smart Plant</h1>
            </div>

            <nav className="hidden lg:flex flex-1 justify-center">
              <div className="flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <NavLink
                      key={tab.id}
                      to={tab.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-6 py-2 rounded-lg transition-colors whitespace-nowrap !text-white ${
                          isActive
                            ? 'bg-emerald-500 shadow-md'
                            : 'hover:bg-emerald-500 hover:bg-opacity-80'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai" element={<AIChat />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Smart Plant | © 2025 | Harun Safro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}