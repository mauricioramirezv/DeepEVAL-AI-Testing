import { runLoginScenario } from "./login.scenario";
runLoginScenario({ provider: "openai", interaction: "agent" }).catch((error) => {
  console.error("La prueba con OpenAI falló:", error);
  process.exitCode = 1;
});
