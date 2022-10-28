const { Schema, model, ObjectId } = require('mongoose')

const FM_ItemSchema = new Schema({
  title: { type: String, required: true },// title
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: Number, required: true },
  viewed: { type: String, default: 0 },
  interactions: { type: String, default: 0 },
  place: { type: Object, required: true },
  favorites: { type: Array },
  fileName: { type: Array }, // images fileNames
  categories: { type: Array },
  insearch: { type: Number, required: false },
}, {
  timestamps: true
})

// createdAt: { type: Date, default: Date.now },
// createdAt: { type: Date, expires: 60, default: Date.now },

const denunciateSchema = new Schema({
  item_id: { type: String, required: true },
  type: { type: Number, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
})


//Schema for find by
export const userIdSchema = new Schema({ _id: ObjectId }, { versionKey: false });
export const userIdS = model('userIdS', userIdSchema)
export const FM_Item = model('FM_Item', FM_ItemSchema)
export const denunciate = model('denunciate', denunciateSchema)