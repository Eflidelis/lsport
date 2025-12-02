import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppChecker from '../components/AppChecker';
import './ApplicationsPage.scss';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const [sortOrder, setSortOrder] = useState("desc"); // сортировка

  
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    inn: '',
    staff_notes: '',
  });

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    const res = await axios.get("http://localhost:5000/api/applications");
    setApplications(res.data);
  };

  /* фильтры */
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleDateFilter = (e) => setFilterDate(e.target.value);
  const handleMonthFilter = (e) => setFilterMonth(e.target.value);

  const filtered = applications.filter((app) =>
    Object.values(app).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const finalApps = filtered.filter((app) => {
    const d = new Date(app.created_at);
    const isoDate = d.toISOString().slice(0, 10);
    const isoMonth = d.toISOString().slice(0, 7);

    return (filterDate ? isoDate === filterDate : true) &&
           (filterMonth ? isoMonth === filterMonth : true);
  });

  /* выбор заявок */
  const toggleSelect = (id) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* групповые действия */

  const bulkAction = async (type) => {
    try {
      if (type === "complete") {
        await Promise.all(selectedApps.map(id =>
          axios.put(`http://localhost:5000/api/applications/status/${id}`, { completed: true })
        ));
      }

      if (type === "archive") {
        await Promise.all(selectedApps.map(id =>
          axios.put(`http://localhost:5000/api/applications/archive/${id}`)
        ));
      }

      if (type === "delete") {
        await Promise.all(selectedApps.map(id =>
          axios.delete(`http://localhost:5000/api/applications/${id}`)
        ));
      }

      setSelectedApps([]);
      await loadApps();

    } catch (e) {
      console.error(e);
    }
  };

  /* редактирование */

  const startEdit = (app) => {
    setEditingId(app.id);

    setEditForm({
      name: app.name || '',
      phone: app.phone || '',
      email: app.email || '',
      company: app.company || '',
      inn: app.inn || '',
      staff_notes: app.staff_notes || '',
    });
  };

  const cancelEdit = () => setEditingId(null);

  
  const saveEdit = async (app) => {
    try {
      const updatedApp = {
        ...app, // сохраняются все оригинальные поля заявки
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        company: editForm.company,
        inn: editForm.inn,
        staff_notes: editForm.staff_notes,
        updated_at: new Date().toISOString(),
      };

      await axios.put(`http://localhost:5000/api/applications/${app.id}`, updatedApp);

      await loadApps();
      setEditingId(null);

    } catch (e) {
      console.error("Ошибка сохранения заявки", e);
    }
  };

  /* сортировка */

  const sortedApps = [...finalApps].sort((a, b) => {
    const t1 = new Date(a.created_at).getTime();
    const t2 = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? t2 - t1 : t1 - t2;
  });

  

  return (
    <div className="applications-page">
      <h2>Список заявок:</h2>

      {/* панель */}
      <div className="actions-panel">
        <div className="actions-inner">
          <input type="text" placeholder="Поиск..." value={searchTerm} onChange={handleSearch} />
          <input type="date" value={filterDate} onChange={handleDateFilter} />
          <input type="month" value={filterMonth} onChange={handleMonthFilter} />

          {/* кнопка сортировки */}
          <button
            className="sort-btn"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            Сортировка: {sortOrder === "desc" ? "Новые ↓" : "Старые ↑"}
          </button>

          <button disabled={!selectedApps.length} onClick={() => bulkAction("complete")}>
            Выполнена
          </button>

          <button disabled={!selectedApps.length} onClick={() => bulkAction("archive")}>
            В архив
          </button>

          <button disabled={!selectedApps.length} className="danger" onClick={() => bulkAction("delete")}>
            Удалить
          </button>
        </div>
      </div>

      <ul>
        {sortedApps.map((app) => {
          const isEditing = editingId === app.id;

          return (
            <li key={app.id} className={isEditing ? "editing" : ""}>

              <AppChecker
                checked={selectedApps.includes(app.id)}
                onChange={() => toggleSelect(app.id)}
              />

              <div className="app-table">

                {/* Имя */}
                <div className="label">Имя:</div>
                <div className="value">
                  {isEditing ? (
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  ) : app.name}
                </div>

                {/* Телефон */}
                <div className="label">Телефон:</div>
                <div className="value">
                  {isEditing ? (
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  ) : app.phone}
                </div>

                {/* email */}
                <div className="label">Email:</div>
                <div className="value">
                  {isEditing ? (
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  ) : app.email}
                </div>

                {/* Компания */}
                <div className="label">Компания:</div>
                <div className="value">
                  {isEditing ? (
                    <input
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    />
                  ) : app.company}
                </div>

                {/* ИНН */}
                <div className="label">ИНН:</div>
                <div className="value">
                  {isEditing ? (
                    <input
                      value={editForm.inn}
                      onChange={(e) => setEditForm({ ...editForm, inn: e.target.value })}
                    />
                  ) : app.inn}
                </div>

                {/* Согласие */}
                <div className="label">Согласие с политикой:</div>
                <div className="value">{app.accept_policy ? "Да" : "Нет"}</div>

                {/* Завершено */}
                <div className="label">Завершено:</div>
                <div className="value">{app.completed ? "Да" : "Нет"}</div>

                {/* Заметки клиента */}
                <div className="label">Заметки клиента:</div>
                <div className="value notes-client">{app.notes}</div>

                {/* Комментарий сотрудника */}
                <div className="label">Комментарий сотрудника:</div>
                <div className="value">
                  {isEditing ? (
                    <textarea
                      value={editForm.staff_notes}
                      onChange={(e) => setEditForm({ ...editForm, staff_notes: e.target.value })}
                    />
                  ) : app.staff_notes || "- отсутствует -"}
                </div>

                {/* Дата создания */}
                <div className="label">Дата создания:</div>
                <div className="value">
                  {new Date(app.created_at).toLocaleString()}
                </div>

                {/* Дата изменения - решила не включать пока */}
                {app.updated_at && (
                  <>
                    <div className="label">Изменено:</div>
                    <div className="value">
                      {new Date(app.updated_at).toLocaleString()}
                    </div>
                  </>
                )}

              </div>

              {isEditing ? (
                <div className="edit-buttons">
                  <button className="save" onClick={() => saveEdit(app)}>
                    Сохранить
                  </button>
                  <button className="cancel" onClick={cancelEdit}>
                    Отмена
                  </button>
                </div>
              ) : (
                <button onClick={() => startEdit(app)}>Изменить</button>
              )}

            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApplicationsPage;
