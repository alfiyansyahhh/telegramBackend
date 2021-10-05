const express = require('express');
const usersController = require('../controllers/User');
const authen = require('../middleware/authentication');
const upload = require('../middleware/upload');

const usersRouter = express.Router();
usersRouter
  .get('/users', authen, usersController.getList)
  .post('/login', usersController.login)
  .get('/user/:id', authen, usersController.getDetails)
  .post('/register', usersController.register)
  .put('/user/:id', authen, upload, usersController.update)
  .delete('/user/:id', authen, usersController.delete);
module.exports = usersRouter;
