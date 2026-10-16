
import React, { useState, useEffect } from 'react';
import { User, QrCode, Copy, Loader2, Lock, ArrowRight, ShieldCheck, CheckCircle2, PartyPopper, Ticket, Scale, AlertCircle, MapPin, Check, Wallet, AlertTriangle, Gem, Sparkles, Eye, EyeOff } from 'lucide-react';
import { User as UserType, SystemSettings } from '../types';
import { validateRegistrationName } from '../services/geminiService';
import { encryptData } from '../services/encryption';

import { translations } from '../src/translations';

interface CelebritySignupFormProps {
  onSignup: (user: UserType) => void;
  onCancel: () => void;
  onSwitchToLogin?: () => void;
  adminPixKey: string;
  systemSettings: SystemSettings;
  language?: string;
}

const CELEBRITY_AVATARS = {
  Athlete: [
    { id: 'a1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete1&accessories=sunglasses&mouth=smile' },
    { id: 'a2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete2&top=shortHair&mouth=smile' },
    { id: 'a3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete3&top=longHair&mouth=smile' },
    { id: 'a4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete4&top=buzzCut&mouth=smile' },
    { id: 'a5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete5&top=frizzle&mouth=smile' },
    { id: 'a6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete6&top=shaggy&mouth=smile' },
    { id: 'a7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete7&top=caesar&mouth=smile' },
    { id: 'a8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete8&top=dreads&mouth=smile' },
    { id: 'a9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete9&top=curly&mouth=smile' },
    { id: 'a10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Athlete10&top=flatTop&mouth=smile' },
  ],
  Artist: [
    { id: 'art1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist1&top=longHair&mouth=smile' },
    { id: 'art2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist2&accessories=round&mouth=smile' },
    { id: 'art3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist3&top=bob&mouth=smile' },
    { id: 'art4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist4&top=curvy&mouth=smile' },
    { id: 'art5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist5&top=dreads&mouth=smile' },
    { id: 'art6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist6&top=frida&mouth=smile' },
    { id: 'art7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist7&top=fro&mouth=smile' },
    { id: 'art8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist8&top=froBand&mouth=smile' },
    { id: 'art9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist9&top=longHair&mouth=smile' },
    { id: 'art10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artist10&top=miaWallace&mouth=smile' },
  ],
  Model: [
    { id: 'mod1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model1&top=bob&mouth=smile' },
    { id: 'mod2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model2&top=longHair&mouth=smile' },
    { id: 'mod3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model3&top=turban&mouth=smile' },
    { id: 'mod4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model4&top=straight01&mouth=smile' },
    { id: 'mod5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model5&top=straight02&mouth=smile' },
    { id: 'mod6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model6&top=bigHair&mouth=smile' },
    { id: 'mod7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model7&top=shaved&mouth=smile' },
    { id: 'mod8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model8&top=bun&mouth=smile' },
    { id: 'mod9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model9&top=hijab&mouth=smile' },
    { id: 'mod10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Model10&top=winterHat01&mouth=smile' },
  ],
  SoccerPlayer: [
    { id: 'soc1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer1&top=shortHair&mouth=smile' },
    { id: 'soc2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer2&top=buzzCut&mouth=smile' },
    { id: 'soc3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer3&top=mohawk&mouth=smile' },
    { id: 'soc4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer4&top=frizzle&mouth=smile' },
    { id: 'soc5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer5&top=shaggy&mouth=smile' },
    { id: 'soc6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer6&top=caesar&mouth=smile' },
    { id: 'soc7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer7&top=dreads&mouth=smile' },
    { id: 'soc8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer8&top=curly&mouth=smile' },
    { id: 'soc9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer9&top=flatTop&mouth=smile' },
    { id: 'soc10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soccer10&top=shaved&mouth=smile' },
  ],
  Other: [
    { id: 'oth1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other1&mouth=smile' },
    { id: 'oth2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other2&mouth=smile' },
    { id: 'oth3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other3&mouth=smile' },
    { id: 'oth4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other4&mouth=smile' },
    { id: 'oth5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other5&mouth=smile' },
    { id: 'oth6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other6&mouth=smile' },
    { id: 'oth7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other7&mouth=smile' },
    { id: 'oth8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other8&mouth=smile' },
    { id: 'oth9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other9&mouth=smile' },
    { id: 'oth10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Other10&mouth=smile' },
  ]
};

