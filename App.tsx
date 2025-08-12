
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { DiffViewer } from './components/DiffViewer';
import { DEFAULT_ORIGINAL_CODE, DEFAULT_CHANGED_CODE } from './constants';

function App() {
  const [originalCode, setOriginalCode] = useState<string>(DEFAULT_ORIGINAL_CODE);
  const [changedCode, setChangedCode] = useState<string>(DEFAULT_CHANGED_CODE);
  const [showDiff, setShowDiff] = useState<boolean>(true); // Show diff by default

  const handleCompare = useCallback(() => {
    setShowDiff(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <Header />
        <main className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeInput
              label="Original Code"
              value={originalCode}
              onChange={(e) => {
                setOriginalCode(e.target.value);
                setShowDiff(false); // Hide diff on input change
              }}
            />
            <CodeInput
              label="Changed Code"
              value={changedCode}
              onChange={(e) => {
                setChangedCode(e.target.value);
                setShowDiff(false); // Hide diff on input change
              }}
            />
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleCompare}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {'Compare Differences'}
            </button>
          </div>

          <div className="mt-8">
            {showDiff && (
              <DiffViewer 
                originalCode={originalCode} 
                changedCode={changedCode} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
