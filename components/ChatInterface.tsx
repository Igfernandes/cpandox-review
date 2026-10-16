
import React, { useState, useEffect, useRef } from 'react';
import { CheckCheck, Lock, MessageSquare, ChevronRight, ShieldCheck, Send, Paperclip, AlertTriangle, Unlock, MoreVertical, Flag, Ban, X, Info, Wallet, ArrowRight, CheckCircle } from 'lucide-react';
import { ChatSession, GigStatus, SystemSettings } from '../types';

import { translations } from '../src/translations';

interface ChatInterfaceProps {
  session: ChatSession;
  onBack: () => void;
  onSendMessage?: (text: string, attachment?: { type: 'image' | 'video', url: string }) => void;
  isUnlocked?: boolean;
  userBalance?: number;
  gigPrice?: number;
  onOpenPayment?: () => void;
  onDepositEscrow?: (amount: number) => void;
  onUpdateStatus?: (status: GigStatus) => void;
  onReleasePayment?: () => void;
  isRequester?: boolean;
  language?: string;
  gigStatus?: GigStatus;
  systemSettings: SystemSettings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  onBack, 
  onSendMessage, 
  isUnlocked = false,
  userBalance = 0,
  gigPrice = 0,
  onOpenPayment,
  onDepositEscrow,
  onUpdateStatus,
  onReleasePayment,
  isRequester = false,
  language = 'pt',
  gigStatus,
  systemSettings,
}) => {
  const T = translations[language] || translations['pt'];
  
  const SAFE_PHRASES = [
    T.chat.phrases.hello,
    T.chat.phrases.expert,
    T.chat.phrases.like,
    T.chat.phrases.valueOk,
    T.chat.phrases.negotiateValue,
    T.chat.phrases.acceptWaitPayment,
    T.chat.phrases.cannotAttend,
    T.chat.phrases.bestTime,
    T.chat.phrases.today,
    T.chat.phrases.tomorrow,
    T.chat.phrases.addressDetails,
    T.chat.phrases.material,
    T.chat.phrases.parking,
    T.chat.phrases.onWay,
    T.chat.phrases.arrived,
    T.chat.phrases.late,
    T.chat.phrases.started,
    T.chat.phrases.finished,
    T.chat.phrases.checkEverything,
    T.chat.phrases.releasePayment,
    T.chat.phrases.thanks,
    T.chat.phrases.rate,
    T.chat.phrases.paySecurityFee,
    T.chat.phrases.keepHere
  ].filter(Boolean);

  const [inputText, setInputText] = useState('');
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for the options menu
  const [showMobilePhrases, setShowMobilePhrases] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastActionRef = useRef<'phrase' | 'text' | 'received'>('phrase');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    // Force a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    lastActionRef.current = 'received';
    return () => clearTimeout(timer);
  }, [session.messages, isUnlocked]);

  // Content Safety Filter
  const containsProhibitedContent = (text: string): boolean => {
    // If chat is unlocked (payment made), disable filter
    if (isUnlocked) return false;

    const lowerText = text.toLowerCase();
    
    // 1. Email Patterns
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailKeywords = ['gmail', 'hotmail', 'outlook', 'yahoo', '.com', '.br', 'arroba', '@'];
    
    // 2. Phone Patterns - STRICTER
    const phoneFormatRegex = /(?:(?:\+|00)?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[\s.-]?\d{4}/;
    const rawNumberRegex = /\b\d{8,}\b/;
    const phoneKeywords = ['whatsapp', 'zap', 'telegram', 'ligar', 'fone', 'celular', 'contato', 'chama no', 'wa.me', 'ddd', 'tel:'];

    // 3. Address Patterns
    const addressKeywords = ['rua', 'avenida', 'av.', 'bairro', 'cep', 'lote', 'quadra', 'número', 'apto', 'bloco', 'alameda', 'travessa'];

    if (emailRegex.test(text) || emailKeywords.some(k => lowerText.includes(k))) return true;
    if (phoneFormatRegex.test(text) || rawNumberRegex.test(text) || phoneKeywords.some(k => lowerText.includes(k))) return true;
    if (addressKeywords.some(k => lowerText.includes(k))) return true;

    return false;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (containsProhibitedContent(inputText)) {
      setShowSafetyWarning(true);
      setTimeout(() => setShowSafetyWarning(false), 5000);
      return;
    }
    
    lastActionRef.current = 'text';
    if (onSendMessage) {
      onSendMessage(inputText);
    }
    
    setInputText('');
    setShowSafetyWarning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendOption = (text: string) => {
    // Safe phrases are pre-vetted
    lastActionRef.current = 'phrase';
    if (onSendMessage) {
      onSendMessage(text);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again if needed
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      lastActionRef.current = 'text';
      if (onSendMessage) {
        // Sending attachment immediately without text for simplicity
        onSendMessage('', { type, url: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReportUser = () => {
    if(confirm(T.chat.reportConfirm)) {
        alert(T.chat.reportSuccess);
        setShowMenu(false);
    }
  };

  const handleBlockUser = () => {
    if(confirm(T.chat.blockConfirm)) {
        alert(T.chat.blockSuccess);
        setShowMenu(false);
        onBack(); // Return to list
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 md:h-[650px] bg-white rounded-none md:rounded-2xl border border-gray-200 md:border-white/10 overflow-hidden shadow-2xl relative">
      
      {/* LEFT COLUMN: Chat Area */}
      <div ref={chatAreaRef} className="flex-1 flex flex-col min-w-0 bg-gray-50 relative z-0 h-full">
        {/* Chat Header */}
        <div className={`p-4 flex items-center gap-4 border-b shadow-sm z-10 transition-colors relative ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
          <button onClick={onBack} className="text-black hover:text-pandora-primary md:hidden">←</button>
          <div className="relative">
            <img src={session.participant.avatar} alt={session.participant.name} className="w-10 h-10 rounded-full border border-gray-200" />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isUnlocked ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-black">{session.participant.name}</h3>
            <div className="flex items-center gap-2">
              {isUnlocked ? (
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 uppercase tracking-wide">
                  <Unlock className="w-3 h-3" /> {T.chat.unlockedContact}
                </p>
              ) : (
                <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1 uppercase tracking-wide">
                  <Lock className="w-3 h-3" /> {T.chat.protectedEnvironment}
                </p>
              )}
              {isUnlocked && isRequester && gigStatus !== GigStatus.COMPLETED && (
                <button 
                  onClick={() => onReleasePayment?.()}
                  className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-green-900/10 flex items-center gap-1.5 animate-pulse transition-all active:scale-95 uppercase tracking-tighter"
                >
                  <CheckCircle className="w-3 h-3" />
                  {T.gigs.releasePayment}
                </button>
              )}
              {gigPrice > 0 && (
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] bg-pandora-primary/10 text-pandora-primary px-2 py-0.5 rounded-t-md font-bold border border-pandora-primary/20 border-b-0 w-full text-center uppercase tracking-tight">
                    {T.chat.total}: {gigPrice.toFixed(1)} PND
                  </span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-b-md font-bold border border-amber-500/20 w-full text-center uppercase tracking-tight">
                    Restante (65%): {(gigPrice * 0.65).toFixed(1)} PND
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Options Menu Button */}
          <div className="relative">
            <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
            >
                < MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <button 
                        onClick={handleReportUser}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-black hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100"
                    >
                        <Flag className="w-4 h-4 text-orange-500" /> {T.chat.reportUser}
                    </button>
                    <button 
                        onClick={handleBlockUser}
                        className="w-full text-left px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                    >
                        <Ban className="w-4 h-4" /> {T.chat.block}
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Fixed Suggestions Sub-header - MOBILE ONLY */}
        <div className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 p-2 overflow-x-auto custom-scrollbar-hide shadow-sm shadow-black/5">
          <div className="flex gap-2 w-max items-center">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mr-1 ml-1 shrink-0">{T.chat.suggestions}:</span>
            {SAFE_PHRASES.map((phrase, index) => (
              <button
                key={index}
                onClick={() => handleSendOption(phrase)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-black hover:bg-pandora-primary/10 hover:border-pandora-primary/20 transition-all active:scale-95"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-6 bg-white" onClick={() => setShowMenu(false)}>
          {/* System Warning/Status Message */}
          <div className="flex justify-center mb-6">
            {isUnlocked ? (
               <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-4 py-3 rounded-lg max-w-sm text-center shadow-sm animate-in fade-in zoom-in duration-500">
                 <p className="font-bold mb-1 flex items-center justify-center gap-1">
                   <Unlock className="w-3 h-3" /> {T.chat.unlockedSuccess}
                 </p>
                 {T.chat.unlockedNote}
               </div>
            ) : (
               <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2 rounded-lg max-w-sm text-center shadow-sm">
                 <p className="font-bold mb-1 flex items-center justify-center gap-1">
                   <ShieldCheck className="w-3 h-3" /> {T.chat.monitoredChat}
                 </p>
                 {T.chat.monitoredNote}
               </div>
            )}
          </div>

          {session.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                  msg.isMe 
                    ? 'bg-pandora-primary/20 text-black border border-pandora-primary/30 rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {msg.attachment ? (
                  <div className="mb-1">
                    {msg.attachment.type === 'image' ? (
                      <img 
                        src={msg.attachment.url} 
                        alt="attachment" 
                        className="rounded-lg max-w-full max-h-[300px] object-cover border border-gray-200" 
                      />
                    ) : (
                      <video 
                        src={msg.attachment.url} 
                        controls 
                        className="rounded-lg max-w-full max-h-[300px] border border-gray-200" 
                      />
                    )}
                  </div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
                
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isMe ? 'text-black/60' : 'text-black/50'}`}>
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Status Banner (Now as a relative flex item) */}
        <div className={`p-2 border-t transition-all duration-500 shrink-0 ${
          isUnlocked 
            ? 'bg-green-50 border-green-100' 
            : 'bg-amber-50 border-amber-100'
        }`}>
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-3">
            <p className={`text-[10px] font-bold uppercase flex items-center gap-2 ${
              isUnlocked ? 'text-green-700' : 'text-amber-700'
            }`}>
              {isUnlocked ? (
                <><Unlock className="w-3 h-3" /> {T.chat.statusUnlocked}</>
              ) : (
                <><Lock className="w-3 h-3" /> {T.chat.statusWaiting}</>
              )}
            </p>
            
            {isUnlocked && onUpdateStatus && (
              <div className="flex gap-2">
                {gigStatus !== GigStatus.COMPLETED && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(GigStatus.NEGOTIATED)}
                      className="text-[9px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                    >
                      {T.gigs.negotiated}
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(GigStatus.WAITING_CONCLUSION)}
                      className="text-[9px] font-bold bg-black text-white border border-white/10 px-3 py-1 rounded-full hover:bg-gray-800 transition-all shadow-md"
                    >
                      {T.gigs.waitingConclusion}
                    </button>
                  </>
                )}
                
                {isRequester ? (
                   gigStatus !== GigStatus.COMPLETED && (
                    <button 
                      onClick={() => onReleasePayment?.()}
                      className="text-[9px] font-bold bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-500 transition-all shadow-md flex items-center gap-1 animate-pulse"
                    >
                      <CheckCircle className="w-2.5 h-2.5" />
                      {T.gigs.releasePayment}
                    </button>
                   )
                ) : (
                  gigStatus !== GigStatus.COMPLETED && (
                    <div className="text-[9px] font-bold bg-gray-600/50 text-gray-400 px-3 py-1 rounded-full flex items-center gap-1 cursor-default opacity-60">
                      <CheckCircle className="w-2.5 h-2.5" />
                      {T.gigs.waitingConfirmation}
                    </div>
                  )
                )}
              </div>
            )}
            
            {!isUnlocked && gigPrice > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDepositEscrow?.(gigPrice * 0.35); }}
                className="flex items-center gap-1 text-[9px] font-black bg-pandora-primary text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-all animate-pulse shadow-lg shadow-purple-900/20 font-sans"
              >
                <Wallet className="w-2.5 h-2.5" /> {T.chat.depositEscrow.replace('{amount}', (gigPrice * 0.35).toFixed(1))}
              </button>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 relative shrink-0">

          {showSafetyWarning && !isUnlocked && (
              <div className="absolute bottom-full left-0 right-0 p-4 bg-red-50 backdrop-blur-md border-t border-red-200 text-red-900 animate-in slide-in-from-bottom-2 fade-in z-20">
              <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                      <p className="font-bold text-sm text-red-800">{T.chat.blockedMessageTitle}</p>
                      <p className="text-xs text-red-700 mt-1">
                          {T.chat.blockedMessageDesc}
                      </p>
                  </div>
              </div>
              </div>
          )}

          {/* Unified Input Bar */}
          <div className={`flex items-center gap-2 p-1.5 rounded-full border transition-all duration-300 shadow-inner relative group ${
            isUnlocked 
              ? 'bg-gray-50 border-gray-200 focus-within:border-pandora-primary/50' 
              : 'bg-gray-100 border-gray-200 opacity-80 grayscale cursor-not-allowed'
          }`}>
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
                disabled={!isUnlocked}
              />
              
              <button 
                onClick={handleAttachClick}
                disabled={!isUnlocked}
                className={`p-2 transition-colors rounded-full ${
                  isUnlocked ? 'text-gray-500 hover:text-black hover:bg-gray-200' : 'text-gray-400'
                }`}
                title={isUnlocked ? T.chat.attachTooltip : T.chat.attachLockedTooltip}
              >
                {isUnlocked ? <Paperclip className="w-4 h-4" /> : <Lock className="w-4 h-4 opacity-50" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                    if (!isUnlocked) return;
                    setInputText(e.target.value);
                    if (showSafetyWarning) setShowSafetyWarning(false);
                }}
                onKeyDown={handleKeyPress}
                disabled={!isUnlocked}
                placeholder={isUnlocked ? T.chat.inputPlaceholderUnlocked : T.chat.inputPlaceholderLocked}
                className={`flex-1 bg-transparent px-2 py-2 focus:outline-none text-sm font-medium transition-all ${
                  isUnlocked 
                    ? 'text-black placeholder-black/30' 
                    : 'text-black/40 placeholder-black/20 cursor-not-allowed'
                }`}
              />
              
              <button 
                onClick={isUnlocked ? handleSend : () => onDepositEscrow?.(gigPrice * 0.35)}
                disabled={isUnlocked && !inputText.trim()}
                className={`p-2 rounded-full transition-all shadow-lg active:scale-95 z-20 ${
                  isUnlocked 
                    ? 'bg-green-600 text-white hover:bg-green-500 shadow-green-200' 
                    : 'bg-pandora-primary text-white hover:bg-purple-600 shadow-purple-200 animate-pulse font-sans'
                }`}
                title={isUnlocked ? T.chat.send : T.chat.payToUnlock}
              >
                {isUnlocked ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              {!isUnlocked && (
                <div className="absolute inset-y-0 left-0 right-12 rounded-l-full cursor-not-allowed z-10" title={T.chat.waitingPayment} />
              )}
          </div>

          {!isUnlocked && (
            <p className="text-[9px] text-center mt-2 text-gray-500 font-bold uppercase tracking-widest opacity-60">
              {T.chat.useSuggestions}
            </p>
          )}
        </div>

        </div>

      {/* RIGHT COLUMN: Sidebar Phrases (Suggestions) - HIDDEN ON MOBILE */}
      <div className="hidden md:flex w-full md:w-80 bg-gray-100 border-t md:border-t-0 md:border-l border-gray-200 flex-col z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.05)]">
        <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
          <h4 className="text-black font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-pandora-secondary" />
            {T.chat.suggestions}
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar max-h-[300px] md:max-h-none">
          {SAFE_PHRASES.map((phrase, index) => (
            <button
              key={index}
              onClick={() => handleSendOption(phrase)}
              className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl text-xs text-black font-semibold hover:bg-pandora-primary/10 hover:border-pandora-primary/30 transition-all flex items-center justify-between group active:scale-95 duration-200"
            >
              <span className="line-clamp-2">{phrase}</span>
              <ChevronRight className="w-3 h-3 text-black/40 group-hover:text-pandora-primary transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Phrases Modal (Removed since we show them inline now) */}
    </div>
  );
};

export default ChatInterface;
