
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Fingerprint, 
  MapPin, 
  Phone, 
  Wallet, 
  ShieldCheck, 
  Hand, 
  Briefcase, 
  Star, 
  Gem, 
  Sparkles,
  Settings, 
  LogOut, 
  Share2, 
  RefreshCw, 
  Headset,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pencil,
  Trash2,
  Link,
  Sun,
  Moon
} from 'lucide-react';
import { User, GigRequest, GigStatus } from '../types';
import { decryptData } from '../services/encryption';
import GigCard from './GigCard';
import { translations } from '../src/translations';

interface ProfileViewProps {
  currentUser: User;
  userBalance: number;
  requests: GigRequest[];
  onLogout: () => void;
  onShareApp: () => void;
  onResetApp: () => void;
  onOpenSafety: () => void;
  onOpenSupport: () => void;
  onHire: (id: string) => void;
  onRelease: (id: string) => void;
  onGigClick: (gig: GigRequest) => void;
  onViewCandidates: (gig: GigRequest) => void;
  onEditGig: (gig: GigRequest) => void;
  onDeleteGig: (id: string) => void;
  setView: (view: string) => void;
  language?: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userBalance,
  requests,
  onLogout,
  onShareApp,
  onResetApp,
  onOpenSafety,
  onOpenSupport,
  onHire,
  onRelease,
  onGigClick,
  onViewCandidates,
  onEditGig,
  onDeleteGig,
  setView,
  language = 'pt'
}) => {
  const T = translations[language] || translations['pt'];
  const [activeTab, setActiveTab] = useState<'cadastro' | 'pedidos' | 'ofertas'>('cadastro');

  const myRequests = requests.filter(r => r.author.id === currentUser.id && r.type === 'request');
  const myOffers = requests.filter(r => r.author.id === currentUser.id && r.type === 'offer');

  const renderRegistrationData = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-pandora-primary" />
          <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{T.profile.personalInfo}</h3>
        </div>
        <div className="p-6 space-y-4">
          <DataField icon={<UserIcon className="w-4 h-4" />} label={T.profile.fullName} value={currentUser.name} />
          <DataField icon={<Mail className="w-4 h-4" />} label={T.profile.email} value={currentUser.email || T.profile.notInformed} />
          <DataField icon={<Fingerprint className="w-4 h-4" />} label={T.profile.cpf} value={decryptData(currentUser.cpf) || currentUser.cpf || T.profile.notVerified} isSensitive />
          <DataField icon={<Phone className="w-4 h-4" />} label={T.profile.phone} value={decryptData(currentUser.phone) || currentUser.phone || T.profile.notInformed} />
          <DataField icon={<MapPin className="w-4 h-4" />} label={T.profile.address} value={decryptData(currentUser.address) || currentUser.address || T.profile.notInformed} />
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">{T.profile.financialInfo}</h3>
        </div>
        <div className="p-6 space-y-4">
          <button 
            onClick={() => setView('wallet')} 
            className="w-full text-left focus:outline-none transition-all active:scale-95"
          >
            <DataField icon={<Gem className="w-4 h-4" />} label="Saldo Disponível" value={`${userBalance} PND`} />
          </button>
          <DataField icon={<CreditCard className="w-4 h-4" />} label="Chave Pix" value={decryptData(currentUser.pixKey) || currentUser.pixKey || 'Não cadastrada'} />
          <DataField icon={<ShieldCheck className="w-4 h-4" />} label="Status da Conta" value={currentUser.isVerified ? 'Verificada' : 'Pendente'} badge={currentUser.isVerified ? 'success' : 'warning'} />
        </div>
      </div>

      {!currentUser.isCelebrity && (
        <div className="bg-amber-500/10 rounded-2xl border border-amber-500/30 p-6 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <Gem className="w-8 h-8 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-black text-amber-500 uppercase tracking-tighter">Você é uma celebridade?</h3>
            <p className="text-xs text-amber-500/70 font-medium">Cadastre-se como famoso e tenha acesso a recursos exclusivos.</p>
          </div>
          <button 
            onClick={() => setView('celebrity_signup')}
            id="profile-celebrity-signup-btn"
            data-allow-interaction="true"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> {T.nav.registerCelebrity}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!currentUser.hasRated && (
          <button onClick={() => setView('rating')} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-colors shadow-lg shadow-amber-900/10">
            <Star className="w-5 h-5" /> Avaliar App
          </button>
        )}
        {currentUser.isVerified && (
          <button onClick={onOpenSupport} className="bg-pandora-secondary/10 text-pandora-secondary border border-pandora-secondary/20 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-pandora-secondary/20 transition-colors shadow-lg shadow-orange-900/10">
            <Headset className="w-5 h-5" /> Suporte
          </button>
        )}
        <button onClick={onOpenSafety} className="bg-blue-900/20 text-blue-400 border border-blue-500/20 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900/40 transition-colors shadow-lg shadow-blue-900/10">
          <ShieldCheck className="w-5 h-5" /> Segurança
        </button>
        <button onClick={onShareApp} className="bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
        <button 
          onClick={() => {
            const html = document.documentElement;
            if (html.classList.contains('dark')) {
              html.classList.remove('dark');
              localStorage.setItem('pandora_theme', 'light');
            } else {
              html.classList.add('dark');
              localStorage.setItem('pandora_theme', 'dark');
            }
            window.location.reload(); // Reload to sync state in App.tsx if needed, or just let it be
          }} 
          className="bg-white/5 text-black dark:text-gray-400 border border-white/10 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Sun className="w-4 h-4 text-amber-400" /> / <Moon className="w-4 h-4 text-blue-400" /> Alternar Tema
        </button>
        <button onClick={onLogout} className="bg-red-900/20 text-red-500 border border-red-500/20 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900/40 transition-colors">
          <LogOut className="w-4 h-4" /> Sair da Conta
        </button>
      </div>

      <div className="pt-4 flex flex-col items-center gap-4">
        <button onClick={onResetApp} className="text-[10px] text-black dark:text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase font-bold tracking-widest">
          <RefreshCw className="w-3 h-3" /> {T.profile.resetApp}
        </button>
      </div>
    </div>
  );

  const renderGigsList = (gigs: GigRequest[], type: 'request' | 'offer') => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
          {type === 'request' ? <Hand className="w-5 h-5 text-pandora-primary" /> : <Briefcase className="w-5 h-5 text-pandora-secondary" />}
          {type === 'request' ? T.profile.tabs.requests : T.profile.tabs.offers}
        </h3>
        <span className="text-xs font-mono text-black dark:text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
          {gigs.length} total
        </span>
      </div>

      {gigs.length === 0 ? (
        <div className="bg-white/5 rounded-3xl p-12 text-center border border-white/5 border-dashed">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            {type === 'request' ? <Hand className="w-8 h-8 text-black dark:text-gray-400" /> : <Briefcase className="w-8 h-8 text-black dark:text-gray-400" />}
          </div>
          <p className="text-black dark:text-gray-400 mb-6">{T.profile.noGigs.replace('{type}', type === 'request' ? T.gigs.request.toLowerCase() : T.gigs.offer.toLowerCase())}</p>
          <button 
            onClick={() => setView('create')} 
            className="bg-pandora-primary hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
          >
            {T.profile.createNow}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {gigs.map(gig => (
            <div key={gig.id} className="relative">
              <GigCard 
                request={gig} 
                onClick={() => onGigClick(gig)} 
                onHire={onHire} 
                onRelease={onRelease} 
                currentUser={currentUser} 
                onViewCandidates={onViewCandidates} 
                onEditGig={onEditGig}
                onDeleteGig={onDeleteGig}
                language={language}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Profile Header Card */}
      <div className="bg-pandora-card rounded-3xl border border-white/10 p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pandora-primary/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-pandora-bg bg-gray-800 overflow-hidden shadow-2xl relative">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            {currentUser.isVerified && (
              <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-pandora-card shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-black dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              {currentUser.name}
              {currentUser.isCelebrity && (
                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                  <Gem className="w-3 h-3" /> {T.profile.famoso}
                </span>
              )}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-current" /> {currentUser.rating}
              </div>
              <div className="w-1 h-1 bg-black dark:bg-gray-600 rounded-full"></div>
              <div className="text-xs text-black dark:text-gray-500 font-bold uppercase tracking-widest">
                {currentUser.role === 'both' ? T.profile.multitask : currentUser.role === 'worker' ? T.profile.worker : T.profile.requester}
              </div>
            </div>
            {!currentUser.isVerified && (
              <button 
                onClick={() => setView('signup')}
                className="mt-4 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse hover:bg-red-500/30 transition-all"
              >
                {T.profile.completeVerification}
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <button 
                onClick={() => setView('wallet')}
                className="flex-1 bg-gradient-to-br from-pandora-primary/20 to-pandora-secondary/20 hover:from-pandora-primary/30 hover:to-pandora-secondary/30 border border-white/10 rounded-2xl p-4 text-center transition-all group relative overflow-hidden shadow-lg shadow-pandora-primary/10"
             >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <p className="text-[10px] text-black dark:text-gray-400 font-bold uppercase mb-1 group-hover:text-black dark:group-hover:text-white transition-colors tracking-widest">{T.profile.availableBalance}</p>
                <div className="flex items-center justify-center gap-2">
                  <Gem className="w-5 h-5 text-amber-500" />
                  <p className="text-2xl font-mono text-black dark:text-white font-black">PND {userBalance}</p>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-bold text-pandora-primary uppercase tracking-widest group-hover:gap-2 transition-all">
                  {T.profile.accessWallet} <ChevronRight className="w-3 h-3" />
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-8 sticky top-24 z-40 backdrop-blur-md">
        <TabButton 
          active={activeTab === 'cadastro'} 
          onClick={() => setActiveTab('cadastro')} 
          label={T.profile.tabs.registration} 
          icon={<Fingerprint className="w-4 h-4" />} 
        />
        <TabButton 
          active={activeTab === 'pedidos'} 
          onClick={() => setActiveTab('pedidos')} 
          label={T.gigs.requests} 
          icon={<Hand className="w-4 h-4" />} 
          count={myRequests.length}
        />
        <TabButton 
          active={activeTab === 'ofertas'} 
          onClick={() => setActiveTab('ofertas')} 
          label={T.gigs.offers} 
          icon={<Briefcase className="w-4 h-4" />} 
          count={myOffers.length}
        />
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'cadastro' && renderRegistrationData()}
        {activeTab === 'pedidos' && renderGigsList(myRequests, 'request')}
        {activeTab === 'ofertas' && renderGigsList(myOffers, 'offer')}
      </div>
    </div>
  );
};

const DataField = ({ icon, label, value, isSensitive, badge }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-black dark:text-gray-500 group-hover:text-pandora-primary transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-black dark:text-gray-500 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-sm font-medium ${isSensitive ? 'font-mono tracking-tighter' : 'text-black dark:text-gray-200'}`}>
          {isSensitive ? value.replace(/.(?=.{4})/g, '*') : value}
        </p>
      </div>
    </div>
    {badge && (
      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
        badge === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
      }`}>
        {value}
      </span>
    )}
  </div>
);

const TabButton = ({ active, onClick, label, icon, count }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
      active 
        ? 'bg-pandora-primary/10 text-pandora-primary dark:bg-white/10 dark:text-white shadow-xl' 
        : 'text-black dark:text-gray-500 hover:text-black dark:hover:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count !== undefined && (
      <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-pandora-primary text-white' : 'bg-white/10 text-gray-500'}`}>
        {count}
      </span>
    )}
  </button>
);

export default ProfileView;
