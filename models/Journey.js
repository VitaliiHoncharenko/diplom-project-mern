const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
}, { versionKey: false });

module.exports = model("Journey", schema);
