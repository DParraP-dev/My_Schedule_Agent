# My Schedule Agent 🗓️

Asistente personal de planificación de estudio. Tú dices **qué** quieres hacer y
**cuánto tiempo** quieres dedicarle; la app decide **cuándo**, repartiendo el
trabajo en **sesiones** a lo largo de tus días disponibles y mostrándotelo en un
calendario.

> **Estado del proyecto:** En construcción. Esta primera entrega contiene la
> **capa de lógica y modelos en TypeScript** más la documentación del alcance.
> La inicialización de la app Expo (React Native) se hace aparte — ver
> [Puesta en marcha](#-puesta-en-marcha).

---

## 🎯 El problema que resuelve

Como estudiante, la disponibilidad **cambia cada día** y organizar manualmente
el reparto de la carga de trabajo es agotador y poco efectivo. Esta herramienta:

1. Te deja **soltar pendientes** sin pensar en cuándo hacerlos.
2. Da a cada pendiente un **tipo** que cambia *cómo* se distribuye su tiempo.
3. **Reparte ese trabajo en sesiones** a lo largo de varios días, encajándolo en
   tus huecos reales.
4. Respeta tu **perfil de horario** (sueño, clases, "nada después de X hora").
5. Te avisa con una **cuenta regresiva de preparación** antes de cada sesión.
6. Si cancelas algo, **no pierde esas horas**: las recupera con una propuesta de
   reagendación.

### La idea central

El sistema **no piensa en "eventos fijos"**, sino en **"minutos que deben
cumplirse"**. Un bloque del calendario es solo una *propuesta de cuándo* cumplir
un compromiso de tiempo. Si la sesión falla, los minutos se reinyectan al
sistema como **"deuda de tiempo"**. Eso es lo que diferencia esta app de un
calendario normal.

---

## 🧩 El modelo de 3 piezas

```
┌─────────────────────────────────────────────────────────────┐
│  1. ENTRADAS (lo que tú defines)                              │
│     • Pendientes: tipo, prioridad, tiempo estimado, deadline  │
│     • Perfil: sueño, clases, preferencias, restricciones      │
├─────────────────────────────────────────────────────────────┤
│  2. MOTOR DE SCHEDULING (el cerebro)                          │
│     • Reparte horas en sesiones según el tipo                 │
│     • Respeta restricciones duras y optimiza preferencias     │
│     • Reacomoda la "deuda de tiempo" cuando rechazas algo     │
├─────────────────────────────────────────────────────────────┤
│  3. EJECUCIÓN (el día a día)                                  │
│     • Calendario con sesiones propuestas/confirmadas          │
│     • Notificación → Confirmar / No puedo ahora               │
│     • Cuenta regresiva de preparación → Pomodoro              │
│     • Registro de tiempo real trabajado                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Tipos de pendiente y su distribución

El **tipo** es la pieza más importante: determina *cómo* se reparte el tiempo.
Estos valores son **configurables** y se ajustan con el uso.

| Tipo       | Cómo distribuye el tiempo                                   | Especial                          |
|------------|-------------------------------------------------------------|-----------------------------------|
| **Tarea**    | 1-2 sesiones cortas, cerca pero antes del deadline         | Simple, no urge fragmentar        |
| **Proyecto** | Muchas sesiones medianas repartidas en varios días/semanas | Fragmentación obligatoria         |
| **Examen**   | Sesiones que **intensifican** acercándose a la fecha        | Repaso espaciado                  |
| **Hábito**   | Bloques cortos, **diarios**, a la misma hora                | Consistencia > cantidad           |

> Definición en código: [`src/models/taskType.ts`](src/models/taskType.ts)
> (`DistributionStrategy` y `DEFAULT_DISTRIBUTION`).

---

## 👤 Perfil de horario

Tu "horario base", que define el lienzo sobre el que el motor coloca sesiones:

- **Sueño:** hora de despertar y de dormir (límites del día).
- **Bloques fijos recurrentes:** clases, comidas, traslados (ocupan tiempo).
- **Ventanas preferentes:** franjas donde rindes mejor (preferencia **blanda**).
- **Restricciones duras:** "nada después de las 22h" (nunca se violan).
- **Buffer de preparación:** minutos de cuenta regresiva antes de cada sesión.

La distinción **restricción dura** (nunca se viola) vs. **preferencia blanda**
(se respeta si se puede) es clave: el motor primero descarta lo imposible y
luego optimiza por lo deseable.

> Definición en código: [`src/models/scheduleProfile.ts`](src/models/scheduleProfile.ts).

---

## 🍅 Pomodoro por sesión

Cada sesión arranca un temporizador Pomodoro. Cada **tipo de tarea** tiene su
configuración por defecto (editable desde ajustes), y una tarea concreta puede
**sobrescribirla**:

| Tipo     | Trabajo | Descanso | Idea                         |
|----------|---------|----------|------------------------------|
| Tarea    | 25 min  | 5 min    | Pomodoro clásico             |
| Proyecto | 50 min  | 10 min   | Concentración profunda       |
| Examen   | 25 min  | 5 min    | Clásico                      |
| Hábito   | 15 min  | 0 min    | Bloque único, sin descanso   |

El Pomodoro además **mide el tiempo real trabajado**, cerrando el ciclo entre lo
planeado y lo real. Si trabajaste menos de lo previsto, se genera deuda.

> Definición en código: [`src/models/pomodoro.ts`](src/models/pomodoro.ts).

---

## 🔔 Flujo de notificación (Confirmar / Posponer / Cancelar)

Antes de cada sesión llega una notificación con cuenta regresiva de preparación
y dos botones:

- **✅ Confirmar** → arranca la preparación y luego el Pomodoro.
- **❌ No puedo ahora** → abre dos opciones:
  - **Posponer** → mover la sesión a **más tarde el mismo día**.
  - **Cancelar** → liberar y generar **deuda de tiempo** para recuperar **otro
    día**. El motor propone una **reagendación** que tú apruebas (nada se agenda
    en silencio). Si no hay huecos antes del deadline, la app **avisa del
    conflicto**.

> Definición en código: [`src/services/notifications.ts`](src/services/notifications.ts)
> y [`src/models/timeDebt.ts`](src/models/timeDebt.ts).

---

## 🗂️ Estructura del proyecto

```
src/
├── models/           # 1. ENTRADAS — modelos de dominio (TypeScript puro)
│   ├── common.ts         Tipos base (IDs, minutos, fechas, prioridad)
│   ├── taskType.ts       Tipos de tarea + estrategia de distribución
│   ├── task.ts           El pendiente que crea el usuario
│   ├── session.ts        Una sesión agendada (trozo de trabajo)
│   ├── scheduleProfile.ts  Perfil de horario del usuario
│   ├── pomodoro.ts       Configuración Pomodoro por tipo
│   ├── timeDebt.ts       Deuda de tiempo y propuesta de recuperación
│   └── index.ts          Fachada de los modelos
│
├── engine/           # 2. MOTOR DE SCHEDULING (el cerebro) — stubs con TODOs
│   ├── types.ts          Entradas/salidas del motor
│   ├── scheduler.ts      Algoritmo de reparto (por implementar)
│   └── index.ts
│
└── services/         # 3. EJECUCIÓN — servicios del dispositivo — stubs
    ├── database.ts       Contrato de persistencia (SQLite local)
    └── notifications.ts  Contrato de notificaciones locales
```

**Por qué servicios como "contratos" (interfaces):** la lógica no depende de
Expo directamente. Cuando instales `expo-sqlite` y `expo-notifications`,
crearás implementaciones concretas de esas interfaces sin tocar el resto del
código (inversión de dependencias). Esto mantiene el núcleo testeable y
desacoplado.

---

## 🛠️ Stack tecnológico

- **Expo (React Native)** — la app, corre en Android/iOS.
- **TypeScript** — tipado estático en todo el dominio.
- **SQLite (`expo-sqlite`)** — datos **100% locales/offline**, sin nube ni cuentas.
- **`expo-notifications`** — notificaciones locales con botones de acción.
- **Motor de scheduling** — lógica propia en TypeScript (por reglas, no IA).

> Diseñado pensando en un **Android de gama baja**: se prioriza una app ligera,
> sin dependencias pesadas ni animaciones costosas.

---

## 🚀 Puesta en marcha

> ⚠️ El entorno del asistente de IA no tiene acceso a `npm`, por eso la **capa
> de lógica/modelos TypeScript** se construyó primero y de forma independiente.
> La inicialización de Expo se hace en **tu máquina** (donde sí hay internet).

### 1. Inicializar el proyecto Expo (en tu computadora)

Desde la raíz del repositorio ya clonado:

```bash
# Instala el proyecto Expo con plantilla TypeScript EN LA CARPETA ACTUAL
npx create-expo-app@latest . --template blank-typescript

# Instala las dependencias nativas que usaremos
npx expo install expo-sqlite expo-notifications
```

> La carpeta `src/` con los modelos y el motor ya está lista; Expo generará
> `App.tsx`, `package.json`, `app.json`, etc. a su alrededor. Si Expo pregunta
> por sobrescribir algún archivo que ya existe (`tsconfig.json`, `.gitignore`),
> conserva y **fusiona** lo que ya hay aquí con lo suyo.

### 2. Verificar los tipos

```bash
npx tsc --noEmit
```

Debe terminar sin errores (así se validó esta entrega).

### 3. Probar en tu teléfono (Android)

1. Instala **Expo Go** desde la Play Store.
2. En la computadora: `npx expo start`.
3. Escanea el QR con Expo Go. La app se abre en tu teléfono.

---

## 🗺️ Alcance

### ✅ Dentro del MVP

- Formulario de pendientes (tipo, prioridad, tiempo estimado, deadline).
- Tipos con distribución diferenciada, ajustables con el uso.
- Perfil de horario (sueño, bloques fijos, ventanas preferentes, restricciones).
- Motor de scheduling con reparto en sesiones.
- Calendario con flujo **propuesta → aceptar / mover / rechazar**.
- Notificación previa con **Confirmar / No puedo ahora** + cuenta regresiva.
- Pomodoro por sesión (config por tipo, con override individual).
- Registro de tiempo real y **recuperación de deuda de tiempo**.
- **100% local** en el teléfono.

### 🔮 Futuro (fuera del MVP)

- Entrada por lenguaje natural.
- Sincronización con Google Calendar.
- Aprendizaje automático de hábitos.
- Multiusuario y nube.

---

## 🧱 Hoja de ruta de implementación

1. **✅ Modelos de dominio + documentación** (esta entrega).
2. ⏳ Inicializar Expo + pantalla inicial + base de datos SQLite real.
3. ⏳ Formulario de creación de pendientes + persistencia.
4. ⏳ Perfil de horario (onboarding/configuración).
5. ⏳ Motor de scheduling v1 (por reglas) + vista calendario.
6. ⏳ Flujo de notificaciones + cuenta regresiva + Pomodoro.
7. ⏳ Deuda de tiempo + propuestas de recuperación.
8. ⏳ Pruebas en el teléfono real y recolección de feedback.
```

