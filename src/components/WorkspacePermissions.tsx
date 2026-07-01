import React from "react";
import { PermissionRule } from "../types";
import { ShieldAlert, ShieldCheck, Key, Lock, Unlock, Eye, FileText } from "lucide-react";

interface WorkspacePermissionsProps {
  permissions: PermissionRule[];
  onTogglePermission: (id: string) => void;
}

export default function WorkspacePermissions({
  permissions,
  onTogglePermission,
}: WorkspacePermissionsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Policy summary */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 bg-rose-950/20 border border-rose-900/40 rounded">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Políticas de Control</h3>
              <p className="text-xs text-[#888]">Gestión de privilegios para subrutinas y agentes de IA.</p>
            </div>
          </div>

          <p className="text-xs text-[#D1D1D1] leading-relaxed mb-4">
            Para mitigar desbordamientos de buffers o picos de presión críticos, el sistema Pistón Parley requiere otorgar permisos explícitos para operaciones críticas como el arranque manual de pistones o el acceso a la memoria global.
          </p>

          <div className="space-y-3 bg-[#0C0C0E] border border-[#2A2A2E] p-4 rounded">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Total de Reglas:</span>
              <span className="text-white font-semibold">{permissions.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Aprobados:</span>
              <span className="text-emerald-400 font-semibold">
                {permissions.filter((p) => p.granted).length}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#888]">Bloqueados:</span>
              <span className="text-rose-400 font-semibold">
                {permissions.filter((p) => !p.granted).length}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2A2A2E] pt-4 text-[10px] text-[#888] flex items-center space-x-1 font-mono">
          <Lock className="w-3.5 h-3.5 text-[#888]" />
          <span>Encriptado: AES-GCM-256</span>
        </div>
      </div>

      {/* Permissions table */}
      <div className="lg:col-span-2 bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col h-[400px]">
        <h3 className="text-sm font-semibold text-white mb-3 font-display uppercase tracking-wider">Matriz de Acceso</h3>
        
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {permissions.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3.5 bg-[#0C0C0E] border border-[#2A2A2E] rounded hover:border-[#C5A059]/40 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-[#121214] rounded border border-[#2A2A2E]">
                  <Key className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white font-mono">{p.scope}</div>
                  <div className="text-[10px] text-[#888] font-mono">Rol: {p.role} • Mod: {p.lastModified}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  p.granted
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900"
                    : "bg-rose-950/40 text-rose-400 border border-rose-900"
                }`}>
                  {p.granted ? "PERMITIDO" : "RESTRINGIDO"}
                </span>

                <button
                  id={`btn-toggle-perm-${p.id}`}
                  onClick={() => onTogglePermission(p.id)}
                  className={`p-1.5 rounded transition border cursor-pointer ${
                    p.granted
                      ? "bg-[#121214] border-[#2A2A2E] hover:border-[#C5A059] text-[#888] hover:text-[#C5A059]"
                      : "bg-[#C5A059] border-[#C5A059] text-black hover:bg-[#b48e48]"
                  }`}
                  title={p.granted ? "Bloquear Permiso" : "Habilitar Permiso"}
                >
                  {p.granted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
