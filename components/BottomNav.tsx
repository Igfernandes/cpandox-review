
import React from 'react';
import { ShieldCheck, MessageCircle, Share2 } from 'lucide-react';
import { User as UserType, ChatSession } from '../types';
import { translations } from '../src/translations';

interface BottomNavProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: UserType;
  userBalance: number;
  onOpenSafety?: () => void;
  onOpenSupport?: () => void;
  onOpenSummary?: () => void;
  onShareApp?: () => void;
  onCreate?: () => void;
  onCelebrityJoin?: () => void;
  chats?: ChatSession[];
  language?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, currentUser, userBalance, onOpenSafety, onOpenSupport, onOpenSummary, onShareApp, onCreate, onCelebrityJoin, chats = [], language = 'pt' }) => {
  const T = translations[language] || translations['pt'];
  const hasUnread = chats.some(c => c.unreadCount > 0);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-pandora-bg/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <NavIcon 
          active={false} 
          onClick={onOpenSafety} 
          icon={<ShieldCheck className="w-6 h-6 text-green-500" />} 
          label={T.nav.safety} 
        />

        {currentUser?.isVerified && (
          <NavIcon 
            active={currentView === 'messages'} 
            onClick={() => setView('messages')} 
            icon={
              <div className="relative">
                <MessageCircle className={`w-6 h-6 ${currentView === 'messages' ? 'text-pandora-primary' : 'text-black dark:text-gray-500'}`} />
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-pandora-bg"></span>
                )}
              </div>
            } 
            label={T.nav.chat} 
          />
        )}

        <NavIcon 
          active={false} 
          onClick={onShareApp} 
          icon={<Share2 className="w-6 h-6 text-pandora-primary" />} 
          label={T.nav.share} 
        />
        
        {currentUser?.isVerified && (
          <button 
            onClick={() => setView('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === 'profile' ? 'text-pandora-primary' : 'text-black dark:text-gray-500'
            }`}
          >
            <div className={`w-7 h-7 rounded-full overflow-hidden border-2 ${
              currentView === 'profile' ? 'border-pandora-primary' : 'border-transparent'
            }`}>
              <img src={currentUser?.avatar || "https://picsum.photos/id/64/100/100"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{T.nav.profile}</span>
          </button>
        )}
      </div>
    </div>
  );
};

const NavIcon = ({ active, onClick, icon, label, id, ...props }: any) => (
  <button 
    onClick={onClick}
    id={id}
    {...props}
    className={`flex flex-col items-center gap-1 transition-all ${
      active ? 'text-pandora-primary scale-110' : 'text-black dark:text-gray-500'
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default BottomNav;
