# DeepEVAL AI

Ejemplos de automatización web con Stagehand y evaluación de los resultados reales con DeepEval.

El proyecto recorre un login público de demostración, guarda lo que realmente mostró la página y evalúa esa evidencia. Sirve como punto de partida para ejemplos de automatización y evaluación; no es una aplicación de producción.

## Qué contiene

El proyecto usa la página pública de demostración [the-internet.herokuapp.com/login](https://the-internet.herokuapp.com/login) y muestra tres enfoques:

- **Stagehand v4** abre un navegador Chromium local con CDP y ofrece `act()`, `observe()` y `extract()`.
- **Gemini 3.8 Flash** y **GPT-6 Astra** realizan las interacciones guiadas por modelo.
- **Ollama con Qwen 3.5 4B** extrae el resultado; el llenado y envío del formulario usan selectores determinísticos.
- **DeepEval 4.3.2 o superior** evalúa la evidencia guardada por la ejecución E2E.
- **RAG** se representa con un archivo de contexto estático; el repositorio no implementa un recuperador ni un chatbot de producción.

La página usa credenciales públicas de prueba: usuario `tomsmith`, contraseña `SuperSecretPassword!`. El criterio de éxito es que el banner contenga `You logged into a secure area!`.

## Flujo de ejecución

1. Configura un proveedor de Stagehand y sus dependencias.
2. Ejecuta un escenario de login; Stagehand valida el banner y guarda la evidencia.
3. Ejecuta DeepEval sobre ese archivo para medir la finalización, las respuestas RAG, la toxicidad y la coincidencia exacta.

La ruta del artefacto es `artifacts/login-result.json`. Cada ejecución lo reemplaza y Git lo ignora.

## Versiones y modelos

El proyecto fija el rango mayor de Stagehand en `^4.3.0` y DeepEval en `>=4.3.2,<5`. Las dependencias Node quedan fijadas por `package-lock.json`.

| Uso | Modelo por defecto | Identificador |
|---|---|---|
| Stagehand con Google | Gemini 3.8 Flash | `google/gemini-3.8-flash` |
| Stagehand con OpenAI | GPT-6 Astra | `openai/gpt-6-astra` |
| Stagehand local | Qwen 3.5 4B en Ollama | `qwen3.5:4b` |
| Juez DeepEval Google | Gemini 3.8 Flash | `gemini-3.8-flash` |
| Juez DeepEval OpenAI general | GPT-5.4 | `gpt-5.4` |

Stagehand v4 no ofrece Ollama como proveedor nativo: el ejemplo local usa el callback de generación de Stagehand y la API estructurada de Ollama. DeepEval usa sus clases de proveedor `GeminiModel`, `OpenAIModel` y `OllamaModel`.

## Requisitos

- Node.js 22.18 o posterior.
- Python y un entorno virtual.
- Google Chrome o Chromium instalado para los ejemplos locales de Stagehand.
- Una clave de Google o OpenAI para ejecutar esos proveedores.
- Ollama instalado y en ejecución si se usa el ejemplo local.

Stagehand v4 ya no usa el flujo Playwright de Stagehand v3. En estos ejemplos no se instala Playwright: Stagehand administra el navegador local con su API v4.

## Instalación

Instala dependencias Node desde la raíz:

```powershell
npm ci
```

Crea y activa el entorno Python en Windows:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copia la plantilla de variables:

```powershell
Copy-Item .env.example .env
```

Completa las claves del proveedor que vayas a usar. Para Gemini, configura la misma clave en `GOOGLE_GENERATIVE_AI_API_KEY` (Stagehand) y `GOOGLE_API_KEY` (DeepEval). Para OpenAI, configura `OPENAI_API_KEY`.

La plantilla `.env.example` usa valores de ejemplo: reemplaza los marcadores por tus claves antes de ejecutar Gemini u OpenAI. El archivo `.env` local está excluido de Git.

Para Ollama:

```powershell
ollama pull qwen3.5:4b
ollama serve
```

Si Ollama ya se inicia como servicio, basta con comprobar que escucha en `http://127.0.0.1:11434`.

Activa `.venv` en la misma terminal desde la que ejecutarás las evaluaciones para que `npm` encuentre el comando `deepeval`.

## Ejecutar ejemplos Stagehand

Cada ejecución valida el banner en el navegador y escribe la evidencia en `artifacts/login-result.json`. El archivo se reemplaza con el resultado de la ejecución más reciente y está excluido de Git.

```powershell
npm run test:gemini
npm run test:gpt
npm run test:ollama
npm run test:observe
```

- `test:gemini`: Gemini llena el formulario, envía el login y extrae el mensaje.
- `test:gpt`: realiza el mismo flujo con GPT-6 Astra.
- `test:ollama`: selectores estables llenan y envían el formulario; el modelo configurado en Ollama extrae el mensaje.
- `test:observe`: Gemini primero inspecciona los controles y luego ejecuta y extrae el resultado.

El navegador se ejecuta en segundo plano por defecto (`HEADLESS=true`). Configura `HEADLESS=false` en `.env` para verlo.

## Ejecutar evaluaciones DeepEval

Primero ejecuta uno de los ejemplos Stagehand para generar la evidencia. Después, usa:

```powershell
npm run deepeval:all
```

También puedes ejecutar cada evaluación por separado:

```powershell
npm run deepeval:rag
npm run deepeval:agent
npm run deepeval:correctness
npm run deepeval:toxicity
```

Selecciona el modelo juez de DeepEval con `EVAL_PROVIDER`:

- `gemini` (por defecto), con `GEMINI_EVAL_MODEL`.
- `openai`, con `OPENAI_EVAL_MODEL`.
- `ollama`, con `OLLAMA_MODEL` y `OLLAMA_BASE_URL`.

Para ejecutar toda la suite sin claves cloud, inicia Ollama, instala el modelo indicado en `.env` y selecciona el proveedor local en PowerShell:

```powershell
$env:EVAL_PROVIDER = "ollama"
npm run deepeval:all
```

En macOS o Linux, activa el entorno con `source .venv/bin/activate` y selecciona el proveedor con `export EVAL_PROVIDER=ollama`.

La evaluación `agent` usa `TaskCompletionMetric` y sigue `EVAL_PROVIDER`. La prueba `correctness` usa `ExactMatchMetric`, porque el banner admite una sola respuesta exacta y no necesita un juez LLM.

Las métricas consumen el mensaje observado y la salida guardada por Stagehand; ya no usan una respuesta de éxito inventada dentro de cada prueba.

| Archivo | Evaluación |
|---|---|
| `test_rag_login.py` | Relevancia de respuesta y fidelidad al contexto |
| `test_agent_completion.py` | TaskCompletionMetric del resultado de la tarea |
| `test_correctness.py` | ExactMatchMetric del mensaje frente al resultado esperado |
| `test_toxicity.py` | Toxicidad de la salida observada |

## Configuración de modelos

Los modelos Stagehand usan el formato `proveedor/modelo`; las variables Python de DeepEval usan el identificador del modelo sin prefijo. Los valores se centralizan en `.env.example` y pueden cambiarse desde `.env`.

El ejemplo local de Ollama espera respuestas JSON conforme al esquema que pide Stagehand. Si el modelo configurado no admite generación estructurada, la ejecución fallará claramente en vez de registrar evidencia incorrecta.

## Límites del ejemplo

- El sitio de login es una página pública de demostración, no una aplicación propia.
- `rag/login_context.txt` es contexto estático: no hay pipeline de recuperación real.
- El flujo guarda la salida de la interfaz y la evalúa; no conserva una traza completa de acciones/herramientas del agente.
- Los resultados de métricas LLM-as-a-Judge pueden variar entre ejecuciones. La comprobación del mensaje exacto de login es determinística y ocurre antes de guardar evidencia.
