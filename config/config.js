module.exports = {
    'server.port': 8443,
    'server.key.path': process.env.KEY_PATH || 'server.key',
    'server.cert.path': process.env.CERT_PATH || 'server.cert',
    
    'db.host': process.env.RDS_HOSTNAME || 'localhost',
    'db.user': process.env.RDS_USERNAME || 'root',
    'db.password': process.env.RDS_PASSWORD || 'pass',
    'db.port': process.env.RDS_PORT || 3306,
    'db.db_name': process.env.RDS_DB_NAME || 'users',
    'db.connection.max_retries': process.env.CONN_MAX_RETRIES || 3,
    'db.connection.retry-interval': process.env.CONN_RETRY_INTERVAL || 30000,
    
};