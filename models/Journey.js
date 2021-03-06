const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  author: { type: String, required: true },
  authorId: { type: Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now, required: true },
}, { versionKey: false });

module.exports = model("Journey", schema);
