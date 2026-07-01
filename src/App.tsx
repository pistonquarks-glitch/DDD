import React, { useState, useEffect } from "react";
import {
  NetworkNode,
  Project,
  SystemEvent,
  ActionRecord,
  PermissionRule,
  LoopAutomation,
  Message,
  SystemStatus,
  LogSeverity,
  Agent,
} from "./types";
import NetworkHierarchy from "./components/NetworkHierarchy";
import PerformanceAnalytics from "./components/PerformanceAnalytics";
import OrchestrationHub from "./components/OrchestrationHub";
import ProjectManagement from "./components/ProjectManagement";
import ActionRecorder from "./components/ActionRecorder";
import AgentChat from "./components/AgentChat";
import SystemSettings from "./components/SystemSettings";
import EventLogs from "./components/EventLogs";
import WorkspacePermissions from "./components/WorkspacePermissions";

import {
  Network,
  Activity,
  Sparkles,
  Briefcase,
  Radio,
  Bot,
  Settings,
  AlertOctagon,
  ShieldCheck,
  Zap,
  Clock,
  Menu,
  X,
  Compass,
  Volume2,
  RefreshCw,
} from "lucide-react";

// Default seed data
const INITIAL_NODES: NetworkNode[] = [
  {
    id: "nd-root",
    name: "Master Gateway (Orion-Core)",
    type: "root",
    status: SystemStatus.ONLINE,
    latency: 2,
    memoryUsage: 48,
    cpuUsage: 35,
    children: [
      {
        id: "nd-gtw-1",
        name: "Sub-Gateway Termoacústico",
        type: "gateway",
        status: SystemStatus.ONLINE,
        latency: 12,
        memoryUsage: 64,
        cpuUsage: 55,
        parentId: "nd-root",
        children: [
          {
            id: "nd-edge-1",
            name: "Edge Sensor Presión V1",
            type: "sensor",
            status: SystemStatus.ONLINE,
            latency: 24,
            memoryUsage: 15,
            cpuUsage: 10,
            parentId: "nd-gtw-1",
          },
          {
            id: "nd-act-1",
            name: "Actuador Compensación Térmica",
            type: "actuator",
            status: SystemStatus.ONLINE,
            latency: 18,
            memoryUsage: 22,
            cpuUsage: 45,
            parentId: "nd-gtw-1",
          },
        ],
      },
      {
        id: "nd-gtw-2",
        name: "Gateway Auxiliar Hidráulico",
        type: "gateway",
        status: SystemStatus.ONLINE,
        latency: 15,
        memoryUsage: 50,
        cpuUsage: 40,
        parentId: "nd-root",
        children: [
          {
            id: "nd-edge-2",
            name: "Válvula de Alivio Pistón V2",
            type: "actuator",
            status: SystemStatus.ONLINE,
            latency: 28,
            memoryUsage: 32,
            cpuUsage: 68,
            parentId: "nd-gtw-2",
          },
        ],
      },
    ],
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Calibración del Ciclo Térmico",
    description: "Sincroniza los sensores de temperatura en el bus principal para mitigar picos.",
    status: "ACTIVE",
    assignedAgent: "programmer",
    progress: 45,
    priority: "HIGH",
    lastActive: "Hoy 12:04",
  },
  {
    id: "proj-2",
    name: "Auditoría de Topología de Red",
    description: "Analiza redundancia física del gateway auxiliar ante desconexión temporal.",
    status: "PENDING",
    assignedAgent: "architect",
    progress: 0,
    priority: "MEDIUM",
    lastActive: "Ayer 18:22",
  },
  {
    id: "proj-3",
    name: "Loop de Compensación de Presión v3",
    description: "Escribe bucle de control para desfogar presión automáticamente a 180 PSI.",
    status: "COMPLETED",
    assignedAgent: "orion",
    progress: 100,
    priority: "HIGH",
    lastActive: "Hace 2 horas",
  },
];

