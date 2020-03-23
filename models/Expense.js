const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  amount: { type: Number },
  journey: { type: Types.ObjectId, ref: "Journey" },
  borrowers: [{ name: String, sum: Number }],
  lenders: [{ name: String, sum: Number }],
}, { versionKey: false });

module.exports = model("Expense", schema);
