const express = require('express');
const cors = require('cors');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

const { config } = require('./config/config');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const port = config.port;
const app = express();

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

function start() {
    try {
        app.listen(port);
        console.log(`APIRest running on http://localhost:${port}`);
        fs.appendFileSync(path.join(__dirname, '../logs/info.log'), `${dayjs().format('DD/MM/YYYY hh:mm:ss a')} - ${__filename} - APIRest running on http://localhost:${port}\n`);
    }
    catch (err) {
        fs.appendFileSync(path.join(__dirname, '../logs/error.log'), `${dayjs().format('DD/MM/YYYY hh:mm:ss a')} - ${__filename} - ${err}\n`);
        console.log(err);
    }
}

start();