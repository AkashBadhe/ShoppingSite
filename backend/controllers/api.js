import pg from 'pg';

import config from '../config.json';

const pgConnect = `postgres://${config.pgsql_username}:${config.pgsql_password}@${config.pgsql_hostname}/${config.pgsql_database}`;

export const apiRequest = (req, res, requestType) => {
  pg.connect(pgConnect, (err, client, done) => {
    if (err) {
      console.error('PostgreSQL ERROR : %s', err.message);
      if (client) done(client);
    } else {
      client.query('SELECT * FROM app_name_modelname', (err2, result) => {
        if (err) {
          console.error('PostgreSQL ERROR : %s', err2.message);
          if (client) done(client);
        } else {
          done();
          const fieldName = result.rowCount ? result.rows[0].field_name : 'data not found, check your database';
          res.json({
            field_name: fieldName,
            request_type: requestType,
          });
        }
      });
    }
  });
};

export const apiGet = (req, res) => apiRequest(req, res, 'GET');

export const apiPost = (req, res) => apiRequest(req, res, 'POST');

