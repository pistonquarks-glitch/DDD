import React, { useState } from "react";
import { SystemEvent, LogSeverity } from "../types";
import { AlertOctagon, AlertTriangle, Info, Terminal, Search, CheckSquare, Square } from "lucide-react";

interface EventLogsProps {
  events: SystemEvent[];
  onToggleResolveEvent: (id: string) => void;
}

export default function EventLogs({ events, onToggleResolveEvent }: EventLogsProps) {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | "ALL">("ALL");

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.source.toLowerCase().includes(search.toLowerCase()) ||
      e.message.toLowerCase().includes(search.toLowerCase());
    
    const matchesSeverity = selectedSeverity === "ALL" || e.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityStyle = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.FATAL:
        return "bg-rose-950/40 text-rose-400 border border-[#2A2A2E]";
      case LogSeverity.WARNING:
        return "bg-amber-950/40 text-amber-400 border border-[#2A2A2E]";
      case LogSeverity.INFO:
        return "bg-[#C5A059]/10 text-[#C5A059] border border-[#2A2A2E]";
      case LogSeverity.TRACE:
        return "bg-[#0C0C0E] text-[#888] border border-[#2A2A2E]";
    }
  };

  const getSeverityIcon = (severity: LogSeverity) => {
    switch (severity) {
      case LogSeverity.FATAL:
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case LogSeverity.WARNING:
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case LogSeverity.INFO:
        return <Info className="w-4 h-4 text-[#C5A059]" />;
      case LogSeverity.TRACE:
        return <Terminal className="w-4 h-4 text-[#888]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#888]" />
          <input
            id="log-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar eventos o fuentes..."
            className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        {/* Severity selection */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#888] font-mono mr-2 hidden sm:inline">Gravedad:</span>
          {(["ALL", "FATAL", "WARNING", "INFO", "TRACE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeverity(s)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium border transition cursor-pointer ${
                selectedSeverity === s
                  ? "bg-[#0C0C0E] text-[#C5A059] border-[#C5A059]"
                  : "bg-[#0C0C0E] text-[#888] border-[#2A2A2E] hover:border-[#C5A059]/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Logs timeline list */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2A2A2E] bg-[#0C0C0E] text-[#888]">
                <th className="py-3 px-4">Marca de Tiempo</th>
                <th className="py-3 px-4">Gravedad</th>
                <th className="py-3 px-4">Fuente</th>
                <th className="py-3 px-4">Mensaje de Diagnóstico</th>
                <th className="py-3 px-4 text-center">Resolución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2E]">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((e) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-[#0C0C0E]/40 transition ${
                      e.resolved ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 text-[#888]">{e.timestamp}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        {getSeverityIcon(e.severity)}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getSeverityStyle(e.severity)}`}>
                          {e.severity}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-semibold">{e.source}</td>
                    <td className="py-3.5 px-4 text-[#D1D1D1]">{e.message}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        id={`btn-resolve-${e.id}`}
                        onClick={() => onToggleResolveEvent(e.id)}
                        className="p-1 rounded text-[#888] hover:text-[#C5A059] transition inline-block mx-auto cursor-pointer"
                        title={e.resolved ? "Reabrir Alerta" : "Resolver Alerta"}
                      >
                        {e.resolved ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 hover:text-[#C5A059]" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#888]">
                    No se encontraron eventos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
