import * as migration_20260913_160320_initial from './20260913_160320_initial';
import * as migration_20260914_173953_marketing_courses from './20260914_173953_marketing_courses';
import * as migration_20260918_161055_mcp_api_keys from './20260918_161055_mcp_api_keys';
import * as migration_20260928_180411_email_verification from './20260928_180411_email_verification';

export const migrations = [
  {
    up: migration_20260913_160320_initial.up,
    down: migration_20260913_160320_initial.down,
    name: '20260913_160320_initial',
  },
  {
    up: migration_20260914_173953_marketing_courses.up,
    down: migration_20260914_173953_marketing_courses.down,
    name: '20260914_173953_marketing_courses',
  },
  {
    up: migration_20260918_161055_mcp_api_keys.up,
    down: migration_20260918_161055_mcp_api_keys.down,
    name: '20260918_161055_mcp_api_keys',
  },
  {
    up: migration_20260928_180411_email_verification.up,
    down: migration_20260928_180411_email_verification.down,
    name: '20260928_180411_email_verification'
  },
];
