
import React, { useState, useEffect } from 'react';
import { User, QrCode, Copy, Loader2, Lock, ArrowRight, ShieldCheck, CheckCircle2, PartyPopper, Ticket, Scale, AlertCircle, MapPin, Check, Wallet, AlertTriangle } from 'lucide-react';
import { User as UserType, SystemSettings } from '../types';
import { validateRegistrationName } from '../services/geminiService';
import { api } from '../services/dataService';
import { encryptData, decryptData } from '../services/encryption';

import { translations } from '../src/translations';

interface SignupFormProps {
  onSignup: (user: UserType) => void;
  onCancel: () => void;
  onSwitchToLogin?: () => void;
  adminPixKey: string;
  userCount: number;
  systemSettings: SystemSettings;
  language?: string;
  initialUser?: UserType;
}

const AVAILABLE_AVATARS = [
  // Femininos Felizes
  { id: 'f1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&mouth=smile' },
  { id: 'f2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&mouth=smile' },
  { id: 'f3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&mouth=smile' },
  { id: 'f4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara&mouth=smile' },
  { id: 'f5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy&mouth=smile' },
  { id: 'f6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&mouth=smile' },
  { id: 'f7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona&mouth=smile' },
  { id: 'f8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace&mouth=smile' },
  { id: 'f9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Heidi&mouth=smile' },
  { id: 'f10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris&mouth=smile' },
  // Masculinos Felizes
  { id: 'm1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&mouth=smile' },
  { id: 'm2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ben&mouth=smile' },
  { id: 'm3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris&mouth=smile' },
  { id: 'm4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dan&mouth=smile' },
  { id: 'm5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erik&mouth=smile' },
  { id: 'm6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&mouth=smile' },
  { id: 'm7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George&mouth=smile' },
  { id: 'm8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hugo&mouth=smile' },
  { id: 'm9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan&mouth=smile' },
  { id: 'm10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&mouth=smile' },
];

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onCancel, onSwitchToLogin, adminPixKey, userCount, systemSettings, language = 'pt', initialUser }) => {
  const T = translations[language] || translations['pt'];
  const [step, setStep] = useState<1 | 2>(initialUser ? 2 : 1);
  const [role, setRole] = useState<'requester' | 'worker' | 'both'>(initialUser ? 'both' : 'requester');
  const [selectedAvatar, setSelectedAvatar] = useState(initialUser?.avatar || AVAILABLE_AVATARS[0].url);
  
  const [formData, setFormData] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    cpf: initialUser?.cpf ? (decryptData(initialUser.cpf) || initialUser.cpf) : '',
    phone: initialUser?.phone ? (decryptData(initialUser.phone) || initialUser.phone) : '',
    password: initialUser?.password ? (decryptData(initialUser.password) || initialUser.password) : ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [addressData, setAddressData] = useState({
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });
  
  const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixPayload, setPixPayload] = useState('');
  const [showTerms, setShowTerms] = useState(false);

  // --- CAMPANHA DE LANÇAMENTO ---
  // Grátis para os primeiros X usuários conforme configuração.
  const isPromotional = systemSettings ? userCount < systemSettings.promotionalUserLimit : true;
  const [randomCents] = useState(() => Math.floor(Math.random() * 90) + 10); 
  
  let baseFee = 0;
  if (role === 'both') {
    baseFee = isPromotional ? (systemSettings?.bothPromotionalFee || 3.99) : (systemSettings?.bothFee || 19.99);
  } else if (!isPromotional) {
    if (role === 'requester') baseFee = systemSettings?.requesterFee || 0;
    else if (role === 'worker') baseFee = systemSettings?.workerFee || 0;
  }
  
  const fee = baseFee > 0 ? baseFee + (randomCents / 100) : 0;

  useEffect(() => {
     // PIX payload generation removed as requested
  }, [step, fee, role]);

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

    if (!formData.name) errors.name = T.signup.fullName + ' *';
    if (!formData.email) errors.email = 'E-mail *';
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

    if (!acceptedTerms) {
      setVerificationStatus('error');
      setVerificationMessage(T.signup.termsAgreement);
      return;
    }

    setVerificationStatus('idle');
    setFormErrors({});
    setVerificationMessage('');
    setIsVerifyingIdentity(true);

    try {
        const users = await api.users.list();
        const existingUser = users.find(u => {
          const decCPF = decryptData(u.cpf) || u.cpf;
          return decCPF === formData.cpf;
        });

        if (existingUser) {
            setIsVerifyingIdentity(false);
            setVerificationStatus('error');
            setVerificationMessage(language === 'pt' ? 'Este CPF já possui um cadastro. Por favor, faça login.' : 'This CPF already has a registration. Please login.');
            setFormErrors({ cpf: language === 'pt' ? 'CPF já cadastrado' : 'CPF already registered' });
            return;
        }

        if (!isValidCPF(formData.cpf)) {
            setIsVerifyingIdentity(false);
            setVerificationStatus('error');
            setVerificationMessage(language === 'pt' ? 'CPF Inválido. Verifique os dígitos e tente novamente.' : 'Invalid CPF. Verify digits and try again.');
            setFormErrors({ cpf: language === 'pt' ? 'CPF inválido' : 'Invalid CPF' });
            return;
        }

        const [nameCheck] = await Promise.all([
            validateRegistrationName(formData.name),
            new Promise(resolve => setTimeout(resolve, 2000))
        ]);

        if (!nameCheck.valid) {
            setIsVerifyingIdentity(false);
            setVerificationStatus('error');
            setVerificationMessage(`${language === 'pt' ? 'Nome Rejeitado' : 'Name Rejected'}: ${nameCheck.message || (language === 'pt' ? 'Informe seu nome civil completo.' : 'Please inform your full legal name.')}`);
            setFormErrors({ name: language === 'pt' ? 'Nome inválido para registro civil' : 'Invalid name for civil registration' });
            return;
        }

        setIsVerifyingIdentity(false);
        setVerificationStatus('success');
        setTimeout(() => setShowTerms(true), 800);

    } catch (e) {
        setIsVerifyingIdentity(false);
        setShowTerms(true);
    }
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    try {
      const fullAddressString = initialUser ? (decryptData(initialUser.address) || initialUser.address) : `${addressData.street}, ${addressData.number} - ${addressData.neighborhood}, ${addressData.city} - CEP: ${addressData.cep}`;
      
      const signUpData = {
        name: formData.name,
        avatar: selectedAvatar,
        rating: initialUser?.rating || 5.0,
        walletBalance: initialUser?.walletBalance || 0,
        status: 'active' as const,
        cpf: encryptData(formData.cpf),
        address: encryptData(fullAddressString || ''),
        phone: encryptData(formData.phone),
        password: encryptData(formData.password),
        role: role,
        isVerified: true,
        isCelebrity: initialUser?.isCelebrity || false,
        hasBiometrics: initialUser?.hasBiometrics || false
      };

      const { user, error } = await api.auth.signUp(formData.email, formData.password, signUpData);

      if (user) {
        if (rememberMe) {
          localStorage.setItem('pandora_saved_login', encryptData(formData.email));
          localStorage.setItem('pandora_saved_password', encryptData(formData.password));
        }
        onSignup(user);
      } else {
        alert(error?.message || 'Error during sign up');
      }
    } catch (e) {
      console.error(e);
      alert('Error during sign up');
    } finally {
      setIsProcessing(false);
    }
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
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-4">
      <div className="bg-pandora-card border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
          <div 
            className="h-full bg-pandora-primary transition-all duration-500" 
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight mb-2">
            {initialUser ? T.signup.upgradeTitle : T.signup.title}
          </h2>
          <p className="text-sm dark:text-gray-400 text-black">
            {initialUser ? T.signup.upgradeDesc : (step === 1 ? T.signup.step1 : T.signup.step2)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-orange-600/20 p-3 rounded-xl mb-6 text-center border border-white/10">
           <p className="text-black dark:text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <PartyPopper className="w-4 h-4 text-amber-400" /> {isPromotional ? (T.signup.promoCamp || "Promo: {limit}").replace('{limit}', systemSettings.promotionalUserLimit.toString()) : (T.signup.upgradeTitle || "Conta")}
           </p>
        </div>

        {isVerifyingIdentity && (
            <div className="absolute inset-0 z-50 bg-pandora-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <Scale className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-black mb-2">{T.signup.validating}</h3>
                <p className="text-sm text-black">{T.signup.validatingDesc}</p>
            </div>
        )}

        {step === 1 && !showTerms && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* AVATAR SELECTOR */}
            <div>
              <label className="block text-xs font-bold dark:text-white text-black uppercase mb-3 ml-1">{T.signup.avatarLabel}</label>
              <div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar snap-x">
                 {AVAILABLE_AVATARS.map((avatar) => (
                    <button
                       key={avatar.id}
                       onClick={() => setSelectedAvatar(avatar.url)}
                       className={`relative shrink-0 w-16 h-16 rounded-full border-2 transition-all snap-start ${
                          selectedAvatar === avatar.url 
                          ? 'border-pandora-primary ring-4 ring-pandora-primary/20 scale-110' 
                          : 'border-white/10 grayscale hover:grayscale-0 hover:border-white/30'
                       }`}
                    >
                       <img src={avatar.url} className="w-full h-full rounded-full" alt="Avatar" />
                       {selectedAvatar === avatar.url && (
                          <div className="absolute -top-1 -right-1 bg-pandora-primary text-white rounded-full p-0.5 shadow-lg">
                             <Check className="w-3 h-3" />
                          </div>
                       )}
                    </button>
                 ))}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold dark:text-white text-black uppercase mb-3 ml-1">{T.signup.roleLabel}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setRole('requester')}
                  className={`p-3 rounded-xl border transition-all ${role === 'requester' ? 'dark:text-white  bg-pandora-primary/20 border-pandora-primary text-black' : 'bg-black/5 border-black/10 text-black'}`}
                >
                  <p className="font-bold text-[10px]">{T.signup.requester}</p>
                  <p className={`text-[10px] font-bold ${isPromotional ? 'text-green-600' : 'text-amber-600'}`}>
                    {isPromotional ? T.signup.free : `R$ ${(systemSettings?.requesterFee || 0).toFixed(2).replace('.', ',')}`}
                  </p>
                </button>
                <button
                  onClick={() => setRole('worker')}
                  className={`p-3 rounded-xl border transition-all ${role === 'worker' ? 'bg-pandora-secondary/20 border-pandora-secondary text-black' : 'bg-black/5 border-black/10 dark:text-white text-black'}`}
                >
                  <p className="font-bold text-[10px]">{T.signup.worker}</p>
                  <p className={`text-[10px] font-bold ${isPromotional ? 'text-green-600' : 'text-amber-600'}`}>
                    {isPromotional ? T.signup.free : `R$ ${(systemSettings?.workerFee || 0).toFixed(2).replace('.', ',')}`}
                  </p>
                </button>
                <button
                  onClick={() => setRole('both')}
                  className={`p-3 rounded-xl border transition-all ${role === 'both' ? 'bg-purple-600/20 border-purple-500 text-black' : 'bg-black/5 border-white/10 dark:text-white text-black'}`}
                >
                  <p className="font-bold text-[10px]">{T.signup.both}</p>
                  <p className={`text-[10px] font-bold text-amber-600`}>
                    R$ {(isPromotional ? (systemSettings?.bothPromotionalFee || 3.99) : (systemSettings?.bothFee || 19.99)).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-[8px] text-black font-bold dark:text-white  uppercase mt-1 leading-none italic">{T.signup.validityOneYear}</p>
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-black dark:text-white  leading-tight">
                <span className="text-blue-400 font-bold">{T.signup.privacyNotice}</span> {T.signup.privacyDesc}
              </p>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-black dark:text-gray-300 mb-1 ml-1">{T.signup.fullName}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (formErrors.name) setFormErrors(prev => ({...prev, name: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.name ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-pandora-primary'}`}
                  placeholder={T.signup.fullNamePlaceholder}
                />
                {formErrors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1 ml-1 dark:text-gray-300">E-mail</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (formErrors.email) setFormErrors(prev => ({...prev, email: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.email ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-pandora-primary'}`}
                  placeholder="seu@email.com"
                />
                {formErrors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.email}</p>}
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-black dark:text-gray-300 mb-1 ml-1">{T.signup.cpf}</label>
                  <input 
                    type="text" 
                    value={formData.cpf}
                    onChange={(e) => {
                      setFormData({...formData, cpf: formatCPF(e.target.value)});
                      if (formErrors.cpf) setFormErrors(prev => ({...prev, cpf: ''}));
                    }}
                    className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none text-white transition-all ${formErrors.cpf ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-pandora-primary'}`}
                    placeholder="000.000.000-00"
                  />
                  {formErrors.cpf && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.cpf}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold dark:text-gray-300 text-black mb-1 ml-1">{T.signup.phone}</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({...formData, phone: e.target.value});
                      if (formErrors.phone) setFormErrors(prev => ({...prev, phone: ''}));
                    }}
                    className={`w-full bg-black/5 text-white border rounded-xl p-3 text-black outline-none transition-all ${formErrors.phone ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-pandora-primary'}`}
                    placeholder="(00) 00000-0000"
                  />
                  {formErrors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.phone}</p>}
                </div>
              </div>

              <div className={`bg-black/5 p-4 rounded-xl border space-y-3 transition-all ${Object.keys(formErrors).some(k => ['cep', 'city', 'street', 'number', 'neighborhood'].includes(k)) ? 'border-red-500/50 bg-red-500/5' : 'border-black/5'}`}>
                 <p className="text-[10px] font-bold text-black uppercase dark:text-gray-300 flex items-center gap-2"><MapPin className="w-3 h-3"/> {T.signup.addressTitle}</p>
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
                        placeholder={T.signup.zip}
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
                        className={`w-full  bg-white/20 border rounded-lg p-2 text-black text-sm outline-none transition-all ${formErrors.city ? 'border-red-500' : 'border-black/10'}`}
                        placeholder={T.signup.city}
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
                        placeholder={T.signup.addressPlaceholder}
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
                        placeholder={T.signup.number}
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
                   placeholder={T.signup.neighborhood}
                 />
                 {Object.keys(formErrors).some(k => ['cep', 'city', 'street', 'number', 'neighborhood'].includes(k)) && (
                   <p className="text-[9px] text-red-500 font-bold">{T.signup.addressError}</p>
                 )}
              </div>

              <div>
                <label className="block text-xs font-bold text-black dark:text-gray-300 mb-1 ml-1">{T.signup.password}</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (formErrors.password) setFormErrors(prev => ({...prev, password: ''}));
                  }}
                  className={`w-full bg-black/5 border rounded-xl p-3 text-black outline-none transition-all ${formErrors.password ? 'border-red-500 bg-red-500/5' : 'border-black/10 focus:border-pandora-primary'}`}
                  placeholder={T.signup.passwordPlaceholder}
                />
                {formErrors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{formErrors.password}</p>}
              </div>

              <div className="flex items-center gap-2 px-1">
                <input 
                  type="checkbox" 
                  id="signupRememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-pandora-primary bg-black/40 border-white/10 rounded cursor-pointer"
                />
                <label htmlFor="signupRememberMe" className="text-xs dark:text-gray-400 text-black cursor-pointer hover:text-black transition-colors">
                  {T.signup.rememberMe}
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
                    id="signupTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5  accent-pandora-primary bg-black/40 border-white/10 rounded cursor-pointer"
                  />
                  <label htmlFor="signupTerms" className="text-[10px] text-black dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white transition-colors leading-tight">
                    {T.signup.termsAgreement}
                  </label>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!acceptedTerms}
                  className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
                    acceptedTerms 
                    ? 'bg-white text-black hover:scale-[1.02]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {T.signup.next}
                </button>
                <div className="flex justify-between items-center px-2">
                  <button onClick={onCancel} className="text-black font-bold dark:text-gray-300 uppercase text-[10px] hover:text-white transition-colors">{T.common.cancel}</button>
                  {onSwitchToLogin && (
                    <button onClick={onSwitchToLogin} className="text-pandora-primary font-bold uppercase text-[10px] hover:text-black transition-all">{T.signup.alreadyHaveAccount}</button>
                  )}
                </div>
            </div>
          </div>
        )}

        {showTerms && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-4">
              <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-3 border border-blue-500/20">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-black uppercase tracking-tight">{T.signup.securityTerms}</h3>
              <p className="text-xs text-black">{T.signup.termsDesc}</p>
            </div>

            <div className="bg-black/10 border border-black/10 rounded-2xl p-5 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-black mb-1">{T.signup.dataProtection}</p>
                  <p className="text-[10px] text-black leading-relaxed">{T.signup.dataProtectionDesc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-black mb-1">{T.signup.idVerification}</p>
                  <p className="text-[10px] text-black leading-relaxed">{T.signup.idVerificationDesc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-black mb-1">{T.signup.conductRespect}</p>
                  <p className="text-[10px] text-black leading-relaxed">{T.signup.conductRespectDesc}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-black mb-1">{T.signup.securePayments}</p>
                  <p className="text-[10px] text-black leading-relaxed">{T.signup.securePaymentsDesc}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group p-2 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 accent-blue-500 bg-black/40 border-white/10 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {T.signup.termsAgreement}
                </p>
              </label>

              <button 
                onClick={() => {
                  if (!acceptedTerms) {
                    alert(T.signup.acceptTermsAlert);
                    return;
                  }
                  setShowTerms(false);
                  setStep(2);
                }}
                disabled={!acceptedTerms}
                className={`w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest shadow-lg flex items-center justify-center gap-3 transition-all ${
                  acceptedTerms 
                  ? 'bg-blue-600 text-white shadow-blue-900/40 hover:bg-blue-500' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {T.signup.safetyAgreed} <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowTerms(false)}
                className="w-full py-2 text-gray-600 dark:text-gray-500 font-bold uppercase text-[10px] hover:text-white transition-colors"
              >
                {T.signup.backReview}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-in fade-in slide-in-from-right-4 duration-300">
             
             {fee > 0 ? (
                /* --- PAGAMENTO COM CARTÃO PARA PLANO AMBOS --- */
                <div className="space-y-6">
                   <div className="mb-4">
                      <div className="inline-block p-4 bg-amber-500/10 rounded-full mb-2 border border-amber-500/30">
                         <Wallet className="w-10 h-10 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-black text-black dark:text-white">{T.signup.activationFee}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{(T.signup.activationNote || "Taxa de ativação: R$ 3,99").replace('3,99', (systemSettings?.bothPromotionalFee || 3.99).toFixed(2).replace('.', ','))}</p>
                   </div>

                   <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-2xl text-left">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-bold text-amber-500 uppercase">Valor do Plano</span>
                         <span className="text-xl font-mono font-bold text-black dark:text-white">R$ {fee.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                         <ShieldCheck className="w-3 h-3 inline mr-1 text-amber-500" /> 
                         {T.signup.payExact}
                      </p>
                   </div>

                   <div className="space-y-4 text-left">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Dados do Cartão</p>
                      
                      <div className="space-y-3">
                         <input 
                           type="text" 
                           placeholder="Número do Cartão"
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-black text-sm outline-none focus:border-pandora-primary"
                         />
                         <input 
                           type="text" 
                           placeholder="Nome Impresso no Cartão"
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-black text-sm outline-none focus:border-pandora-primary"
                         />
                         <div className="flex gap-3">
                            <input 
                              type="text" 
                              placeholder="MM/AA"
                              className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-3 text-black text-sm outline-none focus:border-pandora-primary"
                            />
                            <input 
                              type="text" 
                              placeholder="CVV"
                              className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-3 text-black text-sm outline-none focus:border-pandora-primary"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <button 
                        onClick={handleFinish}
                        disabled={isProcessing}
                        className="w-full py-4 bg-green-600 text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-green-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : T.signup.confirmPayment}
                      </button>
                   </div>
                </div>
             ) : (
                /* --- ATIVAÇÃO GRÁTIS PARA CONTRATANTE/PRESTADOR --- */
                <div className="space-y-6">
                   <div className="mb-8">
                      <div className="inline-block p-6 bg-green-500/10 rounded-full mb-4 border border-green-500/30">
                         <ShieldCheck className="w-20 h-20 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-black text-black dark:text-white mb-2">{(T.signup.almostThere || "Quase lá, {name}!").replace('{name}', formData.name.split(' ')[0])}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                        {isPromotional 
                          ? (T.signup.promoFreeMessage || "Inscrição grátis para os primeiros {limit} usuários!").replace('{limit}', systemSettings.promotionalUserLimit.toString())
                          : T.signup.finalNote}
                      </p>
                   </div>

                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left flex items-center gap-4">
                      <img src={selectedAvatar} className="w-16 h-16 rounded-full border-2 border-pandora-primary" alt="Final Profile" />
                      <div className="text-black">
                          <p className="font-bold">{formData.name}</p>
                          <p className="text-[10px] text-gray-600 dark:text-gray-500 uppercase font-bold">{T.signup.plan}: {role === 'worker' ? T.signup.worker : role === 'requester' ? T.signup.requester : T.signup.both}</p>
                          <p className={`text-[10px] font-bold ${fee > 0 ? 'text-amber-500' : 'text-green-400'}`}>{T.signup.cost}: R$ {fee.toFixed(2).replace('.', ',')}</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinish}
                     disabled={isProcessing}
                     className="w-full py-4 bg-pandora-primary text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-purple-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : T.signup.finish}
                   </button>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
