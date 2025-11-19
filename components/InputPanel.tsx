import React, { useRef, useEffect } from 'react';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isDiffMode: boolean;
  otherValue: string; // To compute diff highlights
  readOnly?: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ label, value, onChange, isDiffMode, otherValue }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Split lines for highlight rendering
  const lines = value.split(/\r?\n/);
  const otherLines = otherValue.split(/\r?\n/);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{label}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => navigator.clipboard.readText().then(onChange)}
            className="text-xs bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded hover:bg-slate-50"
          >
            Paste
          </button>
          <button 
            onClick={() => onChange('')}
            className="text-xs bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded hover:text-red-600 hover:border-red-200 hover:bg-red-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="relative flex-1 min-h-[400px] border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
        {/* Diff Underlay Layer */}
        {isDiffMode && (
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none font-mono text-sm p-4 whitespace-pre overflow-hidden text-transparent"
          >
            {lines.map((line, i) => {
              const otherLine = otherLines[i];
              const isDiff = otherLine !== undefined && line !== otherLine;
              // Simple check: if line exists in both but differs, mark yellow.
              // If line doesn't exist in other (meaning this is longer), mark green/red depending on side?
              // Let's keep it simple: Highlight modified lines.
              const bgClass = isDiff ? 'bg-yellow-100/80' : '';
              
              return (
                <div key={i} className={`${bgClass} w-full min-h-[1.25rem]`}>
                  {line || ' '}
                </div>
              );
            })}
          </pre>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className={`absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent resize-none outline-none text-slate-800 leading-5 ${isDiffMode ? 'z-10' : ''}`}
          placeholder={`Paste ${label} data here...`}
          spellCheck={false}
        />
      </div>
      
      <div className="mt-2 text-xs text-slate-400 flex justify-end">
        {value.length} characters &bull; {lines.length} lines
      </div>
    </div>
  );
};

export default InputPanel;