const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
}, { versionKey: false });

module.exports = model("Journey", schema);
