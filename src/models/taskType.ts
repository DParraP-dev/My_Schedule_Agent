/**
 * taskType.ts
 * -----------
 * El TIPO de un pendiente es la pieza más importante del dominio: determina
 * CÓMO se reparte su tiempo en sesiones a lo largo de los días.
 *
 * Esta es la idea central de la app: no todas las tareas se distribuyen igual.
 * Un proyecto se fragmenta en muchas sesiones; un hábito quiere consistencia
 * diaria; un examen intensifica cerca de la fecha.
 */

import type { Minutes } from './common';

/**
 * Los cuatro tipos de pendiente del MVP.
 *
 * APRENDIENDO TYPESCRIPT:
 *   Usamos una unión de literales en vez de un `enum`. Es más ligero, se
 *   serializa de forma natural a SQLite (se guarda el texto tal cual) y es la
 *   convención más común hoy en React Native/TypeScript.
 */
export type TaskType = 'Tarea' | 'Proyecto' | 'Examen' | 'Habito';

/**
 * Lista de todos los tipos, útil para recorrer en bucles o pintar selectores
 * en la UI. `as const` congela el array para que TypeScript infiera los
 * literales exactos y no un `string[]` genérico.
 */
export const TASK_TYPES = ['Tarea', 'Proyecto', 'Examen', 'Habito'] as const;

/**
 * Estrategia de cómo el motor debe repartir el tiempo de un tipo de tarea.
 *
 * Esto es CONFIGURABLE por el usuario desde ajustes: la idea es que, con el
 * uso, cada quien afine estos valores a su forma de trabajar. Aquí definimos
 * la "forma" de la estrategia; los valores por defecto están más abajo.
 */
export interface DistributionStrategy {
  /** Duración ideal de cada sesión de trabajo de este tipo. */
  readonly sessionTargetMinutes: Minutes;
  /** Duración mínima aceptable de una sesión (no fragmentar por debajo de esto). */
  readonly sessionMinMinutes: Minutes;
  /** Duración máxima de una sesión (por encima, el motor debe partir en varias). */
  readonly sessionMaxMinutes: Minutes;

  /**
   * ¿Cómo se colocan las sesiones respecto al deadline?
   *   - 'justo-antes': una o dos sesiones cerca pero antes de la fecha límite (Tarea).
   *   - 'repartido':   muchas sesiones distribuidas a lo largo del tiempo (Proyecto).
   *   - 'intensifica': sesiones que aumentan de frecuencia al acercarse la fecha (Examen).
   *   - 'diario':      bloques cortos y frecuentes, idealmente cada día (Habito).
   */
  readonly spread: 'justo-antes' | 'repartido' | 'intensifica' | 'diario';

  /**
   * ¿Prefiere repetir SIEMPRE en la misma franja horaria del día?
   * Clave para hábitos (consistencia) — por eso aquí será `true` en 'Habito'.
   */
  readonly consistentTimeOfDay: boolean;

  /**
   * Para estrategias 'diario': cuántos días a la semana como máximo.
   * Para el resto puede quedar en null (no aplica).
   */
  readonly maxDaysPerWeek: number | null;
}

/**
 * Valores POR DEFECTO de la estrategia de distribución de cada tipo.
 *
 * El usuario podrá sobrescribirlos desde la pantalla de configuración; esto es
 * solo el punto de partida razonable basado en el análisis del producto.
 *
 * APRENDIENDO TYPESCRIPT:
 *   `Record<TaskType, DistributionStrategy>` obliga a que el objeto tenga
 *   EXACTAMENTE una entrada por cada tipo. Si mañana añades un tipo nuevo a
 *   `TaskType`, el compilador te forzará a definir su estrategia aquí. Esa es
 *   la gran ventaja de los tipos: te avisa de lo que falta.
 */
export const DEFAULT_DISTRIBUTION: Record<TaskType, DistributionStrategy> = {
  // Tarea: 1-2 sesiones cortas, cerca pero antes del deadline.
  Tarea: {
    sessionTargetMinutes: 45,
    sessionMinMinutes: 25,
    sessionMaxMinutes: 90,
    spread: 'justo-antes',
    consistentTimeOfDay: false,
    maxDaysPerWeek: null,
  },
  // Proyecto: muchas sesiones medianas repartidas en varios días/semanas.
  Proyecto: {
    sessionTargetMinutes: 90,
    sessionMinMinutes: 45,
    sessionMaxMinutes: 120,
    spread: 'repartido',
    consistentTimeOfDay: false,
    maxDaysPerWeek: null,
  },
  // Examen: sesiones que intensifican acercándose a la fecha (repaso espaciado).
  Examen: {
    sessionTargetMinutes: 60,
    sessionMinMinutes: 30,
    sessionMaxMinutes: 120,
    spread: 'intensifica',
    consistentTimeOfDay: false,
    maxDaysPerWeek: null,
  },
  // Hábito: bloques cortos y diarios, a la misma hora para crear consistencia.
  Habito: {
    sessionTargetMinutes: 20,
    sessionMinMinutes: 10,
    sessionMaxMinutes: 30,
    spread: 'diario',
    consistentTimeOfDay: true,
    maxDaysPerWeek: 7,
  },
};
