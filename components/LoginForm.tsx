
import React, { useState } from 'react';
import { User, Lock, ArrowRight, Loader2, AlertTriangle, Smartphone, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../services/dataService';
import { encryptData, decryptData } from '../services/encryption';
import { translations } from '../src/translations';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
  onCancel: () => void;
  onSwitchToSignup: () => void;
  language?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onCancel, 
  onSwitchToSignup,
  language = 'pt'
}) => {
  const T = translations[language] || translations['pt'];
  const [loginId, setLoginId] = useState(() => {
    const saved = localStorage.getItem('pandora_saved_login');
    return saved ? decryptData(saved) : '';
  });
  const [password, setPassword] = useState(() => {
    const saved = localStorage.getItem('pandora_saved_password');
    return saved ? decryptData(saved) : '';
  });
  const [rememberMe, setRememberMe] = useState(true); // Default to true as per user request for "storage"
  const [isProcessing, setIsProcessing] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [error, setError] = useState('');
  
  // Recovery State
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'success'>('input');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError(T.login.fillAll);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { user, error: authError } = await api.auth.signIn(loginId, password);

      if (user) {
        setIsIdentifying(true);
        
        // Identification delay as requested
        setTimeout(() => {
          if (rememberMe) {
            localStorage.setItem('pandora_saved_login', encryptData(loginId));
            localStorage.setItem('pandora_saved_password', encryptData(password));
          } else {
            localStorage.removeItem('pandora_saved_login');
            localStorage.removeItem('pandora_saved_password');
          }
          onLogin(user);
          setIsIdentifying(false);
          setIsProcessing(false);
        }, 2000);
      } else {
        setError(authError?.message || T.login.invalid);
        setIsProcessing(false);
      }
    } catch (err) {
      setError(T.login.error);
      setIsProcessing(false);
    }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryId) {
      setError(T.login.fillAll);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const users = await api.users.list();
      const user = users.find(u => u.cpf === recoveryId);

      if (user) {
        // Simulate sending SMS
        setTimeout(() => {
          setIsProcessing(false);
          setRecoveryStep('success');
        }, 1500);
      } else {
        setError(T.login.invalid);
        setIsProcessing(false);
      }
    } catch (err) {
      setError(T.login.error);
      setIsProcessing(false);
    }
  };

  if (showRecovery) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-pandora-card border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pandora-primary/10 blur-3xl rounded-full"></div>
          
          <button 
            onClick={() => { setShowRecovery(false); setRecoveryStep('input'); }}
            className="mb-6 p-2 hover:bg-white/5 rounded-full transition-colors inline-flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" />
            {T.common.back}
          </button>

          {recoveryStep === 'input' ? (
            <form onSubmit={handleRecoverPassword} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-block p-4 bg-amber-500/10 rounded-full mb-2 border border-amber-500/20">
                  <Smartphone className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{T.login.recoveryTitle}</h2>
                <p className="text-sm text-gray-400">{T.login.recoveryDesc}</p>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-xl flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-xs text-red-300 font-medium">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Seu CPF</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-black dark:text-white outline-none focus:border-pandora-primary transition-all font-bold"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-amber-500 text-black rounded-xl font-black uppercase text-sm tracking-widest shadow-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Smartphone className="w-5 h-5" />}
                {isProcessing ? T.login.processing : T.common.send}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-bold">{T.login.recoveryTitle}</p>
                <p className="text-xs text-gray-400">{T.login.recoverySuccess}</p>
              </div>
              <button
                onClick={() => { setShowRecovery(false); setRecoveryStep('input'); }}
                className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-sm tracking-widest hover:scale-[1.02] transition-all"
              >
                {T.login.close}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-pandora-card border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pandora-primary/10 blur-3xl rounded-full"></div>
        
        <div className="mb-8 text-center">
          <div className="inline-block p-4 bg-pandora-primary/10 rounded-full mb-4 border border-pandora-primary/20">
            <Lock className="w-10 h-10 text-pandora-primary" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">{T.login.title}</h2>
          <p className="text-sm text-black dark:text-gray-400 mt-2">{T.login.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/20 rounded-xl flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-xs text-red-300 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {isIdentifying && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 border-4 border-pandora-primary/20 rounded-full animate-ping absolute inset-0"></div>
                <div className="w-24 h-24 border-4 border-t-pandora-primary border-r-pandora-primary/50 border-b-pandora-primary/20 border-l-pandora-primary/10 rounded-full animate-spin"></div>
                <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-pandora-primary" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{T.login.identifying}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{T.signup.validatingDesc}</p>
              
              <div className="mt-8 w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-pandora-primary animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
              
              <style>{`
                @keyframes loading {
                  0% { width: 0%; margin-left: 0%; }
                  50% { width: 50%; margin-left: 25%; }
                  100% { width: 0%; margin-left: 100%; }
                }
              `}</style>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-black dark:text-gray-400 mb-1 ml-1 uppercase tracking-wider">{T.login.loginLabel}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-black dark:text-white outline-none focus:border-pandora-primary transition-all font-bold"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-xs font-bold text-black dark:text-gray-400 uppercase tracking-wider">{T.login.passLabel}</label>
              <button 
                type="button"
                onClick={() => { setShowRecovery(true); setError(''); }}
                className="text-[10px] font-bold text-pandora-primary uppercase hover:underline"
              >
                {T.login.forgotPass}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-black dark:text-white outline-none focus:border-pandora-primary transition-all font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-10 h-5 rounded-full relative transition-all duration-300 ${rememberMe ? 'bg-pandora-primary' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${rememberMe ? 'left-6' : 'left-1'}`} />
            </button>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{T.login.rememberMe}</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-pandora-primary text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {isProcessing ? T.login.processing : T.login.enter}
          </button>

          <div className="text-center pt-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{T.login.noAccount}</p>
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="w-full py-3 border border-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
            >
              {T.login.createAccount}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={onCancel}
          className="text-[10px] font-black text-gray-500 uppercase tracking-tighter hover:text-white transition-colors"
        >
          {T.common.back}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
