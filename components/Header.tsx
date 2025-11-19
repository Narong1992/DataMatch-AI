import React from 'react';
import { ComparisonMode } from '../types';

interface HeaderProps {
  mode: ComparisonMode;
  setMode: (mode: ComparisonMode) => void;
}

const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">DataMatch AI</h1>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {[ComparisonMode.TEXT, ComparisonMode.JSON, ComparisonMode.SEMANTIC].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                mode === m
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {m.charAt(0) + m.slice(1).toLowerCase()} Mode
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;