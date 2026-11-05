import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'usuario' && password === 'senha') {
      soundFx.playDispatchSuccess();
      sessionStorage.setItem('authenticated', 'true');
      onLoginSuccess();
    } else {
      soundFx.playAlertBeep();
      setError(true);
    }
  };

  const handleDemoFill = () => {
    setUsername('usuario');
    setPassword('senha');
    setError(false);
  };

  return (
    <div className="w-full h-screen bg-[radial-gradient(circle_at_center,_#2c3e50_0%,_#12161c_100%)] flex items-center justify-center p-4 text-[#ecf0f1] font-sans select-none">
      <div className="w-full max-w-[360px] bg-[#1e2a38] border-2 border-[#f1c40f] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center">
        {/* Brand Header */}
        <div className="w-full bg-[#f1c40f] text-black font-black text-2xl py-3 rounded-lg text-center tracking-wider shadow-md mb-6">
          VAI PITANGA
        </div>

        <div className="text-center mb-6">
          <h2 className="text-sm font-mono font-bold text-gray-200 uppercase tracking-widest flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-[#f1c40f]" />
            Acesso ao Centro de Comando
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 font-mono">
            Sistema de Drones de Segurança v6.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
              Operador / Usuário
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                placeholder="Ex: usuario"
                required
                className="w-full py-2.5 px-3 pl-9 rounded-lg bg-[#0e141c] border border-[#34495e] text-white text-sm focus:outline-none focus:border-[#f1c40f] transition-colors"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-300 uppercase mb-1">
              Chave de Acesso / Senha
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                required
                className="w-full py-2.5 px-3 pl-9 rounded-lg bg-[#0e141c] border border-[#34495e] text-white text-sm focus:outline-none focus:border-[#f1c40f] transition-colors"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/70 border border-red-500 text-red-300 px-3 py-2 rounded text-xs font-mono animate-shake">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Credenciais Inválidas. Tente usuario / senha</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#27ae60] hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/60"
          >
            LOGON SISTEMA
          </button>
        </form>

        {/* Demo Auto-fill Helper */}
        <div className="mt-6 pt-4 border-t border-gray-700/60 w-full flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] font-mono text-[#f1c40f] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Preencher credenciais de teste (usuario / senha)
          </button>
          <span className="text-[10px] text-gray-500 font-mono">
            Pitanga - PR · Terminal Homologado EPT
          </span>
        </div>
      </div>
    </div>
  );
};
