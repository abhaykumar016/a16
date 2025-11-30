export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'pending' | 'dialing' | 'connected' | 'completed' | 'failed';
  duration?: number;
}

export interface ScriptConfig {
  text: string;
  language: 'hi-IN' | 'en-US';
  voiceName: string;
}

export enum AppState {
  SETUP = 'SETUP',
  CAMPAIGN_RUNNING = 'CAMPAIGN_RUNNING',
  REPORT = 'REPORT'
}
