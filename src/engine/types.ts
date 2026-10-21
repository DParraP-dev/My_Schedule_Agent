/**
 * engine/types.ts
 * ---------------
 * Tipos de entrada y salida del MOTOR DE SCHEDULING (el cerebro de la app).
 *
 * Definir primero las "formas" (interfaces) de lo que entra y sale nos permite
 * razonar sobre el algoritmo antes de escribirlo. El algoritmo real vendrá
 * después; aquí solo fijamos el contrato.
 */

import type {
  ISODateTime,
  Minutes,
  Task,
  Session,
  ScheduleProfile,
  TimeDebt,
  DistributionStrategy,
  PomodoroConfig,
  TaskType,
} from '@/models';

/**
 * Todo lo que el motor necesita saber para proponer un horario.
 */
export interface SchedulingContext {
  /** Tareas con trabajo pendiente a repartir. */
  tasks: Task[];

  /** Sesiones YA confirmadas (ocupan huecos y no se deben pisar). */
  confirmedSessions: Session[];

  /** Deudas de tiempo pendientes de recuperar. */
  debts: TimeDebt[];

  /** Perfil de horario del usuario (límites y preferencias). */
  profile: ScheduleProfile;

  /** Estrategia de distribución efectiva por tipo (defaults + ajustes del usuario). */
  distributionByType: Record<TaskType, DistributionStrategy>;

  /** Config Pomodoro efectiva por tipo (para alinear sesiones a múltiplos de ciclo). */
  pomodoroByType: Record<TaskType, PomodoroConfig>;

  /** Ventana temporal para la que se planifica (p. ej. la semana en curso). */
  horizon: {
    from: ISODateTime;
    to: ISODateTime;
  };

  /** "Ahora": el motor no debe proponer sesiones en el pasado. */
  now: ISODateTime;
}

/**
 * Un hueco libre encontrado en el calendario, candidato a albergar una sesión.
 * (Estructura intermedia que el algoritmo usa internamente.)
 */
export interface FreeSlot {
  start: ISODateTime;
  end: ISODateTime;
  durationMinutes: Minutes;
  /**
   * Puntuación de "qué tan bueno" es este hueco según las preferencias blandas
   * (mayor = mejor). La usará el motor para elegir entre varios huecos válidos.
   */
  score: number;
}

/**
 * Resultado de una planificación: sesiones propuestas + diagnóstico.
 */
export interface SchedulingResult {
  /** Sesiones nuevas propuestas (en estado 'propuesta'), para que el usuario apruebe. */
  proposedSessions: Session[];

  /**
   * Tareas que NO se pudieron agendar por completo antes de su deadline.
   * La UI usa esto para avisar de conflictos.
   */
  unmetTasks: Array<{
    taskId: Task['id'];
    missingMinutes: Minutes;
    reason: string;
  }>;
}
