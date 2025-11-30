import React, { useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { ScriptEditor } from './components/ScriptEditor';
import { ContactManager } from './components/ContactManager';
import { CampaignRunner } from './components/CampaignRunner';
import { Contact, AppState } from './types';
import { PlayCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [script, setScript] = useState("Namaste! Yeh AutoPromote AI ki taraf se ek demo call hai.");
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Ravi Kumar', phoneNumber: '+91 98765 43210', status: 'pending' },
    { id: '2', name: 'Priya Singh', phoneNumber: '+91 99887 76655', status: 'pending' },
  ]);
  const [campaignAudio, setCampaignAudio] = useState<AudioBuffer | null>(null);

  const startCampaign = () => {
    if (!campaignAudio) {
      alert("Please generate the AI voice message first.");
      return;
    }
    if (contacts.length === 0) {
      alert("Please add at least one contact.");
      return;
    }
    setAppState(AppState.CAMPAIGN_RUNNING);
  };

  const resetCampaign = () => {
    setAppState(AppState.SETUP);
    setContacts(contacts.map(c => ({ ...c, status: 'pending' })));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <DashboardHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {appState === AppState.SETUP && (
          <>
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Campaign Setup</h2>
                <p className="text-slate-500 mt-1">Configure your message and target audience.</p>
              </div>
              <button
                onClick={startCampaign}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-brand-500/20 transition-all ${
                  campaignAudio && contacts.length > 0
                    ? 'bg-brand-600 hover:bg-brand-700 hover:scale-105'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <PlayCircle className="h-5 w-5" />
                Start Campaign
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
              <ScriptEditor 
                script={script} 
                setScript={setScript} 
                onAudioGenerated={setCampaignAudio}
              />
              <ContactManager 
                contacts={contacts} 
                setContacts={setContacts} 
              />
            </div>
            
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> This is a simulation for demonstration purposes. 
                Calls are not actually placed to the telephone network. The voice you hear is generated live by Gemini 2.5 Flash.
              </div>
            </div>
          </>
        )}

        {appState === AppState.CAMPAIGN_RUNNING && (
          <div className="relative">
             <button 
              onClick={resetCampaign}
              className="absolute top-0 left-0 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Setup
            </button>
            <CampaignRunner 
              contacts={contacts} 
              setContacts={setContacts} 
              audioBuffer={campaignAudio!}
              onComplete={() => setAppState(AppState.REPORT)}
            />
          </div>
        )}

        {appState === AppState.REPORT && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <PlayCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Completed!</h2>
            <p className="text-slate-600 mb-8">All contacts in the queue have been processed successfully.</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Total Calls</span>
                <span className="font-medium">{contacts.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Successful Connections</span>
                <span className="font-medium text-green-600">{contacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voice Model</span>
                <span className="font-medium">Gemini 2.5 Flash</span>
              </div>
            </div>

            <button
              onClick={resetCampaign}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800"
            >
              Start New Campaign
            </button>
          </div>
        )}

      </main>
    </div>
  );
}