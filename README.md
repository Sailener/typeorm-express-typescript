# Лабораторно-практична робота №6

## Впровадження сервісного шару, валідації та DTO

**Мета:** Навчитись проектувати та реалізовувати правильну архітектуру бекенд-додатку за принципом розділення відповідальності (Separation of Concerns). Практично реалізувати сервісний шар, впровадити механізм валідації через middleware та навчитись формувати контрольовані відповіді API за допомогою DTO.

[Скриншоти від 5 роботи](./images/1/)  
[Скриншоти від 6 роботи](./images/2/)  

## Короткий опис сутностей та їхніх зв'язків

- **Сутності:**
  - [`orm.entities.users.User`](src/orm/entities/users/User.ts) — базовий обліковий запис (авторизація, ролі).
  - [`orm.entities.users.Client`](src/orm/entities/users/Client.ts) — профіль клієнта (баланс, адреса).
  - [`orm.entities.devices.Device`](src/orm/entities/devices/Device.ts) — обладнання мережі (роутери, комутатори).
  - [`orm.entities.tariffs.Tariff`](src/orm/entities/tariffs/Tariff.ts) — тарифні плани (ціна, швидкість).
  - [`orm.entities.subscriptions.Subscription`](src/orm/entities/subscriptions/Subscription.ts) — підписки клієнтів на тарифи.

- **Відносини:**
  - **User & Client (OneToOne):** Користувач має один профіль клієнта.
  - **Client & Subscription (OneToMany):** Клієнт може мати декілька підписок.
  - **Tariff & Subscription (OneToMany):** Один тариф може бути прив'язаний до багатьох підписок.
  - **Device & Type/Status (ManyToOne):** Пристрій має свій тип (Router/Switch) та статус (Active/Repair).

- **DTO (Data Transfer Objects):**
  - [`dto.UserResponseDTO`](src/dto/UserResponseDTO.ts) — безпечне представлення профілю користувача.
  - [`dto.DeviceResponseDTO`](src/dto/DeviceResponseDTO.ts) — представлення даних про обладнання.
  - [`dto.SubscriptionResponseDTO`](src/dto/SubscriptionResponseDTO.ts) — деталі підписки з вкладеним тарифом.
  - [`dto.TariffResponseDTO`](src/dto/TariffResponseDTO.ts) — структура даних тарифного плану.

## Перелік реалізованих API ендпоінтів (v1)

Маршрути визначені в [src/routes/v1](src/routes/v1):

- **Auth**
  - POST `/v1/auth/login` — авторизація.
  - POST `/v1/auth/register` — реєстрація нового користувача.

- **Clients (Управління користувачами)**
  - GET `/v1/clients` — список всіх клієнтів. Контролер: [`controllers.clients.list`](src/controllers/clients/list.ts)
  - POST `/v1/clients` — створення нового клієнта.
  - GET `/v1/clients/:id` — детальна інформація про клієнта.

- **Devices (Інвентаризація обладнання)**
  - GET `/v1/devices` — список активного обладнання. Контролер: [`controllers.devices.list`](src/controllers/devices/list.ts)
  - POST `/v1/devices` — реєстрація нового пристрою.
  - PATCH `/v1/devices/:id` — зміна статусу або IP-адреси пристрою.

- **Subscriptions & Tariffs**
  - GET `/v1/subscriptions` — перегляд активних підписок.
  - GET `/v1/tariffs` — перелік доступних тарифних планів.

## Валідація (middleware)

Реалізована за допомогою `class-validator` та custom middleware:
- **Auth:** `validatorLogin`, `validatorRegister` в [`src/middleware/validation/auth`](src/middleware/validation/auth)
- **Clients:** `validatorCreateClient` в [`src/middleware/validation/clients`](src/middleware/validation/clients)
- **Devices:** `validatorCreateDevice` в [`src/middleware/validation/devices`](src/middleware/validation/devices)
- **Tariffs/Subscriptions:** відповідні валідатори в папці `middleware/validation/`.

## Сервісний шар (Service Layer)

Сервіси містять бізнес-логіку та взаємодіють з базою даних:
- [`services.UserService`](src/services/UserService.ts)
- [`services.ClientService`](src/services/ClientService.ts)
- [`services.DeviceService`](src/services/DeviceService.ts)
- [`services.TariffService`](src/services/TariffService.ts)
- [`services.SubscriptionService`](src/services/SubscriptionService.ts)

## Нова архітектура додатку — шари та їхня роль

1. **Middleware (Валідація):** Відсікає некоректні дані (наприклад, невалідний email або відсутні обов'язкові поля) ще до обробки запиту.
2. **Controller (Оркестрація):** Приймає HTTP-запит, звертається до сервісу та повертає відповідь клієнту через DTO.
3. **Service (Бізнес-логіка):** Обробляє дані, виконує розрахунки та координує роботу з БД.
4. **Repository / Entity (Доступ до даних):** Описує структуру таблиць PostgreSQL та надає методи для SQL-запитів.
