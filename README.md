# API REST - Plataforma de Eventos e Inscripciones

Pre-entrega 1 del curso Programación Backend II (CoderHouse).

API REST construida con Express y MongoDB para una plataforma general de eventos: recitales, conferencias, talleres y otras actividades, organizadas por categoría.

Esta etapa deja lista la base del proyecto: el servidor, la configuración por variables de entorno, la conexión a **MongoDB Atlas**, las entidades `User` y `Event`, y la estructura de los recursos `events` y `sessions`.

`GET /api/events` ya recorre todas las capas hasta la base de datos: router, controller, service, repository y DAO. Cada organizador se devuelve con **populate**, resolviendo la referencia al usuario.

## Tecnologías

- Node.js con módulos ESM
- Express 5
- MongoDB Atlas y Mongoose
- dotenv
- pnpm

## Instalación

```bash
git clone https://github.com/NahuelTrassani/eventos.git
cd eventos
pnpm install
```

## Configuración

Crear un archivo `.env` en la raíz a partir de `.env.example`:

```
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb+srv://[USUARIO]:[CONTRASENA]@[CLUSTER].mongodb.net/[BASE]?appName=[APP]
JWT_SECRET=
```

| Variable     | Descripción                                                        |
| ------------ | ------------------------------------------------------------------ |
| `PORT`       | Puerto en el que escucha el servidor                               |
| `NODE_ENV`   | Entorno de ejecución                                               |
| `MONGO_URL`  | Cadena de conexión a MongoDB Atlas                                 |
| `JWT_SECRET` | Clave para firmar tokens, reservada para la etapa de autenticación |

Si falta `PORT`, `NODE_ENV` o `MONGO_URL`, la aplicación informa cuál es y no arranca.

## Ejecución

```bash
pnpm dev
```

El servidor primero se conecta a la base y después empieza a escuchar. Si la conexión falla, el proceso termina con el error.

## Estructura

```
src/
├── app.js                          configura Express y monta las rutas
├── server.js                       conecta la base y levanta el servidor
├── config/
│   ├── env.config.js               lee y valida las variables de entorno
│   └── db.config.js                conexión a MongoDB
├── routes/
│   ├── health.router.js
│   ├── events.router.js
│   └── sessions.router.js
├── controllers/
│   ├── health.controller.js
│   ├── events.controller.js
│   └── sessions.controller.js
├── services/
│   └── events.service.js
├── repositories/
│   └── events.repository.js
├── dao/
│   └── events.dao.js
├── models/
│   ├── User.js
│   └── Event.js
├── middlewares/                    preparada para las próximas etapas
└── utils/                          preparada para las próximas etapas
```

## Arquitectura en capas

```
Router → Controller → Service → Repository → DAO → Model → MongoDB
```

| Capa       | Responsabilidad                                 |
| ---------- | ----------------------------------------------- |
| Router     | Asocia cada ruta con su controller              |
| Controller | Recibe el pedido y arma la respuesta HTTP       |
| Service    | Concentra la lógica de negocio                  |
| Repository | Intermedia entre el service y el acceso a datos |
| DAO        | Ejecuta las operaciones sobre la base           |
| Model      | Define la estructura de los documentos          |

`health` y `sessions` usan solo router y controller, porque en esta etapa no acceden a datos.

## Entidades

### User

| Campo        | Tipo   | Reglas                                            |
| ------------ | ------ | ------------------------------------------------- |
| `first_name` | String | Obligatorio                                       |
| `last_name`  | String | Obligatorio                                       |
| `email`      | String | Obligatorio, único, se guarda en minúsculas       |
| `password`   | String | Obligatorio                                       |
| `role`       | String | `user`, `organizer` o `admin`. Por defecto `user` |

### Event

| Campo         | Tipo     | Reglas                                                              |
| ------------- | -------- | ------------------------------------------------------------------- |
| `title`       | String   | Obligatorio                                                         |
| `description` | String   | Obligatorio                                                         |
| `category`    | String   | Obligatorio, se guarda en minúsculas                                |
| `location`    | String   | Obligatorio                                                         |
| `date`        | Date     | Obligatorio                                                         |
| `capacity`    | Number   | Obligatorio, mínimo 1                                               |
| `price`       | Number   | Obligatorio, mínimo 0                                               |
| `status`      | String   | `draft`, `published`, `cancelled` o `finished`. Por defecto `draft` |
| `organizer`   | ObjectId | Obligatorio, referencia a `User`                                    |

Las dos entidades registran `createdAt` y `updatedAt`.

## Rutas disponibles

| Método | Ruta            | Descripción                                   |
| ------ | --------------- | --------------------------------------------- |
| GET    | `/api/health`   | Indica que el servidor está activo            |
| GET    | `/api/events`   | Lista los eventos con su organizador          |
| GET    | `/api/sessions` | Estructura inicial, todavía sin autenticación |

### GET /api/health

```json
{ "status": "ok", "message": "Servidor activo" }
```

### GET /api/events

```json
{ "status": "success", "payload": [] }
```

### GET /api/sessions

```json
{ "status": "success", "payload": [] }
```
