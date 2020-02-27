const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String },
  amount: { type: Number },
  journey: { type: Types.ObjectId, ref: "Journey" },
});

module.exports = model("Expense", schema);
