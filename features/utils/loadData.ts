import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * CONFIG - Static environment config loaded from file
 */
const rawConfig = JSON.parse(readFileSync(resolve(__dirname, '../data/config.json'), 'utf-8'));

const env = process.env.ENV || 'tst';

if (!rawConfig[env]) {
  throw new Error(`Config for environment '${env}' not found`);
}

export const config = {
  ...rawConfig.common,
  ...rawConfig[env],
};
