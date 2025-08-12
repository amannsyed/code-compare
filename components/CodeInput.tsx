
import React from 'react';

interface CodeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col h-full">
      <label className="mb-2 font-semibold text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        spellCheck="false"
        className="flex-grow p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-80 md:h-96"
        placeholder={`Paste your ${label.toLowerCase()} here...`}
      />
    </div>
  );
};
