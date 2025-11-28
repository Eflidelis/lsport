import React from 'react';

// Оставляем только цифры
const onlyDigits = (s) => String(s || '').replace(/\D/g, '');

// Форматер телефона: пользователь вводит ТОЛЬКО цифры,
// мы автоматически показываем +7(XXX)XXX-XX-XX
function formatRuPhone(raw) {
  // вытаскиваем цифры
  let d = onlyDigits(raw);

  
  if (d.startsWith('8')) d = '7' + d.slice(1);
  else if (d.startsWith('9')) d = '7' + d;
  else if (d.length > 0 && d[0] !== '7') d = '7' + d.slice(1);

  // 3) не больше 11 цифр (7 + 10)
  d = d.slice(0, 11);

  // 4) сборка маски +7(XXX)XXX-XX-XX по мере ввода
  const n = d.slice(1); 
  let out = '+7';
  if (n.length > 0) out += '(' + n.slice(0, 3);
  if (n.length >= 3) out += ')';
  if (n.length > 3) out += n.slice(3, 6);
  if (n.length > 6) out += '-' + n.slice(6, 8);
  if (n.length > 8) out += '-' + n.slice(8, 10);

  
  return out.slice(0, 16);
}

const AppInput = ({ value, onChange, className, placeholder, fieldType }) => {
  
  let displayedValue = String(value ?? '');

  if (fieldType === 'phone') {
    displayedValue = formatRuPhone(displayedValue);
  } else if (fieldType === 'inn') {
    displayedValue = onlyDigits(displayedValue).slice(0, 12);
  } else if (fieldType === 'email') {
    // убирает пробелы
    displayedValue = displayedValue.replace(/\s+/g, '');
  }

  
  const handleChange = (e) => {
    const raw = e.target.value;
    let next = raw;

    if (fieldType === 'phone') {
      next = formatRuPhone(raw);
    } else if (fieldType === 'inn') {
      next = onlyDigits(raw).slice(0, 12);
    } else if (fieldType === 'email') {
      next = String(raw || '').replace(/\s+/g, '');
    }

    onChange?.(next);
  };

  
  const handleKeyDown = (e) => {
    if (fieldType !== 'phone') return;

    const allowed = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Tab',
    ];
    if (allowed.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    if (fieldType === 'phone' || fieldType === 'inn') {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const next =
        fieldType === 'phone' ? formatRuPhone(text) : onlyDigits(text).slice(0, 12);
      onChange?.(next);
    }
  };

  return (
    <input
      className={className}
      placeholder={placeholder}
      value={displayedValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      
      {...(fieldType === 'phone' ? { inputMode: 'tel', maxLength: 16 } : {})}
      {...(fieldType === 'inn' ? { inputMode: 'numeric', maxLength: 12 } : {})}
    />
  );
};

export default AppInput;
