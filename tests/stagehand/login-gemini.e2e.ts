import { runLoginScenario } from "./login.scenario";

runLoginScenario({ provider: "gemini", interaction: "agent" }).catch((error) => {
  console.error("La prueba con Gemini falló:", error);
  process.exitCode = 1;
});
