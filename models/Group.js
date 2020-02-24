const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {type: String},
  group: [{ type: Types.ObjectId }],
  owner: {type: Types.ObjectId, ref: 'User'}
});

module.exports = model('Group', schema);
