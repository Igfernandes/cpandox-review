
import React, { useState, useEffect } from 'react';
import { Wand2, Loader2, Send, Hand, Briefcase, AlertCircle, ArrowLeft, ShieldAlert, LockKeyhole, ScanEye, Info, AlertTriangle, Save, PartyPopper, ShieldCheck, Zap, Target, Percent } from 'lucide-react';
import { Category, GigRequest, GigStatus, ListingType, User } from '../types';
import { enhanceGigDescription, generateTags, analyzeGigSafety } from '../services/geminiService';

import { translations } from '../src/translations';

interface CreateGigFormProps {
  onSubmit: (gig: GigRequest) => void;
  onCancel: () => void;
  initialDescription?: string;
  initialType?: ListingType;
  initialTitle?: string;
  initialCategory?: Category;
  initialBudget?: number;
  initialLocation?: string;
  currentUser: User;
  onRedirectToSignup: () => void;
  onUpgrade?: () => void;
  gigToEdit?: GigRequest | null; // Propriedade para edição
  language?: string;
}

const CreateGigForm: React.FC<CreateGigFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialDescription = '', 
  initialType = 'request', 
  initialTitle = '',
  initialCategory,
  initialBudget,
  initialLocation = '',
  currentUser, 
  onRedirectToSignup, 
  onUpgrade, 
  gigToEdit, 
  language = 'pt' 
}) => {
  const T = translations[language] || translations['pt'];
  // Initialize type based on role allowed or edit mode
  const getInitialType = () => {
     if (gigToEdit) return gigToEdit.type;
     if (currentUser.role === 'worker') return 'offer';
     if (currentUser.role === 'requester') return 'request';
     return initialType;
  };

  const [type, setType] = useState<ListingType>(getInitialType());
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState<Category>(initialCategory || Category.PEDIDOS_PESSOAIS);
  const [budget, setBudget] = useState(initialBudget ? String(initialBudget) : '');
  const [location, setLocation] = useState(initialLocation);
  const [deadline, setDeadline] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Pleno');
  const [urgency, setUrgency] = useState('Normal');
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for safety check
  const [safetyWarning, setSafetyWarning] = useState<{ reason: string } | null>(null); // New state for safety warning
  const [error, setError] = useState<string | null>(null);

  // POPULA CAMPOS SE FOR EDIÇÃO OU INSPIRAÇÃO
  useEffect(() => {
    if (gigToEdit) {
      setTitle(gigToEdit.title);
      setDescription(gigToEdit.description);
      setCategory(gigToEdit.category);
      setBudget(String(gigToEdit.budget));
      setLocation(gigToEdit.location);
      setDeadline(gigToEdit.deadline || '');
      setType(gigToEdit.type);
    } else {
      if (initialTitle) setTitle(initialTitle);
      if (initialDescription) setDescription(initialDescription);
      if (initialCategory) setCategory(initialCategory);
      if (initialBudget) setBudget(String(initialBudget));
      if (initialLocation) setLocation(initialLocation);
      if (initialType) setType(initialType);
    }
  }, [gigToEdit, initialTitle, initialDescription, initialCategory, initialBudget, initialLocation, initialType]);

  // Force correct type on mount if user role is restrictive (only if not editing)
  useEffect(() => {
     if (gigToEdit) return; 
     if (currentUser.role === 'worker' && type !== 'offer') setType('offer');
     if (currentUser.role === 'requester' && type !== 'request') setType('request');
  }, [currentUser, gigToEdit]);

  const handleInteraction = (e?: React.FocusEvent | React.KeyboardEvent) => {
    if (!currentUser.isVerified) {
        if (e) e.preventDefault();
        onRedirectToSignup();
    }
  };

  const handleTypeChange = (newType: ListingType) => {
    if (gigToEdit) return; // Não permite trocar tipo na edição para evitar inconsistência

    if (!currentUser.isVerified) {
        setType(newType); // Visual only, interaction blocked elsewhere
        return;
    }

    if (currentUser.role === 'both') {
        setType(newType);
        setError(null);
        return;
    }

    if (currentUser.role === 'requester' && newType === 'offer') {
        if (onUpgrade) {
            onUpgrade();
        } else {
            onRedirectToSignup();
        }
        return;
    }

    if (currentUser.role === 'worker' && newType === 'request') {
        if (onUpgrade) {
            onUpgrade();
        } else {
            onRedirectToSignup();
        }
        return;
    }

    setType(newType);
    setError(null);
  };

  const handleEnhance = async () => {
    if (!description) return;
    setIsEnhancing(true);
    const improved = await enhanceGigDescription(description, category);
    setDescription(improved);
    setIsEnhancing(false);
  };

  /**
   * FUNÇÃO DE SEGURANÇA (Modo Estrito - Bloqueio de Contatos Externos)
   */
  const checkProhibitedContent = (
    text: string,
    fieldName: string,
  ): string | null => {
    const lowerText = text.toLowerCase().replace(/\s/g, ''); // Remove todos os espaços para burlar tentativas de esconder
    
    // Regex para telefones (Brasil e Geral) - Captura padrões como (11) 99999-9999, 11999999999, etc.
    const phoneRegex = /(?:\(?\d{2}\)?\s?)?(?:9\s?)?\d{4}[-\s]?\d{4}/g;
    
    const potentialPhones = text.match(phoneRegex);
    if (potentialPhones) {
      // Filtramos para garantir que tenha pelo menos 8-11 dígitos (evita anos ou preços vindo com pontuação)
      const validPhones = potentialPhones.filter(p => {
        const digits = p.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 13;
      });
      
      if (validPhones.length > 0) {
        return `${T.createGig.contactViolation.replace("{field}", fieldName)}`;
      }
    }

    // Regex para E-mails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailRegex.test(text)) {
      return `${T.createGig.emailViolation.replace("{field}", fieldName)}`;
    }

    // Palavras-chave que indicam tentativa de contato externo (Verificamos no texto sem espaços)
    const prohibitedKeywords = [
      "whatsapp", "zap", "wpp", "contato", "telefone", "celular", "chama", "noszap", "nozap", 
      "meliga", "meunumero", "instagram", "facebook", "email", "ligar"
    ];

    if (prohibitedKeywords.some(k => lowerText.includes(k))) {
      return `${T.createGig.contactViolation.replace("{field}", fieldName)}`;
    }

    // Verificação de símbolos suspeitos comuns em contatos
    if (text.includes('@') && fieldName !== 'E-mail') {
        return `${T.createGig.emailViolation.replace("{field}", fieldName)}`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (currentUser.isVerified && currentUser.role !== "both" && !gigToEdit) {
      if (currentUser.role === "requester" && type === "offer") {
        if (onUpgrade) onUpgrade();
        else onRedirectToSignup();
        return;
      }
      if (currentUser.role === "worker" && type === "request") {
        if (onUpgrade) onUpgrade();
        else onRedirectToSignup();
        return;
      }
    }

    // --- VALIDAÇÃO DE REGEX (MODO ESTRITO) ---
    const titleLabel = isRequest
      ? T.createGig.titleRequest
      : T.createGig.titleOffer;
    const titleViolation = checkProhibitedContent(title, titleLabel);
    if (titleViolation) {
      setError(`${T.createGig.securityBlock}: ${titleViolation}`);
      return;
    }

    const descLabel = T.createGig.descriptionLabel;
    const descViolation = checkProhibitedContent(description, descLabel);
    if (descViolation) {
      setError(`${T.createGig.securityBlock}: ${descViolation}`);
      return;
    }

    // Mínimo de 10 PND (R$ 100,00) - VALOR ATUALIZADO
    // Mínimo de 100 PND para Celebridades
    const minBudget = category === Category.SERVICOS_CELEBRIDADES ? 100 : 10;
    if (Number(budget) < minBudget) {
      setError((T.createGig.minBudgetError || "O valor mínimo é {min} PND").replace('{min}', minBudget.toString()).replace('{value}', (minBudget * 10).toString()));
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError(T.createGig.fillAllFields);
      return;
    }

    // --- ANÁLISE DE IA (CONTEÚDO ILEGAL) ---
    setIsAnalyzing(true);
    const safetyCheck = await analyzeGigSafety(title, description);
    setIsAnalyzing(false);

    if (!safetyCheck.allowed) {
        setSafetyWarning({ reason: safetyCheck.reason });
        return; // PROIBE A PUBLICAÇÃO
    }

    const tags = await generateTags(description);
    
    const newGig: GigRequest = {
      id: gigToEdit ? gigToEdit.id : Math.random().toString(36).substr(2, 9),
      type,
      author: currentUser,
      title: title.trim() || 'Novo Item',
      description: description.trim(),
      category,
      budget: Number(budget),
      location: location.trim(),
      deadline: deadline || (type === 'request' ? 'A combinar' : 'Disponível'),
      createdAt: gigToEdit ? gigToEdit.createdAt : 'Agora',
      tags,
      status: GigStatus.OPEN,
      candidates: gigToEdit ? gigToEdit.candidates : [],
      experienceLevel: !isRequest ? experienceLevel : undefined,
      urgency: isRequest ? urgency : undefined,
    };

    onSubmit(newGig);
  };

  const isRequest = type === 'request';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Mobile Back Button */}
      <button onClick={onCancel} className="md:hidden mb-4 text-gray-400 flex items-center gap-2 text-sm font-bold">
        <ArrowLeft className="w-4 h-4" /> {T.common.back || 'Voltar'}
      </button>

      <div className="bg-pandora-card p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Safety Warning Overlay with Luminous Warning */}
        {safetyWarning && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500 ring-8 ring-red-600 shadow-[0_0_100px_rgba(220,38,38,0.8)]">
            <div className="max-w-sm relative animate-shake">
              {/* Luminous Glow Background - Multi-layered */}
              <div className="absolute -inset-40 bg-red-600/30 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
              <div className="absolute -inset-20 bg-red-500/20 blur-[60px] rounded-full animate-ping pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="w-28 h-28 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-bounce">
                  <ShieldAlert className="w-14 h-14 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,1)]" />
                </div>
                
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(255,0,0,1)] animate-pulse">
                  {T.createGig.safetyViolationTitle}
                </h3>
                
                <div className="bg-red-950/60 border-2 border-red-500 p-6 rounded-2xl mb-8 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                  <p className="text-base text-red-100 font-black leading-relaxed uppercase tracking-tight">
                    {safetyWarning.reason}
                  </p>
                </div>
                
                <p className="text-xs text-gray-400 mb-8 leading-relaxed font-medium">
                  {T.createGig.safetyViolationDesc}
                </p>
                
                <button 
                  onClick={() => setSafetyWarning(null)}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95"
                >
                  {T.createGig.reviewAndFix}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl opacity-10 blur-3xl rounded-full pointer-events-none ${isRequest ? 'from-pandora-primary' : 'from-pandora-secondary'}`} />

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className={`p-4 rounded-2xl border transition-colors ${isRequest ? 'bg-pandora-primary/20 text-pandora-primary border-pandora-primary/20' : 'bg-pandora-secondary/20 text-pandora-secondary border-pandora-secondary/20'}`}>
            {isRequest ? <Hand className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
          </div>
          <div>
             <h2 className="text-3xl font-display font-black text-black dark:text-white tracking-tight">
               {gigToEdit ? T.createGig.editTitle : (isRequest ? T.createGig.requestTitle : T.createGig.offerTitle)}
             </h2>
             <p className="text-gray-600 dark:text-gray-400 text-sm">
               {isRequest ? T.createGig.requestSubtitle : T.createGig.offerSubtitle}
             </p>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-black px-6 py-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <ShieldAlert className="w-6 h-6 shrink-0 text-red-700" />
            <div className="flex flex-col gap-1">
               <span className="font-bold uppercase text-black flex items-center gap-2">
                 <LockKeyhole className="w-4 h-4" /> {T.createGig.securityActivated}
               </span>
               <span className="leading-relaxed font-bold text-black">{error}</span>
               <span className="text-xs text-black mt-1 italic font-bold">
                 {T.createGig.tip}
               </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Type Selector Toggle - Disable if Editing */}
          <div className={`bg-black/40 p-1.5 rounded-xl border border-white/10 flex ${gigToEdit ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              type="button"
              onClick={() => handleTypeChange('request')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isRequest 
                  ? 'bg-pandora-primary text-white shadow-lg shadow-purple-900/50' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Hand className="w-4 h-4" />
              {T.createGig.typeRequest}
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('offer')}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                !isRequest 
                  ? 'bg-pandora-secondary text-white shadow-lg shadow-orange-900/50' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              {T.createGig.typeOffer}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
                {isRequest ? T.createGig.titleRequest : T.createGig.titleOffer}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                onFocus={handleInteraction}
                onKeyDown={handleInteraction}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary focus:border-transparent outline-none transition-all placeholder-gray-600 font-medium"
                placeholder={isRequest ? T.createGig.titlePlaceholderRequest : T.createGig.titlePlaceholderOffer}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">{T.createGig.categoryLabel}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(Category).map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'bg-white text-pandora-primary border-white shadow-xl scale-[1.02]'
                          : 'bg-white/5 text-gray-600 dark:text-gray-400 border-white/10 hover:border-pandora-primary/50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-pandora-primary/10 text-pandora-primary' : 'bg-white/5 text-gray-500'}`}>
                        {cat === Category.PEDIDOS_PESSOAIS && <Hand className="w-5 h-5" />}
                        {cat === Category.PEDIDOS_EVENTOS && <PartyPopper className="w-5 h-5" />}
                        {cat === Category.PEDIDOS_TERCEIROS && <Briefcase className="w-5 h-5" />}
                        {cat === Category.TRABALHOS_INUSITADOS && <Wand2 className="w-5 h-5" />}
                        {cat === Category.SERVICOS_CELEBRIDADES && <ShieldCheck className="w-5 h-5 text-amber-500" />}
                      </div>
                      <span className="text-xs font-bold leading-tight">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">{T.createGig.descriptionLabel}</label>
              <div className="relative">
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onFocus={handleInteraction}
                  onKeyDown={handleInteraction}
                  rows={10}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary focus:border-transparent outline-none transition-all resize-y placeholder-gray-600 leading-relaxed custom-scrollbar"
                  placeholder={isRequest ? T.createGig.descPlaceholderRequest : T.createGig.descPlaceholderOffer}
                />
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !description}
                  className="absolute bottom-4 right-4 text-[10px] bg-pandora-bg text-pandora-primary px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 transition-colors border border-pandora-primary/30 shadow-sm font-bold uppercase tracking-wider"
                >
                  {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  {T.createGig.improveAI}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                 <ShieldAlert className="w-3 h-3 text-pandora-secondary" /> {T.createGig.monitoring}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">{T.createGig.budgetLabel}</label>
                <input
                  type="number"
                  required
                  min="10"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  onFocus={handleInteraction}
                  onKeyDown={handleInteraction}
                  className={`w-full bg-black/20 border rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary outline-none font-mono ${Number(budget) > 0 && Number(budget) < 10 ? 'border-red-500/50 bg-red-900/10' : 'border-white/10'}`}
                  placeholder={T.createGig.budgetPlaceholder}
                />
                <div className="flex flex-col mt-2 gap-1">
                  <span className="text-[10px] text-gray-600 dark:text-gray-500 ml-1 font-medium">{(T.createGig.budgetMin || "Mínimo: {min} PND (R$ {value})").replace('{min}', (category === Category.SERVICOS_CELEBRIDADES ? 100 : 10).toString()).replace('{value}', ((category === Category.SERVICOS_CELEBRIDADES ? 100 : 10) * 10).toString())}</span>
                  {isRequest && Number(budget) >= (category === Category.SERVICOS_CELEBRIDADES ? 100 : 10) && (
                    <div className="bg-pandora-primary/10 border border-pandora-primary/20 p-2 rounded-lg mt-1">
                       <span className="text-[10px] text-pandora-primary font-black uppercase flex items-center gap-1">
                         <Percent className="w-3 h-3" /> 
                         Garantia App (35%): {(Number(budget) * 0.35).toFixed(2)} PND (R$ {(Number(budget) * 0.35 * 10).toFixed(2)})
                       </span>
                       <p className="text-[9px] text-gray-500 leading-tight mt-1">
                         * Este valor será cobrado no ato da publicação via PIX ou Cartão.
                       </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">{T.createGig.deadlineLabel}</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  onFocus={handleInteraction}
                  onKeyDown={handleInteraction}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary outline-none"
                  placeholder={isRequest ? T.createGig.deadlinePlaceholderRequest : T.createGig.deadlinePlaceholderOffer}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">{T.createGig.locationLabel}</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onFocus={handleInteraction}
                  onKeyDown={handleInteraction}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary outline-none"
                  placeholder={T.createGig.locationPlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
                  {isRequest ? T.createGig.urgencyLevelLabel : T.createGig.experienceLevelLabel}
                </label>
                <select
                  value={isRequest ? urgency : experienceLevel}
                  onChange={e => isRequest ? setUrgency(e.target.value) : setExperienceLevel(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-black dark:text-white focus:ring-2 focus:ring-pandora-primary outline-none appearance-none"
                >
                  {isRequest ? (
                    <>
                      <option value="Normal">{T.createGig.urgencyLevels.normal}</option>
                      <option value="Urgente">{T.createGig.urgencyLevels.urgent}</option>
                      <option value="Imediato">{T.createGig.urgencyLevels.immediate}</option>
                    </>
                  ) : (
                    <>
                      <option value="Junior">{T.createGig.experienceLevels.junior}</option>
                      <option value="Pleno">{T.createGig.experienceLevels.pleno}</option>
                      <option value="Senior">{T.createGig.experienceLevels.senior}</option>
                      <option value="Expert">{T.createGig.experienceLevels.expert}</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* LIVE PREVIEW SECTION */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <ScanEye className="w-4 h-4" /> {T.createGig.realTimePreview}
                </h3>

                <div className="bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider ${isRequest ? "bg-pandora-primary/20 text-pandora-primary" : "bg-pandora-secondary/20 text-pandora-secondary"}`}
                        >
                          {isRequest ? T.createGig.requestIcon : T.createGig.offerIcon}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">
                          • {category}
                        </span>
                        <span className="ml-auto text-lg font-mono font-black text-pandora-primary">
                          {budget || "0"} PND
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-1">
                        {title || T.createGig.previewTitlePlaceholder}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic mb-4">
                        {description || T.createGig.previewDescPlaceholder}
                      </p>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-500">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" /> {location || T.createGig.locationLabel}
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {deadline || T.createGig.deadlineLabel}
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowLeft className="w-3 h-3 rotate-45" />{" "}
                          {isRequest 
                            ? (T.createGig.urgencyLevels[urgency.toLowerCase() as keyof typeof T.createGig.urgencyLevels] || urgency)
                            : (T.createGig.experienceLevels[experienceLevel.toLowerCase() as keyof typeof T.createGig.experienceLevels] || experienceLevel)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            
            {/* RULES & WARNINGS BLOCK */}
            <div className="mt-4 bg-[#09090b] border border-white/10 rounded-xl p-4">
               <h4 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-pandora-primary" /> {T.createGig.rulesTitle}
               </h4>
               <ul className="text-[10px] text-white/90 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-pandora-secondary font-bold">•</span>
                    <span><strong className="text-white">{T.createGig.rule1Title}:</strong> {T.createGig.rule1Desc}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pandora-secondary font-bold">•</span>
                    <span><strong className="text-white">{T.createGig.rule2Title}:</strong> {T.createGig.rule2Desc}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pandora-secondary font-bold">•</span>
                    <span><strong className="text-white">{T.createGig.rule3Title}:</strong> {T.createGig.rule3Desc}</span>
                  </li>
                </ul>
            </div>

          </div>

          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              disabled={isAnalyzing}
              className="flex-1 py-4 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-xs"
            >
              {T.common.cancel}
            </button>
            <button
              type="submit"
              disabled={!!error || isAnalyzing}
              className={`flex-[2] py-4 rounded-xl text-white transition-all font-bold flex items-center justify-center gap-3 shadow-lg uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                isRequest 
                  ? 'bg-pandora-primary hover:bg-purple-700 shadow-purple-900/20' 
                  : 'bg-pandora-secondary hover:bg-orange-600 shadow-orange-900/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                   <ScanEye className="w-4 h-4 animate-pulse" /> {T.createGig.analyzing}
                </>
              ) : (
                <>
                   {gigToEdit ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                   {gigToEdit ? T.createGig.saveChanges : (isRequest ? T.createGig.publishRequest : T.createGig.publishOffer)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGigForm;
