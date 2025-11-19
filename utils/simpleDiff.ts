import { DiffResult } from "../types";

export const computeSimpleDiff = (text1: string, text2: string): DiffResult => {
  const lines1 = text1.split(/\r?\n/);
  const lines2 = text2.split(/\r?\n/);
  
  // Very basic line-by-line comparison for visual MVP
  // A real production app might use 'diff' package, but this suffices for "Check if matches" 
  // and visual alignment for same-length files or simple lists.
  
  const maxLines = Math.max(lines1.length, lines2.length);
  const diffLines = [];
  let isExactMatch = true;

  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i] || "";
    const l2 = lines2[i] || "";
    
    if (l1 === l2) {
      diffLines.push({ lineNumber: i + 1, content: l1, status: 'unchanged' as const });
    } else {
      isExactMatch = false;
      // If purely adding/removing lines happens, this simple index match fails to align.
      // However, for a "Data Checker" tool, knowing index mismatch is often desired.
      // We will just mark them as modified at that index.
      if (l1 !== "") diffLines.push({ lineNumber: i + 1, content: l1, status: 'removed' as const });
      if (l2 !== "") diffLines.push({ lineNumber: i + 1, content: l2, status: 'added' as const });
    }
  }

  if (lines1.length !== lines2.length) isExactMatch = false;
  if (lines1.length === 1 && lines2.length === 1 && lines1[0] !== lines2[0]) isExactMatch = false;
  if (text1 === "" && text2 === "") isExactMatch = true;

  return { isExactMatch, diffLines };
};
