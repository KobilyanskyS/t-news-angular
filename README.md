# T-News (TNewsAngular)

Фронтенд на Angular 20 для t-news

## Краткая структура проекта

- Стартовая точка
  - [src/main.ts](src/main.ts) — bootstrap приложения, использует [`appConfig`](src/app/app.config.ts).
- Маршрутизация
  - [src/app/app.routes.ts](src/app/app.routes.ts) — все маршруты приложения.
- Страницы (pages)
  - Лента: [`FeedPage`](src/app/pages/feed-page/feed-page.ts)
  - Вход: [`LogInPage`](src/app/pages/log-in-page/log-in-page.ts)
  - Регистрация: [`SignUpPage`](src/app/pages/sign-up-page/sign-up-page.ts)
  - Профиль пользователя: [`ProfilePage`](src/app/pages/profile-page/profile-page.ts)
  - Поиск: [`SearchPage`](src/app/pages/search-page/search-page.ts)
  - 404: [`NotFoundPage`](src/app/pages/not-found-page/not-found-page.ts)
- Компоненты
  - Шапка: [`HeaderComponent`](src/app/components/header/header.ts)
  - Посты: [`PostsListComponent`](src/app/components/posts/posts-list/posts-list.ts), [`PostComponent`](src/app/components/posts/post/post.ts)
  - Создание поста: [`PostFormComponent`](src/app/components/posts/post-form/post-form.ts)
  - Комментарии: [`CommentsBlockComponent`](src/app/components/comments/comments-block/comments-block.ts), [`CommentsFormComponent`](src/app/components/comments/comments-form/comments-form.ts), [`CommentComponent`](src/app/components/comments/comment/comment.ts)
- Сервисы
  - АПИ-обёртка: [`ApiService`](src/app/services/api/api.ts)
  - Аутентификация: [`AuthService`](src/app/services/auth/auth.ts)
  - Работа с постами: [`PostsService`](src/app/services/posts/posts.ts)
  - Работа с пользователями: [`UserService`](src/app/services/user/user.ts)
  - Поиск: [`SearchService`](src/app/services/search/search.ts)
- Модели типов: см. [src/app/models](src/app/models) — [`User`](src/app/models/user.ts), [`Post`](src/app/models/post.ts), [`Comment`](src/app/models/comment.ts), [`SearchResult`](src/app/models/search-result.ts)
- Константы
  - [src/app/constants/constants.ts](src/app/constants/constants.ts) — базовый URL API (API_SERVER).

Файлы шаблонов и стилей рядом с компонентами: для каждой сущности есть .html и .less (см. папки в `src/app`).

## Установка и запуск (локально)

Требования:
- Node.js (рекомендуется LTS)
- npm

Шаги:

1. Установить зависимости:
```sh
npm install
```

2. Запустить dev-сервер:
```sh
npm start
# или напрямую
ng serve
```
Откройте: http://localhost:4200/

## Настройка API

Базовый адрес сервера задаётся в [`src/app/constants/constants.ts`](src/app/constants/constants.ts). При необходимости поменяйте значение `API_SERVER`.

## Заметки по кодовой базе

- Авторизация хранит текущего пользователя в localStorage и cookie (`ngx-cookie-service`) — реализация в [`AuthService`](src/app/services/auth/auth.ts).
- Запросы проходят через [`ApiService`](src/app/services/api/api.ts) — он добавляет `withCredentials`.
- Компоненты используют standalone-конфигурацию (imports в декораторах).
- Шрифты/ассеты находятся в `src/assets` и `public/`, подключены в [src/app/styles/fonts.less](src/app/styles/fonts.less) и [src/styles.less](src/styles.less).

## Backend

[t-news-angular-backend](https://github.com/KobilyanskyS/t-news-angular-backend)