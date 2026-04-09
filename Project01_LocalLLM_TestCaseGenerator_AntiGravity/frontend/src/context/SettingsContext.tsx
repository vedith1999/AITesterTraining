import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ProviderSettings {
  activeProvider: string;
  // Ollama
  ollamaUrl: string;
  ollamaModel: string;
  // LM Studio
  lmStudioUrl: string;
  lmStudioModel: string;
  // Groq
  groqKey: string;
  groqModel: string;
  // OpenAI
  openAiKey: string;
  openAiModel: string;
  // Claude
  claudeKey: string;
  claudeModel: string;
  // Gemini
  geminiKey: string;
  geminiModel: string;
}

interface SettingsContextType {
  settings: ProviderSettings;
  setSettings: React.Dispatch<React.SetStateAction<ProviderSettings>>;
}

export const defaultSettings: ProviderSettings = {
  activeProvider: 'ollama',
  ollamaUrl: 'http://localhost:11434/v1',
  ollamaModel: 'llama3.2:latest',
  lmStudioUrl: 'http://localhost:1234/v1',
  lmStudioModel: 'local-model',
  groqKey: '',
  groqModel: 'llama-3.3-70b-versatile',
  openAiKey: '',
  openAiModel: 'gpt-4o',
  claudeKey: '',
  claudeModel: 'claude-3-haiku-20240307',
  geminiKey: '',
  geminiModel: 'gemini-1.5-flash',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ProviderSettings>(() => {
    try {
      const saved = localStorage.getItem('llm_settings_v2');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('llm_settings_v2', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

/** Build the generate payload for the active provider */
export const buildGeneratePayload = (settings: ProviderSettings, requirements: string) => {
  const p = settings.activeProvider;
  switch (p) {
    case 'ollama':
      return { provider: 'ollama', model: settings.ollamaModel, endpoint: settings.ollamaUrl, apiKey: '', requirements };
    case 'lmstudio':
      return { provider: 'lmstudio', model: settings.lmStudioModel, endpoint: settings.lmStudioUrl, apiKey: '', requirements };
    case 'groq':
      return { provider: 'groq', model: settings.groqModel, endpoint: '', apiKey: settings.groqKey, requirements };
    case 'openai':
      return { provider: 'openai', model: settings.openAiModel, endpoint: '', apiKey: settings.openAiKey, requirements };
    case 'claude':
      return { provider: 'claude', model: settings.claudeModel, endpoint: '', apiKey: settings.claudeKey, requirements };
    case 'gemini':
      return { provider: 'gemini', model: settings.geminiModel, endpoint: '', apiKey: settings.geminiKey, requirements };
    default:
      return { provider: p, model: '', endpoint: '', apiKey: '', requirements };
  }
};
