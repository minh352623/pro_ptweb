const getPaganitionService = async (req, res) => {
  try {
    return res.status(200).json("get success");
  } catch (e) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getPaganitionService,
};
