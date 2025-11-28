const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const axios = require('axios');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Получение заявок
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM applications');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении заявок:', err);
        res.status(500).send('Server error');
    }
});

// Получение арх заявок 
router.get('/archive', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM archived_applications');
        res.json(result.rows);
    } catch (err) {
        console.error('Ошибка при получении архивированных заявок:', err);
        res.status(500).send('Server error');
    }
});

// Добавление нов заявки 
router.post('/', async (req, res) => {
    const { name, phone, email, company, inn, accept_policy, notes } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO applications (name, phone, email, company, inn, accept_policy, notes, staff_notes) VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8) RETURNING *',
            [name, phone, email, company, inn, accept_policy, notes || '', ''] 
        );

        // копию данных в Django для Telegram
        const notificationResponse = await axios.post('http://localhost:8000/notify/', result.rows[0]);
        console.log(notificationResponse.data);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при добавлении заявки:', err);
        res.status(500).send('Server error');
    }
});

// Обнов.заявки
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, company, inn, accept_policy, notes, staff_notes, completed } = req.body;

    // Проверка на обязат.поля
    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    try {
        const result = await pool.query(
            'UPDATE applications SET name = \$1, phone = \$2, email = \$3, company = \$4, inn = \$5, accept_policy = \$6, notes = \$7, staff_notes = \$8, completed = \$9 WHERE id = \$10 RETURNING *',
            [name, phone, email, company, inn, accept_policy, notes || '', staff_notes || '', completed, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при обновлении заявки:', err);
        res.status(500).send('Server error');
    }
});

// Обнов. статуса
router.put('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    if (completed === undefined) {
        return res.status(400).json({ error: 'Поле completed обязательно' });
    }

    try {
        const checkResult = await pool.query('SELECT completed FROM applications WHERE id = \$1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        if (checkResult.rows[0].completed) {
            return res.status(409).json({ error: 'Заявка уже отмечена как выполненная' });
        }

        const result = await pool.query(
            'UPDATE applications SET completed = \$1 WHERE id = \$2 RETURNING *',
            [completed, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при обновлении статуса заявки:', err);
        res.status(500).send('Server error');
    }
});

// Обнов. комментария сотрудника
router.put('/comment/:id', async (req, res) => {
    const { id } = req.params;
    const { staff_notes } = req.body;

    if (staff_notes === undefined) {
        return res.status(400).json({ error: 'Поле staff_notes обязательно' });
    }

    try {
        const checkResult = await pool.query('SELECT completed FROM applications WHERE id = \$1', [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        if (checkResult.rows[0].completed) {
            return res.status(409).json({ error: 'Заявка уже отмечена как выполненная' });
        }

        const result = await pool.query(
            'UPDATE applications SET staff_notes = \$1 WHERE id = \$2 RETURNING *',
            [staff_notes, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Ошибка при обновлении комментария сотрудника:', err);
        res.status(500).send('Server error');
    }
});

// Архивирование
router.put('/archive/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const applicationResult = await pool.query('SELECT * FROM applications WHERE id = \$1', [id]);

        if (applicationResult.rows.length === 0) {
            return res.status(404).send('Заявка не найдена');
        }

        const applicationData = applicationResult.rows[0];
        console.log('Полученные данные для архивирования:', applicationData);

        await pool.query(
            'INSERT INTO archived_applications (name, phone, email, company, inn, accept_policy, created_at, completed, notes, staff_notes) VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10)',
            [
                applicationData.name,
                applicationData.phone,
                applicationData.email,
                applicationData.company,
                applicationData.inn,
                applicationData.accept_policy,
                applicationData.created_at,
                applicationData.completed,
                applicationData.notes,
                applicationData.staff_notes
            ]
        );

        await pool.query('DELETE FROM applications WHERE id = \$1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при архивировании заявки:', err);
        res.status(500).send('Server error');
    }
});

// Удаление
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM applications WHERE id = \$1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при удалении заявки:', err);
        res.status(500).send('Server error');
    }
});

// Удаление из архива
router.delete('/archive/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM archived_applications WHERE id = \$1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error('Ошибка при удалении заявки из архива:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
