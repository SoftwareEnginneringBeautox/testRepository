const config = require('config');

const {Pool} = require('pg');

const pool = new Pool({
    user: config.get('postgre-server.user'),
    password: config.get('postgre-server.password'),
    host: config.get('postgre-server.host'),
    port: config.get('postgre-server.port'),
    database: config.get('postgre-server.database')

});

console.log("Connected to Postgres");

module.exports = pool;