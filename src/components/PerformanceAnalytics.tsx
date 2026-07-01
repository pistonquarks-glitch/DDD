import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Gauge, Sliders, Zap, Download, RefreshCw, AlertTriangle } from "lucide-react";

interface PerformanceData {
  time: string;
  cpu: number;
  ram: number;
  pressure: number;
  throughput: number;
}

export default function PerformanceAnalytics() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [intervalSpeed, setIntervalSpeed] = useState<number>(2000); // ms
  const [isLive, setIsLive] = useState<boolean>(true);
  const [pressureMultiplier, setPressureMultiplier] = useState<number>(1);

  // Seed initial data
  useEffect(() => {
    const initialData: PerformanceData[] = [];
    const now = new Date();
    for (let i = 15; i >= 0; i--) {
      const timeStr = new Date(now.getTime() - i * 5000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      initialData.push({
        time: timeStr,
        cpu: Math.floor(45 + Math.random() * 20),
        ram: Math.floor(62 + Math.random() * 5),
        pressure: Math.floor(95 + Math.random() * 15),
        throughput: Math.floor(180 + Math.random() * 50),
      });
    }
    setData(initialData);
  }, []);

  // Update live data periodically
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      setData((prev) => {
        const nextTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const currentCpu = Math.min(
          100,
          Math.max(
            15,
            Math.floor((prev[prev.length - 1]?.cpu || 50) + (Math.random() * 20 - 10))
          )
        );
        const currentRam = Math.min(
          100,
          Math.max(
            30,
            Math.floor((prev[prev.length - 1]?.ram || 65) + (Math.random() * 4 - 2))
          )
        );
        const rawPressure = Math.floor(100 + Math.random() * 20);
        const currentPressure = Math.min(250, Math.floor(rawPressure * pressureMultiplier));
        const currentThroughput = Math.floor(150 + Math.random() * 80);

        const newData = [
          ...prev.slice(1),
          {
            time: nextTime,
            cpu: currentCpu,
            ram: currentRam,
            pressure: currentPressure,
            throughput: currentThroughput,
          },
        ];
        return newData;
      });
    }, intervalSpeed);

    return () => clearInterval(timer);
  }, [isLive, intervalSpeed, pressureMultiplier]);

  const triggerPressureSpike = () => {
    setPressureMultiplier(2.1);
    setTimeout(() => {
      setPressureMultiplier(1.0);
    }, 4000);
  };

  const clearHistory = () => {
    setData((prev) => [prev[prev.length - 1]]);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Bar Controls */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#0C0C0E] border border-[#2A2A2E] rounded">
            <Sliders className="w-5 h-5 text-[#C5A059]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Panel de Control de Analíticas</h3>
            <p className="text-xs text-[#888]">Ajusta intervalos de muestreo y simulación de spikes de presión.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-[#0C0C0E] px-3 py-1.5 rounded border border-[#2A2A2E]">
            <span className="text-xs text-[#888] font-mono">Intervalo:</span>
            <select
              value={intervalSpeed}
              onChange={(e) => setIntervalSpeed(Number(e.target.value))}
              className="bg-transparent text-xs font-mono text-[#C5A059] focus:outline-none cursor-pointer"
            >
              <option value={1000}>1.0s (Rápido)</option>
              <option value={2000}>2.0s (Normal)</option>
              <option value={5000}>5.0s (Lento)</option>
            </select>
          </div>

          <button
            id="btn-spike"
            onClick={triggerPressureSpike}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
              pressureMultiplier > 1
                ? "bg-rose-950/50 text-rose-400 border border-rose-800 animate-pulse"
                : "bg-amber-950/20 text-amber-400 border border-amber-900/40 hover:bg-amber-950/40"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{pressureMultiplier > 1 ? "¡Spike de Presión Activo!" : "Simular Spike"}</span>
          </button>

          <button
            id="btn-live-toggle"
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer ${
              isLive
                ? "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/30"
                : "bg-[#0C0C0E] text-[#888] border-[#2A2A2E]"
            }`}
          >
            {isLive ? "● LIVE" : "❚❚ PAUSADO"}
          </button>

          <button
            id="btn-clear"
            onClick={clearHistory}
            className="p-1.5 rounded bg-[#0C0C0E] border border-[#2A2A2E] hover:bg-[#121214] text-[#888] hover:text-white transition cursor-pointer"
            title="Limpiar Historial"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: CPU & RAM Area Chart */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Carga de CPU & Memoria RAM</h3>
              <p className="text-xs text-[#888]">Métricas acumuladas del bus de memoria principal.</p>
            </div>
            <div className="flex space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-[#C5A059] inline-block" />
                <span className="text-[#C5A059]">CPU</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-white inline-block" />
                <span className="text-white">RAM</span>
              </span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="time" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0C0C0E", borderColor: "#2A2A2E" }}
                  labelStyle={{ color: "#888" }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#C5A059"
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="ram"
                  stroke="#FFFFFF"
                  fillOpacity={1}
                  fill="url(#colorRam)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Piston Pressure Peaks (Line Chart with Reference line) */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 h-[340px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Presión del Pistón (PSI)</h3>
              <p className="text-xs text-[#888]">Historial dinámico de bucles de presión.</p>
            </div>
            {pressureMultiplier > 1 && (
              <div className="flex items-center space-x-1 bg-rose-950/50 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-mono text-rose-400">
                <AlertTriangle className="w-3 h-3 animate-bounce" />
                <span>SOBREPRESIÓN</span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="time" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} domain={[40, 240]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0C0C0E", borderColor: "#2A2A2E" }}
                  labelStyle={{ color: "#888" }}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke={pressureMultiplier > 1 ? "#ef4444" : "#C5A059"}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: System Throughput (Bar Chart) */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 h-[320px] lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wider">Rendimiento de Pipeline (Pipelines/min)</h3>
              <p className="text-xs text-[#888]">Volumen de orquestación de subrutinas resueltas en tiempo real.</p>
            </div>
            <button
              id="btn-export"
              className="flex items-center space-x-1 text-xs text-[#888] hover:text-[#C5A059] transition cursor-pointer"
              onClick={() => {
                const text = JSON.stringify(data, null, 2);
                const blob = new Blob([text], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "piston_parley_metrics.json";
                a.click();
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="time" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0C0C0E", borderColor: "#2A2A2E" }}
                  labelStyle={{ color: "#888" }}
                />
                <Bar dataKey="throughput" fill="#C5A059" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
