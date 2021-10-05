const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/User');
const { success, failed } = require('../helpers/respon');
const { JWT_SECRET } = require('../helpers/env');

const users = {
  register: (req, res) => {
    try {
      const { body } = req;
      const payload2 = {
        username: body.username,
        email: body.email,
        paddword: body.password,
        picture: 'images.jpg',
        phone_number: body.phone_number,
      };
      usersModel.cekUsernameRegis(body).then((result) => {
        if (!result.length <= 0) {
          failed(res, 100, 'username sudah ada');
        } else {
          usersModel.cekEmail(body).then((resultemail) => {
            if (!resultemail.length <= 0) {
              failed(res, 100, 'email sudah ada');
            } else {
              bcrypt.hash(body.password, 10, (err, hash) => {
                // Store hash in your password DB.
                if (err) {
                  failed(res, 401, err);
                } else {
                  usersModel.register(payload2, hash).then((result2) => {
                    const user = result2;
                    const payload = {
                      id: user.insertId,
                    };
                    const output = {
                      user,
                      token: jwt.sign(payload, JWT_SECRET),
                    };
                    success(res, output, 'succes');
                  }).catch((err1) => {
                    failed(res, 401, err1);
                  });
                }
              });
            }
          });
        }
      }).catch((err) => {
        failed(res, 401, err);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  login: (req, res) => {
    try {
      const { body } = req;
      usersModel.cekUsernameLogin(body).then((result) => {
        if (result.length <= 0) {
          failed(res, 100, 'username salah');
        } else {
          const passwordHash = result[0].password;
          bcrypt.compare(body.password, passwordHash, (error, checkpassword) => {
            if (error) {
              res.json(error);
            } else if (checkpassword === true) {
              const user = result[0];
              const payload = {
                id: user.id,
              };
              const output = {
                user,
                token: jwt.sign(payload, JWT_SECRET),
              };
              console.log(output);
              success(res, output, 'succes');
            } else {
              failed(res, 401, 'Wrong Password');
            }
          });
        }
      }).catch((err) => {
        failed(res, 401, err);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  getList: (req, res) => {
    try {
      const { query } = req;
      const search = query.search === undefined ? '' : query.search;
      const field = query.field === undefined ? 'id' : query.field;
      const typeSort = query.sort === undefined ? '' : query.sort;
      // eslint-disable-next-line radix
      const limit = query.limit === undefined ? 50 : parseInt(query.limit);
      const page = query.page === undefined ? 1 : query.page;
      // eslint-disable-next-line eqeqeq
      const offset = page === 1 ? 0 : (page - 1) * limit;
      usersModel.getList(search, field, typeSort, limit, offset).then(async (result2) => {
        // eslint-disable-next-line no-undef
        const allData = await usersModel.getAll();
        const output = {
          users: result2,
          // eslint-disable-next-line no-undef
          totalPage: Math.ceil(allData.length / limit),
          search,
          limit,
          page,
        };

        success(res, output, 'succes');
      }).catch((error) => {
        failed(res, 500, error);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  getDetails: (req, res) => {
    try {
      const { id } = req.params;
      usersModel.getDetails(id).then((result) => {
        success(res, result[0], 'succes');
      }).catch((err) => {
        failed(res, 500, err);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req;
      const { filename } = req.file;
      bcrypt.hash(body.password, 10, (errb, hash) => {
        // Store hash in your password DB.
        if (errb) {
          failed(res, 401, errb);
        } else {
          usersModel.update(body, id, hash, filename).then((result) => {
            success(res, result, 'succes');
          }).catch((err) => {
            failed(res, 500, err);
          });
        }
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
  delete: (req, res) => {
    try {
      const { id } = req.params;
      usersModel.delete(id).then((result) => {
        success(res, result, 'succes');
      }).catch((err) => {
        failed(res, 500, err);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },

};

module.exports = users;
