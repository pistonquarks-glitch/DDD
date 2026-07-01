import React, { useState, useRef, useEffect } from "react";
import { Message, Agent } from "../types";
import { Send, Bot, User, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface AgentChatProps {
  agents: Agent[];
  messages: Message[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onSendMessage: (agentId: string, text: string) => Promise<void>;
  isLoading: boolean;
}

export default function AgentChat({
  agents,
  messages,
  selectedAgentId,
  onSelectAgent,
  onSendMessage,
  isLoading,
}: AgentChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(selectedAgentId, inputText);
    setInputText("");
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[580px]">
      {/* Agent Selector rail */}
      <div className="lg:col-span-1 bg-[#121214] border border-[#2A2A2E] rounded p-4 flex flex-col justify-between overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-widest mb-3.5 font-mono">
            Módulos de Agente IA
          </h3>
          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <div
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className={`p-3 rounded border transition cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? "bg-[#0C0C0E] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.08)]"
                      : "bg-[#0C0C0E] border-[#2A2A2E] hover:border-[#C5A059]/40"
                  }`}
                >
                  <div className="text-lg">{agent.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{agent.name}</div>
                    <div className="text-[10px] text-[#888] truncate">{agent.role}</div>
                  </div>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "PROCESSING" ? "bg-[#C5A059] animate-pulse" : "bg-emerald-500"
                  }`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Small operational instructions */}
        <div className="mt-4 pt-3 border-t border-[#2A2A2E] text-[10px] text-[#888] space-y-1 font-mono">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Power: Gemini 3.5 Flash</span>
          </div>
          <p>La IA comprende variables del sistema y ajusta buffers.</p>
        </div>
      </div>

      {/* Conversation Screen */}
      <div className="lg:col-span-3 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2E]">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{activeAgent?.avatar}</span>
            <div>
              <h4 className="text-sm font-semibold text-white">{activeAgent?.name}</h4>
              <p className="text-xs text-[#888]">{activeAgent?.description}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-2 py-0.5 rounded uppercase font-semibold">
            {activeAgent?.status}
          </span>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2 scrollbar-thin">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#888] space-y-1">
              <Bot className="w-10 h-10 stroke-1 text-[#C5A059]/60" />
              <p className="text-xs text-center max-w-sm">
                Inicia una consulta. Los agentes pueden responder sobre la presión de los pistones, cuellos de botella de red o topologías.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded p-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-[#C5A059] text-black font-semibold rounded-tr-none"
                      : "bg-[#0C0C0E] border border-[#2A2A2E] text-white rounded-tl-none"
                  }`}>
                    <div className={`flex items-center space-x-1.5 mb-1 font-mono text-[9px] ${
                      isUser ? "text-black/75" : "text-[#888]"
                    }`}>
                      {isUser ? <User className="w-2.5 h-2.5" /> : <Bot className="w-2.5 h-2.5 text-[#C5A059]" />}
                      <span>{isUser ? "Tú" : activeAgent.name}</span>
                      <span>• {m.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    
                    {m.isSimulated && (
                      <div className="mt-2 text-[10px] text-amber-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Respuesta simulada localmente (configura tu API Key de Gemini en AI Studio).</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#0C0C0E] border border-[#2A2A2E] text-[#888] rounded rounded-tl-none p-3 text-xs font-mono flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-bounce delay-75" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-bounce delay-150" />
                <span>Procesando consulta...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="flex space-x-2 pt-2 border-t border-[#2A2A2E]">
          <input
            id="chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Consulta a ${activeAgent.name}...`}
            className="flex-1 bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
            disabled={isLoading}
            required
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-[#C5A059] hover:bg-[#b48e48] text-black rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