const INITIAL_EVENTS: SystemEvent[] = [
  {
    id: "evt-1",
    timestamp: "12:04:15",
    severity: LogSeverity.INFO,
    source: "orion.gateway.root",
    message: "Handshake de sincronización completado con éxito.",
    resolved: true,
  },
  {
    id: "evt-2",
    timestamp: "11:58:32",
    severity: LogSeverity.WARNING,
    source: "piston.pressure_valve",
    message: "Spike de presión detectado a 185 PSI en válvula V2.",
    resolved: false,
  },
  {
    id: "evt-3",
    timestamp: "10:14:02",
    severity: LogSeverity.FATAL,
    source: "gateway.aux.hydra",
    message: "Enlace de red principal interrumpido temporalmente. Enrutando por canal secundario.",
    resolved: false,
  },
];

const INITIAL_PERMISSIONS: PermissionRule[] = [
  { id: "perm-1", role: "orion-core", scope: "orion.core.read", granted: true, lastModified: "12:00" },
  { id: "perm-2", role: "orion-core", scope: "piston.valves.write", granted: true, lastModified: "12:00" },
  { id: "perm-3", role: "guest", scope: "system.config.write", granted: false, lastModified: "12:00" },
  { id: "perm-4", role: "architect", scope: "network.topology.edit", granted: true, lastModified: "12:00" },
];

