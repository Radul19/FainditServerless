const { Schema, model, ObjectId } = require('mongoose')

const FM_ItemSchema = new Schema({
  fileName: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: Number, required: true },
  viewed: { type: String, default: 0 },
  interactions: { type: String, default: 0 },
  place: { type: String, required: true },
  favorites: [],
  base64: {
    type: String,
    required: true,
    default: 'https://kartox.com/cdnassets/categories/grid/K0502-1_l.jpg',
  },
  categories: []
}, {
  timestamps: true
})

/*
Cambiar filename por title
cambiar base64 por filename (tendra el nombre de la imagen para asi buscarla en el bucket)
*/

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