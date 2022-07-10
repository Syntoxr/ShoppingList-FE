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
