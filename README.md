# Film catalogue app
Film catalogue app - додаток для зберігання інформації про фільми. 

## Стек технологій:
* Front-end - React.js [репозиторій](https://github.com/vipr0/film-catalogue-app) [сайт](https://film-catalogue-app.vercel.app/).  
* Back-end - REST API на express.js
* Database - MongoDB

## Опис REST API
REST API побудоване на Node.js  з використанням бібліотеки Express.js

### Endpoints
* `GET /films` - отримати список всіх фільмів. 
* `GET /films/:id` - отримати фільм за  id.
* `DELETE /films/:id` -  видалити фільм за  id.
* `POST /films` - додати новий фільм. 
Приклад тіла запиту:
```json
{
    "title": "Blazing Saddles 2",
    "releaseYear": 1974,
    "format": "VHS",
    "stars": ["Mel Brooks", "Clevon Little", "Harvey Korman", "Gene Wilder", "Slim Pickens", "Madeline Kahn"]
}
```
* `GET /films/search?query= %query_string%` - пошук фільмів за назвою або іменем актора, де /%query_string%/ - строка пошуку.
* `POST /films/import` - імпортувати список фільмів з файлу.  Тип контенту тіла запиту -  /*multipart/form-data*/ з полем file,  який містить файл для надсилання.

## Доступні команди
* `npm start` - запуск додатку в production режимі
* `npm run dev` - запуск додатку в development режимі
* `npm test` - запуск тестів

## Інструкція з запуску додатку
1. Клонувати репозиторій
```bash
git clone https://github.com/vipr0/film-catalogue-server.git
```
2. Встановити пакети з npm
```bash
cd film-catalogue-server
npm install
```
3. Для *production mode* додати в своєму середовищі змінну середовища *MONGODB_URL* та вказати в ній значення строки підключення до своєї MongoDB бази даних. 
Для *development mode* перейменувати файл в папці /config/ /dev.env.example/ в /dev.env/ та заповнити значення для змінних.
Для *запуску тестів* перейменувати файл в папці /config/ /test.env.example/ в /test.env/ та заповнити значення для змінних.
4. Запустити додаток
```bash
npm start # production mode
npm run dev # development mode
npm test # run tests
```