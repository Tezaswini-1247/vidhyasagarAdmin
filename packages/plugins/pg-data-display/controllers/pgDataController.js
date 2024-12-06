'use strict';

module.exports = {
  async fetchData(ctx) {
    const data = await strapi.services['pgDataService'].fetchData();
    ctx.send(data);
  },
};
