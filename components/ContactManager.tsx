import React, { useState } from 'react';
import { Users, Plus, Trash2, Smartphone } from 'lucide-react';
import { Contact } from '../types';

interface ContactManagerProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export const ContactManager: React.FC<ContactManagerProps> = ({ contacts, setContacts }) => {
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');

  const addContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber) return;

    const contact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName || 'Guest User',
      phoneNumber: newNumber,
      status: 'pending',
    };

    setContacts([...contacts, contact]);
    setNewNumber('');
    setNewName('');
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-600" />
          Target List ({contacts.length})
        </h2>
      </div>

      <form onSubmit={addContact} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name (Optional)"
          className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <input
          type="tel"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="+91 98765..."
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
        {contacts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg p-8">
            <Users className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">No contacts added yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full border border-slate-200 text-slate-400">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-500">{contact.phoneNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};