const BRAZILIAN_CLUBS = [
  'Nenhum / Aposentado', 'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Grêmio', 'Internacional', 
  'Atlético Mineiro', 'Cruzeiro', 'Vasco da Gama', 'Fluminense', 'Santos', 'Botafogo',
  'Bahia', 'Fortaleza', 'Athletico Paranaense', 'Cuiabá', 'Goiás', 'Coritiba', 'América Mineiro', 'Bragantino'
];

const CLUB_COLORS: Record<string, string> = {
  'Flamengo': 'red',
  'Palmeiras': 'green',
  'São Paulo': 'red',
  'Corinthians': 'white',
  'Grêmio': 'blue',
  'Internacional': 'red',
  'Atlético Mineiro': 'black',
  'Cruzeiro': 'blue',
  'Vasco da Gama': 'black',
  'Fluminense': 'maroon',
  'Santos': 'white',
  'Botafogo': 'black',
  'Bahia': 'blue',
  'Fortaleza': 'red',
  'Athletico Paranaense': 'red',
  'Cuiabá': 'green',
  'Goiás': 'green',
  'Coritiba': 'green',
  'América Mineiro': 'green',
  'Bragantino': 'white',
  'Nenhum / Aposentado': 'gray'
};

const CelebritySignupForm: React.FC<CelebritySignupFormProps> = ({ onSignup, onCancel, onSwitchToLogin, adminPixKey, systemSettings, language = 'pt' }) => {
  const T = translations[language] || translations['pt'];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [celebrityCategory, setCelebrityCategory] = useState<'Athlete' | 'Artist' | 'Model' | 'SoccerPlayer' | 'Other'>('Athlete');
  const [selectedClub, setSelectedClub] = useState(BRAZILIAN_CLUBS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(CELEBRITY_AVATARS.Athlete[0].url);

  const [securityAgreements, setSecurityAgreements] = useState({
    preTerms: false,
    terms: false,
    identity: false,
    safety: false
  });

  // Dynamic avatars for SoccerPlayer based on club (20 options)
  const getSoccerAvatars = (club: string) => {
    const clubSeed = club.replace(/\s/g, '');
    const clubColor = CLUB_COLORS[club] || 'blue';
    const bgColor = clubColor === 'white' ? 'black' : clubColor;
    
    const hairStyles = [
      'shortHair', 'buzzCut', 'mohawk', 'frizzle', 'shaggy', 
      'caesar', 'dreads', 'curly', 'flatTop', 'shaved',
      'shortHair', 'buzzCut', 'mohawk', 'frizzle', 'shaggy',
      'caesar', 'dreads', 'curly', 'flatTop', 'shaved'
    ];

    const facialHairStyles = [
      '', '', '', 'beardLight', 'beardMedium', 
      '', '', '', 'mustacheMagnum', 'beardMajestic',
      '', '', '', 'beardLight', 'beardMedium',
      '', '', '', 'mustacheMagnum', 'beardMajestic'
    ];

    const avatars = Array.from({ length: 10 }, (_, i) => {
      if (i === 9) {
        return {
          id: 'soc10',
          url: `https://api.dicebear.com/7.x/initials/svg?seed=${clubSeed}&backgroundColor=${bgColor}`
        };
      }
      
      const hair = hairStyles[i % hairStyles.length];
      const facial = facialHairStyles[i % facialHairStyles.length];
      const facialParam = facial ? `&facialHair=${facial}` : '';
      
      return {
        id: `soc${i + 1}`,
        url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${clubSeed}${i}&top=${hair}${facialParam}&clothing=graphicShirt&clothingColor=${clubColor}&mouth=smile`
      };
    });

    return avatars;
  };

  const currentAvatars = celebrityCategory === 'SoccerPlayer' 
    ? getSoccerAvatars(selectedClub) 
    : CELEBRITY_AVATARS[celebrityCategory];
  
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    password: '',
    canOfferServices: true,
    canAcceptOffers: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });
  
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixPayload, setPixPayload] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- CONDIÇÕES DE PAGAMENTO VIP ---
  const [randomCents] = useState(() => Math.floor(Math.random() * 90) + 10);
  const baseFee = (systemSettings?.celebrityFee !== undefined) ? systemSettings.celebrityFee : 50; 
  const fee = (typeof baseFee === 'number' ? baseFee : 50) + (randomCents / 100);

  useEffect(() => {
    setSelectedAvatar(currentAvatars[0].url);
  }, [celebrityCategory, selectedClub]);

  useEffect(() => {
     // PIX payload generation removed as requested
  }, [step, fee]);

  const isValidCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  };

  const handleNext = async () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = T.celebSignup.nameLabel + ' *';
    if (!formData.cpf) errors.cpf = T.signup.cpf + ' *';
    if (!formData.phone) errors.phone = T.signup.phone + ' *';
    if (!formData.password) errors.password = T.signup.password + ' *';
    
    if (!addressData.cep) errors.cep = T.signup.zip + ' *';
    if (!addressData.street) errors.street = T.signup.addressPlaceholder + ' *';
    if (!addressData.number) errors.number = T.signup.number + ' *';
    if (!addressData.city) errors.city = T.signup.city.split(' - ')[0] + ' *';
    if (!addressData.neighborhood) errors.neighborhood = T.signup.neighborhood + ' *';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setVerificationStatus('error');
      setVerificationMessage(language === 'pt' ? 'Por favor, corrija os erros destacados abaixo.' : 'Please correct the errors highlighted below.');
      return;
    }

    if (!securityAgreements.preTerms) {
      setVerificationStatus('error');
      setVerificationMessage("Você precisa aceitar os termos de uso e segurança para continuar.");
      return;
    }

    setVerificationStatus('idle');
    setFormErrors({});
    setVerificationMessage('');

    if (!isValidCPF(formData.cpf)) {
        setFormErrors({ cpf: 'CPF inválido' });
        setVerificationStatus('error');
        setVerificationMessage('CPF Inválido. Verifique os dígitos e tente novamente.');
        return;
    }

    setStep(2);
  };

  const handleSecurityNext = () => {
    if (!securityAgreements.terms || !securityAgreements.identity || !securityAgreements.safety) {
      alert("Por favor, aceite todos os termos de segurança para continuar.");
      return;
    }
    setStep(3);
  };

  const handleFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const fullAddressString = `${addressData.street}, ${addressData.number} - ${addressData.neighborhood}, ${addressData.city} - CEP: ${addressData.cep}`;
      const newUser: UserType = {
        id: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        avatar: selectedAvatar,
        rating: 5.0,
        walletBalance: 0,
        status: 'active',
        cpf: encryptData(formData.cpf),
        address: encryptData(fullAddressString),
        phone: encryptData(formData.phone),
        password: encryptData(formData.password),
        role: 'worker',
        isVerified: true,
        isCelebrity: true,
        celebrityCategory: celebrityCategory,
        club: celebrityCategory === 'SoccerPlayer' ? selectedClub : undefined,
        canOfferServices: formData.canOfferServices,
        canAcceptOffers: formData.canAcceptOffers
      };

      // Salvar credenciais para login automático (criptografado)
      localStorage.setItem('pandora_saved_login', encryptData(formData.cpf));
      localStorage.setItem('pandora_saved_password', encryptData(formData.password));

      onSignup(newUser);
      setIsProcessing(false);
    }, 2000);
  };

  const copyPix = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(language === 'pt' ? "Código Pix copiado!" : "Pix code copied!");
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-pandora-card border border-amber-500/30  rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-amber-500 transition-all duration-500" 
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          ></div>
        </div>

        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-4">
            <Gem className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Acesso Exclusivo Celebridades</span>
          </div>
          <h2 className="text-2xl font-black dark:text-gray-200 text-black uppercase tracking-tight mb-2">
            Inscrição VIP C.Pandox
          </h2>
          <p className="text-sm text-black dark:text-gray-400">
            {step === 1 ? 'Identidade de Famoso' : step === 2 ? 'Segurança e Termos' : 'Ativação de Conta VIP'}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* AVATAR SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-black dark:text-gray-300 uppercase mb-3 ml-1">
                { (T.celebSignup.avatarLabel || 'Avatar ({category})').replace('{category}', celebrityCategory === 'Athlete' ? (T.celebSignup.athlete || 'Atleta') : celebrityCategory === 'Artist' ? (T.celebSignup.artist || 'Artista') : celebrityCategory === 'Model' ? (T.celebSignup.model || 'Modelo') : celebrityCategory === 'SoccerPlayer' ? (T.celebSignup.soccer || 'Jogador') : (T.celebSignup.other || 'Outro')) } *
              </label>
              <div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar snap-x">
                 {currentAvatars.map((avatar) => (
                    <button
                       key={avatar.id}
                       onClick={() => setSelectedAvatar(avatar.url)}
                       className={`relative shrink-0 w-16 h-16 rounded-full border-2 transition-all snap-start ${
                          selectedAvatar === avatar.url 
                          ? 'border-amber-500 ring-4 ring-amber-500/20 scale-110' 
                          : 'border-white/10 grayscale hover:grayscale-0 hover:border-white/30'
                       }`}
                    >
                       <img src={avatar.url} className="w-full h-full rounded-full" alt="Avatar" />
                       {selectedAvatar === avatar.url && (
                          <div className="absolute -top-1 -right-1  bg-amber-500 text-black rounded-full p-0.5 shadow-lg">
                             <Check className="w-3 h-3" />
                          </div>
                       )}
                    </button>
                 ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black dark:text-gray-300 uppercase mb-2 ml-1">{T.celebSignup.categoryLabel}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Athlete', 'Artist', 'Model', 'SoccerPlayer', 'Other'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCelebrityCategory(cat)}
                      className={`py-2 px-1 rounded-lg border  text-[9px] font-bold transition-all ${celebrityCategory === cat ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/5 border-black/10 dark:text-gray-300 text-black hover:border-amber-500/50'}`}
                    >
                      {cat === 'Athlete' ? T.celebSignup.athlete : 
                       cat === 'Artist' ? T.celebSignup.artist : 
                       cat === 'Model' ? T.celebSignup.model : 
                       cat === 'SoccerPlayer' ? T.celebSignup.soccer : 
                       T.celebSignup.other}
                    </button>
                  ))}
                </div>
              </div>

              {celebrityCategory === 'SoccerPlayer' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold  text-black mb-2 ml-1">{T.celebSignup.clubLabel}</label>
                  <select 
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-xl p-3  text-black outline-none focus:border-amber-500 text-sm"
                  >
                    {BRAZILIAN_CLUBS.map(club => (
                      <option key={club} value={club} className="bg-white text-black">{club}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-black dark:text-gray-300 leading-tight">
                <span className="text-amber-400 font-bold">{T.celebSignup.vipPrivacy}</span> {T.celebSignup.vipPrivacyDesc}
              </p>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-gray-400 text-black mb-1 ml-1">{T.celebSignup.nameLabel}</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  if (formErrors.name) setFormErrors(prev => ({...prev, name: ''}));
                }}
                className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.name ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-amber-500'}`}
                placeholder={T.celebSignup.namePlaceholder}
              />
              {formErrors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.name}</p>}
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold dark:text-gray-400  text-black mb-1 ml-1">CPF *</label>
                <input 
                  type="text" 
                  value={formData.cpf}
                  onChange={(e) => {
                    setFormData({...formData, cpf: formatCPF(e.target.value)});
                    if (formErrors.cpf) setFormErrors(prev => ({...prev, cpf: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.cpf ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-amber-500'}`}
                  placeholder="000.000.000-00"
                />
                {formErrors.cpf && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.cpf}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold  dark:text-gray-400 text-black mb-1 ml-1">Celular *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    if (formErrors.phone) setFormErrors(prev => ({...prev, phone: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.phone ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-amber-500'}`}
                  placeholder="(00) 00000-0000"
                />
                {formErrors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.phone}</p>}
              </div>
            </div>

            <div className={`bg-black/5 p-4 rounded-xl border space-y-3 transition-all ${Object.keys(formErrors).some(k => ['cep', 'city', 'street', 'number', 'neighborhood'].includes(k)) ? 'border-red-500/50 bg-red-500/5' : 'border-black/5'}`}>
               <p className="text-[10px] font-bold text-black dark:text-gray-400  uppercase flex items-center gap-2"><MapPin className="w-3 h-3"/> Endereço de Residência</p>
               <div className="flex gap-3">
                  <div className="w-1/3">
                    <input 
                      type="text" 
                      value={addressData.cep}
                      onChange={(e) => {
                        setAddressData({...addressData, cep: formatCEP(e.target.value)});
                        if (formErrors.cep) setFormErrors(prev => ({...prev, cep: ''}));
                      }}
                      className={`w-full bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.cep ? 'border-red-500' : 'border-black/10'}`}
                      placeholder="CEP"
                    />
                  </div>
                  <div className="w-2/3">
                    <input 
                      type="text" 
                      value={addressData.city}
                      onChange={(e) => {
                        setAddressData({...addressData, city: e.target.value});
                        if (formErrors.city) setFormErrors(prev => ({...prev, city: ''}));
                      }}
                      className={`w-full bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.city ? 'border-red-500' : 'border-black/10'}`}
                      placeholder="Cidade - UF"
                    />
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={addressData.street}
                      onChange={(e) => {
                        setAddressData({...addressData, street: e.target.value});
                        if (formErrors.street) setFormErrors(prev => ({...prev, street: ''}));
                      }}
                      className={`w-full bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.street ? 'border-red-500' : 'border-black/10'}`}
                      placeholder="Logradouro"
                    />
                  </div>
                  <div className="w-20">
                    <input 
                      type="text" 
                      value={addressData.number}
                      onChange={(e) => {
                        setAddressData({...addressData, number: e.target.value});
                        if (formErrors.number) setFormErrors(prev => ({...prev, number: ''}));
                      }}
                      className={`w-full bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.number ? 'border-red-500' : 'border-black/10'}`}
                      placeholder="Nº"
                    />
                  </div>
               </div>
               <input 
                 type="text" 
                 value={addressData.neighborhood}
                 onChange={(e) => {
                   setAddressData({...addressData, neighborhood: e.target.value});
                   if (formErrors.neighborhood) setFormErrors(prev => ({...prev, neighborhood: ''}));
                 }}
                 className={`w-full bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.neighborhood ? 'border-red-500' : 'border-black/10'}`}
                 placeholder="Bairro"
               />
               {Object.keys(formErrors).some(k => ['cep', 'city', 'street', 'number', 'neighborhood'].includes(k)) && (
                 <p className="text-[9px] text-red-500 font-bold text-center">Por favor, preencha o endereço completo.</p>
               )}
            </div>

            <div>
              <label className="block text-xs font-bold dark:text-gray-200  text-black mb-1 ml-1">Senha de Acesso *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (formErrors.password) setFormErrors(prev => ({...prev, password: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.password ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-amber-500'} pr-10`}
                  placeholder="Crie uma senha segura"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-black/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.password}</p>}
            </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-4">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Preferências de Perfil VIP</p>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.canOfferServices ? 'bg-amber-500 text-black' : 'bg-black/5 text-black'}`}>
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-gray-200 ">Oferecer Serviços</p>
                      <p className="text-[10px] text-black italic dark:text-gray-400 ">Quero realizar pedidos de fãs</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={formData.canOfferServices}
                    onChange={(e) => setFormData({...formData, canOfferServices: e.target.checked})}
                    className="w-5 h-5 accent-amber-500 bg-black/5 border-black/10 rounded"
                  />
                </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.canAcceptOffers ? 'bg-amber-500 text-black' : 'bg-black/5 text-black'}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black dark:text-gray-200 ">Aceito Ofertas</p>
                  <p className="text-[10px] text-black italic dark:text-gray-400 ">Quero receber propostas exclusivas</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.canAcceptOffers}
                onChange={(e) => setFormData({...formData, canAcceptOffers: e.target.checked})}
                className="w-5 h-5 accent-amber-500 bg-black/5 border-black/10 rounded"
              />
            </label>
            </div>
            </div>

            {verificationStatus === 'error' && (
                <p className="text-red-500 text-xs font-bold text-center">{verificationMessage}</p>
            )}

            <div className="flex flex-col gap-3 pt-4">
               <div className="flex items-start gap-2 px-1 mb-2">
                  <input 
                    type="checkbox" 
                    id="celebPreTerms"
                    checked={securityAgreements.preTerms}
                    onChange={(e) => setSecurityAgreements({...securityAgreements, preTerms: e.target.checked})}
                    className="w-4 h-4 mt-0.5 accent-amber-500 bg-black/5 border-black/10 rounded cursor-pointer"
                  />
                  <label htmlFor="celebPreTerms" className="text-[10px] text-black dark:text-gray-300  cursor-pointer hover:text-black transition-colors leading-tight">
                    Li e concordo com os <span className="text-amber-500 font-bold">Termos de Uso VIP</span>, <span className="text-amber-500 font-bold">Políticas de Segurança</span> e privacidade da plataforma C.Pandox.
                  </label>
               </div>

               <button 
                 onClick={handleNext}
                 disabled={!securityAgreements.preTerms}
                 className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-amber-900/20 ${
                   securityAgreements.preTerms 
                   ? 'bg-amber-500 text-black hover:scale-[1.02]' 
                   : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                 }`}
               >
                 Avançar para Segurança
               </button>
               <div className="flex justify-between items-center px-2">
                 <button onClick={onCancel} className="text-black dark:text-gray-200 font-bold uppercase text-[10px] hover:text-amber-500 transition-colors">Sair</button>
                 {onSwitchToLogin && (
                   <button onClick={onSwitchToLogin} className="text-amber-500 font-bold uppercase text-[10px] hover:text-black transition-colors">Já tem conta? Entrar</button>
                 )}
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
                <h3 className="text-lg font-black text-black uppercase tracking-tight">Compromisso de Segurança</h3>
              </div>

                 <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={securityAgreements.terms}
                      onChange={(e) => setSecurityAgreements({...securityAgreements, terms: e.target.checked})}
                      className="w-5 h-5 accent-amber-500 bg-black/5 border-black/10 rounded"
                    />
                  </div>
                  <p className="text-xs text-black leading-relaxed group-hover:text-black transition-colors">
                    Declaro que li atentamente e concordo integralmente com os <span className="text-amber-500 font-bold">Termos de Uso</span> e a <span className="text-amber-500 font-bold">Política de Privacidade</span> da plataforma C.Pandox.
                  </p>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={securityAgreements.identity}
                      onChange={(e) => setSecurityAgreements({...securityAgreements, identity: e.target.checked})}
                      className="w-5 h-5 accent-amber-500 bg-black/5 border-black/10 rounded"
                    />
                  </div>
                  <p className="text-xs text-black leading-relaxed group-hover:text-black transition-colors">
                    Declaro sob as penas da lei que sou uma <span className="text-amber-500 font-bold">figura pública ou celebridade real</span>, e que os dados fornecidos são verídicos.
                  </p>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={securityAgreements.safety}
                      onChange={(e) => setSecurityAgreements({...securityAgreements, safety: e.target.checked})}
                      className="w-5 h-5 accent-amber-500 bg-black/5 border-black/10 rounded"
                    />
                  </div>
                  <p className="text-xs text-black leading-relaxed group-hover:text-black transition-colors">
                    Comprometo-me a manter a <span className="text-amber-500 font-bold">ética e segurança</span> em todas as interações com fãs e usuários da plataforma.
                  </p>
                </label>
              </div>

            <div className="flex flex-col gap-3 pt-4">
               <button 
                 onClick={handleSecurityNext}
                 disabled={!securityAgreements.terms || !securityAgreements.identity || !securityAgreements.safety}
                 className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg ${
                   securityAgreements.terms && securityAgreements.identity && securityAgreements.safety
                   ? 'bg-amber-500 text-black shadow-amber-900/20 hover:scale-[1.02]' 
                   : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                 }`}
               >
                 Concordar e acessar
               </button>
               <button 
                 onClick={() => setStep(1)}
                 className="text-black font-bold uppercase text-[10px] hover:text-amber-500 transition-colors"
               >
                 Voltar para Identidade
               </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
             
             <div className="space-y-6">
                <div className="mb-4">
                   <div className="inline-block p-4 bg-amber-500/10 rounded-full mb-2 border border-amber-500/30">
                      <Wallet className="w-10 h-10 text-amber-500" />
                   </div>
                   <h3 className="text-xl font-black text-black">Taxa de Ativação VIP</h3>
                   <p className="text-xs text-black">O cadastro de celebridades possui taxa de ativação para manutenção do perfil verificado.</p>
                </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-left">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-amber-500 uppercase">Valor da Inscrição</span>
                          <span className="text-xl font-mono font-bold text-black">R$ {fee.toFixed(2).replace('.', ',')}</span>
                       </div>
                       <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-500/10">
                          <span className="text-[10px] font-bold text-black uppercase">Período de Acesso</span>
                          <span className="text-xs font-bold text-amber-500">1 ANO</span>
                       </div>
                       <p className="text-[10px] text-black leading-relaxed">
                          <ShieldCheck className="w-3 h-3 inline mr-1 text-amber-500" /> 
                          {T.celebSignup.paymentNote}
                       </p>
                    </div>

                    <div className="space-y-4 text-left">
                       <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1">Dados do Cartão (Crédito ou Débito)</p>
                       
                       <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Número do Cartão"
                            className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-amber-500"
                          />
                          <input 
                            type="text" 
                            placeholder="Nome Impresso no Cartão"
                            className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-amber-500"
                          />
                          <div className="flex gap-3">
                             <input 
                               type="text" 
                               placeholder="MM/AA"
                               className="w-1/2 bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-amber-500"
                             />
                             <input 
                               type="text" 
                               placeholder="CVV"
                               className="w-1/2 bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-amber-500"
                             />
                          </div>
                       </div>
                    </div>

                <div className="space-y-2">
                   <button 
                     onClick={handleFinish}
                     disabled={isProcessing}
                     className="w-full py-4 bg-amber-500 text-black rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-amber-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : T.celebSignup.confirmVip}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebritySignupForm;
