# Student Help 🎓

Платформа для взаимопомощи среди студентов. Здесь можно создать запрос о помощи или откликнуться на чужой запрос.

## 📋 Содержание
- О проекте
- Функционал
- Технологии
- Установка
- Запуск
- Структура проекта
- API Endpoints
- База данных
- Скриншоты
- Команда

## 🎯 О проекте

Student Help - это веб-приложение, созданное для того, чтобы студенты могли легко находить помощь в учебе и бытовых вопросах. Проект реализует принцип "равный-равному" (peer-to-peer), где каждый может как просить о помощи, так и предлагать её.

**Проблема:** Студенты часто нуждаются в помощи (учеба, бытовые вопросы, поиск информации), но не знают, к кому обратиться.

**Решение:** Создание платформы, объединяющей тех, кто ищет помощь, и тех, кто готов её оказать.

## ✨ Функционал

### 👤 Пользователи
- ✅ Регистрация и авторизация
- ✅ Личный профиль с аватаркой
- ✅ Редактирование профиля (имя, email, bio)
- ✅ Загрузка аватарки
- ✅ Просмотр профилей других пользователей

### 📝 Запросы на помощь
- ✅ Создание запроса с заголовком, описанием и категорией
- ✅ Просмотр всех активных запросов на главной
- ✅ Фильтрация по категориям
- ✅ Кликабельные карточки запросов
- ✅ Статусы запросов (активен/выполнен/отменен)

### 💬 Отклики
- ✅ Возможность откликнуться на запрос
- ✅ Просмотр всех откликов на странице запроса
- ✅ Отображение откликов в профиле пользователя (в виде таймлайна)

### ⭐ Рейтинг
- ✅ Оценка помощников от 1 до 5 звезд
- ✅ Средний рейтинг отображается в профиле
- ✅ Визуализация рейтинга звездами (полные, половинки, пустые)
- ✅ Защита от повторных оценок

### 🔍 Поиск
- ✅ Поиск пользователей по имени
- ✅ Кликабельные результаты поиска

## 🛠 Технологии

### Backend
- **Python 3.10+**
- **FastAPI** - современный веб-фреймворк
- **SQLite** - легковесная база данных
- **Jinja2** - шаблонизатор для HTML
- **JWT** - аутентификация через токены
- **Passlib** - хеширование паролей
- **Uvicorn** - ASGI сервер

### Frontend
- **HTML5** + **CSS3**
- **JavaScript** (vanilla)
- **Font Awesome** - иконки
- **Адаптивный дизайн** (мобильные/планшеты/десктоп)

## 📦 Установка

### Требования
- Python 3.10 или выше
- pip (менеджер пакетов Python)
- Git (опционально)

### Пошаговая инструкция

1. **Клонировать репозиторий**
```bash
git clone https://github.com/yourusername/student-help.git
cd student-help-backend
```

2. **Создать виртуальное окружение**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Установить зависимости**
```bash
pip install -r requirements.txt
```

4. **Настроить базу данных**
```bash
# База создастся автоматически при первом запуске
# Опционально: создать тестовые данные
python create_test_users.py
```

5. **Запустить сервер**
```bash
python -m uvicorn app.main:app --reload
```

6. **Открыть в браузере**
```
http://localhost:8000
```

## 🚀 Запуск

### Режим разработки
```bash
# Автоматическая перезагрузка при изменениях
python -m uvicorn app.main:app --reload
```

### Режим production
```bash
# Без автоматической перезагрузки
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📁 Структура проекта

```
student-help-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Точка входа
│   ├── config.py               # Конфигурация
│   ├── auth.py                 # Аутентификация
│   ├── database.py             # Подключение к БД
│   ├── models.py               # Модели данных
│   ├── dependencies.py         # Зависимости
│   ├── routers/                # Маршруты
│   │   ├── __init__.py
│   │   ├── auth.py             # /login, /register
│   │   ├── profile.py          # /profile
│   │   ├── requests.py         # /, /create, /request
│   │   └── search.py           # /search
│   ├── templates/               # HTML шаблоны
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── profile.html
│   │   ├── public_profile.html
│   │   ├── create.html
│   │   ├── request.html
│   │   └── rate_helper.html
│   ├── static/                  # Статические файлы
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── img/
│   │       └── default-avatar.png
│   └── database/                # База данных
│       └── help.db
├── venv/                         # Виртуальное окружение
├── requirements.txt              # Зависимости
├── create_test_users.py          # Тестовые данные
├── clear_database.py             # Очистка БД
└── README.md                     # Документация
```

## 🔌 API Endpoints

### Аутентификация
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/login` | Страница входа |
| POST | `/login` | Вход в систему |
| GET | `/register` | Страница регистрации |
| POST | `/register` | Регистрация |
| GET | `/logout` | Выход |

### Профиль
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/profile` | Мой профиль |
| GET | `/profile/{id}` | Профиль пользователя |
| GET | `/profile/edit` | Редактирование |
| POST | `/profile/edit` | Сохранить изменения |
| POST | `/profile/avatar` | Загрузить аватар |

### Запросы
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/` | Главная (список запросов) |
| GET | `/create` | Создать запрос |
| POST | `/create` | Сохранить запрос |
| GET | `/request/{id}` | Просмотр запроса |
| POST | `/request/{id}/respond` | Откликнуться |

### Рейтинг
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/rate/{request_id}/{helper_id}` | Страница оценки |
| POST | `/request/{id}/rate` | Отправить оценку |

### Поиск
| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/search?q={query}` | Поиск пользователей |

## 💾 База данных

### Таблица users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT DEFAULT '/static/img/default-avatar.png',
    rating REAL DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    bio TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица help_requests
```sql
CREATE TABLE help_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER,
    author_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    location TEXT,
    urgency TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (author_id) REFERENCES users (id)
);
```

### Таблица responses
```sql
CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER NOT NULL,
    helper_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES help_requests (id),
    FOREIGN KEY (helper_id) REFERENCES users (id)
);
```

### Таблица ratings
```sql
CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    request_id INTEGER NOT NULL,
    score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users (id),
    FOREIGN KEY (to_user_id) REFERENCES users (id),
    FOREIGN KEY (request_id) REFERENCES help_requests (id),
    UNIQUE(from_user_id, request_id)
);
```

### Таблица categories
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);
```

## 📸 Скриншоты

(Здесь можно добавить скриншоты интерфейса)

## 👥 Команда

Проект разработан командой:

- **Frontend-разработчик** - отвечает за интерфейс, верстку, JavaScript
- **Backend-разработчик** - отвечает за сервер, базу данных, API

**Student Help** - помогаем друг другу! 🎓



**Ошибка (venv) PS C:\Users\User\Desktop\Fr13nds\student-help-backend> pip install -r requirements.txt
Fatal error in launcher: Unable to create process using '"C:\Users\Admin\Desktop\Fr13nds\student-help-backend\venv\Scripts\python.exe"
"C:\Users\User\Desktop\Fr13nds\student-help-backend\venv\Scripts\pip.exe" install -r requirements.txt': ?? ??????? ????? ????????? ????.**
```bash
# Выходим из текущего виртуального окружения
deactivate

# Удаляем старую папку venv
Remove-Item -Recurse -Force venv

# Создаем новое виртуальное окружение
py -m venv venv

# Активируем его (сначала пробуем через bat файл)
venv\Scripts\activate
```
