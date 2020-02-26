const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  title: {type: String},
  amount: {type: Number},
});

module.exports = model('Expense', schema);
