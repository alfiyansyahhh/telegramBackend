const db = require('../config/db');

const chatsModels = {
  insertChats: (sender, receiver, msg) => new Promise((resolve, reject) => {
    db.query(`INSERT INTO chat (sender,receiver,message) VALUE (
            '${sender}', '${receiver}','${msg}'
        )`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  getChatHistory: (sender, receiver) => new Promise((resolve, reject) => {
    db.query(`select * from chat where (sender='${sender}' and receiver='${receiver}') || (sender='${receiver}' and receiver='${sender}')`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  deleteChats: (data) => new Promise((resolve, reject) => {
    db.query(`delete from chat where id IN (${data})`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};

module.exports = chatsModels;
