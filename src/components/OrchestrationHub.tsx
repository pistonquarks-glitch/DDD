import React, { useState } from "react";
import { Cpu, Shield, Zap, Sparkles, Server, CheckCircle2, Play, CircleAlert } from "lucide-react";
import { motion } from "motion/react";

export default function OrchestrationHub() {
  const [optimization, setOptimization] = useState<number>(82);
  const [activePipeline, setActivePipeline] = useState<string>("Bucle_Sincronizacion_Memoria");
  const [logs, setLogs] = useState<string[]>([
    "[12:10:01] [Orquestador] Inicializando pipeline: Bucle_Sincronizacion_Memoria.",
    "[12:10:02] [Arquitecto] Validando coherencia del bus de topología de red.",
    "[12:10:04] [Programador] Ejecutando compilación del handler de interrupciones.",
    "[12:10:06] [Orion-Core] Analizando telemetría de buffers y colas de datos.",
    "[12:10:08] [Sistemas] Pipeline estabilizado con latencia de 4.2ms. Carga balanceada.",
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(true);

  const runSamplePipeline = (name: string) => {
    setActivePipeline(name);
    setIsRunning(true);
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] [Orquestador] Desplegando pipeline: ${name}...`,
      `[${new Date().toLocaleTimeString()}] [Orion-Core] Re-enrutando buffers de carga...`,
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cognitive Orchestrator Settings */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 bg-[#0C0C0E] border border-[#2A2A2E] rounded">
                <Sparkles className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Orquestador Cognitivo</h3>
                <p className="text-xs text-[#888]">Ajuste de hiperparámetros del swarm de agentes.</p>
              </div>
            </div>

            <div className="space-y-5 my-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                  <span className="text-[#888]">Eficiencia de Loop</span>
                  <span className="text-[#C5A059] font-bold">{optimization}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={optimization}
                  onChange={(e) => setOptimization(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#0C0C0E] rounded appearance-none cursor-pointer accent-[#C5A059]"
                />
              </div>

              <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888]">Algoritmo:</span>
                  <span className="text-white font-semibold">Gemini 3.5 Flash Swarm</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888]">Nivel de Pensamiento:</span>
                  <span className="text-[#4ade80] font-semibold">Automático (Bajo Estrés)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#888]">Reintentos de Fallo:</span>
                  <span className="text-white">3 (Máximo)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A2A2E] pt-4 flex flex-col space-y-2">
            <button
              id="btn-optimize"
              onClick={() => setOptimization(96)}
              className="w-full py-2 bg-[#C5A059] hover:bg-[#b48e48] text-black text-xs font-bold rounded transition cursor-pointer"
            >
              Autotunear Swarm (96% Eficiencia)
            </button>
          </div>
        </div>

        {/* Core Agent Swarm Status */}
        <div className="lg:col-span-2 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Agentes de Orquestación v4.2</h3>
              <p className="text-xs text-[#888]">Módulos neuronales asignados a pipelines industriales.</p>
            </div>
            <div className="flex items-center space-x-1 bg-[#1A301D] border border-[#2A2A2E] px-2 py-0.5 rounded text-[10px] font-mono text-[#4ade80]">
              <span>SWARM READY</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Agent 1 */}
            <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#C5A059] font-mono">01_ARQUITECTO</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Sistemas Topológicos</h4>
                <p className="text-xs text-[#888] mt-1">Valida la consistencia de los buses de red y topologías distribuidas.</p>
              </div>
              <div className="border-t border-[#2A2A2E] pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-[#888]">
                <span>Precisión: 98.4%</span>
                <span className="text-[#4ade80]">IDLE</span>
              </div>
            </div>

            {/* Agent 2 */}
            <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#C5A059] font-mono">02_PROGRAMADOR</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">Lógica en Tiempo Real</h4>
                <p className="text-xs text-[#888] mt-1">Escribe listeners en bajo nivel y compila pipelines de eventos.</p>
              </div>
              <div className="border-t border-[#2A2A2E] pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-[#888]">
                <span>Precisión: 99.1%</span>
                <span className="text-[#4ade80]">IDLE</span>
              </div>
            </div>

            {/* Agent 3 */}
            <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded flex flex-col justify-between hover:border-[#C5A059]/40 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#C5A059] font-mono">03_ORION_CORE</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                </div>
                <h4 className="text-sm font-semibold text-white">Diagnóstico Maestro</h4>
                <p className="text-xs text-[#888] mt-1">Supervisa latencias globales y picos de presión críticos.</p>
              </div>
              <div className="border-t border-[#2A2A2E] pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-[#888]">
                <span>Precisión: 97.9%</span>
                <span className="text-[#C5A059] font-bold">BUSY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipelines & Live Console Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Pipelines */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Pipelines de Acción Disponibles</h3>
          <div className="space-y-2">
            {[
              { id: "Bucle_Sincronizacion_Memoria", title: "Sincronización de Memoria", desc: "Sincroniza buffers distribuidos", icon: <Server className="w-4 h-4 text-[#C5A059]" /> },
              { id: "Monitoreo_Presion_Pistones", title: "Monitoreo de Presión", desc: "Mide y mitiga picos de presión", icon: <Zap className="w-4 h-4 text-[#C5A059]" /> },
              { id: "Verificacion_Enlace_Canal", title: "Canal de Enlace de Red", desc: "Prueba integridad de gateway", icon: <Shield className="w-4 h-4 text-[#C5A059]" /> },
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => runSamplePipeline(p.id)}
                className={`p-3 rounded border transition cursor-pointer flex items-start space-x-3 ${
                  activePipeline === p.id
                    ? "bg-[#0C0C0E] border-[#C5A059]"
                    : "bg-[#0C0C0E] border-[#2A2A2E] hover:border-[#C5A059]/40"
                }`}
              >
                <div className="p-1.5 bg-[#121214] rounded border border-[#2A2A2E] mt-0.5">
                  {p.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{p.title}</div>
                  <div className="text-[10px] text-[#888] mt-0.5">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Console logs stream */}
        <div className="lg:col-span-2 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Terminal de Orquestación Directa</h3>
            <span className="text-[10px] font-mono text-[#888] uppercase">Interactive Logs</span>
          </div>

          <div className="flex-1 bg-[#0C0C0E] border border-[#2A2A2E] rounded p-3.5 font-mono text-xs text-[#D1D1D1] h-48 overflow-y-auto space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="flex space-x-2">
                <span className="text-[#C5A059] font-bold select-none">&gt;</span>
                <span className="text-[#D1D1D1] leading-normal">{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
