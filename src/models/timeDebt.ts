/**
 * timeDebt.ts
 * -----------
 * La "DEUDA DE TIEMPO" es el corazón inteligente de la app y lo que la
 * diferencia de un calendario normal.
 *
 * Problema que resuelve: cancelas una sesión por un cambio del día y luego
 * OLVIDAS que debías recuperar esas horas de trabajo.
 *
 * Solución: cuando una sesión se cancela, sus minutos no desaparecen. Se
 * registran como una "deuda" asociada a la tarea, y el motor la vuelve a
 * repartir (proponiendo una reagendación que tú apruebas).
 *
 * Modelo mental: el sistema no piensa en "eventos fijos", sino en "minutos que
 * deben cumplirse". Un bloque del calendario es solo una propuesta de CUÁNDO
 * cumplir ese compromiso; si falla, los minutos se reinyectan al sistema.
 */

import type {
  ISODateTime,
  Minutes,
  SessionId,
  TaskId,
} from './common';

/**
 * Por qué se generó la deuda, para poder mostrarlo y analizarlo luego.
 *   - 'cancelada':      el usuario canceló la sesión (recuperar otro día).
 *   - 'incompleta':     la sesión terminó pero se trabajó MENOS de lo planeado.
 *   - 'no-confirmada':  pasó la hora y nunca se confirmó/arrancó la sesión.
 */
export type DebtReason = 'cancelada' | 'incompleta' | 'no-confirmada';

/**
 * Un registro de deuda: minutos de una tarea que quedaron pendientes de
 * reagendar.
 */
export interface TimeDebt {
  readonly id: string;

  /** Tarea a la que pertenecen los minutos pendientes. */
  readonly taskId: TaskId;

  /** Sesión que originó la deuda (si aplica). */
  readonly originSessionId: SessionId | null;

  /** Minutos que faltan por recuperar. */
  minutes: Minutes;

  reason: DebtReason;

  /**
   * ¿Ya se generó una propuesta de reagendación para esta deuda?
   * El flujo es: deuda creada -> el motor propone recuperación -> el usuario
   * la aprueba -> la deuda se marca como resuelta.
   */
  resolved: boolean;

  readonly createdAt: ISODateTime;
}

/**
 * Una PROPUESTA DE RECUPERACIÓN: el conjunto de sesiones nuevas que el motor
 * sugiere para saldar una deuda. El usuario la revisa y la aprueba (nada se
 * agenda de forma silenciosa).
 *
 * APRENDIENDO TYPESCRIPT:
 *   Usamos `SessionId[]` (array de IDs) en lugar de incrustar los objetos
 *   Session completos, para no duplicar datos: las sesiones viven en su propia
 *   tabla y aquí solo las referenciamos.
 */
export interface RecoveryProposal {
  readonly id: string;
  readonly debtId: string;
  /** Sesiones nuevas propuestas (en estado 'propuesta') para cubrir la deuda. */
  proposedSessionIds: SessionId[];
  /** Minutos totales que cubre esta propuesta. */
  coveredMinutes: Minutes;
  /**
   * true si el motor NO encontró huecos suficientes antes del deadline.
   * En ese caso la UI debe avisar del conflicto ("no alcanza el tiempo,
   * ¿reduzco otra cosa o muevo el deadline?").
   */
  hasConflict: boolean;
  readonly createdAt: ISODateTime;
}
