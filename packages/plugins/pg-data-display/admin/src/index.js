import React from 'react';
import { Book } from '@strapi/icons';
import PgDataPage from './pages/PgDataPage';

export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/pg-data-display',
      icon: Book,
      intlLabel: {
        id: 'app.pg-data-display.label',
        defaultMessage: 'PostgreSQL Data',
      },
      Component: PgDataPage,
    });

    console.log('PostgreSQL Data Plugin Registered!');
  },
};
