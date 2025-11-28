import React, { useState, useEffect } from 'react';
import AppInput from '../components/AppInput';
import AppBtn from '../components/AppBtn';
import axios from 'axios';

const EditApplication = ({ application, onUpdate, onCancel }) => {
  const [form, setForm] = useState({
    ...application,
    staff_notes: application.staff_notes || ''  
  });

  useEffect(() => {
    setForm({
      ...application,
      staff_notes: application.staff_notes || ''
    });
  }, [application]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await onUpdate(form);
    } catch (error) {
      console.error('Ошибка при сохранении заявки:', error);
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AppInput 
        value={form.name} 
        onChange={(value) => handleChange('name', value)} 
        placeholder="Имя" 
      />
      <AppInput 
        value={form.phone} 
        onChange={(value) => handleChange('phone', value)} 
        placeholder="Телефон" 
      />
      <AppInput 
        value={form.email} 
        onChange={(value) => handleChange('email', value)} 
        placeholder="Email" 
      />
      <AppInput 
        value={form.company} 
        onChange={(value) => handleChange('company', value)} 
        placeholder="Компания" 
      />
      <AppInput 
        value={form.inn} 
        onChange={(value) => handleChange('inn', value)} 
        placeholder="ИНН" 
      />
      <AppInput 
        value={form.notes} 
        onChange={(value) => handleChange('notes', value)} 
        placeholder="Заметки клиента" 
        readOnly  
      />
      <AppInput 
        value={form.staff_notes} 
        onChange={(value) => handleChange('staff_notes', value)} 
        placeholder="Комментарий сотрудника"  
      />
      <AppBtn text="Сохранить" type="submit" />
      <AppBtn text="Отмена" onClick={onCancel} />
    </form>
  );
};

export default EditApplication;
