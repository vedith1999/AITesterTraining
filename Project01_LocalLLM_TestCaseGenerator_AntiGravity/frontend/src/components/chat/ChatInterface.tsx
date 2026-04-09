import React, { useState } from 'react';
import { Send, Paperclip, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { useSettings, buildGeneratePayload } from '../../context/SettingsContext';
import axios from 'axios';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { settings } = useSettings();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setTestCases([]);
    setErrorMsg(null);
    try {
      const payload = buildGeneratePayload(settings, input);
      const response = await axios.post('http://localhost:3001/api/generate', payload);
      
      if (response.data.testCases) {
        setTestCases(response.data.testCases);
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      const msg = error.response?.data?.error || "Failed to generate test cases. Please verify your settings and API keys.";
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
      setInput(''); // clear after send
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Output Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/40">
        
        {/* Placeholder if empty */}
        {testCases.length === 0 && !isGenerating && !errorMsg && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>Enter your requirements below to generate Jira formatted Test Cases</p>
          </div>
        )}

        {/* Error State */}
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 shadow-sm flex items-start flex-col">
            <h4 className="font-bold flex items-center gap-2 mb-2">Generation Failed</h4>
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center gap-3 text-blue-500 p-4 border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl max-w-sm">
            <Loader2 className="animate-spin" size={20} />
            <span>Generating test cases with {settings.activeProvider}...</span>
          </div>
        )}

        {/* Generated Test Cases (Jira Format) */}
        {testCases.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green-500" />
              Generated Test Cases ({settings.activeProvider})
            </h3>
            
            {testCases.map((tc, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
                  <div>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                      {tc.testCaseID || `TC-${String(idx+1).padStart(3, '0')}`}
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mt-2">{tc.scenario}</h4>
                  </div>
                  {tc.status && tc.status !== "N/A" && (
                     <span className={`text-xs px-2 py-1 rounded font-bold ${
                        tc.status === 'Pass' ? 'bg-green-100 text-green-700' : 
                        tc.status === 'Fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                     }`}>
                        {tc.status}
                     </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-100 dark:border-gray-700">
                     <h5 className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Steps</h5>
                     <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{tc.steps}</p>
                   </div>
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-100 dark:border-gray-700">
                     <h5 className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Expected Result</h5>
                     <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{tc.expectedResults}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            className="flex-1 bg-transparent outline-none p-2 text-gray-800 dark:text-gray-200 placeholder-gray-500"
            placeholder="Paste your Jira requirements, user story, or ask to generate test cases..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            disabled={isGenerating}
          />
          <button 
            onClick={handleGenerate}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={!input.trim() || isGenerating}
          >
            <Send size={18} className={isGenerating ? "" : "translate-x-0.5"} />
          </button>
        </div>
      </div>
    </div>
  );
};
