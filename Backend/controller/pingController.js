const pingController = async (req, res) => {
  return res.status(200).json({
    msg: "Pong",
  });
};
export default pingController;
