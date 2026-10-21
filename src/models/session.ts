/**
 * session.ts
 * ----------
 * Una SESIÓN es un trozo de tiempo agendado para avanzar en una tarea.
 *
 * Idea central de la app: una sesión NO es un evento fijo e inamovible. Es una
 * PROPUESTA de cuándo cumplir parte del compromiso de tiempo de una tarea. Si
 * la sesión no se cumple (el usuario no está disponible), sus minutos no se
 * pierden: se convierten en "deuda de tiempo" que el motor vuelve a repartir.
 *
 * Esto es lo que diferencia esta herramienta de un calendario normal.
 */

import type {
  ISODateTime,
  Minutes,
  SessionId,
  TaskId,
} from './common';

/**
 * Estado de una sesión a lo largo de su ciclo de vida.
 *
 *   - 'propuesta':   el motor la sugirió; el usuario aún no la ha confirmado.
 *   - 'confirmada':  el usuario aceptó que trabajará en esta franja.
 *   - 'en-curso':    la sesión arrancó (cuenta regresiva + Pomodoro corriendo).
 *   - 'completada':  se trabajó y se registró el tiempo real.
 *   - 'pospuesta':   se movió a MÁS TARDE EL MISMO DÍA (ver flujo de notificación).
 *   - 'cancelada':   se liberó; sus minutos pasan a deuda para recuperar OTRO día.
 */
export type SessionStatus =
  | 'propuesta'
  | 'confirmada'
  | 'en-curso'
  | 'completada'
  | 'pospuesta'
  | 'cancelada';

/**
 * Una sesión agendada.
 */
export interface Session {
  readonly id: SessionId;

  /** A qué tarea pertenece esta sesión. */
  readonly taskId: TaskId;

  /** Inicio propuesto/confirmado de la sesión. */
  start: ISODateTime;

  /** Fin propuesto/confirmado de la sesión. */
  end: ISODateTime;

  /**
   * Duración PLANEADA de la sesión en minutos. Normalmente coincide con
   * (end - start), pero lo guardamos explícito para no recalcular siempre y
   * para que la lógica del motor sea más clara.
   */
  plannedMinutes: Minutes;

  /**
   * Minutos REALMENTE trabajados, que el Pomodoro va acumulando.
   * - null  => aún no se ha trabajado (sesión propuesta/confirmada).
   * - 0..N  => tiempo efectivo registrado al completar los Pomodoros.
   *
   * Comparar `actualMinutesWorked` con `plannedMinutes` es lo que permite
   * detectar cuánto falta y generar deuda si se quedó corto.
   */
  actualMinutesWorked: Minutes | null;

  status: SessionStatus;

  /**
   * Minutos de preparación (cuenta regresiva previa) para ESTA sesión.
   * Normalmente se hereda del perfil del usuario, pero se guarda aquí por si
   * una sesión concreta necesita más/menos tiempo de preparación.
   */
  preparationMinutes: Minutes;

  readonly createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/**
 * Datos para crear una sesión nueva (sin id ni timestamps).
 */
export type NewSessionInput = Omit<
  Session,
  'id' | 'createdAt' | 'updatedAt'
>;
