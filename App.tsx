import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import AnalysisResult from './components/AnalysisResult';
import { analyzeDataMismatch } from './services/geminiService';
import { ComparisonMode, GeminiAnalysisResult } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<ComparisonMode>(ComparisonMode.TEXT);
  const [leftText, setLeftText] = useState<string>('');
  const [rightText, setRightText] = useState<string>('');
  
  const [aiResult, setAiResult] = useState<GeminiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset AI result when text changes significantly to avoid stale data
  useEffect(() => {
    if (aiResult) setAiResult(null);
    if (error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftText, rightText, mode]);

  // Compute basic strict equality
  const isExactMatch = useMemo(() => {
    if (!leftText && !rightText) return true;
    if (mode === ComparisonMode.JSON) {
        try {
            // Try to normalize JSON for comparison
            const l = JSON.stringify(JSON.parse(leftText));
            const r = JSON.stringify(JSON.parse(rightText));
            return l === r;
        } catch (e) {
            return leftText === rightText;
        }
    }
    return leftText === rightText;
  }, [leftText, rightText, mode]);

  const handleAnalyze = async () => {
    if (!leftText.trim() || !rightText.trim()) {
      setError("Please enter text in both fields to compare.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeDataMismatch(leftText, rightText);
      setAiResult(result);
    } catch (err) {
      setError("Failed to analyze data. Please try again or check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const prettifyJSON = () => {
      try {
        if (leftText) setLeftText(JSON.stringify(JSON.parse(leftText), null, 2));
        if (rightText) setRightText(JSON.stringify(JSON.parse(rightText), null, 2));
      } catch (e) {
          setError("Invalid JSON detected. Cannot format.");
          setTimeout(() => setError(null), 3000);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header mode={mode} setMode={setMode} />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toolbar / Status */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isExactMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    <span className={`block w-2.5 h-2.5 rounded-full ${isExactMatch ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className="font-semibold text-sm">
                        {isExactMatch ? 'Exact Match' : 'Inputs Differ'}
                    </span>
                </div>
                {!isExactMatch && (
                    <span className="text-sm text-slate-500">
                        {(Math.abs(leftText.length - rightText.length))} char difference
                    </span>
                )}
            </div>

            {mode === ComparisonMode.JSON && (
                <button 
                    onClick={prettifyJSON}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Prettify JSON
                </button>
            )}
        </div>

        {/* Error Toast */}
        {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] mb-8">
          <InputPanel 
            label="Source A (Original)" 
            value={leftText} 
            onChange={setLeftText} 
            isDiffMode={!isExactMatch}
            otherValue={rightText}
            variant="original"
          />
          <InputPanel 
            label="Source B (Modified)" 
            value={rightText} 
            onChange={setRightText} 
            isDiffMode={!isExactMatch}
            otherValue={leftText}
            variant="modified"
          />
        </div>

      </main>

      <AnalysisResult 
        result={aiResult} 
        loading={isAnalyzing} 
        onAnalyze={handleAnalyze} 
      />
    </div>
  );
};

export default App;