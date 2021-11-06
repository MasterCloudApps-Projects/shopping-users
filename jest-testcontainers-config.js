module.exports = {
  mysql: {
    image: 'mysql',
    tag: 'latest',
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
