module.exports = {
  'server.port': process.env.SERVER_PORT || 8443,
  'server.key.path': process.env.KEY_PATH || './certs/private-key.pem',
  'server.cert.path': process.env.CERT_PATH || './certs/cert.pem',

  'db.host': process.env.RDS_HOSTNAME || 'localhost',
  'db.user': process.env.RDS_USERNAME || 'root',
  'db.password': process.env.RDS_PASSWORD || 'pass',
  'db.port': process.env.RDS_PORT || 3306,
  'db.db_name': process.env.RDS_DB_NAME || 'users',
  'db.connection.max_retries': process.env.CONN_MAX_RETRIES || 3,
  'db.connection.retry-interval': process.env.CONN_RETRY_INTERVAL || 30000,

  'kafka.enabled': process.env.KAFKA_ENABLED || false,
  'kafka.retry.initialRetryTime': process.env.KAFKA_INIT_RETY_TIME || 10000,
  'kafka.retry.retries': process.env.KAFKA_RETRIES || 3,
  'kafka.host': process.env.KAFKA_HOST || '127.0.0.1',
  'kafka.port': process.env.KAFKA_PORT || 9092,
  'kafka.groupId': process.env.GROUP_ID || 'users-group',
  'kafka.topics.validateBalance': process.env.VALIDATE_BALANCE_TOPIC || 'validate-balance',
  'kafka.topics.changeState': process.env.CHANGE_ORDER_STATE || 'change-orders-state',

  secret: process.env.TOKEN_SECRET || 'supersecret',
  'token.expiration': process.env.TOKEN_EXPIRATION || 300,

};
