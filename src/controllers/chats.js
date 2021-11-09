const chatModels = require('../models/Chat');
const { success, failed } = require('../helpers/respon');

const chats = {
  delete: (req, res) => {
    try {
      const { data } = req.body;
      const id = data.toString();
      chatModels.deleteChats(id).then((result) => {
        success(res, result, 'succes');
      }).catch((err) => {
        failed(res, 500, err);
      });
    } catch (error) {
      failed(res, 401, error);
    }
  },
};

module.exports = chats;
