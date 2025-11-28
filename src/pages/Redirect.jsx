import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = () => {
  const history = useNavigate();

  useEffect(() => {
    navigate('/'); // перенаправление на главную страницу
  }, [history]);

  return null;
};

export default Redirect;
