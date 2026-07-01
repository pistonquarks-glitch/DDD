import React, { useState } from "react";
import { ActionRecord, LoopAutomation } from "../types";
import { Radio, Play, Pause, Trash2, ListChecks, HelpCircle, Save, Zap } from "lucide-react";

interface ActionRecorderProps {
  records: ActionRecord[];
  onAddRecord: (record: Omit<ActionRecord, "id" | "timestamp">) => void;
  onClearRecords: () => void;
  onSaveAsLoop: (name: string, frequency: string) => void;
}

export default function ActionRecorder({
  records,
  onAddRecord,
  onClearRecords,
  onSaveAsLoop,
}: ActionRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loopName, setLoopName] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("2s");

  const startRecording = () => {
    setIsRecording(true);
    onAddRecord({
      actionType: "STATE_CHANGE",
      target: "orion.core.recorder",
      value: "RECORDING_ACTIVE",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    onAddRecord({
      actionType: "STATE_CHANGE",
      target: "orion.core.recorder",
      value: "RECORDING_PAUSED",
    });
  };

  const addMockClick = () => {
    if (!isRecording) return;
    onAddRecord({
      actionType: "CLICK",
      target: "piston.pressure_valve.adjust_v2",
      value: "Pressure set to 125 PSI",
    });
  };

  const addMockInput = () => {
    if (!isRecording) return;
    onAddRecord({
      actionType: "INPUT",
      target: "chronos_loop.latency.target",
      value: "4ms",
    });
  };

  const addMockApi = () => {
    if (!isRecording) return;
    onAddRecord({
      actionType: "API_CALL",
      target: "orion_gateway.cluster.sync",
      value: "payload: { status: 1 }",
    });
  };

  const handleSaveLoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loopName.trim()) return;
    onSaveAsLoop(loopName, frequency);
    setLoopName("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recording Controllers */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col justify-between h-[300px]">
          <div>
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="p-2 bg-[#0C0C0E] border border-[#2A2A2E] rounded">
                <Radio className={`w-5 h-5 ${isRecording ? "text-rose-500 animate-pulse" : "text-[#888]"}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Grabadora de Acciones</h3>
                <p className="text-xs text-[#888]">Graba flujos manuales de operarios para crear automatizaciones.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 my-4">
              {!isRecording ? (
                <button
                  id="btn-start-record"
                  onClick={startRecording}
                  className="flex items-center space-x-1 px-4 py-2 rounded bg-rose-950/40 text-rose-400 border border-rose-800 hover:bg-rose-950/70 text-xs font-semibold transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Iniciar Grabación</span>
                </button>
              ) : (
                <button
                  id="btn-stop-record"
                  onClick={stopRecording}
                  className="flex items-center space-x-1 px-4 py-2 rounded bg-amber-950/40 text-amber-400 border border-amber-800 hover:bg-amber-950/60 text-xs font-semibold transition cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar Grabación</span>
                </button>
              )}

              <button
                id="btn-clear-record"
                onClick={onClearRecords}
                className="flex items-center space-x-1 px-3 py-2 rounded border border-[#2A2A2E] bg-[#0C0C0E] hover:border-[#C5A059] text-xs font-medium text-[#888] hover:text-white transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>
          </div>

          <div className="border-t border-[#2A2A2E] pt-4">
            <h4 className="text-[10px] font-mono text-[#888] uppercase tracking-widest mb-2">Simular Clics Manuales</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-mock-click"
                onClick={addMockClick}
                disabled={!isRecording}
                className="py-1 px-2 text-[10px] font-mono rounded bg-[#0C0C0E] border border-[#2A2A2E] hover:border-[#C5A059] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clic Válvula
              </button>
              <button
                id="btn-mock-input"
                onClick={addMockInput}
                disabled={!isRecording}
                className="py-1 px-2 text-[10px] font-mono rounded bg-[#0C0C0E] border border-[#2A2A2E] hover:border-[#C5A059] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Set Latencia
              </button>
              <button
                id="btn-mock-api"
                onClick={addMockApi}
                disabled={!isRecording}
                className="py-1 px-2 text-[10px] font-mono rounded bg-[#0C0C0E] border border-[#2A2A2E] hover:border-[#C5A059] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Gtw Sync API
              </button>
            </div>
          </div>
        </div>

        {/* Live Timeline list of steps */}
        <div className="lg:col-span-2 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col h-[300px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Cronología de Pasos Registrados</h3>
            <span className="text-[10px] font-mono text-[#888] uppercase">Buffer: {records.length} Pasos</span>
          </div>

          <div className="flex-1 bg-[#0C0C0E] border border-[#2A2A2E] rounded p-3 overflow-y-auto space-y-2 h-44">
            {records.length > 0 ? (
              records.map((r, i) => (
                <div key={r.id} className="flex items-start space-x-2.5 text-xs font-mono">
                  <span className="text-slate-600">[{r.timestamp}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    r.actionType === "CLICK"
                      ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30"
                      : r.actionType === "INPUT"
                      ? "bg-white/5 text-white border border-white/20"
                      : r.actionType === "API_CALL"
                      ? "bg-[#1A301D] text-[#4ade80] border border-[#2A2A2E]"
                      : "bg-[#121214] text-[#888] border border-[#2A2A2E]"
                  }`}>
                    {r.actionType}
                  </span>
                  <span className="text-[#D1D1D1]">{r.target}</span>
                  <span className="text-[#888]">→ {r.value}</span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#888] space-y-1">
                <ListChecks className="w-8 h-8 stroke-1 text-[#C5A059]" />
                <p className="text-xs">No hay acciones en el buffer. Inicia la grabación para capturar clics.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compiler section to save loop */}
      {records.length > 2 && (
        <form
          onSubmit={handleSaveLoop}
          className="bg-[#121214] border border-[#C5A059]/20 p-5 rounded space-y-4 animate-fade-in"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-[#0C0C0E] border border-[#C5A059]/20 rounded">
              <Zap className="w-4 h-4 text-[#C5A059]" />
            </div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Compilador de Loops de Automatización</h3>
          </div>

          <p className="text-xs text-[#888] max-w-xl">
            Convierte esta secuencia grabada de clics y llamadas a la API en un loop periódico de automatización que se ejecuta continuamente en las puertas de enlace IoT del Piston.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs text-[#888] block mb-1 font-mono">Nombre del Loop</label>
              <input
                type="text"
                value={loopName}
                onChange={(e) => setLoopName(e.target.value)}
                placeholder="Ej. Bucle_Compensador_Presion"
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2 px-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-[#888] block mb-1 font-mono">Frecuencia de Repetición</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2 px-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
              >
                <option value="500ms">500 ms (Alta frecuencia)</option>
                <option value="1s">1.0 s (Regular)</option>
                <option value="5s">5.0 s (Bajo impacto)</option>
                <option value="15s">15.0 s (Pasivo)</option>
              </select>
            </div>

            <button
              id="btn-save-loop"
              type="submit"
              className="flex items-center justify-center space-x-1.5 py-2 px-4 bg-[#C5A059] hover:bg-[#b48e48] text-black text-xs font-bold rounded transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Compilar y Guardar Loop</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
