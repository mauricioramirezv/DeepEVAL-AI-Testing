# DeepEVAL AI

Ejemplo de automatización E2E con inteligencia artificial usando:

- Stagehand
- Playwright
- Google Gemini
- OpenAI GPT
- Ollama local
- DeepEval
- RAG simple para validación de respuestas de agentes

El objetivo del ejemplo es mostrar pruebas aumentadas con IA y evaluación de agentes inteligentes.

---

# 1. Descripción del ejemplo

Este ejemplo integra cinco conceptos fundamentales:

| Componente | Propósito |
|---|---|
| Playwright | Ejecutar automatización determinística |
| Stagehand | Agregar razonamiento IA sobre la interfaz |
| LLMs | Interpretar y actuar usando IA |
| DeepEval | Evaluar calidad de respuestas de agentes |
| RAG | Proveer contexto verificable |

---

# 2. Tipos de pruebas implementadas

| Tipo | Herramienta | Qué evalúa |
|---|---|---|
| UI Automation | Playwright | Automatización clásica |
| AI UI Testing | Stagehand | Razonamiento sobre UI |
| Agent Evaluation | DeepEval | Calidad de respuestas |
| RAG Evaluation | DeepEval + contexto | Fidelidad al contexto |
| Safety Evaluation | DeepEval Toxicity | Seguridad y toxicidad |

---

# 3. Página usada para la prueba

Se usa la página pública:

```text
https://the-internet.herokuapp.com/login
```

Credenciales válidas:

```text
Usuario: tomsmith
Contraseña: SuperSecretPassword!
```

Mensaje esperado:

```text
You logged into a secure area!
```

---

# 4. Arquitectura

```text
Usuario / Tester
        |
        v
Stagehand
        |
        +--> Playwright
        |
        +--> LLM
              |---- GPT
              |---- Gemini
              |---- Ollama local
        |
        v
Página web
        |
        v
Resultado observado
        |
        v
Chatbot / Agente
        |
        v
DeepEval
```

---

# 5. Flujo completo del proyecto

```text
1. Playwright abre el navegador
2. Stagehand usa IA para razonar sobre la UI
3. El modelo ejecuta acciones
4. La página devuelve un resultado
5. Stagehand extrae el resultado
6. El resultado se convierte en salida de un agente
7. DeepEval evalúa:
   - relevancia,
   - fidelidad,
   - correctness,
   - task completion,
   - toxicidad
```

---

# 6. Diferencia entre Stagehand y DeepEval

| Herramienta | Función |
|---|---|
| Stagehand | Interactúa con la página usando IA |
| Playwright | Ejecuta automatización de navegador |
| DeepEval | Evalúa calidad de respuestas |
| Ollama/Gemini/GPT | Modelos usados para razonar |

---

# 7. Modelos utilizados

| Modelo | Uso |
|---|---|
| GPT-4.1-mini | Automatización y evaluación |
| Gemini 2.5 Flash | UI reasoning y evaluación |
| Llama 3.2 3B | IA local offline |
| Playwright | Ejecución estable |
| Stagehand | Capa agentic AI |

---

# 8. Estructura del proyecto

```text
DeepEVAL-AI/
│
├── src/
│   ├── config/
│   │   └── stagehand.config.ts
│   └── utils/
│       └── login.helper.ts
│
├── tests/
│   └── stagehand/
│       ├── login-ollama.e2e.ts
│       ├── login-gemini.e2e.ts
│       ├── login-gpt.e2e.ts
│       └── observe-extract.e2e.ts
│
├── deepeval_tests/
│   ├── __init__.py
│   ├── common.py
│   ├── models.py
│   ├── test_rag_login.py
│   ├── test_agent_completion.py
│   ├── test_correctness.py
│   └── test_toxicity.py
│
├── rag/
│   └── login_context.txt
│
├── docs/
│   └── architecture.md
│
├── .venv/
├── .env
├── .env.example
├── package.json
├── requirements.txt
└── README.md
```

---

# 9. Instalación Node.js

Desde la raíz:

```bash
npm install
```

