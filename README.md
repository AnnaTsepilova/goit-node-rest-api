## Домашнє завдання. MongoDB и Mongoose

### Гілка 04-auth

Продовжуємо створення REST API для роботи з колекцією контактів. Додати логіку аутентифікації / авторизації користувача через [JWT](https://jwt.io/).

### Крок 1

1. У коді створити схему і модель користувача для колекції users.

```
{
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
}
```

2. Змінити схему контактів, щоб кожен користувач бачив тільки свої контакти. Для цього в схемі контактів додати властивість

```
   owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
```

### Крок 2

**Реєстрація**

1. Створити ендпоінт `/users/register `
2. Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути `Помилку валідації`.

- У разі успішної валідації в моделі `User` створити користувача за даними, які пройшли валідацію. Для засолювання паролів використовуй [bcrypt](https://www.npmjs.com/package/bcrypt) або [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Якщо пошта вже використовується кимось іншим, повернути `Помилку Conflict`.
- В іншому випадку повернути `Успішна відповідь`.

**Registration request**

```
POST /users/register
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

**Registration validation error**

```
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>
```

**Registration conflict error**

```
Status: 409 Conflict
Content-Type: application/json
ResponseBody: {
  "message": "Email in use"
}
```

**Registration success response**

```
Status: 201 Created
Content-Type: application/json
ResponseBody: {
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

**Логін**

1. Створити ендпоінт `/users/login`
2. В моделі `User` знайти користувача за `email`.
3. Зробити валідацію всіх обов'язкових полів (email і password). При помилці валідації повернути `Помилку валідації`.

- В іншому випадку, порівняти пароль для знайденого користувача, якщо паролі збігаються створити токен, зберегти в поточного юзера і повернути успішну відповідь.
- Якщо пароль або імейл невірний, повернути помилку Unauthorized.

**Login request**

```
POST /users/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

**Login validation error**

```
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}
```

**Login success response**

```
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "token": "exampletoken",
  "user": {
    "email": "example@example.com",
    "subscription": "starter"
  }
}
```

**Login auth error**

```
Status: 401 Unauthorized
ResponseBody: {
  "message": "Email or password is wrong"
}
```

### Крок 3

**Перевірка токена**

Створити мідлвар для перевірки токена і додай його до всіх раутів, які повинні бути захищені.

- Мідлвар бере токен з заголовків `Authorization`, перевіряє токен на валідність.
- У випадку помилки повернути помилку `Unauthorized`.
- Якщо валідація пройшла успішно, отримати з токена `id` користувача. Знайти користувача в базі даних з цим `id`.
- Якщо користувач існує і токен збігається з тим, що знаходиться в базі, записати його дані в `req.user` і викликати `next()`.
- Якщо користувача з таким `id` НЕ існує або токени не збігаються, повернути помилку `Unauthorized`

**Middleware unauthorized error**

```
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

### Крок 4

**Логаут**

1. Створити ендпоінт `/users/logout`
2. Додати в маршрут мідлвар перевірки токена.

- У моделі User знайти користувача за `_id`.
- Якщо користувача не існує, повернути Помилку `Unauthorized`.
- В іншому випадку, видалити токен у поточного юзера і повернути `Успішна відповідь`.

**Logout request**

```
POST /users/logout
Authorization: "Bearer {{token}}"
```

**Logout unauthorized error**

```
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

**Logout success response**

```
Status: 204 No Content
```

### Крок 5

Поточний користувач - отримати дані юзера по токені

1. Створити ендпоінт `/users/current`
2. Додати в раут мідлвар перевірки токена.

- Якщо користувача не існує, повернути Помилку `Unauthorized`
- В іншому випадку повернути `Успішну відповідь`

**Current user request**

```
GET /users/current
Authorization: "Bearer {{token}}"
```

**Current user unauthorized error**

```
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

**Current user success response**

```
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}
```

## Додаткове завдання

- Зробити пагінацію для колекції контактів `GET /contacts?page=1&limit=20`.
- Зробити фільтрацію контактів по полю обраного `GET /contacts?favorite=true`
- Оновлення підписки `subscription` користувача через ендпоінт `PATCH /users`. Підписка повинна мати одне з наступних значень `['starter', 'pro', 'business']`
