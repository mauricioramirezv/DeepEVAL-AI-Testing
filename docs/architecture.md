# Arquitectura del proyecto DeepEVAL AI

```text
Tester / Estudiante
        |
        v
Stagehand
        |
        +--> Playwright controla el navegador
        |
        +--> Modelo LLM razona sobre la interfaz
              |        |        |
              v        v        v
            GPT     Gemini    Ollama local

Resultado de la acción E2E
        |
        v
Chatbot / Agente interpreta la ejecución
        |
        v
RAG aporta contexto esperado
        |
        v
DeepEval evalúa:
- relevancia
- fidelidad al contexto
- toxicidad
- cumplimiento de tarea
- corrección de la interpretación
```
