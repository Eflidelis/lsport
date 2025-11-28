import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppChecker from '../components/AppChecker';
import EditApplication from '../components/EditApplication';
import './ApplicationsPage.scss';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredApplications = applications.filter(app =>
    Object.values(app).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDateFilter = (event) => {
    setFilterDate(event.target.value);
  };

  const handleMonthFilter = (event) => {
    setFilterMonth(event.target.value);
  };

  // фильтрация по дате и месяцу
  const sortedApplications = filteredApplications.filter(app => {
    const appDate = new Date(app.created_at);
    const isoDate = appDate.toISOString().slice(0, 10);
    const isoMonth = appDate.toISOString().slice(0, 7);

    const matchesDate = filterDate ? isoDate === filterDate : true;
    const matchesMonth = filterMonth ? isoMonth === filterMonth : true;

    return matchesDate && matchesMonth;
  });

  const toggleSelect = (id) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
  };

  const markAsCompleted = async () => {
    try {
      await Promise.all(selectedApps.map(async (id) => {
        await axios.put(`http://localhost:5000/api/applications/status/${id}`, { completed: true });
      }));
      setSelectedApps([]);
      const response = await axios.get('http://localhost:5000/api/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const archiveSelected = async () => {
    try {
      await Promise.all(selectedApps.map(async (id) => {
        await axios.put(`http://localhost:5000/api/applications/archive/${id}`);
      }));
      setSelectedApps([]);
      const response = await axios.get('http://localhost:5000/api/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Ошибка при архивировании заявок:', error);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedApps.map(async (id) => {
        await axios.delete(`http://localhost:5000/api/applications/${id}`);
      }));
      setSelectedApps([]);
      const response = await axios.get('http://localhost:5000/api/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Ошибка при удалении заявок:', error);
    }
  };

  const handleEdit = (app) => {
    setEditingApp(app);
  };

  const handleUpdate = async (updatedApp) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${updatedApp.id}`, updatedApp);
      const response = await axios.get('http://localhost:5000/api/applications');
      setApplications(response.data);
      setEditingApp(null);
    } catch (error) {
      console.error('Ошибка при обновлении заявки:', error);
    }
  };

  return (
    <div className="applications-page">
      <h2>Список заявок:</h2>

      <input
        type="text"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <input
        type="date"
        value={filterDate}
        onChange={handleDateFilter}
      />

      <input
        type="month"
        value={filterMonth}
        onChange={handleMonthFilter}
      />

      <button onClick={markAsCompleted} disabled={selectedApps.length === 0}>
        Отметить выполненной
      </button>

      <button onClick={archiveSelected} disabled={selectedApps.length === 0}>
        Отправить в архив
      </button>

      <button onClick={deleteSelected} disabled={selectedApps.length === 0}>
        Удалить
      </button>

      <ul>
        {sortedApplications.map((app) => (
          <li key={app.id}>
            <AppChecker
              checked={selectedApps.includes(app.id)}
              onChange={() => toggleSelect(app.id)}
            />

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
              <div className="value">{new Date(app.created_at).toLocaleString()}</div>

            </div>

            <button onClick={() => handleEdit(app)}>Изменить</button>
          </li>
        ))}
      </ul>

      {editingApp && (
        <EditApplication
          application={editingApp}
          onUpdate={handleUpdate}
          onCancel={() => setEditingApp(null)}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
