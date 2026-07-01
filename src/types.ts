export enum SystemStatus {
  ONLINE = "ONLINE",
  MAINTENANCE = "MAINTENANCE",
  OFFLINE = "OFFLINE",
  DEGRADED = "DEGRADED",
}

export enum LogSeverity {
  FATAL = "FATAL",
  WARNING = "WARNING",
  INFO = "INFO",
  TRACE = "TRACE",
}

export interface NetworkNode {
  id: string;
  name: string;
  type: "root" | "gateway" | "edge" | "sensor" | "actuator";
  status: SystemStatus;
  latency: number; // in ms
  memoryUsage: number; // in %
  cpuUsage: number; // in %
  parentId?: string;
  children?: NetworkNode[];
}

export interface Project {
  id: string;
  name: string;
  status: "ACTIVE" | "COMPLETED" | "PENDING";
  assignedAgent: string;
  progress: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  lastActive: string;
  description: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  source: string;
  message: string;
  resolved: boolean;
}

export interface LoopAutomation {
  id: string;
  name: string;
  targetNode: string;
  frequency: string; // e.g., "500ms", "5s"
  isActive: boolean;
  actionsCount: number;
  lastExecuted: string;
}

export interface ActionRecord {
  id: string;
  timestamp: string;
  actionType: "CLICK" | "INPUT" | "API_CALL" | "STATE_CHANGE";
  target: string;
  value: string;
}

export interface PermissionRule {
  id: string;
  role: string;
  scope: string; // e.g., "orion.core.read", "piston.fire"
  granted: boolean;
  lastModified: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  status: "IDLE" | "PROCESSING" | "OFFLINE";
  accuracy: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isSimulated?: boolean;
}
