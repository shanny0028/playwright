export function resolveAppEnv(env: NodeJS.ProcessEnv) {
  const appEnv = env.ENV || 'tst';
  const baseUrl = env[`BASE_URL_${appEnv}`] ?? env.BASE_URL ?? 'https://example.com';
  return { appEnv, baseUrl };
}