const INITIAL_AGENTS: Agent[] = [
  {
    id: "orchestrator",
    name: "Intelligent Orchestrator",
    avatar: "🤖",
    role: "Swarm Coordinator",
    description: "Coordinador central cognitivo para planificación y asignación de tareas.",
    status: "IDLE",
    accuracy: 99.5,
  },
  {
    id: "orion",
    name: "Orion-Core v9.1",
    avatar: "☄️",
    role: "Diagnostic Master",
    description: "Especialista de bajo nivel para diagnóstico de latencias y picos de presión.",
    status: "PROCESSING",
    accuracy: 97.9,
  },
  {
    id: "architect",
    name: "Systems Architect",
    avatar: "📐",
    role: "Network Designer",
    description: "Modelador de redundancia física y ruteo seguro de gateways IoT.",
    status: "IDLE",
    accuracy: 98.4,
  },
  {
    id: "programmer",
    name: "Senior Programmer",
    avatar: "💻",
    role: "Loop Builder",
    description: "Compilador pragmático de controladores lógicos y listeners de eventos.",
    status: "IDLE",
    accuracy: 99.1,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("network");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Persistent States in LocalStorage
  const [nodes, setNodes] = useState<NetworkNode[]>(() => {
    const saved = localStorage.getItem("pp_nodes");
    return saved ? JSON.parse(saved) : INITIAL_NODES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("pp_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [events, setEvents] = useState<SystemEvent[]>(() => {
    const saved = localStorage.getItem("pp_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [records, setRecords] = useState<ActionRecord[]>(() => {
    const saved = localStorage.getItem("pp_records");
    return saved ? JSON.parse(saved) : [];
  });

  const [permissions, setPermissions] = useState<PermissionRule[]>(() => {
    const saved = localStorage.getItem("pp_permissions");
    return saved ? JSON.parse(saved) : INITIAL_PERMISSIONS;
  });

  const [loops, setLoops] = useState<LoopAutomation[]>(() => {
    const saved = localStorage.getItem("pp_loops");
    return saved ? JSON.parse(saved) : [];
  });

  // Chat conversational state
  const [chatMessages, setChatMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("pp_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedAgentId, setSelectedAgentId] = useState<string>("orchestrator");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("pp_nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("pp_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("pp_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("pp_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("pp_permissions", JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem("pp_loops", JSON.stringify(loops));
  }, [loops]);

  useEffect(() => {
    localStorage.setItem("pp_messages", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Clock Update
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for local state changes
  const handleToggleNodeStatus = (id: string) => {
    const updateNode = (list: NetworkNode[]): NetworkNode[] => {
      return list.map((n) => {
        if (n.id === id) {
          const newStatus =
            n.status === SystemStatus.ONLINE ? SystemStatus.OFFLINE : SystemStatus.ONLINE;
          
          // Log event of status change
          const nextEvt: SystemEvent = {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            severity: newStatus === SystemStatus.OFFLINE ? LogSeverity.WARNING : LogSeverity.INFO,
            source: n.name,
            message: `Estado del dispositivo modificado manualmente a: ${newStatus}`,
            resolved: false,
          };
          setEvents((prev) => [nextEvt, ...prev]);

          return { ...n, status: newStatus };
        }
        if (n.children) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });
    };
    setNodes((prev) => updateNode(prev));
  };

  const handleSimulateStress = (id: string) => {
    const updateNode = (list: NetworkNode[]): NetworkNode[] => {
      return list.map((n) => {
        if (n.id === id) {
          const nextEvt: SystemEvent = {
            id: `evt-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            severity: LogSeverity.FATAL,
            source: n.name,
            message: "¡ALERTA CRÍTICA! Simulación de desbordamiento de búfer y latencia extrema activa.",
            resolved: false,
          };
          setEvents((prev) => [nextEvt, ...prev]);

          return { ...n, cpuUsage: 98, memoryUsage: 94, latency: 145 };
        }
        if (n.children) {
          return { ...n, children: updateNode(n.children) };
        }
        return n;
      });
    };
    setNodes((prev) => updateNode(prev));
  };

  const handleAddProject = (p: Omit<Project, "id" | "lastActive">) => {
    const newProj: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      lastActive: "Hoy " + new Date().toLocaleTimeString().substring(0, 5),
    };
    setProjects((prev) => [newProj, ...prev]);

    // Add log event
    const nextEvt: SystemEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: LogSeverity.INFO,
      source: "orion.orquestador",
      message: `Nuevo pipeline operativo iniciado: "${p.name}". Asignado a: ${p.assignedAgent}.`,
      resolved: false,
    };
    setEvents((prev) => [nextEvt, ...prev]);
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isCompleted = progress === 100;
          if (isCompleted && p.status !== "COMPLETED") {
            const nextEvt: SystemEvent = {
              id: `evt-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              severity: LogSeverity.INFO,
              source: "orion.orquestador",
              message: `¡Pipeline completado al 100%!: "${p.name}"`,
              resolved: false,
            };
            setEvents((prev) => [nextEvt, ...prev]);
          }
          return {
            ...p,
            progress,
            status: isCompleted ? "COMPLETED" : "ACTIVE",
          };
        }
        return p;
      })
    );
  };

  const handleAddRecord = (r: Omit<ActionRecord, "id" | "timestamp">) => {
    const newRec: ActionRecord = {
      ...r,
      id: `rec-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setRecords((prev) => [...prev, newRec]);
  };

  const handleSaveAsLoop = (name: string, frequency: string) => {
    const newLoop: LoopAutomation = {
      id: `loop-${Date.now()}`,
      name,
      targetNode: "nd-root",
      frequency,
      isActive: true,
      actionsCount: records.length,
      lastExecuted: "Nunca",
    };
    setLoops((prev) => [...prev, newLoop]);
    setRecords([]); // clear recorder

    // Add log event
    const nextEvt: SystemEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: LogSeverity.INFO,
      source: "orion.core.compiler",
      message: `Loop compilado y desplegado de forma segura: "${name}" (${frequency}).`,
      resolved: false,
    };
    setEvents((prev) => [nextEvt, ...prev]);
  };

  const handleTogglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, granted: !p.granted, lastModified: "Ahora" } : p))
    );
  };

  const handleToggleResolveEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: !e.resolved } : e))
    );
  };

  const handleResetApp = () => {
    localStorage.clear();
    setNodes(INITIAL_NODES);
    setProjects(INITIAL_PROJECTS);
    setEvents(INITIAL_EVENTS);
    setRecords([]);
    setPermissions(INITIAL_PERMISSIONS);
    setLoops([]);
    setChatMessages([]);
  };

  // Express API communication for Gemini Chat
  const handleSendMessage = async (agentId: string, text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          agentId,
          history: chatMessages.slice(-8), // send last 8 messages for context
        }),
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSimulated: data.isSimulated,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: "Error de enlace con el orquestador cognitivo. Por favor, reintente en unos momentos.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0B] text-[#D1D1D1] selection:bg-gold-accent/30 selection:text-[#C5A059]">
      
      {/* Top Main Header */}
      <header className="border-b border-[#2A2A2E] bg-[#0C0C0E]/90 backdrop-blur-md sticky top-0 z-40 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            id="btn-sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 md:hidden text-[#888] hover:text-white rounded bg-[#121214] border border-[#2A2A2E]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-[#121214] rounded border border-[#2A2A2E] flex items-center justify-center glow-gold">
              <Compass className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-display font-semibold text-white text-lg uppercase tracking-wide">
                Pistón Parley
              </span>
              <span className="text-[10px] text-[#C5A059] font-mono block tracking-widest leading-none">
                INDUSTRIAL OS / SWARM v4.2
              </span>
            </div>
          </div>
        </div>

        {/* Global Telemetry Strip */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-[#121214] border border-[#2A2A2E] px-3 py-1.5 rounded">
            <span className="text-[#888]">CPU LOAD:</span>
            <span className="text-[#C5A059] font-bold">35.4%</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#121214] border border-[#2A2A2E] px-3 py-1.5 rounded">
            <span className="text-[#888]">CYCLES / SEC:</span>
            <span className="text-[#C5A059] font-bold">1,244 HZ</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#121214] border border-[#2A2A2E] px-3 py-1.5 rounded">
            <Clock className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-white font-bold">{currentTime}</span>
          </div>
        </div>

        {/* Header Badges */}
        <div className="flex items-center space-x-3">
          <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest hidden sm:inline">
            SYSTEM STANDBY
          </span>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Left Navigation Sidebar */}
        <aside
          className={`absolute md:static top-0 bottom-0 left-0 z-30 w-64 bg-[#0C0C0E] border-r border-[#2A2A2E] p-4 space-y-2 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="md:hidden flex justify-end pb-3">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-[#888] hover:text-white rounded bg-[#121214] border border-[#2A2A2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "network", label: "Jerarquía de Red", icon: <Network className="w-4 h-4" /> },
              { id: "analytics", label: "Analíticas de Core", icon: <Activity className="w-4 h-4" /> },
              { id: "orchestration", label: "Orquestador IA", icon: <Sparkles className="w-4 h-4" /> },
              { id: "projects", label: "Gestión Proyectos", icon: <Briefcase className="w-4 h-4" /> },
              { id: "recorder", label: "Grabador de Loops", icon: <Radio className="w-4 h-4" /> },
              { id: "chat", label: "Consultor de Agente", icon: <Bot className="w-4 h-4" /> },
              { id: "permissions", label: "Permisos Espacio", icon: <ShieldCheck className="w-4 h-4" /> },
              { id: "events", label: "Centro de Alertas", icon: <AlertOctagon className="w-4 h-4" /> },
              { id: "settings", label: "Configuración", icon: <Settings className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`tab-link-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded text-xs font-medium border transition ${
                  activeTab === tab.id
                    ? "bg-[#121214] text-[#C5A059] border-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.05)]"
                    : "bg-transparent text-[#888] border-transparent hover:bg-[#121214] hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Connected state snippet at sidebar bottom */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#121214] border border-[#2A2A2E] p-3.5 rounded text-center space-y-1.5">
            <div className="text-[10px] font-mono text-[#888]">MEMORIA RECEPTOR:</div>
            <div className="text-xs font-mono text-[#C5A059] font-bold">24,400 KB SECURE</div>
          </div>
        </aside>

        {/* Content View Stage */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#0A0A0B]">
          
          {/* Active component render */}
          {activeTab === "network" && (
            <NetworkHierarchy
              nodes={nodes}
              onToggleNodeStatus={handleToggleNodeStatus}
              onSimulateStress={handleSimulateStress}
            />
          )}

          {activeTab === "analytics" && <PerformanceAnalytics />}

          {activeTab === "orchestration" && <OrchestrationHub />}

          {activeTab === "projects" && (
            <ProjectManagement
              projects={projects}
              onAddProject={handleAddProject}
              onUpdateProgress={handleUpdateProgress}
            />
          )}

          {activeTab === "recorder" && (
            <ActionRecorder
              records={records}
              onAddRecord={handleAddRecord}
              onClearRecords={() => setRecords([])}
              onSaveAsLoop={handleSaveAsLoop}
            />
          )}

          {activeTab === "chat" && (
            <AgentChat
              agents={INITIAL_AGENTS}
              messages={chatMessages}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          )}

          {activeTab === "permissions" && (
            <WorkspacePermissions
              permissions={permissions}
              onTogglePermission={handleTogglePermission}
            />
          )}

          {activeTab === "events" && (
            <EventLogs events={events} onToggleResolveEvent={handleToggleResolveEvent} />
          )}

          {activeTab === "settings" && <SystemSettings onResetApp={handleResetApp} />}

        </main>
      </div>
    </div>
  );
}
