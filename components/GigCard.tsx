
import React from 'react';
import { MapPin, Star, Gem, ShieldCheck, Lock, MessageCircleDashed, Hand, Briefcase, CheckCircle, Maximize2, Users, Ban, AlertTriangle, ChevronRight, Trash2, Pencil, Sparkles } from 'lucide-react';
import { GigRequest, GigStatus, User } from '../types';
import { translations } from '../src/translations';

interface GigCardProps {
  request: GigRequest;
  onClick: () => void;
  onHire: (id: string) => void;
  onRelease: (id: string) => void;
  currentUser: User;
  onViewCandidates?: (request: GigRequest) => void;
  onEditGig?: (gig: GigRequest) => void;
  onDeleteGig?: (id: string) => void;
  onUseInspiration?: (gig: GigRequest) => void;
  language?: string;
}

const GigCard: React.FC<GigCardProps> = ({ request, onClick, onHire, onRelease, currentUser, onViewCandidates, onEditGig, onDeleteGig, onUseInspiration, language = 'pt' }) => {
  const T = translations[language] || translations['pt'];
  const isOffer = request.type === 'offer';
  const isOwner = request.author.id === currentUser.id;
  const isGuest = currentUser.id === 'u1';
  const hasCandidates = request.candidates && request.candidates.length > 0;
  const isDenied = request.status === GigStatus.DENIED;
  const isSample = request.author.isSample;

  return (
    <div 
      onClick={isDenied ? undefined : onClick}
      className={`bg-pandora-card border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col h-full ${
        isDenied 
         ? 'border-red-500/20 opacity-80 cursor-not-allowed grayscale-[0.5] hover:border-red-500/40' 
         : (isSample 
            ? 'border-dashed border-pandora-primary/30 hover:border-pandora-primary shadow-xl shadow-pandora-primary/5 hover:bg-pandora-primary/5' 
            : 'border-white/5 hover:shadow-2xl hover:shadow-pandora-primary/10 hover:border-pandora-primary/30 cursor-pointer group')
      }`}
    >
      {/* Sample/Inspiration Badge */}
      {isSample && (
        <div className="absolute top-0 right-0 bg-pandora-primary/20 border-l border-b border-pandora-primary/30 text-pandora-primary text-[10px] font-black px-4 py-2 rounded-bl-3xl flex items-center gap-1 z-20 animate-pulse shadow-lg shadow-pandora-primary/20 pr-6">
          <Sparkles className="w-3.5 h-3.5" />
          {T.gigs.inspiration}
        </div>
      )}

      {/* Owner Management Controls */}
      {isOwner && (
        <div className="absolute top-10 right-4 flex gap-2 z-20">
          {onEditGig && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEditGig(request); }}
              className="p-1.5 bg-blue-600/90 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-colors backdrop-blur-sm"
              title={T.admin.actions.edit}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDeleteGig && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteGig(request.id); }}
              className="p-1.5 bg-red-600/90 text-white rounded-lg shadow-lg hover:bg-red-500 transition-colors backdrop-blur-sm"
              title={T.common.delete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Type Badge */}
      <div className={`absolute top-0 left-0 px-4 py-1.5 rounded-br-2xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 z-10 ${
        isDenied 
          ? 'bg-gray-700 text-black dark:text-gray-400'
          : (isOffer ? 'bg-pandora-secondary text-white' : 'bg-pandora-primary text-white')
      }`}>
        {isOffer ? <Briefcase className="w-3 h-3" /> : <Hand className="w-3 h-3" />}
        {isOffer ? T.gigs.offer : T.gigs.request}
        {request.urgency === 'Urgente' && <span className="ml-1 animate-pulse">🔥</span>}
        {request.urgency === 'Imediato' && <span className="ml-1 animate-bounce">⚡</span>}
      </div>

      {/* Image Preview (If exists) */}
      {request.images && request.images.length > 0 && (
        <div className="relative -mx-6 -mt-6 mb-4 h-40 overflow-hidden">
           <img 
             src={request.images[0]} 
             alt={request.title} 
             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-pandora-card via-transparent to-transparent"></div>
           
           {(request.urgency || request.experienceLevel) && (
             <div className="absolute bottom-2 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                {isOffer ? request.experienceLevel : request.urgency}
             </div>
           )}
        </div>
      )}

      {/* Status Indicators */}
      {isDenied && (
         <div className="absolute top-0 right-0 bg-red-900/60 border-l border-b border-red-500/40 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
          <Ban className="w-3 h-3" />
          {T.gigs.denied}
        </div>
      )}

      {request.status === GigStatus.IN_PROGRESS && (
        <div className="absolute top-0 right-0 bg-white border-l border-b border-white/20 text-black text-[10px] font-black px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-lg shadow-black/20">
          <Lock className="w-3 h-3" />
          {T.gigs.inProgress}
        </div>
      )}

      {request.status === GigStatus.NEGOTIATED && (
        <div className="absolute top-0 right-0 bg-blue-900/40 border-l border-b border-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
          <MessageCircleDashed className="w-3 h-3" />
          {T.gigs.negotiated}
        </div>
      )}

      {request.status === GigStatus.WAITING_CONCLUSION && (
        <div className="absolute top-0 right-0 bg-white border-l border-b border-white/20 text-black text-[10px] font-black px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-lg shadow-black/20">
          <CheckCircle className="w-3 h-3" />
          {T.gigs.waitingConclusion}
        </div>
      )}

      {(request.status === GigStatus.NEGOTIATING || (hasCandidates && !isOwner)) && 
        request.status !== GigStatus.IN_PROGRESS && 
        request.status !== GigStatus.NEGOTIATED && 
        request.status !== GigStatus.WAITING_CONCLUSION && 
        request.status !== GigStatus.COMPLETED && 
        !isDenied && (
        <div className="absolute top-0 right-0 bg-blue-900/40 border-l border-b border-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1 animate-pulse">
          <MessageCircleDashed className="w-3 h-3" />
          {T.gigs.negotiating}
        </div>
      )}

      {request.status === GigStatus.COMPLETED && (
        <div className="absolute top-0 right-0 bg-green-900/40 border-l border-b border-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {T.gigs.completed} {request.review && `• ${request.review.rating}★`}
        </div>
      )}

      <div className={`${request.images && request.images.length > 0 ? 'mt-2' : 'mt-6'} mb-2 flex justify-between items-start`}>
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white/5 text-black dark:text-gray-400 uppercase border border-white/5">
          {request.category}
        </span>
        <span className="text-xs text-black dark:text-gray-500">{request.createdAt}</span>
      </div>

      <h3 className={`text-xl font-bold mb-2 transition-colors line-clamp-2 ${isDenied ? 'text-red-400/80 line-through decoration-red-500/50' : 'text-black dark:text-white group-hover:text-pandora-primary'}`}>
        {request.title}
      </h3>
      
      {/* Description with Line Clamp */}
      <div className="relative mb-4 flex-grow">
        {isDenied ? (
           <div className="bg-red-950/30 p-3 rounded-lg border border-red-500/10">
              <p className="text-red-300 text-xs font-bold flex items-center gap-2 mb-1">
                 <AlertTriangle className="w-3 h-3" /> {T.gigs.deniedReason}:
              </p>
              <p className="text-black dark:text-gray-400 text-sm italic">
                 "{request.denialReason || 'Violação de conteúdo'}"
              </p>
           </div>
        ) : (
          <>
            <p className="text-black dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
              {request.description}
            </p>
            <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-pandora-card to-transparent pointer-events-none"></div>
          </>
        )}
      </div>

      {!isDenied && (
        <div className="text-[10px] text-pandora-primary font-bold uppercase tracking-wider mb-4 opacity-60 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Maximize2 className="w-3 h-3" /> Ver detalhes completos
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {request.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] bg-black/20 text-black dark:text-gray-500 px-2 py-1 rounded-md border border-white/5">
            #{tag}
          </span>
        ))}
      </div>

      {/* OWNER VIEW: Candidates List (Interactive) */}
      {isOwner && hasCandidates && request.status !== GigStatus.IN_PROGRESS && request.status !== GigStatus.COMPLETED && !isDenied && (
         <div 
            onClick={(e) => {
               e.stopPropagation();
               if(onViewCandidates) onViewCandidates(request);
            }}
            className="mb-4 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 hover:border-pandora-primary/30 transition-all cursor-pointer group/candidates"
         >
            <div className="flex justify-between items-center mb-2">
               <p className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {request.candidates.length} Interessados
               </p>
               <span className="text-[10px] text-black dark:text-gray-500 flex items-center group-hover/candidates:text-white transition-colors">
                  Gerenciar <ChevronRight className="w-3 h-3" />
               </span>
            </div>
            <div className="flex -space-x-2 overflow-hidden items-center">
               {request.candidates.slice(0, 5).map((candidate, i) => (
                  <img 
                    key={i} 
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#18181b] object-cover" 
                    src={candidate.avatar} 
                    alt={candidate.name} 
                  />
               ))}
               {request.candidates.length > 5 && (
                  <div className="h-6 w-6 rounded-full ring-2 ring-[#18181b] bg-gray-700 flex items-center justify-center text-[8px] text-white font-bold">
                     +{request.candidates.length - 5}
                  </div>
               )}
            </div>
         </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3">
          <img src={request.author.avatar} alt={request.author.name} className={`w-9 h-9 rounded-full border ${request.author.isCelebrity ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/10'}`} />
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-black dark:text-gray-200">{isOwner ? T.gigs.me : request.author.name}</p>
              {request.author.isCelebrity && (
                <span className="bg-amber-500 text-black text-[8px] font-black px-1 rounded flex items-center gap-0.5">
                  <Gem className="w-2 h-2" /> {T.gigs.celebrity}
                </span>
              )}
            </div>
            <div className="flex items-center text-[10px] text-amber-500">
              <Star className="w-3 h-3 fill-current mr-0.5" />
              {request.author.rating}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-pandora-secondary font-bold font-mono flex items-center justify-end gap-1 text-lg">
            <Gem className="w-4 h-4" />
            {request.budget}
          </div>
          
          {!isOwner && request.status === GigStatus.OPEN && !isDenied && !isSample && (
            <button 
              onClick={(e) => { e.stopPropagation(); onHire(request.id); }}
              className={`mt-2 text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1 transition-colors font-bold shadow-sm ${
                isGuest
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : (isOffer 
                      ? 'bg-pandora-secondary hover:bg-orange-600 text-white'
                      : 'bg-pandora-primary hover:bg-purple-700 text-white')
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {isGuest ? (language === 'en' ? 'SIGN UP NOW' : 'CADASTRE-SE AGORA') : (isOffer ? T.gigs.hire : T.gigs.meet)}
            </button>
          )}

          {isSample && (
            <button 
              onClick={(e) => { e.stopPropagation(); onUseInspiration?.(request); }}
              className="mt-2 text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1 transition-all font-bold shadow-lg shadow-pandora-primary/30 bg-pandora-primary text-white hover:bg-pandora-primary/80 hover:scale-105"
            >
              <Sparkles className="w-3 h-3" />
              {T.gigs.useIdea}
            </button>
          )}

          {!isOwner && request.status === GigStatus.NEGOTIATING && !isDenied && (
             <span className="mt-2 text-[10px] text-blue-400 font-bold uppercase tracking-wide">
                Disponível
             </span>
          )}

          {(request.status === GigStatus.IN_PROGRESS || 
            request.status === GigStatus.NEGOTIATED || 
            request.status === GigStatus.WAITING_CONCLUSION) && ((request.type === 'request' && isOwner) || (request.type === 'offer' && !isOwner)) && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRelease(request.id); }}
              className="mt-2 text-[10px] px-4 py-1.5 rounded-full flex items-center gap-1 transition-colors font-bold shadow-lg shadow-green-900/50 bg-green-600 text-white hover:bg-green-500 animate-pulse"
            >
              <CheckCircle className="w-3 h-3" />
              {T.gigs.releasePayment}
            </button>
          )}

          {isDenied && (
             <span className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-wide flex items-center gap-1">
                <Ban className="w-3 h-3" /> Tente Novamente
             </span>
          )}
          
          <div className="mt-1 text-[10px] text-black dark:text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {request.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
