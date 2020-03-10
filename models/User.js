const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  email: {type: String, unique: true},
  password: {type: String},
  // links: [{ type: Types.ObjectId, ref: 'Link' }],
  name: {type: String},
  journey: { type: Types.ObjectId, ref: 'Journey' },
  expense: [{ type: Types.ObjectId, ref: 'Expense' }],
});

module.exports = model('User', schema);
