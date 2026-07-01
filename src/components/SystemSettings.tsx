import React, { useState } from "react";
import { Settings, ShieldAlert, Sliders, Volume2, Globe, Key, Trash2, CheckCircle2 } from "lucide-react";

interface SystemSettingsProps {
  onResetApp: () => void;
}

export default function SystemSettings({ onResetApp }: SystemSettingsProps) {
  const [logLevel, setLogLevel] = useState<string>("TRACE");
  const [telemetryRate, setTelemetryRate] = useState<number>(2000);
  const [language, setLanguage] = useState<string>("es");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [firmwareVersion, setFirmwareVersion] = useState<string>("v4.2.1-Beta");

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <form onSubmit={handleSave} className="bg-[#121214] border border-[#2A2A2E] rounded p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-2.5 pb-4 border-b border-[#2A2A2E]">
          <Settings className="w-5 h-5 text-[#C5A059]" />
          <div>
            <h3 className="text-md font-display font-semibold text-white uppercase tracking-wider">Configuración del Sistema</h3>
            <p className="text-xs text-[#888]">Parámetros del núcleo de red, credenciales de IA y almacenamiento.</p>
          </div>
        </div>

        {/* Credentials & API */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-[#888] uppercase tracking-widest font-mono flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Credenciales & API</span>
          </h4>
          <div className="bg-[#0C0C0E]/40 border border-[#2A2A2E] p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-[#D1D1D1] font-semibold block">Servidor Gemini API Proxy</span>
                <span className="text-[10px] text-[#888] block mt-0.5">La API se gestiona de forma segura del lado del servidor.</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 font-semibold">
                ACTIVE
              </span>
            </div>
            
            <div className="p-3 bg-[#0C0C0E] rounded border border-[#2A2A2E] text-[11px] font-mono text-[#888]">
              Para usar capacidades cognitivas completas, asegúrate de configurar <code className="text-[#C5A059] font-bold">GEMINI_API_KEY</code> en el menú de Secretos de AI Studio.
            </div>
          </div>
        </div>

        {/* Core System Variables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* General settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#888] uppercase tracking-widest font-mono flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Frecuencias & Filtros</span>
            </h4>
            
            <div className="space-y-3 bg-[#0C0C0E]/20 p-4 rounded border border-[#2A2A2E]">
              <div>
                <label className="text-xs text-[#888] block mb-1 font-mono">Logger Level de Depuración</label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="TRACE">TRACE (Detallado)</option>
                  <option value="INFO">INFO (Normal)</option>
                  <option value="WARNING">WARNING (Solo Alertas)</option>
                  <option value="FATAL">FATAL (Crítico)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#888] block mb-1 font-mono">Tasa de Telemetría (ms)</label>
                <input
                  type="number"
                  min="500"
                  max="10000"
                  step="500"
                  value={telemetryRate}
                  onChange={(e) => setTelemetryRate(Number(e.target.value))}
                  className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Localization & Sound */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#888] uppercase tracking-widest font-mono flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Idioma & Sonidos</span>
            </h4>
            
            <div className="space-y-3 bg-[#0C0C0E]/20 p-4 rounded border border-[#2A2A2E]">
              <div>
                <label className="text-xs text-[#888] block mb-1 font-mono">Idioma Predeterminado</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="es">Español (Castellano)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-xs text-[#D1D1D1] font-semibold block">Sintetizador de Voz</span>
                  <span className="text-[10px] text-[#888] block">Alertas críticas leídas en voz alta.</span>
                </div>
                <button
                  id="btn-sound-toggle"
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded border transition cursor-pointer ${
                    soundEnabled
                      ? "bg-[#0C0C0E] text-[#C5A059] border-[#C5A059]"
                      : "bg-[#0C0C0E] text-[#888] border-[#2A2A2E]"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#2A2A2E] pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-[#888] font-mono">
            Firmware: {firmwareVersion} | Build Node: Cloud-V3
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              id="btn-reset-app"
              type="button"
              onClick={() => {
                if (confirm("¿Estás seguro de restablecer el sistema? Se borrarán todos tus datos grabados.")) {
                  onResetApp();
                }
              }}
              className="flex items-center justify-center space-x-1 px-4 py-2 border border-rose-900 bg-rose-950/45 hover:bg-rose-900/45 text-rose-400 text-xs font-semibold rounded transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Restaurar Fábrica</span>
            </button>

            <button
              id="btn-save-settings"
              type="submit"
              className="flex items-center justify-center space-x-1 px-5 py-2 bg-[#C5A059] hover:bg-[#b48e48] text-black text-xs font-bold rounded transition cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-black animate-bounce" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Parámetros</span>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
