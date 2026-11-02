import {
  OLLAMA_BASE_URL,
  MODELS,
} from "../../src/config/stagehand.config";

type TextBlock = { type: "text"; text: string };
type ImageBlock = { type: "image"; data: string; mimeType: string };
type MessageContent = TextBlock | ImageBlock | Array<TextBlock | ImageBlock>;

interface GenerateParams {
  messages: Array<{ role: "user" | "assistant"; content: MessageContent }>;
  systemPrompt?: string;
  temperature?: number;
  responseFormat?:
    | { type: "text" }
    | { type: "json_schema"; name: string; schema: unknown };
}

interface OllamaChatResponse {
  message?: { content?: string };
  error?: string;
}

function getText(content: MessageContent): string {
  const blocks = Array.isArray(content) ? content : [content];
  const images = blocks.filter((block) => block.type === "image");
  if (images.length) {
    throw new Error("El ejemplo Ollama procesa páginas web solo con texto.");
  }
  return blocks.map((block) => block.type === "text" ? block.text : "").join("\n");
}

export function createOllamaGenerate() {
  return async (params: GenerateParams) => {
    if (params.responseFormat?.type !== "json_schema") {
      throw new Error("Stagehand solicitó una respuesta sin esquema JSON.");
    }

    const messages = [
      ...(params.systemPrompt
        ? [{ role: "system", content: params.systemPrompt }]
        : []),
      ...params.messages.map(({ role, content }) => ({ role, content: getText(content) })),
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODELS.ollama,
        messages,
        format: params.responseFormat.schema,
        stream: false,
        options: { temperature: 0 },
      }),
    });

    const payload = await response.json() as OllamaChatResponse;
    if (!response.ok) {
      throw new Error(payload.error || `Ollama respondió HTTP ${response.status}.`);
    }

    const text = payload.message?.content;
    if (!text) throw new Error("Ollama devolvió una respuesta vacía.");

    return {
      role: "assistant" as const,
      content: { type: "text" as const, text },
      outputFormat: "json_schema" as const,
      structuredContent: JSON.parse(text) as Record<string, unknown>,
    };
  };
}
