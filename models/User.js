const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  email: {type: String, unique: true},
  password: {type: String},
  name: {type: String},
  journey: { type: Types.ObjectId, ref: 'Journey' },
}, { versionKey: false });

module.exports = model('User', schema);
