const mongoose = require("mongoose");

const login_details = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  sesion_id: {
    type: String,
  },
  login_time: {
    type: String,
  },
  logout_time: {
    type: String,
  },
});

module.exports = mongoose.model("login_details", login_details);
