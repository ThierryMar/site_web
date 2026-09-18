import * as migration_20260913_160320_initial from './20260913_160320_initial';
import * as migration_20260914_173953_marketing_courses from './20260914_173953_marketing_courses';

export const migrations = [
  {
    up: migration_20260913_160320_initial.up,
    down: migration_20260913_160320_initial.down,
    name: '20260913_160320_initial',
  },
  {
    up: migration_20260914_173953_marketing_courses.up,
    down: migration_20260914_173953_marketing_courses.down,
    name: '20260914_173953_marketing_courses'
  },
];
