import React from 'react';
import { Outlet } from 'react-router-dom';
import './DefaultLayout.scss';

const DefaultLayout = ({ children }) => {
  console.log('Default rendered');

  return (
    <div className="container layout">
      <header>
        {children}
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
