const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  journey: { type: Types.ObjectId, ref: "Journey" },
  borrowers: [{ _id: false, name: String, sum: Number }],
  lenders: [{ _id: false, name: String, sum: Number }],
}, { versionKey: false });

module.exports = model("Expense", schema);
