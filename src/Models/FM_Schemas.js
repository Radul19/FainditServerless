const { Schema, model, ObjectId } = require('mongoose')

const FM_ItemSchema = new Schema({
  title: { type: String, required: true  },// filename
  description: { type: String, required: true  },
  ownerId: { type: String, required: true  },
  price: { type: Number, required: true  },
  viewed: { type: String ,default:0 },
  interactions: { type: String, default:0  },
  place: { type: String, required: true   },
  favorites:[],
  fileName: [],// base64
  categories:[]
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