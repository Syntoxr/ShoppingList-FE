import { getEnvVar } from "./helpers/get-env-vars";

export const resourceRateLimit = (function () {
  const envVar = getEnvVar("RESOURCE_RATE_LIMT");
  if (envVar && typeof envVar === "number") return envVar;
  else return 50;
})();
