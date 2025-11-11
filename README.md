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

Создать `.env` со следующим содержимым:

```ini
TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
; https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit?gid=0#gid=0
SPREADSHEET_ID=YOUR_SPREADSHEET_ID
SHEET_TITLE=Лист1
```

### Получение Google API Key

* Открыть [Google Cloud Console](https://console.cloud.google.com/)
* Создать новый проект (или использовать существующий)
* Создать API Key
* В разделе **APIs & Services → Library** включить **Google Sheets API**
  <!-- https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=1038693916349 -->
