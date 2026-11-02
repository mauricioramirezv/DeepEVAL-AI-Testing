import { runLoginScenario } from "./login.scenario";

runLoginScenario({ provider: "ollama", interaction: "deterministic" }).catch((error) => {
  console.error("La prueba local con Ollama falló:", error);
  process.exitCode = 1;
});
