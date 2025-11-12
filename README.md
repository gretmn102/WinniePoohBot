# WinniePoohBot

Бот для [Telegram](https://telegram.org/), который поздравляет с днем рождения. В качестве базы данных использует [Google таблицу](https://docs.google.com/spreadsheets/u/0/?pli=1).

## Как работает

* Запускается
* Считывается целиком база данных, заданная в настройках Гугл таблицы

  Например:

  | дата      | поздравление                                                                                                                             |
  |-----------|------------------------------------------------------------------------------------------------------------------------------------------|
  | 16 ноября | Сегодня мы поздравляем сразу двоих - [Аделину](@oejfjf), автора движка "HEBD&@" и [Евлампия](@example), популярного автора игр на Twine! |

* Сверяет сегодняшнюю дату с имеющимися в БД
* Постит поздравления с совпавшими датами в указанный в настройках канал

## Установка

* Скомпилировать проект (в будущем сделаю, чтобы сразу можно было скачать скомпилированное<!-- todo -->) (см. [Компиляция](#компиляция))
* Создать `.env`
* Добавить в него токен Telegram бота (см. [Создание бота в Telegram](#создание-бота-в-telegram)):

  ```ini
  TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
  ```

* Добавить в него ключ Google API (см. [получение ключа](#получение-google-api-key)):

  ```ini
  GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
  ```

* Создать [Гугл-таблицу](https://docs.google.com/spreadsheets/u/0/?pli=1)
* Заполнить ее (см. [таблицу-пример](https://docs.google.com/spreadsheets/d/12j1RWPQNSKQ_q_SWJK6yjNBQQJ8AMtrvt0dRvNBQYFw/edit?gid=0#gid=0))
* Сделать таблицу публичной:

  * Нажать **Настройки доступа**
  * Выбрать **Все, у кого есть ссылка** в графе **Общий доступ**
* Скопировать ссылку
* Скопировать ID таблицы из ссылки:

  ```text
  https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit?gid=0#gid=0
  ```

* Вставить ID таблицы в `.env`:

  ```ini
  SPREADSHEET_ID=YOUR_SPREADSHEET_ID
  ```

* Запустить бот:

  ```bash
  node index.js
  ```

* Пригласить бота на свой сервер
* Написать `/start`, чтобы получить ID чата
* Вставить ID чата в `.env`:

  ```bash
  CHAT_ID=YOUR_CHAT_ID
  ```

Бот можно закрывать. Теперь достаточно его запустить, чтобы он сделал свое дело и благополучно закрылся.

### Создание бота в Telegram

* Открыть [BotFather](https://t.me/BotFather)
* Вызвать `/newbot`
* Ввести название для нового бота

BotFather должен выдать токен после фразы:

> Use this token to access the HTTP API

### Получение Google API Key

* Открыть [Google Cloud Console](https://console.cloud.google.com/)
* Создать новый проект (или использовать существующий)
* Создать API Key
* В разделе **APIs & Services → Library** включить **Google Sheets API**
  <!-- https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=1038693916349 -->

## Разработка

### Компиляция

* Скачать git хранилище

  ```bash
  git clone https://github.com/gretmn102/WinniePoohBot.git
  ```

* Установить [NodeJS](https://nodejs.org/en/download) (у меня — `v18.20.0`, например)
* Перейти в папку проекта
* Установить пакеты

  ```bash
  npm install
  ```

* Скомпилировать

  ```bash
  npm run build
  ```

Проект скомпилируется в папку `build`. С нее можно запускать проект:

```bash
node index.js
```
