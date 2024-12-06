'use strict';

module.exports = {
  async fetchData() {
    // Use the knex query builder or any other method to fetch data from PostgreSQL
    const knex = strapi.connections.default;

    const data = await knex('your_table_name').select('*');
    return data;
  },
};
