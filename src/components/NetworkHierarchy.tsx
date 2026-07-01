import React, { useState } from "react";
import { NetworkNode, SystemStatus } from "../types";
import { Network, Server, Cpu, Radio, Activity, Zap, Shield, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface NetworkHierarchyProps {
  nodes: NetworkNode[];
  onToggleNodeStatus: (id: string) => void;
  onSimulateStress: (id: string) => void;
}

export default function NetworkHierarchy({
  nodes,
  onToggleNodeStatus,
  onSimulateStress,
}: NetworkHierarchyProps) {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(nodes[0] || null);

  // Helper to render node icon
  const getNodeIcon = (type: NetworkNode["type"]) => {
    switch (type) {
      case "root":
        return <Server className="w-5 h-5 text-[#C5A059]" />;
      case "gateway":
        return <Network className="w-5 h-5 text-[#C5A059]" />;
      case "edge":
        return <Radio className="w-5 h-5 text-[#C5A059]" />;
      case "sensor":
        return <Activity className="w-5 h-5 text-[#C5A059]" />;
      case "actuator":
        return <Zap className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  const getStatusBadge = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.ONLINE:
        return <span className="px-2 py-1 text-xs font-mono rounded bg-[#1A301D] text-[#4ade80] border border-[#2A2A2E]">ONLINE</span>;
      case SystemStatus.MAINTENANCE:
        return <span className="px-2 py-1 text-xs font-mono rounded bg-amber-950/40 text-amber-400 border border-[#2A2A2E]">MAINT</span>;
      case SystemStatus.DEGRADED:
        return <span className="px-2 py-1 text-xs font-mono rounded bg-rose-950/40 text-rose-400 border border-[#2A2A2E]">DEGRADED</span>;
      case SystemStatus.OFFLINE:
        return <span className="px-2 py-1 text-xs font-mono rounded bg-[#121214] text-[#888] border border-[#2A2A2E]">OFFLINE</span>;
    }
  };

  // Render node element recursively
  const renderNodeTree = (node: NetworkNode, depth = 0) => {
    const isSelected = selectedNode?.id === node.id;
    return (
      <div key={node.id} className="flex flex-col">
        <div
          style={{ paddingLeft: `${depth * 24}px` }}
          className="flex items-center py-2"
        >
          {depth > 0 && (
            <div className="w-6 h-px bg-[#2A2A2E] mr-2 relative">
              <div className="absolute -top-1.5 left-0 w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            </div>
          )}
          <div
            onClick={() => setSelectedNode(node)}
            className={`flex-1 flex items-center justify-between p-3 rounded border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#121214] border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.08)]"
                : "bg-[#0C0C0E] border-[#2A2A2E] hover:bg-[#121214] hover:border-[#C5A059]/40"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-[#121214] rounded border border-[#2A2A2E] flex items-center justify-center">
                {getNodeIcon(node.type)}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{node.name}</div>
                <div className="text-xs text-[#888] font-mono capitalize">
                  {node.type} • {node.latency}ms
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-xs text-[#888] font-mono hidden sm:block">
                CPU: {node.cpuUsage}% | RAM: {node.memoryUsage}%
              </div>
              {getStatusBadge(node.status)}
            </div>
          </div>
        </div>
        {node.children && node.children.map((child) => renderNodeTree(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tree Visualization */}
      <div className="lg:col-span-2 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-[#2A2A2E] pb-3">
          <div>
            <h2 className="text-lg font-display font-semibold text-white">
              Jerarquía de Red Global
            </h2>
            <p className="text-xs text-[#888]">
              Topología de enrutamiento y nodos IoT del sistema operacional.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-xs font-mono text-[#C5A059] uppercase tracking-widest">Network Live</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {nodes.map((rootNode) => renderNodeTree(rootNode))}
        </div>
      </div>

      {/* Node Details & Diagnostic Panel */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col h-[600px]">
        {selectedNode ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#2A2A2E]">
              <div className="p-2.5 bg-[#0C0C0E] rounded border border-[#2A2A2E]">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <h3 className="text-md font-display font-semibold text-white">
                  {selectedNode.name}
                </h3>
                <span className="text-xs font-mono text-[#888] uppercase tracking-wider">
                  ID: {selectedNode.id}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-5">
              {/* Telemetry Stats */}
              <div>
                <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
                  Métricas de Telemetría
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-3 rounded text-center">
                    <span className="text-xs text-[#888] block mb-1">CPU Load</span>
                    <span className="text-xl font-mono font-semibold text-white">
                      {selectedNode.cpuUsage}%
                    </span>
                    <div className="w-full bg-[#121214] h-1 mt-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-1 rounded-full"
                        style={{ width: `${selectedNode.cpuUsage}%` }}
                      />
                    </div>
                  </div>
                  <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-3 rounded text-center">
                    <span className="text-xs text-[#888] block mb-1">RAM Usage</span>
                    <span className="text-xl font-mono font-semibold text-white">
                      {selectedNode.memoryUsage}%
                    </span>
                    <div className="w-full bg-[#121214] h-1 mt-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C5A059] h-1 rounded-full"
                        style={{ width: `${selectedNode.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Latency */}
              <div className="bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#888]">Estado Operativo</span>
                  {getStatusBadge(selectedNode.status)}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#888]">Latencia de Enlace</span>
                  <span className="font-mono text-[#C5A059] font-bold">{selectedNode.latency} ms</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#888]">Tipo de Dispositivo</span>
                  <span className="font-mono text-white capitalize">{selectedNode.type}</span>
                </div>
              </div>

              {/* Diagnostic Log */}
              <div>
                <h4 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Bitácora de Seguridad & Diagnóstico</span>
                </h4>
                <div className="bg-[#0C0C0E] border border-[#2A2A2E] rounded p-3 font-mono text-[11px] leading-relaxed text-[#D1D1D1] h-32 overflow-y-auto space-y-1.5">
                  <div>[12:04:15] Node sync handshake initiated...</div>
                  <div>[12:04:16] Link integrity check: <span className="text-[#4ade80]">100% OK</span></div>
                  {selectedNode.cpuUsage > 75 && (
                    <div className="text-rose-400">[12:04:18] WARNING: High CPU utilization spike.</div>
                  )}
                  {selectedNode.status === SystemStatus.OFFLINE ? (
                    <div className="text-[#888]">[12:04:20] Node state set to OFFLINE.</div>
                  ) : (
                    <div className="text-[#C5A059]">[12:04:22] Thread listeners active. Ready.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Controller Actions */}
            <div className="border-t border-[#2A2A2E] pt-4 mt-auto grid grid-cols-2 gap-3">
              <button
                id="btn-toggle-status"
                onClick={() => onToggleNodeStatus(selectedNode.id)}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded border border-[#2A2A2E] bg-[#0C0C0E] hover:border-[#C5A059] transition text-xs font-medium text-white hover:text-[#C5A059] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#888]" />
                <span>Alternar Estado</span>
              </button>
              <button
                id="btn-stress"
                onClick={() => onSimulateStress(selectedNode.id)}
                className="flex items-center justify-center space-x-2 py-2 px-3 rounded bg-[#C5A059] text-black hover:bg-[#b48e48] transition text-xs font-bold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simular Stress</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#888]">
            <Network className="w-10 h-10 mb-2 stroke-1 text-[#C5A059]" />
            <p className="text-sm">Selecciona un nodo para ver su diagnóstico.</p>
          </div>
        )}
      </div>
    </div>
  );
}
