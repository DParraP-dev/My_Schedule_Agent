/**
 * index.ts (modelos)
 * ------------------
 * Punto único de entrada para importar los modelos del dominio.
 *
 * En lugar de:   import { Task } from '../models/task';
 * puedes hacer:  import { Task } from '@/models';
 *
 * APRENDIENDO TYPESCRIPT:
 *   `export * from './x'` reexporta todo lo público de ese módulo. Así este
 *   archivo actúa como "fachada" (barrel file) de toda la carpeta de modelos.
 */

export * from './common';
export * from './taskType';
export * from './pomodoro';
export * from './task';
export * from './session';
export * from './scheduleProfile';
export * from './timeDebt';
