# API REST - Plataforma de Eventos e Inscripciones

Pre-entrega 2 del curso Programación Backend II (CoderHouse).

API REST construida con Express y MongoDB para publicar eventos y, en las próximas etapas, gestionar inscripciones.

Sobre la base de la entrega anterior, esta etapa incorpora el **registro seguro de usuarios**: `POST /api/sessions/register` valida los datos, normaliza el email, rechaza duplicados, guarda la contraseña hasheada con **bcrypt** y responde sin exponerla.

El registro recorre todas las capas: router, controller, service, repository y DAO. La lógica vive en el service y el hash en un helper reutilizable de `utils/`.

## Temática

Plataforma general de eventos: recitales, conferencias, talleres y otras actividades, organizadas por categoría.

## Tecnologías

- Node.js con módulos ESM
- Express 5
- MongoDB Atlas y Mongoose
- bcrypt
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
│   ├── events.service.js
│   └── sessions.service.js         lógica del registro
├── repositories/
│   ├── events.repository.js
│   └── users.repository.js
├── dao/
│   ├── events.dao.js
│   └── users.dao.js
├── models/
│   ├── User.js
│   └── Event.js
├── middlewares/                    preparada para las próximas etapas
└── utils/
    └── hash.js                     hash y comparación de contraseñas con bcrypt
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

`health` usa solo router y controller, porque no accede a datos. El registro de `sessions` usa el repository y el DAO de usuarios.

Cuando el service detecta un error de negocio, lo lanza con su código HTTP (`400` o `409`) y el controller responde con ese código. Cualquier error inesperado se responde con `500`.

## Entidades

### User

| Campo        | Tipo   | Reglas                                            |
| ------------ | ------ | ------------------------------------------------- |
| `first_name` | String | Obligatorio                                       |
| `last_name`  | String | Obligatorio                                       |
| `email`      | String | Obligatorio, único, se guarda en minúsculas       |
| `password`   | String | Obligatorio, se guarda hasheado con bcrypt        |
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

| Método | Ruta                     | Descripción                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/api/health`            | Indica que el servidor está activo   |
| GET    | `/api/events`            | Lista los eventos con su organizador |
| POST   | `/api/sessions/register` | Registra un usuario nuevo            |

### GET /api/health

```json
{ "status": "ok", "message": "Servidor activo" }
```

### GET /api/events

```json
{ "status": "success", "payload": [] }
```

### POST /api/sessions/register

Campos que espera en el body, en formato JSON:

| Campo        | Reglas                            |
| ------------ | --------------------------------- |
| `first_name` | Obligatorio                       |
| `last_name`  | Obligatorio                       |
| `email`      | Obligatorio, con formato de email |
| `password`   | Obligatorio, mínimo 6 caracteres  |

Qué hace el registro:

- Normaliza el email: le quita los espacios y lo pasa a minúsculas.
- Rechaza el registro si el email ya existe.
- Guarda la contraseña hasheada con bcrypt, nunca en texto plano.
- Ignora el campo `role` si viene en el body: todo usuario nuevo se crea como `user`.
- Responde sin la contraseña.

**Request**

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

**Respuestas**

`201` registro exitoso:

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

`400` campos faltantes, email inválido o contraseña corta:

```json
{ "status": "error", "message": "Todos los campos son obligatorios" }
```

`409` email ya registrado:

```json
{ "status": "error", "message": "El correo electrónico ya está registrado" }
```

### Cómo probarlo

Con el servidor corriendo, enviar un `POST` a `http://localhost:3000/api/sessions/register` desde Postman, con el body en **raw → JSON**, o desde la terminal:

```bash
curl -X POST http://localhost:3000/api/sessions/register -H "Content-Type: application/json" -d "{\"first_name\":\"Ana\",\"last_name\":\"Pérez\",\"email\":\"Ana@Mail.com \",\"password\":\"Secreta123\"}"
```

Casos para verificar:

1. Registro exitoso: `201` y la respuesta sin `password`.
2. Campos faltantes: `400`.
3. Email con formato inválido: `400`.
4. Email ya registrado (repetir el mismo request): `409`.
5. En MongoDB Atlas, el campo `password` del usuario empieza con `$2b$`, es decir, está hasheado.
