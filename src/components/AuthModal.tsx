import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Phone, Globe, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, login, register, setCurrentView } = useApp();
  
  const [tab, setTab] = useState<'login' | 'register' | 'recover'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Angola');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Recovery
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverSent, setRecoverSent] = useState(false);

  // Status/Errors
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (activeModal !== 'auth') return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setActiveModal('none');
      if (res.user?.role === 'client') {
        setCurrentView('client_dashboard');
      } else {
        setCurrentView('admin');
      }
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As palavras-passe introduzidas não coincidem.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('A palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      setErrorMessage('Deverá aceitar os Termos e Condições e a Política de Privacidade.');
      return;
    }

    const res = register({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      country: regCountry,
      password: regPassword,
    });

    if (res.success) {
      setSuccessMessage('Conta criada com sucesso! A redirecionar para a área de cliente...');
      setTimeout(() => {
        setActiveModal('none');
        setCurrentView('client_dashboard');
      }, 1200);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        
        {/* Header with Close */}
        <div className="p-6 pb-2 flex items-center justify-between border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              ÁREA RESERVADA ZEMAN
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
              {tab === 'login' && 'Iniciar Sessão'}
              {tab === 'register' && 'Criar Nova Conta'}
              {tab === 'recover' && 'Recuperar Acesso'}
            </h3>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        {tab !== 'recover' && (
          <div className="grid grid-cols-2 p-2 bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-center">
            <button
              onClick={() => { setTab('login'); setErrorMessage(''); }}
              className={`py-2 rounded-xl transition-all ${
                tab === 'login' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMessage(''); }}
              className={`py-2 rounded-xl transition-all ${
                tab === 'register' ? 'bg-white shadow-sm text-slate-950' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Registar-se
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Endereço de Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.ao"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => { setTab('recover'); setErrorMessage(''); }}
                  className="text-xs text-amber-700 hover:underline"
                >
                  Esqueceu-se?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
            >
              Iniciar Sessão
            </button>

            {/* Quick Demo Credentials Help */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Contas de Demonstração Rápidas:</p>
              <p>• Hóspede: <code className="text-amber-800 font-mono">joao.silva@exemplo.ao</code> (passe: password123)</p>
              <p>• Administrador: <code className="text-amber-800 font-mono">admin@zemantrading.ao</code> (passe: admin)</p>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ex: João Baptista Silva"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Endereço de Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.ao"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+244 9XX..."
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  País *
                </label>
                <input
                  type="text"
                  required
                  value={regCountry}
                  onChange={(e) => setRegCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Palavra-passe *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mín. 6 carateres"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Confirmar *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repetir passe"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Checkboxes required by prompt */}
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Aceito integralmente os <strong>Termos e Condições</strong> de prestação de serviços da ZEMAN.</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Autorizo o tratamento dos meus dados de acordo com a <strong>Política de Privacidade</strong>.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer mt-2"
            >
              Criar Conta de Cliente
            </button>
          </form>
        )}

        {/* RECOVER PASSWORD */}
        {tab === 'recover' && (
          <div className="p-6 space-y-4">
            {recoverSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Instruções Enviadas!</h4>
                <p className="text-xs text-slate-600">
                  Enviámos uma ligação segura para redefinição de senha para <strong>{recoverEmail}</strong>. Verifique a sua caixa de correio.
                </p>
                <button
                  onClick={() => { setTab('login'); setRecoverSent(false); }}
                  className="text-xs font-bold text-amber-700 hover:underline block mx-auto pt-2"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Introduza o endereço de email associado à sua conta. Receberá instruções imediatas para redefinir a sua palavra-passe.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Endereço de Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@exemplo.ao"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-slate-950 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-md"
                  >
                    Enviar Instruções
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
