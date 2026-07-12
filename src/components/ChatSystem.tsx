import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Pin, 
  Search, 
  CheckCheck, 
  Users, 
  MessageSquare
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatSystemProps {
  chatHistory: ChatMessage[];
  onSendMessage: (msg: string) => void;
  onPinMessage: (id: string) => void;
  currentUser: any;
}

export default function ChatSystem({
  chatHistory,
  onSendMessage,
  onPinMessage,
  currentUser
}: ChatSystemProps) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentUsername = currentUser?.displayName || currentUser?.email || 'Guest';

  // Scroll to bottom whenever history updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const filteredMessages = chatHistory.filter(msg => {
    const matchesSearch = msg.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.sender.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || msg.isPinned;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col h-full bg-[#111113] select-none font-sans text-[#e4e4e7]">
      
      {/* Collaboration status & online count */}
      <div className="p-3 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-zinc-300">Workspace Global Chat</span>
          <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-450 text-[9px] font-bold rounded-full">Live Sync</span>
        </div>

        {/* Tab switches */}
        <div className="flex bg-[#111113] border border-[#27272a] p-0.5 rounded-lg text-[9px] font-bold uppercase">
          <button 
            onClick={() => setActiveTab('all')} 
            className={`px-2 py-0.5 rounded-md ${activeTab === 'all' ? 'bg-[#18181b] text-indigo-400' : 'text-zinc-500'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('pinned')} 
            className={`px-2 py-0.5 rounded-md ${activeTab === 'pinned' ? 'bg-[#18181b] text-indigo-400' : 'text-zinc-500'}`}
          >
            Pinned
          </button>
        </div>
      </div>

      {/* History Search bar */}
      <div className="px-3 py-2 border-b border-[#27272a] bg-[#18181b]/30 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search chat messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111113] text-[#e4e4e7] text-[10px] pl-8 pr-3 py-1.5 rounded-lg border border-[#27272a] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Messages Scrolling Panel */}
      <div className="flex-1 overflow-auto p-4 space-y-3.5 min-h-0">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center text-xs space-y-1">
            <MessageSquare className="w-8 h-8 opacity-40 mb-1" />
            <span>No messages found.</span>
            <span>Type a message to collaborate.</span>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.sender.username === currentUsername;
            return (
              <div 
                key={msg.id}
                className={`flex items-start space-x-2.5 max-w-[85%] ${
                  isMe ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <img 
                  src={msg.sender.avatar} 
                  alt={msg.sender.username} 
                  className="w-7 h-7 rounded-full object-cover shrink-0" 
                  referrerPolicy="no-referrer"
                />

                {/* Message Bubble container */}
                <div className="space-y-1">
                  {/* Sender details */}
                  <div className={`flex items-center space-x-1.5 text-[9px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-bold text-zinc-200">{msg.sender.username}</span>
                    <span className="text-zinc-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bubble text */}
                  <div className={`p-3 rounded-2xl relative group border ${
                    isMe 
                      ? 'bg-indigo-600 border-indigo-750 text-white rounded-tr-none' 
                      : 'bg-[#18181b] border-[#27272a] text-zinc-300 rounded-tl-none'
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap pr-4">{msg.text}</p>
                    
                    {/* Pin button */}
                    <button
                      onClick={() => onPinMessage(msg.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 bg-white/20 hover:bg-white/40 rounded transition cursor-pointer"
                      title="Pin Message"
                    >
                      <Pin className={`w-2.5 h-2.5 ${msg.isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Read Receipts */}
                  {isMe && (
                    <div className="flex justify-end text-[9px] text-emerald-600 font-bold items-center space-x-0.5">
                      <span>Read</span>
                      <CheckCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Inputs Dock */}
      <div className="p-3 border-t border-[#27272a] bg-[#18181b] flex items-center space-x-2 shrink-0">
        <button 
          onClick={() => setInputText(prev => prev + ' ⚡')}
          className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-400"
          title="Add Action Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <button 
          onClick={() => {
            const url = prompt('Insert image mockup URL:');
            if (url) {
              onSendMessage(`[Uploaded File]: ${url}`);
            }
          }}
          className="p-1.5 hover:bg-[#27272a] rounded-lg text-zinc-400"
          title="Attach Mockup File"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input 
          type="text" 
          placeholder="Collaborate on code..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#111113] text-[#e4e4e7] border border-[#27272a] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <button 
          onClick={handleSend}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer transition active:scale-95 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