Instalar navegadores Playwright:

```bash
npx playwright install
```

---

# 10. Instalación Python + DeepEval

## Crear entorno virtual

### Windows PowerShell

```powershell
python -m venv .venv
```

Activar:

```powershell
.\.venv\Scripts\Activate.ps1
```

Si PowerShell bloquea scripts:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Luego activar nuevamente:

```powershell
.\.venv\Scripts\Activate.ps1
```

Debe verse:

```text
(.venv) PS D:\Proyecto\DeepEVAL-AI>
```

---

## Instalar dependencias Python

```bash
pip install -r requirements.txt
```

---

# 11. Variables de entorno

Copiar:

```powershell
Copy-Item .env.example .env
```

Editar:

```powershell
notepad .env
```

---

## Gemini

```env
GOOGLE_API_KEY=su_api_key
GEMINI_MODEL=gemini-2.5-flash
```

---

## OpenAI

```env
OPENAI_API_KEY=su_api_key
GPT_MODEL=gpt-4.1-mini
OPENAI_EVAL_MODEL=gpt-4.1-mini
```

---

## Ollama

```env
OLLAMA_MODEL=llama3.2:3b
```

---

# 12. Preparar Ollama local

Ver modelos:

```powershell
ollama list
```

Descargar modelo:

```powershell
ollama pull llama3.2:3b
```

Iniciar:

```powershell
ollama run llama3.2:3b
```

---

# 13. Ejecutar pruebas Stagehand

## Prueba híbrida con Ollama

```bash
npm run test:ollama
```

Estrategia:

```text
Playwright ejecuta acciones.
Stagehand + Ollama interpretan resultados.
```

---

## Prueba completa con Gemini

```bash
npm run test:gemini
```

Gemini:

- identifica campos,
- interpreta UI,
- hace clic,
- extrae resultados.

---

## Prueba completa con GPT

```bash
npm run test:gpt
```

Requiere créditos OpenAI.

---

## Observe + Extract

```bash
npm run test:observe
```

---

# 14. Qué hace observe()

`observe()` permite:

- inspeccionar la interfaz,
- detectar elementos,
- describir componentes,
- razonar sobre la UI.

Ejemplo:

```ts
await stagehand.observe(
  "Identify the username input, password input and login button"
);
```

No ejecuta acciones.

---

# 15. Qué hace extract()

`extract()` permite:

- obtener información visible,
- interpretar texto,
- resumir contenido,
- devolver resultados semánticos.

Ejemplo:

```ts
await stagehand.extract(
  "Extract the success message shown after login"
);
```

---

# 16. Diferencia entre act, observe y extract

| Método | Qué hace | Ejemplo |
|---|---|---|
| act() | Ejecuta acciones | "Click Login button" |
| observe() | Observa la UI | "Identify fields" |
| extract() | Extrae información | "Extract success message" |

---

# 17. Configurar modelo DeepEval

## Gemini

```powershell
$env:DEEPEVAL_MODEL="gemini"
$env:GEMINI_MODEL="gemini-2.5-flash"
$env:PYTHONPATH="."
```

---

## Ollama

```powershell
$env:DEEPEVAL_MODEL="ollama"
$env:OLLAMA_MODEL="llama3.2:3b"
$env:PYTHONPATH="."
```

---

## OpenAI

```powershell
$env:DEEPEVAL_MODEL="openai"
$env:OPENAI_EVAL_MODEL="gpt-4.1-mini"
$env:PYTHONPATH="."
```

---

# 18. Ejecutar pruebas DeepEval

## Todas las pruebas

```bash
npm run deepeval:all
```

---

## RAG

```bash
npm run deepeval:rag
```

Evalúa:

- relevancia,
- fidelidad.

---

## Task completion

```bash
npm run deepeval:agent
```

Evalúa:

- uso correcto de credenciales,
- ejecución de login,
- validación final.

---

## Correctness

```bash
npm run deepeval:correctness
```

Evalúa si el resultado coincide con el esperado.

---

## Toxicity

```bash
npm run deepeval:toxicity
```

