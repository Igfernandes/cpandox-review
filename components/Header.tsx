
import React from 'react';
import { MessageCircle, PlusCircle, Search, User, Gem, Shield, Share2, ShieldCheck, UserPlus, Info, Sparkles, Headset, Link as LinkIcon, Fingerprint, LogOut, HelpCircle, ArrowLeft, Sun, Moon, Languages, Check, ChevronDown } from 'lucide-react';
import { User as UserType, Category, ChatSession } from '../types';
import { decryptData } from '../services/encryption';
import { translations } from '../src/translations';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  userBalance: number;
  onOpenSafety?: () => void;
  onOpenGuide?: () => void;
  onOpenSupport?: () => void;
  onOpenSummary?: () => void;
  onSelectCategory?: (category: any) => void;
  onCelebrityJoin?: () => void;
  currentUser?: UserType; // Nova prop para acessar dados do usuário (avatar e status)
  onLogout?: () => void;
  onShareApp?: () => void;
  onCreate?: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  chats?: ChatSession[];
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, userBalance, onOpenSafety, onOpenGuide, onOpenSupport, onOpenSummary, onSelectCategory, onCelebrityJoin, currentUser, onLogout, onShareApp, onCreate, theme, toggleTheme, chats = [], language = 'pt', onLanguageChange }) => {
  
  const T = translations[language] || translations['pt'];
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];
  
  // ATUALIZADO PARA COMPARTILHAR O LINK DO APLICATIVO (COM FOCO EM WHATSAPP)
  const handleQuickShare = () => {
    if (onShareApp) {
      onShareApp();
      return;
    }

    const url = window.location.href;
    const shareText = T.nav.shareMessage.replace('{url}', url);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'C.Pandox',
        text: shareText,
        url: url,
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
        window.open(waUrl, '_blank');
      });
    } else {
      // Abre WhatsApp diretamente sem confirm() para melhor UX em iframe
      window.open(waUrl, '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-pandora-bg/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LEFT SIDE: LOGO & GUIDE BUTTON */}
        <div className="flex items-center gap-4">
          <div 
            className="flex flex-col cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="flex items-center gap-3">
                {/* LOGOMARCA: SETA DE RETORNO */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                   <ArrowLeft className="w-7 h-7 text-black dark:text-white group-hover:text-pandora-primary transition-colors" />
                </div>

               <h1 className="font-display font-black text-3xl tracking-tighter text-black dark:text-white group-hover:scale-105 transition-transform duration-300 hidden sm:block">
                C.<span className="text-pandora-primary italic">PANDOX</span>
              </h1>
            </div>
          </div>

          {/* GUIDE BUTTON (TOP LEFT) */}
          <button 
            onClick={onOpenGuide}
            className="bg-white/5 hover:bg-pandora-primary/20 text-black dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full border border-white/10 transition-all hover:scale-110 group relative shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            title={T.nav.guideTrigger}
          >
             <HelpCircle className="w-4 h-4 text-pandora-primary animate-pulse drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
             <span className="absolute -top-1 -right-1 w-2 h-2 bg-pandora-primary rounded-full animate-ping"></span>
          </button>

          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className="bg-white/5 hover:bg-pandora-primary/20 text-black dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full border border-white/10 transition-all hover:scale-110 group relative shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            title={theme === 'dark' ? T.nav.lightMode : T.nav.darkMode}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="bg-white/5 hover:bg-pandora-primary/20 text-black dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full border border-white/10 transition-all hover:scale-110 group relative shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              title={T.nav.changeLanguage}
            >
              <Languages className="w-4 h-4 text-pandora-primary" />
            </button>

            {showLanguageMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-pandora-card border border-white/10 rounded-xl shadow-2xl z-[60] p-2 animate-in fade-in zoom-in-95 duration-200">
                <p className="px-3 py-2 text-[10px] font-black uppercase text-gray-500 border-b border-white/5 mb-1">{T.nav.selectLanguage}</p>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (onLanguageChange) onLanguageChange(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        language === lang.code 
                          ? 'bg-pandora-primary/20 text-pandora-primary' 
                          : 'text-black dark:text-gray-400 hover:bg-white/5 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                      {language === lang.code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION - Pill Design */}
        <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10">
          
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => {
              if (onOpenSummary) {
                onOpenSummary();
              } else {
                setView('home');
              }
            }} 
            icon={<Search className="w-4 h-4" />} 
            label={T.nav.explore}
          />
          
          <NavButton 
            active={currentView === 'create'} 
            onClick={onCreate || (() => setView('create'))} 
            icon={<PlusCircle className="w-4 h-4" />} 
            label={T.nav.create}
          />

          <div 
            className="flex items-center"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onCelebrityJoin) onCelebrityJoin();
            }}
            data-allow-interaction="true"
          >
            <button 
              className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-500 rounded-full border border-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              id="header-famosos-trigger"
              type="button"
            >
              <Gem className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{T.nav.celebrities}</span>
            </button>
          </div>

          <div className="w-px h-5 bg-white/10 mx-1" />
        </nav>

        {/* Mobile Profile Icon & Admin Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Specific Buttons: Criar & Famosos */}
          <div className="flex md:hidden items-center gap-1">
            <button 
              onClick={onCreate || (() => setView('create'))}
              className={`p-2 rounded-full transition-all ${currentView === 'create' ? 'bg-pandora-primary/20 text-pandora-primary' : 'bg-white/5 text-black dark:text-gray-400'}`}
              title={T.nav.create}
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            {!currentUser?.isCelebrity && (
              <button 
                onClick={() => {
                  if (onCelebrityJoin) onCelebrityJoin();
                }}
                id="header-mobile-celebrity-signup"
                data-allow-interaction="true"
                className="p-2.5 bg-amber-500 text-black rounded-full transition-all active:scale-90 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                title={T.nav.registerCelebrity}
              >
                <Gem className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Login Button */}
          {(!currentUser || !currentUser.isVerified) && (
            <button
              onClick={() => setView('login')}
              data-allow-interaction="true"
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pandora-primary to-purple-800 text-white rounded-full text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider hover:shadow-lg hover:scale-105 transition-all"
              title={T.nav.login}
            >
              <Fingerprint className="w-3.5 h-3.5 sm:w-4 h-4" />
              <span className="hidden sm:inline">{T.nav.loginLong}</span>
              <span className="sm:hidden">{T.nav.login}</span>
            </button>
          )}

          {/* Logout & Admin Actions */}
          {currentUser && (
            <div className="flex items-center gap-2">
              {/* ADMIN ACCESS: Master priority for user 03531702750 */}
              {(currentUser.isAdmin || 
                currentUser.isMaster || 
                (currentUser.cpf && (decryptData(currentUser.cpf) === '03531702750' || currentUser.cpf === '03531702750')) ||
                currentUser.email === 'AlexPinto926@gmail.com' ||
                currentUser.id === 'u_user_alex' ||
                currentUser.name === 'Alex Pinto' ||
                (currentUser.name === 'alex' && (currentUser.password === '212171' || (currentUser.password && decryptData(currentUser.password) === '212171')))) && (
                <button 
                  onClick={() => setView('admin_login')}
                  className="flex items-center gap-1.5 p-2 bg-gradient-to-br from-pandora-primary to-purple-600 text-white rounded-full transition-all animate-pulse shadow-[0_0_20px_rgba(139,92,246,0.8)] z-50 border border-white/40 group"
                  title={T.nav.adminPanel}
                >
                  <ShieldCheck className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform" />
                  {(currentUser.isMaster || currentUser.id === 'u_user_alex' || (currentUser.cpf && (decryptData(currentUser.cpf) === '03531702750' || currentUser.cpf === '03531702750'))) && (
                    <span className="text-[7px] font-black pr-1 hidden sm:block">MASTER</span>
                  )}
                </button>
              )}
              
              {/* Logout button (only if actually signed in) */}
              {currentUser.id !== 'u1' && (
                <button
                  onClick={onLogout}
                  className="p-2 bg-red-900/10 hover:bg-red-900/30 text-red-500 rounded-full transition-colors border border-red-500/20"
                  title={T.nav.logoutAccount}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ active, onClick, icon, badge, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-full transition-all duration-300 relative flex items-center gap-2 text-sm font-semibold ${
      active 
        ? 'bg-pandora-card text-pandora-primary shadow-lg shadow-black/50 border border-white/5' 
        : 'text-black dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/5'
    } shadow-sm`}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#09090b]"></span>
    )}
  </button>
);

export default Header;
