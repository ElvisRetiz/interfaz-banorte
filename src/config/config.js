require('dotenv').config();
const fs = require('fs');
const path = require('path');

const jsonConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../app.config.json')));
const serverSql = jsonConfig.instanceSql.split("\\");

const config = {
    port: process.env.API_PORT || 3000,
    apikey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    output: jsonConfig.output,
    db: {
        host: serverSql[0],
        instance: serverSql[1] || "",
        name: jsonConfig.bdSql,
        user: jsonConfig.userSql,
        pwd: jsonConfig.passwordSql
    },
    user: jsonConfig.user,
    pwd: jsonConfig.password,
    sentinel: process.env.TRESS_SENTINEL
}

module.exports = { config };