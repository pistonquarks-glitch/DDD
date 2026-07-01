import React, { useState } from "react";
import { Project } from "../types";
import { Briefcase, CheckCircle2, AlertCircle, Plus, Calendar, Star, Users } from "lucide-react";

interface ProjectManagementProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, "id" | "lastActive">) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

export default function ProjectManagement({
  projects,
  onAddProject,
  onUpdateProgress,
}: ProjectManagementProps) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "PENDING">("ALL");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New project form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("orion");
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddProject({
      name,
      description,
      assignedAgent,
      priority,
      status: "ACTIVE",
      progress: 0,
    });

    // Reset
    setName("");
    setDescription("");
    setAssignedAgent("orion");
    setPriority("MEDIUM");
    setShowAddForm(false);
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121214] border border-[#2A2A2E] rounded p-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["ALL", "ACTIVE", "COMPLETED", "PENDING"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-medium font-mono border transition cursor-pointer ${
                filter === status
                  ? "bg-[#0C0C0E] text-[#C5A059] border-[#C5A059]"
                  : "bg-[#0C0C0E] text-[#888] border-[#2A2A2E] hover:border-[#C5A059]/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <button
          id="btn-show-add-project"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 py-2 px-3.5 bg-[#C5A059] hover:bg-[#b48e48] text-black text-xs font-bold rounded transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Add Project Form Overlay / Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#121214] border border-[#C5A059]/20 p-5 rounded space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-display">Crear Nuevo Pipeline Operativo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#888] block mb-1 font-mono">Nombre del Proyecto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Bucle de Sincronización Térmica"
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2 px-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-[#888] block mb-1 font-mono">Agente Asignado</label>
              <select
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2 px-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
              >
                <option value="orion">Orion-Core v9.1</option>
                <option value="architect">Systems Architect</option>
                <option value="programmer">Senior Programmer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-[#888] block mb-1 font-mono">Descripción de la Tarea</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la subrutina o el pipeline que el agente resolverá..."
                className="w-full bg-[#0C0C0E] border border-[#2A2A2E] rounded py-2 px-3 text-sm text-white focus:outline-none focus:border-[#C5A059] h-20"
              />
            </div>

            <div>
              <label className="text-xs text-[#888] block mb-1 font-mono">Prioridad</label>
              <div className="flex space-x-2">
                {(["HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded border text-xs font-mono font-medium transition cursor-pointer ${
                      priority === p
                        ? "bg-[#0C0C0E] border-[#C5A059] text-[#C5A059]"
                        : "bg-[#0C0C0E] border-[#2A2A2E] text-[#888]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-[#0C0C0E] border border-[#2A2A2E] hover:border-white rounded text-xs font-semibold text-[#888] hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#C5A059] hover:bg-[#b48e48] rounded text-xs font-bold text-black transition cursor-pointer"
            >
              Desplegar Proyecto
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-[#121214] border border-[#2A2A2E] rounded p-5 flex flex-col justify-between hover:border-[#C5A059]/40 transition duration-300"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  p.priority === "HIGH"
                    ? "bg-rose-950/50 text-rose-400 border-[#2A2A2E]"
                    : p.priority === "MEDIUM"
                    ? "bg-amber-950/50 text-amber-400 border-[#2A2A2E]"
                    : "bg-[#0C0C0E] text-[#888] border-[#2A2A2E]"
                }`}>
                  {p.priority} PRIORITY
                </span>

                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${
                    p.status === "ACTIVE"
                      ? "bg-[#C5A059] animate-pulse"
                      : p.status === "COMPLETED"
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }`} />
                  <span className="text-xs text-[#888] font-mono uppercase tracking-wide">{p.status}</span>
                </div>
              </div>

              <h3 className="text-md font-display font-semibold text-white leading-snug">{p.name}</h3>
              <p className="text-xs text-[#888] mt-1.5 leading-relaxed">{p.description}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#2A2A2E] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#888]">
                <span className="flex items-center space-x-1.5 text-white">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="capitalize font-semibold">{p.assignedAgent}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#888]" />
                  <span>{p.lastActive}</span>
                </span>
              </div>

              {/* Editable progress bar slider */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-[#888]">Progreso Operativo</span>
                  <span className="text-[#C5A059] font-bold">{p.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={p.progress}
                  onChange={(e) => onUpdateProgress(p.id, Number(e.target.value))}
                  className="w-full h-1 bg-[#0C0C0E] rounded appearance-none cursor-pointer accent-[#C5A059]"
                  disabled={p.status === "COMPLETED"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
