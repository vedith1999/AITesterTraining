import React, { useState } from 'react';
import { HistorySidebar } from '../chat/HistorySidebar';
import { ChatInterface } from '../chat/ChatInterface';
import { SettingsPanel } from '../settings/SettingsPanel';
import { Settings as SettingsIcon, Menu, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden font-sans">
      
      {/* Left Sidebar: History */}
      <div className="hidden md:flex w-72 flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LocalLLM Tester
          </h1>
          <p className="text-xs text-gray-500 mt-1">AI-Powered Test Case Generator</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <HistorySidebar />
        </div>
      </div>
      
      {/* Right Main Area */}
      <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 w-full">
          <div className="flex items-center gap-3">
             <button className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Menu size={24} />
             </button>
             <h2 className="text-lg font-bold md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LocalLLM Tester</h2>
          </div>
          
          <button 
             onClick={() => setIsSettingsOpen(true)}
             className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95 shadow-sm font-medium text-sm ml-auto"
          >
            <SettingsIcon size={16} className="text-gray-600 dark:text-gray-400" />
            <span>Settings</span>
          </button>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden relative">
          <ChatInterface />
        </div>
      </div>

      {/* Settings Modal overlay */}
      {isSettingsOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200">
               <button 
                 onClick={() => setIsSettingsOpen(false)}
                 className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors z-10"
               >
                 <X size={20} />
               </button>
               <div className="p-8 overflow-y-auto">
                  <SettingsPanel />
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
