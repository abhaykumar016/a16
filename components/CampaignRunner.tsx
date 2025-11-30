import React, { useEffect, useState } from 'react';
import { Phone, PhoneOutgoing, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Contact } from '../types';
import { playAudioBuffer } from '../utils/audioUtils';

interface CampaignRunnerProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  audioBuffer: AudioBuffer;
  onComplete: () => void;
}

export const CampaignRunner: React.FC<CampaignRunnerProps> = ({ contacts, setContacts, audioBuffer, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processQueue = async () => {
      if (currentIndex >= contacts.length) {
        onComplete();
        return;
      }

      const currentContact = contacts[currentIndex];
      
      // Update status to Dialing
      updateContactStatus(currentContact.id, 'dialing');

      // Simulate connection delay (1-2 seconds)
      await new Promise(r => setTimeout(r, 1500));

      // Update to Connected
      updateContactStatus(currentContact.id, 'connected');
      setIsPlayingAudio(true);

      // Play the actual AI generated audio
      await playAudioBuffer(audioBuffer);
      
      setIsPlayingAudio(false);

      // Update to Completed
      updateContactStatus(currentContact.id, 'completed');

      // Move to next
      setCurrentIndex(prev => prev + 1);
    };

    processQueue();

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]); // Intentionally only depend on currentIndex to chain them

  const updateContactStatus = (id: string, status: Contact['status']) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-slate-300" />;
      case 'dialing': return <PhoneOutgoing className="h-5 w-5 text-amber-500 animate-pulse" />;
      case 'connected': return <Phone className="h-5 w-5 text-green-500 animate-bounce" />;
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const currentContact = contacts[currentIndex];
  const progress = (currentIndex / contacts.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center max-w-2xl mx-auto mt-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Campaign In Progress</h2>
        <p className="text-slate-500">Do not close this window while calls are active.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
        <div 
          className="bg-brand-600 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Active Call Card */}
      {currentContact ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8 relative overflow-hidden">
          {isPlayingAudio && (
            <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
          )}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${
              currentContact.status === 'connected' ? 'bg-green-100 text-green-600' : 
              currentContact.status === 'dialing' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentContact.status === 'connected' ? <Phone className="h-8 w-8" /> : <PhoneOutgoing className="h-8 w-8" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{currentContact.name}</h3>
            <p className="text-lg text-slate-600 font-mono mb-4">{currentContact.phoneNumber}</p>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-slate-200 shadow-sm">
              {currentContact.status === 'dialing' && "Dialing..."}
              {currentContact.status === 'connected' && "Speaking message..."}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500">
          Campaign Finished
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Total</p>
          <p className="text-2xl font-bold text-slate-800">{contacts.length}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.status === 'completed').length}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Remaining</p>
          <p className="text-2xl font-bold text-slate-800">
            {contacts.length - currentIndex}
          </p>
        </div>
      </div>
    </div>
  );
};