const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // просто вот так надо прописывать ключ, хз

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Настройки подключения к бд
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Для добавления тестового пользователя
// Пример: POST http://localhost:5000/api/add-test-user
app.post('/api/add-test-user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(
      'INSERT INTO employees (username, password_hash) VALUES (\$1, \$2) ON CONFLICT (username) DO NOTHING',
      ['admin', hashedPassword]
    );
    res.json({ message: 'Тестовый пользователь добавлен: admin / password123' });
  } catch (err) {
    console.error('Ошибка при добавлении тестового пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.post('/api/login', async (req, res) => {
  console.log('Получен запрос на /api/login'); // Лог
  console.log('Тело запроса:', req.body); 
  const { username, password } = req.body;
  console.log(`Проверка: username=${username}, password=${password}`);

  try {
    const result = await pool.query('SELECT * FROM employees WHERE username = \$1', [username]);
    console.log('Результат запроса к БД:', result.rows);
    if (result.rows.length === 0) {
      console.log('Пользователь не найден');
      return res.status(401).json({ error: 'Неверный логин' });
    }

    const user = result.rows[0];
    console.log('Найден пользователь:', user.username);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Пароль совпадает:', isMatch);
    if (!isMatch) {
      console.log('Неверный пароль');
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '2m' });
    console.log('Токен создан');
    res.json({ token });
  } catch (err) {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});


const applicationsRoutes = require('./routes/applications');
app.use('/api/applications', applicationsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
