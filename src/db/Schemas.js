import { Schema, model, ObjectId } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  birth: { type: String, required: true },
  phone: { type: String, required: true },
  id: { type: String, required: true },
  place: { type: String, required: true },
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
  fileName: { type: String, required: true  },
  description: { type: String, required: true  },
  ownerId: { type: String, required: true  },
  price: { type: String, required: true  },
  favorites:[],
  base64: {
    type: String, 
    required: true,
    default: 'https://kartox.com/cdnassets/categories/grid/K0502-1_l.jpg',
  },
}, {
  timestamps: true
})

const denunciateSchema = new Schema({
  item_id: { type: String, required: true  },
  type: { type: Number, required: true  },
  description: { type: String, required: true }
}, {
  timestamps: true
})

//Schema for find by
export const userIdSchema = new Schema({ _id: ObjectId }, { versionKey: false });
export const userIdS = model('userIdS', userIdSchema)
export const denunciate = model('denunciate', denunciateSchema)
export const User = model('User', UserSchema)
export const FM_Item = model('FM_Item', FM_ItemSchema)



// module.exports = model('User', UserSchema)