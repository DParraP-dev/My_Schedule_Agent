/**
 * services/notifications.ts
 * -------------------------
 * Capa de notificaciones locales (previstas con `expo-notifications`).
 *
 * Feature central: antes de cada sesión suena una notificación con una cuenta
 * regresiva de PREPARACIÓN y botones de acción:
 *
 *   [ Confirmar ]  -> arranca la preparación y luego el Pomodoro.
 *   [ No puedo ahora ] -> abre el flujo de Posponer / Cancelar:
 *        · Posponer: mover la sesión a más tarde EL MISMO DÍA.
 *        · Cancelar: liberar y generar deuda para recuperar OTRO día
 *                    (el motor propondrá una reagendación que apruebas).
 *
 * ESTADO ACTUAL: contrato (interfaz) sin acoplarse a expo-notifications todavía,
 * por el mismo motivo que la base de datos (la librería aún no está instalada).
 *
 * TODO(notif): implementar con expo-notifications:
 *   - Registrar permisos y un canal de notificación en Android.
 *   - Definir una "categoría" con las acciones Confirmar / No puedo ahora.
 *   - Programar la notificación en (inicioSesión - preparationMinutes).
 *   - Manejar la respuesta a las acciones y disparar el flujo correspondiente.
 */

import type { SessionId, Minutes } from '@/models';

/**
 * Acciones que el usuario puede pulsar desde la notificación.
 */
export type NotificationAction = 'confirmar' | 'posponer' | 'cancelar';

/**
 * Datos que viajan con la notificación para saber a qué sesión corresponde.
 */
export interface SessionReminderPayload {
  sessionId: SessionId;
  /** Minutos de cuenta regresiva de preparación antes de arrancar. */
  preparationMinutes: Minutes;
}

/**
 * Contrato del servicio de notificaciones.
 */
export interface NotificationService {
  /** Pide permisos y configura el canal/categoría (Android). */
  init(): Promise<void>;

  /**
   * Programa el recordatorio de una sesión. Se disparará `preparationMinutes`
   * antes de la hora de inicio.
   * @returns identificador de la notificación programada (para poder cancelarla).
   */
  scheduleSessionReminder(
    payload: SessionReminderPayload,
    fireAtISO: string,
  ): Promise<string>;

  /** Cancela una notificación programada (p. ej. si la sesión se mueve). */
  cancelScheduled(notificationId: string): Promise<void>;

  /**
   * Registra el callback que se ejecuta cuando el usuario pulsa una acción.
   * La app usará esto para disparar confirmar / posponer / cancelar.
   */
  onAction(
    handler: (action: NotificationAction, payload: SessionReminderPayload) => void,
  ): void;
}
