const db = require('../config/db');

const userModels = {
  getAll: () => new Promise((resolve, reject) => {
    db.query('SELECT * from users', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  getList: (search) => new Promise((resolve, reject) => {
    db.query(
      `select * from users  
            WHERE username LIKE "%${search}%"`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  getDetails: (id) => new Promise((resolve, reject) => {
    db.query(`select * from users where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  register: (body, pass) => new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (username,email,password,picture,phone_number)
            VALUE (
                '${body.username}','${body.email}','${pass}','${body.picture}','${body.phone_number}'
            )`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  cekUsernameLogin: (body) => new Promise((resolve, reject) => {
    db.query(`select * from users where username='${body.username}' || email='${body.username}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
          console.log('ini', result);
        }
      });
  }),
  cekUsernameRegis: (body) => new Promise((resolve, reject) => {
    db.query(`select * from users where username='${body.username}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  }),
  cekEmail: (body) => new Promise((resolve, reject) => {
    db.query(`select * from users where email='${body.email_address}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
  }),
  update: (body, id, filename) => new Promise((resolve, reject) => {
    db.query(
      `update users set username='${body.username}',picture='${filename}',
      email='${body.email}',phone_number='${body.phone_number}'
      where id='${id}'`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  delete: (id) => new Promise((resolve, reject) => {
    db.query(`delete from users where id='${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),

};

module.exports = userModels;
