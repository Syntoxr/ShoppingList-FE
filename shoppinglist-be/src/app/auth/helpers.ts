import { User } from "./types";

export function getEnvVar(key: string) {
  const envVar = process.env[key];
  if (!envVar) {
    console.warn(`Environment variable ${key} not set!`);
    return null;
  }

  //try parsing envvar to JSON
  try {
    return JSON.parse(envVar);
  } catch {
    return envVar;
  }
}

export function isUserList(payload: unknown): payload is User[] {
  let allUsersValid = true;
  if (Array.isArray(payload)) {
    payload.forEach((item) => {
      if (isUser(item)) {
        return;
      } else {
        allUsersValid = false;
      }
    });
    return allUsersValid;
  } else return false;
}

function isUser(payload: unknown): payload is User {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "name" in payload &&
    "password" in payload
  );
}
