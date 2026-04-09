import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';

export const HistorySidebar: React.FC = () => {
  const dummyHistory = [
    { id: 1, title: 'Login Page Tests' },
    { id: 2, title: 'Checkout API Flow' },
    { id: 3, title: 'User Profile Non-functional' },
  ];

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Clock size={20} className="text-blue-500" />
        History
      </h2>
      <ul className="flex-1 overflow-y-auto space-y-2">
        {dummyHistory.map((item) => (
          <li key={item.id}>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <MessageSquare size={16} />
              <span className="truncate">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
