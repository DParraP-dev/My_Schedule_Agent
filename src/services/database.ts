/**
 * services/database.ts
 * --------------------
 * Capa de acceso a datos (SQLite local, 100% offline).
 *
 * ESTADO ACTUAL: definimos el CONTRATO (interfaz) del repositorio de datos sin
 * acoplarlo todavía a `expo-sqlite`. ¿Por qué así?
 *   - `expo-sqlite` aún no está instalado (el entorno de este asistente no tiene
 *     acceso a npm). Al programar contra una interfaz, el resto de la app no
 *     depende de Expo y los tipos compilan sin la librería.
 *   - Cuando inicialices Expo e instales `expo-sqlite`, crearás una
 *     implementación concreta de `Database` (p. ej. `SqliteDatabase`) sin tocar
 *     el resto del código. Esto se llama "inversión de dependencias".
 *
 * TODO(datos): crear `sqliteDatabase.ts` que implemente esta interfaz usando
 *   expo-sqlite, y definir el esquema de tablas (tasks, sessions, profile,
 *   time_debt, pomodoro_overrides).
 */

import type {
  Task,
  NewTaskInput,
  Session,
  NewSessionInput,
  ScheduleProfile,
  TimeDebt,
  TaskId,
  SessionId,
} from '@/models';

/**
 * Operaciones de persistencia que necesita la app. Es deliberadamente simple;
 * crecerá conforme añadamos funcionalidad.
 *
 * APRENDIENDO TYPESCRIPT:
 *   `Promise<T>` indica operaciones ASÍNCRONAS (la base de datos responde con
 *   el tiempo). Las consumirás con `await`.
 */
export interface Database {
  // --- Ciclo de vida ---
  /** Abre la BD y crea las tablas si no existen. */
  init(): Promise<void>;

  // --- Tareas ---
  createTask(input: NewTaskInput): Promise<Task>;
  getTask(id: TaskId): Promise<Task | null>;
  listTasks(): Promise<Task[]>;
  updateTask(task: Task): Promise<void>;
  deleteTask(id: TaskId): Promise<void>;

  // --- Sesiones ---
  createSession(input: NewSessionInput): Promise<Session>;
  listSessionsForTask(taskId: TaskId): Promise<Session[]>;
  listSessionsInRange(fromISO: string, toISO: string): Promise<Session[]>;
  updateSession(session: Session): Promise<void>;
  deleteSession(id: SessionId): Promise<void>;

  // --- Perfil de horario (único registro) ---
  getProfile(): Promise<ScheduleProfile | null>;
  saveProfile(profile: ScheduleProfile): Promise<void>;

  // --- Deuda de tiempo ---
  listOpenDebts(): Promise<TimeDebt[]>;
  saveDebt(debt: TimeDebt): Promise<void>;
}

/**
 * TODO(datos): exportar aquí una instancia/singleton de la implementación real
 * cuando exista, p. ej.:
 *
 *   import { SqliteDatabase } from './sqliteDatabase';
 *   export const db: Database = new SqliteDatabase('my_schedule_agent.db');
 */
