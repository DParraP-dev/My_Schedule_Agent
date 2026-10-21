/**
 * pomodoro.ts
 * -----------
 * Configuración del temporizador Pomodoro.
 *
 * Idea de producto: cada TIPO de tarea tiene su propia configuración Pomodoro
 * preferida (p. ej. los proyectos usan 50/10 para concentración profunda; los
 * hábitos, 15 min sin descanso). El usuario edita estos valores desde ajustes.
 * Además, una tarea concreta puede SOBRESCRIBIR la config de su tipo.
 *
 * Importante: el Pomodoro no es solo un cronómetro. Es el mecanismo que mide
 * cuánto se trabajó DE VERDAD, cerrando el ciclo "planeado vs. real".
 */

import type { Minutes, TaskId } from './common';
import type { TaskType } from './taskType';

/**
 * Parámetros de un ciclo Pomodoro.
 */
export interface PomodoroConfig {
  /** Minutos de trabajo intensivo por bloque (p. ej. 25). */
  readonly workMinutes: Minutes;
  /** Minutos de descanso corto entre bloques (p. ej. 5). 0 = sin descanso. */
  readonly breakMinutes: Minutes;
  /** Cuántos bloques de trabajo antes de un descanso largo. */
  readonly cyclesBeforeLongBreak: number;
  /** Minutos del descanso largo tras completar los ciclos. 0 = sin descanso largo. */
  readonly longBreakMinutes: Minutes;
}

/**
 * Configuración Pomodoro POR DEFECTO de cada tipo de tarea.
 *
 * Como en la distribución, `Record<TaskType, ...>` garantiza que haya una
 * entrada por cada tipo: si añades un tipo, el compilador te obliga a definirla.
 */
export const DEFAULT_POMODORO: Record<TaskType, PomodoroConfig> = {
  // Tarea: Pomodoro clásico 25/5.
  Tarea: {
    workMinutes: 25,
    breakMinutes: 5,
    cyclesBeforeLongBreak: 4,
    longBreakMinutes: 15,
  },
  // Proyecto: bloques largos de concentración profunda 50/10.
  Proyecto: {
    workMinutes: 50,
    breakMinutes: 10,
    cyclesBeforeLongBreak: 3,
    longBreakMinutes: 20,
  },
  // Examen: clásico 25/5.
  Examen: {
    workMinutes: 25,
    breakMinutes: 5,
    cyclesBeforeLongBreak: 4,
    longBreakMinutes: 15,
  },
  // Hábito: un solo bloque corto, sin descansos.
  Habito: {
    workMinutes: 15,
    breakMinutes: 0,
    cyclesBeforeLongBreak: 1,
    longBreakMinutes: 0,
  },
};

/**
 * Sobrescritura de Pomodoro para UNA tarea concreta.
 *
 * APRENDIENDO TYPESCRIPT:
 *   `Partial<PomodoroConfig>` crea un tipo donde TODOS los campos son
 *   opcionales. Así una tarea puede redefinir solo lo que quiera (p. ej. solo
 *   `workMinutes`) y heredar el resto de la config de su tipo. La función
 *   `resolvePomodoro` de abajo fusiona ambas capas.
 */
export interface PomodoroOverride {
  readonly taskId: TaskId;
  readonly config: Partial<PomodoroConfig>;
}

/**
 * Resuelve la configuración Pomodoro efectiva de una tarea aplicando la
 * jerarquía: valores del tipo (base) + sobrescritura individual (si existe).
 *
 * @param typeConfig Config por defecto del tipo de la tarea.
 * @param override   Sobrescritura opcional de la tarea concreta.
 * @returns La configuración final que usará el temporizador.
 */
export function resolvePomodoro(
  typeConfig: PomodoroConfig,
  override?: Partial<PomodoroConfig>,
): PomodoroConfig {
  // El spread (...) copia el base y luego pisa solo los campos presentes en override.
  return { ...typeConfig, ...(override ?? {}) };
}
