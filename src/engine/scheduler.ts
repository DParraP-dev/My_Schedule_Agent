/**
 * engine/scheduler.ts
 * -------------------
 * El MOTOR DE SCHEDULING. Esta es la pieza más interesante del proyecto y donde
 * está el grueso del aprendizaje algorítmico.
 *
 * ESTADO ACTUAL: este archivo contiene la ESTRUCTURA (contratos de funciones)
 * con TODOs. La implementación real del algoritmo se construirá por pasos,
 * empezando por una versión determinista basada en reglas (no IA todavía):
 *
 *   1. Calcular huecos libres a partir del perfil y las sesiones confirmadas.
 *   2. Ordenar tareas por urgencia (prioridad + cercanía del deadline).
 *   3. Para cada tarea, fragmentar sus minutos en sesiones según la
 *      estrategia de su tipo (justo-antes / repartido / intensifica / diario).
 *   4. Colocar cada sesión en el mejor hueco (puntuando preferencias blandas).
 *   5. Lo que no quepa antes del deadline => reportarlo como conflicto.
 *
 * Mantener el motor como funciones PURAS (entran datos, salen datos, sin tocar
 * la base de datos ni el reloj global) lo hace fácil de probar y de razonar.
 */

import type {
  FreeSlot,
  SchedulingContext,
  SchedulingResult,
} from './types';
import type { Task, TimeDebt, RecoveryProposal } from '@/models';

/**
 * Función principal: dado el contexto, propone un conjunto de sesiones.
 *
 * TODO(motor): implementar el algoritmo de reparto por reglas descrito arriba.
 *
 * @param context Tareas, sesiones confirmadas, deudas, perfil y horizonte.
 * @returns Sesiones propuestas + diagnóstico de lo que no cupo.
 */
export function proposeSchedule(context: SchedulingContext): SchedulingResult {
  // TODO(motor): 1) huecos -> 2) ordenar tareas -> 3) fragmentar -> 4) colocar.
  void context; // evita el aviso de parámetro no usado mientras es un stub.
  return {
    proposedSessions: [],
    unmetTasks: [],
  };
}

/**
 * Calcula los huecos libres dentro del horizonte, descartando bloques fijos,
 * sesiones confirmadas y restricciones duras del perfil.
 *
 * TODO(motor): recorrer cada día del horizonte y restar lo ocupado.
 */
export function computeFreeSlots(context: SchedulingContext): FreeSlot[] {
  // TODO(motor): implementar el cálculo de huecos.
  void context;
  return [];
}

/**
 * Ordena las tareas por urgencia. La urgencia combina la prioridad declarada y
 * la cercanía del deadline (cuanto más cerca, más urgente).
 *
 * TODO(motor): definir la fórmula de urgencia y ordenar.
 */
export function orderTasksByUrgency(tasks: Task[], now: string): Task[] {
  // TODO(motor): ordenar por (peso de prioridad) + (presión por deadline).
  void now;
  return [...tasks]; // de momento, copia sin reordenar.
}

/**
 * Fragmenta los minutos pendientes de UNA tarea en una lista de duraciones de
 * sesión, respetando la estrategia de su tipo (mín/objetivo/máx y 'spread').
 *
 * TODO(motor): implementar la fragmentación según DistributionStrategy.
 *
 * @returns Lista de duraciones (en minutos) para cada sesión a crear.
 */
export function splitIntoSessions(
  task: Task,
  context: SchedulingContext,
): number[] {
  // TODO(motor): partir task.estimatedMinutes según la estrategia del tipo.
  void task;
  void context;
  return [];
}

/**
 * Genera una propuesta de RECUPERACIÓN para una deuda concreta (reagendar los
 * minutos perdidos). El usuario la aprueba antes de que se fije nada.
 *
 * TODO(motor): reutilizar computeFreeSlots + colocación para cubrir la deuda.
 */
export function proposeRecovery(
  debt: TimeDebt,
  context: SchedulingContext,
): RecoveryProposal | null {
  // TODO(motor): buscar huecos para `debt.minutes` antes del deadline de la tarea.
  void debt;
  void context;
  return null;
}
