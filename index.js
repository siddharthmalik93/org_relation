require('dotenv').config();

const express = require('express');

const orgRoute = require('./app/routes/organization.routes');
const { init_tables, pool } = require('./config/pgsql');

const app = express();
app.use(express.json());

app.use('/organization', orgRoute);

const server = app.listen(process.env.PORT, () => {
    console.log("App listening at: ", process.env.PORT)
});

init_tables(shutDown);
process.on('uncaughtException', shutDown);
process.on('SIGINT', shutDown);

function shutDown(err) {
    console.log('error: ', err);

    pool.end((err) => {
        console.log('shutting down connection pool gracefully');

        server.close(() => {
            console.log('shutting down server gracefully');

            process.exit();
        });
        // all connections in the pool have ended
    });
}
