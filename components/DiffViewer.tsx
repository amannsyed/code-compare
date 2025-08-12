
import React, { useMemo, useState } from 'react';
import type { Change } from '../types';

// --- TYPES ---
interface LineInfo {
  number?: number;
  content: React.ReactNode;
  rawContent?: string;
  type: 'added' | 'removed' | 'common' | 'placeholder';
}

interface DiffLinePair {
  left: LineInfo;
  right: LineInfo;
}

// --- ICONS ---
const MinusIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" className="fill-red-400">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12M5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1"></path>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" className="fill-green-400">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12M8 4.5a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 .5-.5"></path>
  </svg>
);

// --- LINE COMPONENT ---
const DiffLine: React.FC<LineInfo> = ({ number, content, type }) => {
  const bgClass = {
    added: 'bg-green-500/20',
    removed: 'bg-red-500/20',
    common: '',
    placeholder: '',
  }[type];

  return (
    <div className="flex w-full min-h-[20px]">
      <span className="w-10 text-right pr-4 text-gray-500 select-none flex-shrink-0">{number || ''}</span>
      <pre className={`flex-1 whitespace-pre-wrap break-all pr-4 pl-2 ${bgClass}`}>{content || <>&nbsp;</>}</pre>
    </div>
  );
};

// --- PANEL COMPONENT ---
interface DiffPanelProps {
  side: 'left' | 'right';
  changeCount: number;
  totalLines: number;
  lines: LineInfo[];
}

const DiffPanel: React.FC<DiffPanelProps> = ({ side, changeCount, totalLines, lines }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = lines.map(line => line.rawContent ?? '').join('\n');
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isLeft = side === 'left';

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b border-gray-700 text-sm text-gray-400 sticky top-0 bg-gray-800 z-10">
                <div className="flex items-center gap-2 font-medium">
                    {isLeft ? <MinusIcon /> : <PlusIcon />}
                    <span>{changeCount} {isLeft ? 'removals' : 'additions'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs">{totalLines} lines</span>
                    <button onClick={handleCopy} className="text-xs font-semibold hover:text-white transition-colors duration-200">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
            <div className="font-mono text-sm leading-5 overflow-auto">
                {lines.map((line, index) => <DiffLine key={index} {...line} />)}
            </div>
        </div>
    )
}

// --- MAIN VIEWER COMPONENT ---
export const DiffViewer: React.FC<{ originalCode: string; changedCode: string; }> = ({ originalCode, changedCode }) => {
  const { linePairs, additions, removals } = useMemo(() => {
    if (typeof Diff === 'undefined') {
      return { linePairs: [], additions: 0, removals: 0 };
    }
    const diffs = Diff.diffLines(originalCode, changedCode);
    
    const linePairs: DiffLinePair[] = [];
    let leftLineNum = 1;
    let rightLineNum = 1;
    let additions = 0;
    let removals = 0;
    
    let i = 0;
    while (i < diffs.length) {
      const current = diffs[i];
      const next = diffs[i+1];

      const getLines = (part: Change) => {
        const lines = part.value.split('\n');
        if (lines[lines.length - 1] === '') lines.pop();
        return lines;
      };

      if (current.removed && next && next.added) {
        const leftBlockLines = getLines(current);
        const rightBlockLines = getLines(next);
        removals += leftBlockLines.length;
        additions += rightBlockLines.length;
        const maxLength = Math.max(leftBlockLines.length, rightBlockLines.length);

        for (let j = 0; j < maxLength; j++) {
            const leftLine = leftBlockLines[j];
            const rightLine = rightBlockLines[j];
            let leftContent: React.ReactNode = leftLine;
            let rightContent: React.ReactNode = rightLine;

            if (leftLine !== undefined && rightLine !== undefined) {
              const wordDiffs = Diff.diffWordsWithSpace(leftLine, rightLine);
              const leftSpans: React.ReactNode[] = [];
              const rightSpans: React.ReactNode[] = [];
              wordDiffs.forEach((word, k) => {
                  if (word.added) {
                      rightSpans.push(<span key={k} className="bg-green-500/40 rounded-sm">{word.value}</span>);
                  } else if (word.removed) {
                      leftSpans.push(<span key={k} className="bg-red-500/40 rounded-sm">{word.value}</span>);
                  } else {
                      leftSpans.push(<span key={k}>{word.value}</span>);
                      rightSpans.push(<span key={k}>{word.value}</span>);
                  }
              });
              leftContent = <>{leftSpans}</>;
              rightContent = <>{rightSpans}</>;
            }

            linePairs.push({
              left: { number: leftLine !== undefined ? leftLineNum++ : undefined, content: leftContent, rawContent: leftLine, type: 'removed' },
              right: { number: rightLine !== undefined ? rightLineNum++ : undefined, content: rightContent, rawContent: rightLine, type: 'added' }
            });
        }
        i += 2;
      } else if (current.removed) {
        const blockLines = getLines(current);
        removals += blockLines.length;
        blockLines.forEach(line => {
          linePairs.push({
            left: { number: leftLineNum++, content: line, rawContent: line, type: 'removed' },
            right: { content: '', type: 'placeholder' }
          });
        });
        i++;
      } else if (current.added) {
        const blockLines = getLines(current);
        additions += blockLines.length;
        blockLines.forEach(line => {
          linePairs.push({
            left: { content: '', type: 'placeholder' },
            right: { number: rightLineNum++, content: line, rawContent: line, type: 'added' }
          });
        });
        i++;
      } else { // common
        const blockLines = getLines(current);
        blockLines.forEach(line => {
          linePairs.push({
            left: { number: leftLineNum++, content: line, rawContent: line, type: 'common' },
            right: { number: rightLineNum++, content: line, rawContent: line, type: 'common' }
          });
        });
        i++;
      }
    }
    return { linePairs, additions, removals };
  }, [originalCode, changedCode]);

  const hasChanges = additions > 0 || removals > 0;

  if (!hasChanges) {
    return (
      <div className="p-4 text-center text-green-400 bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-lg">No Differences Found</h3>
        <p className="text-gray-400">The two code blocks are identical.</p>
      </div>
    );
  }

  const originalLines = linePairs.map(p => p.left);
  const changedLines = linePairs.map(p => p.right);
  
  const originalTotalLines = originalCode.split('\n').length;
  const changedTotalLines = changedCode.split('\n').length;

  return (
    <div className="grid grid-cols-2 gap-px bg-gray-700 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
      <div className="bg-gray-800 overflow-hidden">
          <DiffPanel side="left" changeCount={removals} totalLines={originalTotalLines} lines={originalLines} />
      </div>
      <div className="bg-gray-800 overflow-hidden">
          <DiffPanel side="right" changeCount={additions} totalLines={changedTotalLines} lines={changedLines} />
      </div>
    </div>
  );
};
