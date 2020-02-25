const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  name: {type: String, ref: 'User'},
  group: {type: Array},
});

module.exports = model('Group', schema);
