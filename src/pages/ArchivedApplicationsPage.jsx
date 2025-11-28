import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ArchivedApplicationsPage.scss';

const ArchivedApplicationsPage = () => {
  const [archivedApplications, setArchivedApplications] = useState([]);

  // загрузка архивных заявок
  useEffect(() => {
    fetchArchived();
  }, []);

  const fetchArchived = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications/archive');
      setArchivedApplications(response.data);
    } catch (error) {
      console.error('Ошибка при получении архивированных заявок:', error);
    }
  };

  // Удаление окончательно
  const deleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/archive/${id}`);
      fetchArchived(); // обновление списка после удаления
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
    }
  };

  return (
    <div className="archived-applications-page">
      <h2>Архив заявок:</h2>

      <ul>
        {archivedApplications.map((app) => (
          <li key={app.id}>

            {/* Табличная структура */}
            <div className="app-table">

              <div className="label">Имя:</div>
              <div className="value">{app.name}</div>

              <div className="label">Телефон:</div>
              <div className="value">{app.phone}</div>

              <div className="label">Email:</div>
              <div className="value">{app.email}</div>

              <div className="label">Компания:</div>
              <div className="value">{app.company}</div>

              <div className="label">ИНН:</div>
              <div className="value">{app.inn}</div>

              <div className="label">Согласие с политикой:</div>
              <div className="value">{app.accept_policy ? 'Да' : 'Нет'}</div>

              <div className="label">Завершено:</div>
              <div className="value">{app.completed ? 'Да' : 'Нет'}</div>

              <div className="label">Заметки клиента:</div>
              <div className="value">{app.notes}</div>

              <div className="label">Комментарий сотрудника:</div>
              <div className="value">{app.staff_notes || '- отсутствует -'}</div>

              <div className="label">Дата создания:</div>
              <div className="value">
                {new Date(app.created_at).toLocaleString()}
              </div>

            </div>

            {/* Кнопка Удалить */}
            <button
              className="delete-btn"
              onClick={() => deleteApplication(app.id)}
            >
              Удалить окончательно
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchivedApplicationsPage;
