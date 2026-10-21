/**
 * common.ts
 * ---------
 * Tipos "ladrillo" que se reutilizan en todo el dominio.
 *
 * APRENDIENDO TYPESCRIPT:
 *   Aquí usamos varias herramientas clave del lenguaje:
 *   - `type` para dar nombre a un tipo (alias de tipo).
 *   - Uniones literales (`'a' | 'b'`) para listas cerradas de valores válidos.
 *   - "Branded types" (tipos con marca) para que un ID de Tarea no pueda
 *     confundirse accidentalmente con un ID de Sesión, aunque ambos sean strings.
 */

/**
 * Representa un instante en el tiempo.
 *
 * Decisión de diseño: guardamos las fechas como texto en formato ISO 8601
 * (p. ej. "2026-10-20T16:00:00.000Z"). ¿Por qué texto y no un objeto Date?
 *   - SQLite no tiene un tipo "fecha" nativo; guardar texto ISO es lo más
 *     portable y legible.
 *   - Evita problemas al serializar/deserializar.
 * Para operar con ellas en memoria, conviertes con `new Date(isoString)`.
 */
export type ISODateTime = string;

/**
 * Duración expresada SIEMPRE en minutos.
 *
 * Decisión de diseño: toda la app razona en minutos (no en horas ni en
 * milisegundos). Mantener una sola unidad en todo el dominio evita una
 * fuente enorme de bugs ("¿esto estaba en horas o en minutos?").
 */
export type Minutes = number;

/**
 * Minutos transcurridos desde la medianoche (0 = 00:00, 480 = 08:00, 1439 = 23:59).
 *
 * Lo usamos para horarios que se repiten CADA día (hora de despertar, de dormir,
 * ventanas preferentes...), donde la fecha concreta no importa, solo la hora.
 */
export type MinuteOfDay = number;

/**
 * Día de la semana. 0 = domingo, 6 = sábado (igual que JavaScript `Date.getDay()`).
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * --- "Branded types" (tipos con marca) ---
 *
 * Un truco de TypeScript para que dos IDs que "por dentro" son strings no se
 * puedan intercambiar por error. `TaskId` es un string, pero marcado de forma
 * que el compilador NO deja pasar un `SessionId` donde se espera un `TaskId`.
 *
 * El `& { readonly __brand: ... }` es una marca invisible en tiempo de
 * compilación; en tiempo de ejecución sigue siendo un string normal.
 */
export type TaskId = string & { readonly __brand: 'TaskId' };
export type SessionId = string & { readonly __brand: 'SessionId' };
export type BlockId = string & { readonly __brand: 'BlockId' };

/**
 * Prioridad de un pendiente. Usamos una unión literal (lista cerrada) en vez de
 * un número suelto, para que el compilador solo permita estos cuatro valores.
 */
export type Priority = 'baja' | 'media' | 'alta' | 'urgente';

/**
 * Peso numérico de cada prioridad, útil para que el motor de scheduling ordene.
 * A mayor número, mayor urgencia.
 */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  baja: 1,
  media: 2,
  alta: 3,
  urgente: 4,
};
