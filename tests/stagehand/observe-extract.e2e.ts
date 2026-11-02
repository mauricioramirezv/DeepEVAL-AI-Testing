import { runLoginScenario } from "./login.scenario";

runLoginScenario({
  provider: "gemini",
  interaction: "agent",
  observeFirst: true,
}).catch((error) => {
  console.error("La prueba observe/extract falló:", error);
  process.exitCode = 1;
});
