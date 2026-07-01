import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// System instructions for the different agents in Piston Parley
const AGENT_PERSONAS: Record<string, string> = {
  orion: `You are Orion-Core v9.1, the master industrial AI agent of the Pistón Parley platform. 
Your tone is highly technical, precise, objective, and authoritative. 
You specialize in system state diagnostic analysis, memory synchronization, and cluster orchestration. 
Use technical jargon such as "memory bus", "thread lock", "telemetry packets", "loop cycle latency", "piston pressure spikes". 
Keep responses under 150 words and structure with precise bullet points if diagnosing issues.`,

  architect: `You are the Systems Architect agent of Pistón Parley.
You specialize in designing resilient global network topologies, microservice architectures, and edge node routing.
Your tone is strategic, analytical, and professional. 
You focus on scalability, safety bounds, high-throughput message buses, and modular systems.`,

  programmer: `You are the Senior Programmer agent of Pistón Parley.
You specialize in real-time execution loops, event listeners, action recordings, and direct hardware API integration.
Your tone is pragmatic, slightly dry, and focused on clean, optimal code, thread safety, and execution profiling.`,

  orchestrator: `You are the Pistón Parley Intelligent Orchestrator.
Your role is to orchestrate and coordinate multiple subordinate agents (Orion-Core, Architect, Programmer).
You analyze user industrial automation requirements, suggest loop designs, manage permissions, and supervise workflow executions.
Your tone is professional, helpful, and executive.`
};

// API Endpoint for persona-based chatting
app.post("/api/chat", async (req, res) => {
  try {
    const { message, agentId = "orchestrator", history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "El mensaje es requerido." });
    }

    const client = getGeminiClient();
    const personaInstruction = AGENT_PERSONAS[agentId] || AGENT_PERSONAS.orchestrator;

    if (!client) {
      // Return a helpful fallback response if Gemini API Key is missing or default
      console.log("No Gemini API key configured. Using intelligent simulated agent response.");
      
      let simulatedResponse = "";
      if (agentId === "orion") {
        simulatedResponse = `[SIMULATED - Orion-Core v9.1]: Alerta de diagnóstico local activa. 
* Conexión remota: Sin llave API de Gemini (llave de simulación de respaldo en uso).
* Estado del sistema: Diagnóstico ejecutándose localmente. Piston pressure: 120 PSI.
* Mensaje recibido: "${message}".
Por favor, configura tu API Key de Gemini en el panel de Secretos para habilitar las respuestas neuronales reales.`;
      } else if (agentId === "architect") {
        simulatedResponse = `[SIMULATED - Systems Architect]: Red de topología activa localmente.
* Topología global: Enlace seguro local.
* Recomendación: El sistema está procesando "${message}" mediante heurísticas predefinidas. Configura la llave de Gemini para análisis avanzados.`;
      } else if (agentId === "programmer") {
        simulatedResponse = `[SIMULATED - Programador Senior]: Ejecución local de subrutinas.
* Latencia de loop: 4ms (Estable).
* Estado: Procesando directiva "${message}". Para compilación cognitiva avanzada, añade una llave de API.`;
      } else {
        simulatedResponse = `[SIMULATED - Intelligent Orchestrator]: ¡Bienvenido a Pistón Parley! 
Para disfrutar de la experiencia completa con procesamiento de lenguaje natural avanzado de Gemini (que potenciará las decisiones del orquestador), configura tu llave 'GEMINI_API_KEY' en el panel de Configuración de Secretos de AI Studio.
* Tu entrada fue: "${message}".`;
      }

      return res.json({ text: simulatedResponse, isSimulated: true });
    }

    // Prepare contents with chat history for conversational continuity
    const contents = [];
    
    // Add history in the format expected by generateContent (system instructions go into config)
    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }
    
    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: personaInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "No se pudo generar una respuesta.";
    return res.json({ text, isSimulated: false });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Error procesando la solicitud con Gemini.", 
      details: error.message 
    });
  }
});

// Serve static assets or mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pistón Parley server running on http://localhost:${PORT}`);
  });
}

startServer();
