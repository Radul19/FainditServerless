const { Schema, model } = require('mongoose')

const FM_ItemSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: String, required: true },
  img_id: { type: String, required: true },
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
export const userIdS = model('userIdS', userIdSchema)
export const userIdSchema = new Schema({ _id: ObjectId }, { versionKey: false });
export const FM_Item = model('FM_Item', FM_ItemSchema)
export const denunciate = model('denunciate', denunciateSchema)