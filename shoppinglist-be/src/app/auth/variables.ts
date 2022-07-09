import { getEnvVar, isUserList } from "./helpers";

export const envUsers = (function () {
  let envVar = getEnvVar("USERS");
  if (isUserList(envVar)) return envVar;
  else return [];
})();

export const tokenSecret = (function () {
  let envVar = getEnvVar("TOKEN_SECRET");
  if (envVar && typeof envVar === "string") return envVar;
  else return (Date.now() * Math.random()).toString();
})();

export const tokenLifetime = (function () {
  let envVar = getEnvVar("TOKEN_LIFETIME");
  if (envVar && typeof envVar === "number") return envVar;
  else return 3600;
})();
