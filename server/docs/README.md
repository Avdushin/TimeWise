Вот краткая документация API с примерами запросов cURL в формате Markdown:

```markdown
# API Documentation

## Authentication

### Register User
- **POST** `/api/signup`
- **Body**:
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword",
    "birthdate": "2000-01-01",
    "first_name": "Test",
    "last_name": "User",
    "middle_name": null,
    "country": null,
    "city": null,
    "phone": null
  }
  ```
- **CURL**:
  ```bash
  curl -X POST http://localhost:4000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "securepassword", "birthdate": "2000-01-01", "first_name": "Test", "last_name": "User", "middle_name": null, "country": null, "city": null, "phone": null}'
  ```

### Login User
- **POST** `/api/login`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "securepassword"
  }
  ```
- **CURL**:
  ```bash
  curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "securepassword"}'
  ```

## Tasks

### Create Task
- **POST** `/api/tasks`
- **Authorization**: Bearer Token
- **Body**:
  ```json
  {
    "title": "New Task",
    "description": "Complete this task.",
    "due_date": "2023-10-18"
  }
  ```
- **CURL**:
  ```bash
  curl -X POST http://localhost:4000/api/tasks \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Complete this task.", "due_date": "2023-10-18"}'
  ```

### Get All Tasks
- **GET** `/api/tasks`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X GET http://localhost:4000/api/tasks \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```

### Get Task by ID
- **GET** `/api/tasks/{id}`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X GET http://localhost:4000/api/tasks/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```

### Update Task
- **PUT** `/api/tasks/{id}`
- **Authorization**: Bearer Token
- **Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description.",
    "due_date": "2023-10-19"
  }
  ```
- **CURL**:
  ```bash
  curl -X PUT http://localhost:4000/api/tasks/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "description": "Updated description.", "due_date": "2023-10-19"}'
  ```

### Delete Task
- **DELETE** `/api/tasks/{id}`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X DELETE http://localhost:4000/api/tasks/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```

## Events

### Create Event
- **POST** `/api/events`
- **Authorization**: Bearer Token
- **Body**:
  ```json
  {
    "title": "New Event",
    "date": "2023-10-25",
    "description": "Event description.",
    "tags": ["conference", "tech"]
  }
  ```
- **CURL**:
  ```bash
  curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "New Event", "date": "2023-10-25", "description": "Event description.", "tags": ["conference", "tech"]}'
  ```

### Get All Events
- **GET** `/api/events`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X GET http://localhost:4000/api/events \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```

### Get Event by ID
- **GET** `/api/events/{id}`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X GET http://localhost:4000/api/events/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```

### Update Event
- **PUT** `/api/events/{id}`
- **Authorization**: Bearer Token
- **Body**:
  ```json
  {
    "title": "Updated Event",
    "date": "2023-11-01",
    "description": "Updated description of the event.",
    "tags": ["seminar", "tech"]
  }
  ```
- **CURL**:
  ```bash
  curl -X PUT http://localhost:4000/api/events/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Event", "date": "2023-11-01", "description": "Updated description of the event.", "tags": ["seminar", "tech"]}'
  ```

### Delete Event
- **DELETE** `/api/events/{id}`
- **Authorization**: Bearer Token
- **CURL**:
  ```bash
  curl -X DELETE http://localhost:4000/api/events/5979d34d-9687-48b6-bdd4-dcb7c1b5770a \
  -H "Authorization: Bearer [JWT_TOKEN]"
  ```
```