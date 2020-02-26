const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  userId: {type: Types.ObjectId, ref: 'User'},
  expenseId: {type: Types.ObjectId, ref: 'Expense'},
});

module.exports = model('Expense', schema);
