const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  journey: { type: Types.ObjectId, ref: "Journey" },
  borrowers: [{ _id: false, name: String, sum: Number, to: {} }],
  lenders: [{ _id: false, name: String, sum: Number, to: {} }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  repaid: [{ name: String, sum: Number, payBackTo: String, createdAt: {type: Date, default: Date.now} }]
}, { versionKey: false, timestamps: true });

module.exports = model("Expense", schema);
