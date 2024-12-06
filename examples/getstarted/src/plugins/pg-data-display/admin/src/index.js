import { Book } from '@strapi/icons';
import PgDataPage from './pages/PgDataPage';

export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/pg-data-display',
      icon: Book, // The imported icon
      intlLabel: {
        id: 'app.components.Menu.pgData',
        defaultMessage: 'PostgreSQL Data',
      },
      Component: PgDataPage,
    });

    console.log('PgData plugin has been registered!');
  },
};
