'use strict';

module.exports = ({ strapi }) => {
  return {
    // Define routes for fetching PostgreSQL data
    routes: [
      {
        method: 'GET',
        path: '/pg-data',
        handler: 'pg-data.find',
        config: {
          policies: [],
          auth: false,
        },
      },
    ],
  };
};

module.exports.services = {
  'pg-data': {
    find: async () => {
      const knex = strapi.db.connection;
      const data = await knex.raw('SELECT * FROM your_table_name');
      return data.rows; // Ensure this matches the structure of your table
    },
  },
};
