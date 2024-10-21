## SWAGGER DOCUMENTATION
http://localhost:4000/swagger/index.html

## Примеры запросов в cURL:
---
### Регистрация пользователя:
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123",
  "role": "user",
  "username": "john_doe",
  "name": "John Doe",
  "birthday": "1990-01-01",
  "country": "USA",
  "city": "New York",
  "phone": "+1234567890"
}' http://localhost:4000/register
```

Обязательные поля:
- Email
- Password
  
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123",
}' http://localhost:4000/register
```

### Авторизация пользователя:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "user@example.com",
  "password": "password123"
}' http://localhost:4000/login
```

### Удаление пользователя (требуется авторизация и роль администратора):
```bash
curl -X DELETE -H "Authorization: Bearer your_jwt_token" http://localhost:4000/user/123
```

### Получение всех пользователей (требуется авторизация и роль администратора):

```bash
curl -X GET -H "Authorization: Bearer your_jwt_token" http://localhost:4000/users
```

### Создание контента (требуется авторизация):
```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer your_jwt_token" -d '{
  "category": "Technology",
  "title": "Introduction to Golang",
  "description": "A brief overview of the Go programming language.",
  "date": "2023-01-01T00:00:00Z"
}' http://localhost:4000/auth/content/create


curl -X POST -H "Content-Type: application/json; charset=utf-8" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiIiLCJyb2xlIjoidXNlciIsImV4cCI6MTcwNTI0NDAxOX0.3PeB270AEN4hUp4h8aD_7e2_9xrQ5QRkzAFUKOBSPX0" -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiIiLCJyb2xlIjoidXNlciIsImV4cCI6MTcwNTI0NDAxOX0.3PeB270AEN4hUp4h8aD_7e2_9xrQ5QRkzAFUKOBSPX0" -d @data.json http://localhost:4000/auth/content/create
```

### Обновление статуса контента
```bash
curl -X PUT -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcwMjU2NDA0OH0.3k3NqHskP0lrfBJ0pEB6bGCCyeXlb0cLfzTP6XVHhRg" -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcwMjU2NDA0OH0.3k3NqHskP0lrfBJ0pEB6bGCCyeXlb0cLfzTP6XVHhRg" -d '{"status": "Approved"}' http://localhost:4000/auth/content/update/1
```

### Получение контента на рассмотрении (требуется авторизация и роль администратора):
```bash
curl -X GET -H "Authorization: Bearer jwt_token" -b "token=jwt_token" http://localhost:4000/auth/content/pending
```

### Запрос на сброс пароля (отправляет письмо с ссылкой на восстановление пароля)
```bash
curl -X POST -H "Content-Type: application/json" -d '{"email": "post@gmail.com"}' http://localhost:4000/forgot-password
```

### Сброс пароля
```bash
curl -X POST -H "Content-Type: application/json" -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiIiLCJyb2xlIjoidXNlciIsImV4cCI6MTcwNTI0NzA0M30.OKH6K61Ts5IB2QFYCk6CEh8lGWkJjD0gZiXXlGmhUe0", "newPassword": "новый пароль"}' http://localhost:4000/reset-password
```

## Примеры запросов на JavaScript (используя Fetch API):
---
### Регистрация пользователя:
```javascript
fetch('http://localhost:4000/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    username: 'john_doe',
    name: 'John Doe',
    birthday: '1990-01-01',
    country: 'USA',
    city: 'New York',
    phone: '+1234567890',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

Обязательные поля:
- Email
- Password

```javascript
fetch('http://localhost:4000/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Авторизация пользователя:
```javascript
fetch('http://localhost:4000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Удаление пользователя (требуется авторизация и роль администратора):
```javascript
fetch('http://localhost:4000/user/123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer your_jwt_token',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Получение всех пользователей (требуется авторизация и роль администратора):
```javascript
fetch('http://localhost:4000/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_jwt_token',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Создание контента (требуется авторизация):
```javascript
const createContent = async () => {
  const url = 'http://localhost:4000/auth/content/create';
  const accessToken = 'YOUR_ACCESS_TOKEN'; // Замените на ваш реальный токен

  const data = {
    category: 'Technology',
    title: 'Введение в го',
    description: 'Аоаоаоаоао',
    date: '2023-01-01T00:00:00Z'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Получение контента на рассмотрении (требуется авторизация и роль администратора):
```javascript
fetch('http://localhost:4000/auth/content/pending', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_jwt_token',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Обновление статуса контента
```js
const contentID = 1;
const updateStatusRequest = { status: "Approved" };

// Замените токен на действительный
const token = "ваш_токен";

fetch(`http://localhost:4000/auth/content/update/${contentID}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(updateStatusRequest)
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Response:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

```

### Запрос на сброс пароля (отправляет письмо с ссылкой на восстановление пароля)

```js
const forgotPasswordRequest = {
  email: 'post@gmail.com',
};

fetch('http://localhost:4000/forgot-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(forgotPasswordRequest),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

```

### Сброс пароля

```js
const resetPasswordRequest = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiIiLCJyb2xlIjoidXNlciIsImV4cCI6MTcwNTI0NzA0M30.OKH6K61Ts5IB2QFYCk6CEh8lGWkJjD0gZiXXlGmhUe0',
  newPassword: 'новый пароль',
};

fetch('http://localhost:4000/reset-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(resetPasswordRequest),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

```