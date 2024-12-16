export const getEnv = (
  EnvName: string,
) => {
  const env = process.env[EnvName];

  if (!env)
    throw new Error(
      `Env ${EnvName} not defined`,
    );

  return env;
};
