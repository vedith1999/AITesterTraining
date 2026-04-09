import React, { useState } from 'react';
import { Settings, Save, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSettings, buildGeneratePayload } from '../../context/SettingsContext';
import axios from 'axios';

interface ProviderTestStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
}

export const SettingsPanel: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [testStatuses, setTestStatuses] = useState<Record<string, ProviderTestStatus>>({});
  const [saveStatus, setSaveStatus] = useState(false);

  const testProvider = async (provider: string) => {
    setTestStatuses(prev => ({ ...prev, [provider]: { status: 'testing' } }));
    try {
      const payload = buildGeneratePayload({ ...settings, activeProvider: provider }, 'Say OK');
      const res = await axios.post('http://localhost:3001/api/test-connection', payload);
      if (res.data.status === 'OK') {
        setTestStatuses(prev => ({ ...prev, [provider]: { status: 'success', message: 'Connected!' } }));
      } else {
        setTestStatuses(prev => ({ ...prev, [provider]: { status: 'error', message: 'Bad response' } }));
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Connection failed';
      setTestStatuses(prev => ({ ...prev, [provider]: { status: 'error', message: msg } }));
    }
  };

  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const s = settings;
  const upd = (patch: Partial<typeof s>) => setSettings(prev => ({ ...prev, ...patch }));

  const TestBtn: React.FC<{ providerKey: string }> = ({ providerKey }) => {
    const ts = testStatuses[providerKey];
    return (
      <button
        onClick={() => testProvider(providerKey)}
        disabled={ts?.status === 'testing'}
        className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
      >
        {ts?.status === 'testing' ? <Loader2 size={14} className="animate-spin" /> :
         ts?.status === 'success' ? <CheckCircle size={14} className="text-green-500" /> :
         ts?.status === 'error' ? <AlertCircle size={14} className="text-red-500" /> :
         <Zap size={14} />}
        Test
      </button>
    );
  };

  const StatusBadge: React.FC<{ providerKey: string }> = ({ providerKey }) => {
    const ts = testStatuses[providerKey];
    if (!ts || ts.status === 'idle' || ts.status === 'testing') return null;
    return (
      <span className={`text-xs font-medium mt-1 ${ts.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        {ts.message}
      </span>
    );
  };

  const InputRow: React.FC<{
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; providerKey: string;
  }> = ({ label, value, onChange, placeholder, type = 'text', providerKey }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <TestBtn providerKey={providerKey} />
      </div>
      <StatusBadge providerKey={providerKey} />
    </div>
  );

  const providers = [
    { key: 'ollama', label: 'Ollama (Local)' },
    { key: 'lmstudio', label: 'LM Studio (Local)' },
    { key: 'groq', label: 'Groq' },
    { key: 'openai', label: 'OpenAI' },
    { key: 'claude', label: 'Claude (Anthropic)' },
    { key: 'gemini', label: 'Google Gemini' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Settings className="text-blue-500" size={22} />
            LLM Provider Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your local and cloud AI providers. Each has its own Test button.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow font-semibold transition-colors"
        >
          {saveStatus ? <CheckCircle size={18} /> : <Save size={18} />}
          {saveStatus ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {/* Active Provider Selector */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 shrink-0">Active Provider (used for generation):</span>
        <select
          value={settings.activeProvider}
          onChange={(e) => upd({ activeProvider: e.target.value })}
          className="px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
        >
          {providers.map(p => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Provider Configurations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Ollama */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Ollama (Local)
          </h3>
          <InputRow label="API URL" value={s.ollamaUrl} onChange={v => upd({ ollamaUrl: v })} placeholder="http://localhost:11434/v1" providerKey="ollama" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.ollamaModel} onChange={e => upd({ ollamaModel: e.target.value })} placeholder="llama3.2:latest" />
          </div>
        </div>

        {/* LM Studio */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> LM Studio (Local)
          </h3>
          <InputRow label="API URL" value={s.lmStudioUrl} onChange={v => upd({ lmStudioUrl: v })} placeholder="http://localhost:1234/v1" providerKey="lmstudio" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.lmStudioModel} onChange={e => upd({ lmStudioModel: e.target.value })} placeholder="local-model" />
          </div>
        </div>

        {/* Groq */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Groq
          </h3>
          <InputRow label="Groq API Key" value={s.groqKey} onChange={v => upd({ groqKey: v })} type="password" placeholder="gsk_..." providerKey="groq" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.groqModel} onChange={e => upd({ groqModel: e.target.value })} placeholder="llama-3.3-70b-versatile" />
          </div>
        </div>

        {/* OpenAI */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> OpenAI
          </h3>
          <InputRow label="OpenAI API Key" value={s.openAiKey} onChange={v => upd({ openAiKey: v })} type="password" placeholder="sk-..." providerKey="openai" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.openAiModel} onChange={e => upd({ openAiModel: e.target.value })} placeholder="gpt-4o" />
          </div>
        </div>

        {/* Claude */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Claude (Anthropic)
          </h3>
          <InputRow label="Claude API Key" value={s.claudeKey} onChange={v => upd({ claudeKey: v })} type="password" placeholder="sk-ant-..." providerKey="claude" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.claudeModel} onChange={e => upd({ claudeModel: e.target.value })} placeholder="claude-3-haiku-20240307" />
          </div>
        </div>

        {/* Gemini */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Google Gemini
          </h3>
          <InputRow label="Gemini API Key" value={s.geminiKey} onChange={v => upd({ geminiKey: v })} type="password" placeholder="AIza..." providerKey="gemini" />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={s.geminiModel} onChange={e => upd({ geminiModel: e.target.value })} placeholder="gemini-1.5-flash" />
          </div>
        </div>

      </div>
    </div>
  );
};