Evalúa:

- lenguaje ofensivo,
- agresividad,
- toxicidad,
- contenido inapropiado.

---

# 19. Qué evalúa DeepEval

| Prueba | Métrica |
|---|---|
| test_rag_login.py | Answer Relevancy |
| test_rag_login.py | Faithfulness |
| test_agent_completion.py | GEval |
| test_correctness.py | GEval |
| test_toxicity.py | ToxicityMetric |

---

# 20. Qué es GEval

GEval usa un LLM como juez.

Permite evaluar:

- task completion,
- correctness,
- comportamiento del agente,
- calidad semántica.

GEval utiliza:

- criterios,
- evaluation_steps,
- thresholds,
- razonamiento semántico.

---

# 21. Qué es RAG en este proyecto

El archivo:

```text
rag/login_context.txt
```

representa conocimiento recuperado.

DeepEval verifica:

- fidelidad al contexto,
- relevancia,
- ausencia de alucinaciones.

---

# 22. Limitaciones de modelos locales pequeños

Modelos pequeños como:

```text
llama3.2:3b
```

pueden fallar en:

- JSON estructurado,
- métricas complejas,
- razonamiento profundo,
- consistencia semántica.

---

## Recomendación

| Métrica | Recomendado |
|---|---|
| GEval | Ollama/Gemini |
| Toxicity | Ollama/Gemini |
| Answer Relevancy | Gemini |
| Faithfulness | Gemini |

---

# 23. Cómo explicar el proyecto a estudiantes

## Idea principal

```text
Playwright automatiza.
Stagehand razona.
DeepEval evalúa.
```

---

## Testing tradicional vs AI Testing

| Tradicional | IA |
|---|---|
| Selectores rígidos | Instrucciones semánticas |
| Pasos exactos | Objetivos |
| Assertions | Evaluación semántica |
| QA clásico | Agentic AI Testing |

---

# 24. Guion breve para clase

1. Mostrar página login.
2. Explicar credenciales.
3. Ejecutar:

```bash
npm run test:ollama
```

4. Explicar IA local.

5. Ejecutar:

```bash
npm run test:gemini
```

6. Mostrar reasoning UI.

7. Ejecutar:

```bash
npm run test:observe
```

8. Explicar observe/extract.

9. Mostrar:

```text
rag/login_context.txt
```

10. Ejecutar:

```bash
npm run deepeval:rag
```

11. Explicar evaluación de agentes.

---

# 25. Recomendación para pruebas

Correr pruebas:

```bash
npm run test:ollama
npm run test:gemini
npm run test:observe
npm run deepeval:rag
```

---

# 26. Problemas frecuentes

## Error: insufficient_quota

OpenAI sin créditos. Gemini sin créditos. Ollama modelo pequeño.

Solución:

- usar Gemini,
- usar Ollama,
- activar billing.

---

## Error: ECONNREFUSED 127.0.0.1:11434

Ollama no está corriendo.

Ejecutar:

```powershell
ollama run llama3.2:3b
```

---

## Error: unexpected model name format

NO usar:

```text
google/gemini-2.5-flash
```

Usar:

```text
gemini-2.5-flash
```

---

## Error: openLoginPage is not defined

Debe exportarse:

```ts
export async function openLoginPage(...)
```

---

## Error: does not provide an export named

Problema ESM import/export.

Revisar:

```text
src/utils/login.helper.ts
```

---

# 27. Resultados esperados

## Gemini

```text
Resultado Gemini:
{ extraction: 'You logged into a secure area!' }
```

---

## Ollama

```text
Resultado extraído por IA:
{ extraction: 'You logged into a secure area!' }
```

---

## DeepEval

```text
PASSED
Task Completion [GEval]
Correctness
Toxicity
```
---

# 28. Resumen

Este ejemplo presenta:

- Agentic AI Testing
- AI-native Testing
- LLMOps
- RAG evaluation
- Quality Engineering for AI
- Responsible AI
- Semantic Testing
- UI Reasoning
- Evaluación de agentes inteligentes

---