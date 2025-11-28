import React, { useState, useEffect } from 'react';
import AppInput from './AppInput';
import AppChecker from './AppChecker';
import './TheApplication.scss';
import heartsGif from '../assets/images/Olympics Hearts.gif';

const onlyDigits = (s) => String(s || '').replace(/\D/g, '');

const errorStyle = {
  color: '#E53935',
  fontSize: 12,
  lineHeight: 1.2,
  marginTop: 6,
  display: 'block',
};

const subtleNoteStyle = {
  fontSize: 12,
  color: 'rgba(0,0,0,0.55)',
  marginTop: 8,
};

const TheApplication = ({ submitApplication }) => {
  const buttonCss = `
  .learn-more-btn {
    position: relative;
    display: inline-block;
    cursor: pointer;
    border: 0;
    background: transparent;
    padding: 0;
    font: inherit;
    width: 12rem;
    height: auto;
    user-select: none;
  }
  .learn-more-btn .circle {
    transition: all .45s cubic-bezier(0.65,0,0.76,1);
    position: relative;
    display: block;
    margin: 0;
    width: 3rem;
    height: 3rem;
    background: #2563eb;
    border-radius: 1.625rem;
  }
  .learn-more-btn .circle .icon {
    transition: all .45s cubic-bezier(0.65,0,0.76,1);
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
  }
  .learn-more-btn .circle .icon.arrow {
    transition: all .45s cubic-bezier(0.65,0,0.76,1);
    left: .625rem;
    width: 1.125rem;
    height: .125rem;
    background: none;
  }
  .learn-more-btn .circle .icon.arrow::before {
    position: absolute;
    content: '';
    top: -.25rem;
    right: .0625rem;
    width: .625rem;
    height: .625rem;
    border-top: .125rem solid #fff;
    border-right: .125rem solid #fff;
    transform: rotate(45deg);
  }
  .learn-more-btn .button-text {
    transition: all .45s cubic-bezier(0.65,0,0.76,1);
    position: absolute;
    inset: 0;
    padding: .75rem 0;
    margin: 0 0 0 1.85rem;
    color: #2563eb;
    font-weight: 700;
    line-height: 1.6;
    text-align: center;
    text-transform: uppercase;
  }
  .learn-more-btn:hover:not(:disabled),
  .learn-more-btn:focus-visible:not(:disabled) {
    outline: none;
  }
  .learn-more-btn:hover:not(:disabled) .circle,
  .learn-more-btn:focus-visible:not(:disabled) .circle {
    width: 100%;
  }
  .learn-more-btn:hover:not(:disabled) .circle .icon.arrow,
  .learn-more-btn:focus-visible:not(:disabled) .circle .icon.arrow {
    background: #fff;
    transform: translate(1rem,0);
  }
  .learn-more-btn:hover:not(:disabled) .button-text,
  .learn-more-btn:focus-visible:not(:disabled) .button-text {
    color: #fff;
  }
  .learn-more-btn:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
  `;

  const [form, setForm] = useState({
    acceptPolicy: false,
    name: '',
    phone: '',
    email: '',
    company: '',
    inn: '',
    notes: '',
    phoneError: '',
    emailError: '',
    innError: '',
    send: false,
    waiting: false,
  });

  
  const [gifVisible, setGifVisible] = useState(false);

  useEffect(() => {
    if (form.send) {
      setGifVisible(true);
      
      const timeout = setTimeout(() => setGifVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [form.send]);

  const isActive = () =>
    form.name &&
    form.phone.length > 0 &&
    form.email &&
    form.acceptPolicy &&
    !form.waiting;

  const handleChange = (field, value) => {
    if (field === 'phone') {
      return setForm((p) => ({ ...p, phone: value, phoneError: '' }));
    }
    if (field === 'email') {
      return setForm((p) => ({ ...p, email: value, emailError: '' }));
    }
    if (field === 'inn') {
      return setForm((p) => ({
        ...p,
        inn: onlyDigits(value).slice(0, 12),
        innError: '',
      }));
    }
    setForm((p) => ({ ...p, [field]: value }));
  };

  const validateForm = () => {
    const next = { phoneError: '', emailError: '', innError: '' };

    if (!form.email || !form.email.includes('@')) {
      next.emailError = 'Укажите корректный e-mail (должен содержать @).';
    }

    const phoneDigits = onlyDigits(form.phone);
    if (phoneDigits.length !== 11 || phoneDigits[0] !== '7') {
      next.phoneError = 'Телефон должен быть в формате +7(XXX)XXX-XX-XX.';
    }

    if (form.inn.length !== 12) {
      next.innError = 'ИНН должен содержать ровно 12 цифр.';
    }

    setForm((p) => ({ ...p, ...next }));
    return !next.phoneError && !next.emailError && !next.innError;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!isActive()) return;
    if (!validateForm()) return;

    setForm((p) => ({ ...p, waiting: true }));

    const data = { ...form, accept_policy: form.acceptPolicy };
    delete data.send;
    delete data.waiting;
    delete data.phoneError;
    delete data.emailError;
    delete data.innError;

    try {
      await submitApplication(data);
      setForm((p) => ({ ...p, send: true }));
    } catch (error) {
      console.error('Ошибка отправки:', error);
    } finally {
      setForm((p) => ({ ...p, waiting: false }));
    }
  };

  return (
    <div
      className={`application ${form.send ? 'application--sent' : ''}`}
      id="application"
    >
      <style>{buttonCss}</style>

      {!form.send ? (
        <div className="grid">
          <div className="left">
            <h1 className="title">Подключить организацию к системе</h1>
            <p className="description">
              Наши специалисты свяжутся с вами, ответят на все вопросы и
              продемонстрируют работу платформы LSport
            </p>
          </div>
          <div className="right">
            <form className="form" onSubmit={submit} noValidate>
              <div style={subtleNoteStyle}>* — обязательные поля</div>

              <div className="field">
                <span className="label">Имя* </span>
                <AppInput
                  value={form.name}
                  onChange={(v) => handleChange('name', v)}
                  className="input"
                  placeholder="Ваше имя"
                />
              </div>

              <div className="field">
                <span className="label">Телефон* </span>
                <AppInput
                  value={form.phone}
                  onChange={(v) => handleChange('phone', v)}
                  className="input"
                  placeholder="+7(920)123-45-67"
                  fieldType="phone"
                />
                {form.phoneError && (
                  <span style={errorStyle}>{form.phoneError}</span>
                )}
              </div>

              <div className="field">
                <span className="label">E-mail* </span>
                <AppInput
                  value={form.email}
                  onChange={(v) => handleChange('email', v)}
                  className="input"
                  placeholder="Ваш e-mail"
                  fieldType="email"
                />
                {form.emailError && (
                  <span style={errorStyle}>{form.emailError}</span>
                )}
              </div>

              <div className="field">
                <span className="label">Организация </span>
                <AppInput
                  value={form.company}
                  onChange={(v) => handleChange('company', v)}
                  className="input"
                  placeholder="Название организации"
                />
              </div>

              <div className="field">
                <span className="label">ИНН организации* </span>
                <AppInput
                  value={form.inn}
                  onChange={(v) => handleChange('inn', v)}
                  className="input"
                  placeholder="Введите 12 цифр"
                  fieldType="inn"
                />
                {form.innError && (
                  <span style={errorStyle}>{form.innError}</span>
                )}
              </div>

              <div className="field">
                <span className="label">Комментарий </span>
                <AppInput
                  value={form.notes}
                  onChange={(v) => handleChange('notes', v)}
                  className="input"
                  placeholder="Краткое описание"
                />
              </div>

              <div className="policy">
                <AppChecker
                  checked={form.acceptPolicy}
                  onChange={(v) => handleChange('acceptPolicy', v)}
                />
                <span>
                  Я согласен с{' '}
                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Политикой
                  </a>{' '}
                  обработки персональных данных
                </span>
              </div>

              <button
                className="learn-more-btn"
                type="submit"
                disabled={!isActive()}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow" />
                </span>
                <span className="button-text">Отправить</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="success-wrapper">
          <div className="success-card">
            
            <img
              src={heartsGif}
              alt="успешная отправка"
              className="success-gif"
              style={{ opacity: gifVisible ? 1 : 0 }}
            />
            <div className="success-text">Заявка отправлена!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheApplication;
