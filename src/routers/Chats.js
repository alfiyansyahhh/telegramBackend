const express = require('express');
const chatsController = require('../controllers/chats');
// const authen = require('../middleware/authentication');

const chatsRouter = express.Router();
chatsRouter
  .delete('/chats', chatsController.delete);
module.exports = chatsRouter;
