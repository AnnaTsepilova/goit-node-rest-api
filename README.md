## Домашнє завдання. Робота з email та Docker

### Гілка hw06-email

Продовжуємо створення REST API для роботи з колекцією контактів.
Додайте верифікацію email користувача після реєстрації за допомогою сервісу [SendGrid](https://sendgrid.com/en-us).

Як процес верифікації повинен працювати:

- Після реєстрації, користувач повинен отримати лист на вказану при реєстрації пошту з посиланням для верифікації свого email
- Пройшовши посиланням в отриманому листі, в перший раз, користувач повинен отримати `Відповідь зі статусом 200`, що буде мати на увазі успішну верифікацію email
- Пройшовши по посиланню повторно користувач повинен отримати `Помилку зі статусом 404`

### Крок 1

#### Підготовка інтеграції з SendGrid API

- Зареєструйся на [SendGrid](https://sendgrid.com/en-us).
- Створи email-відправника. Для цього в адміністративній панелі SendGrid зайдіть в меню Marketing в підміню senders і в правому верхньому куті натисніть кнопку "Create New Sender". Заповніть поля в запропонованій формі. Збережіть.
- На вказаний email повинно прийти лист верифікації (перевірте спам, якщо не бачите листи). Натисніть на посилання в ньому і завершите процес.
- Тепер необхідно створити API токен доступу. Вибираємо меню "Email API", і підменю "Integration Guide". Тут вибираємо "Web API". Далі необхідно вибрати технологію Node.js.
- На третьому кроці даємо ім'я нашого токену. Необхідно зкопіювати цей токен (це важливо, тому що більше ви не зможете його подивитися). Після завершити процес створення токена.
- Отриманий API-токен треба додати в .env файл в нашому проєкті.

### Крок 2

#### Створення ендпоінта для верифікації email

**1.** Додати в модель `User` два поля `verificationToken` і `verify`. Значення поля `verify` рівне `false` означатиме, що його email ще не пройшов верифікацію

```shell
{
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
}
```

**2.** Створити ендпоінт `GET /users/verify/:verificationToken`, де по параметру `verificationToken` ми будемо шукати користувача в моделі `User`

- Якщо користувач з таким токеном не знайдений, необхідно повернути Помилку `'Not Found'`
- Якщо користувач знайдений, встановлюємо `verificationToken` в `null`, а поле `verify` ставимо рівним `true` в документі користувача і повертаємо `Успішну відповідь`

**Verification request**

```shell
GET /auth/verify/:verificationToken
```

**Verification user Not Found**

```shell
Status: 404 Not Found
ResponseBody: {
message: 'User not found'
}
```

**Verification success response**

```shell
Status: 200 OK
ResponseBody: {
message: 'Verification successful',
}
```

### Крок 3

#### Додавання відправки email користувачу з посиланням для верифікації

При створення користувача при реєстрації:

- Створити `verificationToken` для користувача і записати його в БД (для генерації токена використовуйте пакет [uuid](https://www.npmjs.com/package/uuid) або [nanoid](https://www.npmjs.com/package/nanoid))
- Відправити email на пошту користувача і вказати посилання для верифікації email'а (`/users/verify/:verificationToken`) в повідомленні

Так само необхідно враховувати, що тепер логін користувача не дозволено, якщо не верифікувано email

### Крок 4

#### Додавання повторної відправки email користувачу з посиланням для верифікації

Необхідно передбачити варіант, що користувач може випадково видалити лист. Він може не дійти з якоїсь причини до адресата. Наш сервіс відправки листів під час реєстрації видав помилку і т.д.

**POST /users/verify**

- Отримує `body` в форматі `{email}`
- Якщо в `body` немає обов'язкового поля `email`, повертає json з ключем `{"message":"missing required field email"}` і статусом `400`
- Якщо з `body` все добре, виконуємо повторну відправку листа з `verificationToken` на вказаний email, але тільки якщо користувач не верифікований
- Якщо користувач вже пройшов верифікацію відправити json з ключем `{"message":"Verification has already been passed"}` зі статусом `400 Bad Request`

**Resending an email request**

```shell
POST /users/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}
```

**Resending an email validation error**

```shell
Status: 400 Bad Request
Content-Type: application/json
ResponseBody:  {
  "message": "Помилка від Joi або іншої бібліотеки валідації"
}
```

**Resending an email success response**

```shell
Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}
```

**Resend email for verified user**

```shell
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}
```

### Додаткове завдання (необов'язкове)

Написати `dockerfile` для своєї програми.

Для запуску додатку в docker треба виконати наступні команди:

1. `docker build . -t contacts-app`
2. `docker run --name contacts-app -p 3000:3000 -d contacts-app:latest`
