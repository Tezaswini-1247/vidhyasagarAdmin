module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/pg-data',
        handler: 'pgDataController.fetchData',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  