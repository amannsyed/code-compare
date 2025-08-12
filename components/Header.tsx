
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Code Difference Checker
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Compare two blocks of code and see the changes highlighted.
      </p>
    </header>
  );
};
