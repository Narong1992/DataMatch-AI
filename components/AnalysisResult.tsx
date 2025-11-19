import React, { useState } from 'react';
import { GeminiAnalysisResult } from '../types';

interface AnalysisResultProps {
  result: GeminiAnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, loading, onAnalyze }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!result) return;
    
    const markdown = `
### Data Match Analysis
**Status:** ${result.isSemanticMatch ? '✅ Match' : '❌ Mismatch'}
**Similarity Score:** ${result.similarityScore}%

**Summary:**
${result.summary}

**Key Differences:**
${result.keyDifferences.map(d => `- ${d}`).join('\n')}

${result.suggestions && result.suggestions.length > 0 ? `**Suggestions:**\n${result.suggestions.map(s => `- ${s}`).join('\n')}` : ''}
    `.trim();

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex-1 w-full">
            {!result && !loading && (
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-sm">Ready to analyze differences using Gemini AI models.</span>
                <button
                  onClick={onAnalyze}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm ring-offset-2 focus:ring-2 ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.9-1.35a1 1 0 00-1.66-1.12l-2 3a1 1 0 00.83 1.57h4.15A2 2 0 0019 13V5a4 4 0 00-4-4H5a4 4 0 00-4 4v8a4 4 0 004 4h1.42l1.5 2.25a1 1 0 001.66-1.12l-1.35-2.03H5a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                  AI Deep Scan
                </button>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-full ${result.isSemanticMatch ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {result.isSemanticMatch ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {result.isSemanticMatch ? 'Semantically Equivalent' : 'Significant Differences Detected'}
                      </h3>
                      <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          result.similarityScore > 80 ? 'bg-green-100 text-green-800' :
                          result.similarityScore > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.similarityScore}% Match Score
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-4">{result.summary}</p>
                    
                    {result.keyDifferences.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Differences</h4>
                        <ul className="space-y-2">
                          {result.keyDifferences.map((diff, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                              {diff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end gap-4">
                       <button
                          onClick={copyToClipboard}
                          className="inline-flex items-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          {copied ? (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Copied to Clipboard
                             </>
                          ) : (
                             <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy for GitHub
                             </>
                          )}
                        </button>
                       <button
                          onClick={onAnalyze}
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline px-4 py-2"
                        >
                          Re-analyze
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;