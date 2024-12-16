export const getEnv = (EnvName: string): string => {
  const env = process.env[EnvName];

  if (!env) throw new Error(`Env ${EnvName} not defined`);

  return env;
};
