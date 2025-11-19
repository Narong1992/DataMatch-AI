import React, { useRef } from 'react';

interface InputPanelProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isDiffMode: boolean;
  otherValue: string; // To compute diff highlights
  variant: 'original' | 'modified';
}

const InputPanel: React.FC<InputPanelProps> = ({ label, value, onChange, isDiffMode, otherValue, variant }) => {
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

  // Color definitions based on GitHub diff styles
  const diffColorClass = variant === 'original' ? 'bg-red-100/70' : 'bg-green-100/70';

  return (
    <div className="flex flex-col h-full group">
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${variant === 'original' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{label}</h2>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

      <div className={`relative flex-1 min-h-[400px] border rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm ${variant === 'original' ? 'border-red-100' : 'border-emerald-100'}`}>
        {/* Diff Underlay Layer */}
        {isDiffMode && (
          <pre
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none font-mono text-sm p-4 whitespace-pre overflow-hidden text-transparent"
          >
            {lines.map((line, i) => {
              const otherLine = otherLines[i];
              // A line is considered "changed" if it doesn't match the other line at the same index,
              // or if the other line doesn't exist (length mismatch).
              const isDiff = (otherLine !== undefined && line !== otherLine) || (otherLine === undefined && line !== '');
              
              const bgClass = isDiff ? diffColorClass : '';
              
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
        {value.length} chars &bull; {lines.length} lines
      </div>
    </div>
  );
};

export default InputPanel;