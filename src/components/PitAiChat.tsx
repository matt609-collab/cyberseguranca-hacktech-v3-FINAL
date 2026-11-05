import React, { useState, useRef, useEffect } from 'react';
import { generateDolmayanResponse, ChatMessage } from '../utils/dolmayanEngine';
import { Bot, X, Send, Trash2, Sparkles, Volume2, ShieldCheck, Minimize2, ChevronDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const DolmayanChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Olá! Sou o **PIT-AI**, o robô assistente local da **VAI PITANGA**.\n\nFui concebido para rodar de forma leve e local no seu navegador, sem depender de nenhuma chave de API ou conexão externa.\n\nComo posso ajudar com a frota de drones, especificações técnicas, planos ou procedimentos de emergência?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Escape to close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    soundFx.playClick();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate local LLM streaming inference
    setTimeout(() => {
      const fullResponse = generateDolmayanResponse(text);
      let currentLength = 0;
      const botMsgId = (Date.now() + 1).toString();

      // Add empty bot message first
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: '',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Stream tokens
      const interval = setInterval(() => {
        currentLength += 4;
        if (currentLength >= fullResponse.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((m) => (m.id === botMsgId ? { ...m, text: fullResponse } : m))
          );
          setIsTyping(false);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId ? { ...m, text: fullResponse.slice(0, currentLength) + '▍' } : m
            )
          );
        }
      }, 15);
    }, 350);
  };

  const handleClearChat = () => {
    soundFx.playClick();
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Histórico reiniciado. O que você gostaria de consultar sobre o sistema VAI PITANGA?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown characters for cleaner speech
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickPrompts = [
    '🔋 Como funciona a recarga solar?',
    '🌾 Planos para área rural',
    '🚨 O que fazer em caso de alerta?',
    '👥 Quem são os desenvolvedores EPT?',
  ];

  return (
    <>
      {/* Floating Bot Toggle Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            soundFx.playClick();
            setIsOpen(true);
          }}
          className="fixed bottom-5 right-5 z-[99990] flex items-center gap-2.5 bg-[#1b2633] hover:bg-[#223040] text-white border-2 border-[#f1c40f] py-2.5 px-4 rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105 active:scale-95 group"
          aria-label="Abrir assistente PIT-AI"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5"></span>
            <div className="p-1 rounded-full bg-[#f1c40f] text-black">
              <Bot className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-left font-sans">
            <div className="text-xs font-black tracking-wider text-[#f1c40f]">PIT-AI</div>
            <div className="text-[10px] text-gray-300 font-mono flex items-center gap-1">
              <span>IA Local Offline</span>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-[99995] w-[90vw] max-w-[400px] h-[540px] bg-[#111822] border-2 border-[#f1c40f] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 text-[#ecf0f1]">
          {/* Header */}
          <div className="bg-[#182330] border-b border-[#2d3f52] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5"></span>
                <div className="p-1.5 rounded-full bg-[#f1c40f] text-black">
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <div className="font-bold text-xs tracking-wider text-[#f1c40f] flex items-center gap-1.5">
                  ROBÔ PIT-AI
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1 py-0.2 rounded font-mono">
                    LOCAL / SEM API
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Assistente Operacional VAI PITANGA
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                title="Limpar Conversa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-[#0c1219] px-3 py-2 border-b border-[#1f2b38] overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+\s*/, ''))}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 rounded bg-[#172230] hover:bg-[#233347] border border-[#2d3e52] text-[10px] text-gray-300 font-mono transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0e141c]/90">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isBot
                        ? 'bg-[#1b2633] text-gray-100 border border-[#2d3f52] rounded-tl-none font-sans'
                        : 'bg-[#27ae60] text-white font-medium rounded-tr-none'
                    }`}
                  >
                    {/* Message formatting with bullet support */}
                    <div className="whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Bold parsing
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={lIdx} className={line.startsWith('•') ? 'pl-2 my-0.5' : ''}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className="text-[#f1c40f] font-bold">
                                    {p.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return p;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 px-1 text-[9px] text-gray-500 font-mono">
                    <span>{msg.timestamp}</span>
                    {isBot && msg.text && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="hover:text-[#f1c40f] transition-colors"
                        title="Ouvir resposta (Sintetizador de Voz)"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs font-mono bg-[#1b2633] px-3 py-2 rounded-xl rounded-tl-none max-w-[120px] border border-[#2d3f52]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f1c40f] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f1c40f] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f1c40f] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] text-gray-400 ml-1">Processando</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#182330] border-t border-[#2d3f52] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte ao PIT-AI sobre os drones..."
              disabled={isTyping}
              className="flex-1 py-2 px-3 rounded-lg bg-[#0e141c] border border-[#34495e] text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#f1c40f] font-mono transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2 rounded-lg bg-[#f1c40f] hover:bg-yellow-400 active:scale-95 text-black disabled:opacity-40 disabled:pointer-events-none transition-all shadow"
              title="Enviar mensagem"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
