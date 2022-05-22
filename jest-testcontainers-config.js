module.exports = {
  mysql: {
    image: 'mysql',
    tag: '8.0.27',
    ports: [3306],
    env: {
      MYSQL_ROOT_PASSWORD: 'pass',
      MYSQL_DATABASE: 'users',
    },
    wait: {
      type: 'ports',
      timeout: 60,
    },
  },
};
