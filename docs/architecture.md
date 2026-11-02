# Arquitectura del proyecto DeepEVAL AI

```text
Tester
  |
  v
Stagehand v4 + navegador local (CDP)
  |-- Google Gemini 3.8 Flash
  |-- OpenAI GPT-6 Astra
  |-- Ollama Qwen 3.5 4B mediante callback compatible con JSON Schema
  |
  v
Login de demostración + comprobación determinística del mensaje
  |
  v
artifacts/login-result.json (evidencia generada por la ejecución)
  |
  +--> DeepEval 4.3.2 o superior evalúa la evidencia real
         |-- Answer Relevancy
         |-- Faithfulness sobre contexto estático de ejemplo
         |-- TaskCompletionMetric para el resultado del agente
         |-- ExactMatchMetric para el mensaje literal
         |-- Toxicity

El archivo RAG es contexto de referencia estático; el proyecto no implementa
un recuperador ni un chatbot de producción.
```
