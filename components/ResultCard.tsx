import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string | string[];
  color: 'blue' | 'purple' | 'amber' | 'emerald';
  icon: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, color, icon }) => {
  const [copied, setCopied] = useState(false);

  const colorStyles = {
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    purple: "border-purple-200 bg-purple-50 text-purple-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };

  const headerStyles = {
    blue: "text-blue-700",
    purple: "text-purple-700",
    amber: "text-amber-700",
    emerald: "text-emerald-700",
  };

  const handleCopy = () => {
    let textToCopy = "";
    if (Array.isArray(content)) {
      textToCopy = content.join('\n');
    } else {
      textToCopy = content;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${colorStyles[color]} p-5 h-full flex flex-col shadow-sm transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-white bg-opacity-60 ${headerStyles[color]}`}>
            {icon}
          </div>
          <h3 className={`font-bold text-base ${headerStyles[color]}`}>{title}</h3>
        </div>
        <button 
          onClick={handleCopy}
          className={`p-1.5 rounded-md hover:bg-white hover:bg-opacity-50 transition-colors ${headerStyles[color]}`}
          title="Copiar contenido"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      
      <div className="flex-grow text-sm leading-relaxed whitespace-pre-line">
        {Array.isArray(content) ? (
          <ul className="list-disc pl-4 space-y-1.5 marker:opacity-50">
            {content.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </div>
  );
};