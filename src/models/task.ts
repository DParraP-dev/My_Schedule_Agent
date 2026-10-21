/**
 * task.ts
 * -------
 * El "pendiente" (Tarea/Proyecto/Examen/Hábito) tal como lo crea el usuario en
 * el formulario. Representa un COMPROMISO DE TIEMPO: "necesito dedicar X minutos
 * a esto antes de tal fecha". El motor decide luego CUÁNDO cumplirlo.
 */

import type {
  ISODateTime,
  Minutes,
  Priority,
  TaskId,
} from './common';
import type { TaskType } from './taskType';
import type { PomodoroConfig } from './pomodoro';

/**
 * Estado de un pendiente a lo largo de su vida.
 *   - 'pendiente':  creado, aún con trabajo por hacer.
 *   - 'en-curso':   ya tiene sesiones y se ha trabajado algo, pero no está completo.
 *   - 'completado': se cumplió el tiempo objetivo (o el usuario lo cerró).
 *   - 'archivado':  el usuario lo descartó sin completar.
 */
export type TaskStatus = 'pendiente' | 'en-curso' | 'completado' | 'archivado';

/**
 * Un pendiente creado por el usuario.
 *
 * APRENDIENDO TYPESCRIPT:
 *   `readonly` marca campos que no deberían mutarse una vez creado el objeto.
 *   En TypeScript esto es una protección en tiempo de COMPILACIÓN (te avisa si
 *   intentas reasignarlos); no congela el objeto en ejecución. Para cambiar el
 *   estado, lo normal será crear un objeto nuevo con los cambios.
 */
export interface Task {
  readonly id: TaskId;

  /** Título corto que ve el usuario (p. ej. "Entregar ensayo de Historia"). */
  title: string;

  /** Descripción opcional con detalles o notas. */
  description?: string;

  /** Tipo, que define la estrategia de distribución del tiempo. */
  type: TaskType;

  /** Prioridad para el ordenamiento del motor. */
  priority: Priority;

  /**
   * Tiempo ESTIMADO total que el usuario cree que necesita dedicar.
   * Esta es la "deuda inicial" que el motor debe repartir en sesiones.
   */
  estimatedMinutes: Minutes;

  /**
   * Fecha límite. Para 'Examen' es la fecha del examen; para 'Habito' puede ser
   * la fecha hasta la que se quiere mantener el hábito (o null si es indefinido).
   */
  deadline: ISODateTime | null;

  /**
   * Sobrescritura opcional de la config Pomodoro para esta tarea concreta.
   * Si está ausente, se usa la config por defecto del tipo (ver pomodoro.ts).
   */
  pomodoroOverride?: Partial<PomodoroConfig>;

  status: TaskStatus;

  readonly createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/**
 * Datos que llegan desde el FORMULARIO de creación (aún sin id ni timestamps,
 * que los pone la capa de datos).
 *
 * APRENDIENDO TYPESCRIPT:
 *   `Omit<Task, ...>` construye un tipo "Task pero sin estos campos". Así no
 *   repetimos la definición y, si Task cambia, este tipo se actualiza solo.
 */
export type NewTaskInput = Omit<
  Task,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;
