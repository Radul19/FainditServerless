const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  birth: { type: String, required: true },
  phone: { type: String, required: true },
  id: { type: String, required: true },
  place: { type: String, required: true },
  middlename: { type: String, required: true },
  address: { type: String, required: false },
  country: { type: String, required: false },
  profile_pic: { type: String, required: false },
  interest: { type: Array, required: false },
  market: { type: Boolean, required: true },
  viewer: { type: Boolean, required: true },
  favorite: { type: Object, required: false },
  membership: { type: Boolean, required: true },
  notifications: { type: Array, required: false },
}, {
  timestamps: true
})

const FM_ItemSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: String, required: true },
  img_id: { type: String, required: true },
}, {
  timestamps: true
})

export const User = model('User', UserSchema)
export const FM_Item = model('FM_Item', FM_ItemSchema)



// module.exports = model('User', UserSchema)