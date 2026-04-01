# qtim-nest

## Запуск

Скачайте репозиторий:
```bash
git clone https://github.com/al-revenko/qtim-nest
```

В корне проекта создайте файл `.env` и скопируйте в него переменные из файла [env.example](./.env.example). Задайте нужные значения переменным.

Установите зависимости:
```bash
npm i
```

Соберите приложение:
```bash
npm run build
```

Запустите миграции (база данных и раздел public должны существовать):
```bash
npm run migration:up
```

Запустите приложение:
```bash
npm run start
```

## Swagger

Документация по эндпоинтам доступна по `GET /api` эндпоинту
