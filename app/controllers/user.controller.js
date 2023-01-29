const { getPaganitionService } = require("../services/user.service");

const getPaganition = (req, res) => {
  try {
    return getPaganitionService(req, res);
  } catch (e) {
    return res.status(500).json(e);
  }
};

module.exports = {
  getPaganition,
};
