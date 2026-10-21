/**
 * scheduleProfile.ts
 * ------------------
 * El PERFIL DE HORARIO del usuario: su "horario base". Es tan importante como
 * las tareas, porque define el lienzo sobre el que el motor puede colocar
 * sesiones. Se configura una vez (y se ajusta con el tiempo).
 *
 * Distinción clave de diseño:
 *   - RESTRICCIÓN DURA (hard): nunca se viola. El motor descarta estos huecos.
 *   - PREFERENCIA BLANDA (soft): se respeta SI SE PUEDE; si no, se puede ceder.
 *
 * El motor primero elimina lo imposible (duras) y luego OPTIMIZA por lo
 * deseable (blandas).
 */

import type {
  BlockId,
  DayOfWeek,
  MinuteOfDay,
  Minutes,
} from './common';

/**
 * Un bloque FIJO y recurrente que ocupa tiempo y no se puede tocar:
 * clases, trabajo, comidas, traslados...
 */
export interface FixedBlock {
  readonly id: BlockId;
  /** Etiqueta visible (p. ej. "Clase de Cálculo"). */
  label: string;
  /** Días de la semana en que se repite. */
  days: DayOfWeek[];
  /** Hora de inicio en minutos desde medianoche. */
  startMinuteOfDay: MinuteOfDay;
  /** Hora de fin en minutos desde medianoche. */
  endMinuteOfDay: MinuteOfDay;
}

/**
 * Una VENTANA PREFERENTE: una franja donde el usuario rinde mejor para cierto
 * tipo de trabajo (p. ej. "mañanas para estudiar fuerte"). Es una preferencia
 * BLANDA: el motor intenta colocar aquí primero, pero puede salir si no cabe.
 */
export interface PreferredWindow {
  readonly id: BlockId;
  label: string;
  days: DayOfWeek[];
  startMinuteOfDay: MinuteOfDay;
  endMinuteOfDay: MinuteOfDay;
  /**
   * Peso de la preferencia (mayor = más deseable). Permite que el motor
   * compare varias ventanas y elija la "mejor" cuando hay opciones.
   */
  weight: number;
}

/**
 * El perfil completo del usuario.
 */
export interface ScheduleProfile {
  /** Hora típica de despertar (límite inferior del día utilizable). */
  wakeTime: MinuteOfDay;

  /** Hora típica de dormir (límite superior del día utilizable). */
  sleepTime: MinuteOfDay;

  /**
   * Restricción DURA: no agendar sesiones después de esta hora.
   * null = sin límite explícito (se usa sleepTime como tope).
   */
  noTasksAfter: MinuteOfDay | null;

  /**
   * Restricción DURA: no agendar sesiones antes de esta hora.
   * null = sin límite explícito (se usa wakeTime como piso).
   */
  noTasksBefore: MinuteOfDay | null;

  /** Bloques fijos recurrentes (clases, comidas, etc.) que ocupan el día. */
  fixedBlocks: FixedBlock[];

  /** Ventanas preferentes (preferencias blandas). */
  preferredWindows: PreferredWindow[];

  /**
   * Minutos de preparación por defecto antes de cada sesión: la cuenta
   * regresiva que te avisa para preparar tu espacio antes de empezar.
   */
  defaultPreparationMinutes: Minutes;

  /**
   * Descanso mínimo entre dos sesiones consecutivas (buffer), para no encadenar
   * bloques sin respiro.
   */
  minGapBetweenSessions: Minutes;
}

/**
 * Perfil POR DEFECTO razonable para arrancar. El usuario lo ajustará en el
 * onboarding / pantalla de configuración.
 *
 * (Recordatorio: los minutos desde medianoche: 7*60 = 420 = 07:00, etc.)
 */
export const DEFAULT_SCHEDULE_PROFILE: ScheduleProfile = {
  wakeTime: 7 * 60, // 07:00
  sleepTime: 23 * 60, // 23:00
  noTasksAfter: 22 * 60, // 22:00
  noTasksBefore: 8 * 60, // 08:00
  fixedBlocks: [],
  preferredWindows: [],
  defaultPreparationMinutes: 10,
  minGapBetweenSessions: 10,
};
