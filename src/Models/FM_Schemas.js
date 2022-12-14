const { Schema, model, ObjectId } = require('mongoose')

const FM_ItemSchema = new Schema({
  title: { type: String, required: true },// title
  description: { type: String, required: true },
  ownerId: { type: String, required: true },
  price: { type: Number, required: true },
  viewed: { type: Number, default: 0 },
  interactions: { type: Number, default: 0 },
  place: { type: Object, required: true },
  favorites: { type: Array },
  fileName: { type: Array }, // images fileNames
  categories: { type: Array },
  insearch: { type: Number, required: false, default: 0},
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


const denunciatesVacantSchema = new Schema({
  vacantID: { type: String, required: true },
  type: { type: Number, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
})

const PromotionFmSchema = new Schema({
  type: { type: Number, required: true },
  userID: { type: String, required: true },
  itemID: { type: String, required: true },
  since: { type: Date, required: true},
  until: { type: Date, required: false },
  gender: { type: Number, required: true },
  age_min: { type: Number, required: true },
  age_max: { type: Number, required: true },
  place:   {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  images: { type: Array, required: true },
  categories: { type: Array, required: true },
  status: { type: Boolean, required: true },
  passed: { type: Number, required: true, default: 2 }
}, {
  timestamps: true
})

const PromotionJobsSchema = new Schema({
  type: { type: Number, required: true },
  userID: { type: String, required: true },
  itemID: { type: String, required: true },
  since: { type: Date, required: true},
  until: { type: Date, required: false },
  gender: { type: Number, required: true },
  age_min: { type: Number, required: true },
  age_max: { type: Number, required: true },
  place:   {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true }
  },
  images: { type: Array, required: true },
  categories: { type: Array, required: true },
  status: { type: Boolean, required: true },
  passed: { type: Number, required: true, default: 2 }
}, {
  timestamps: true
})


export const FM_Item = model('FM_Item', FM_ItemSchema)
export const denunciate = model('denunciate', denunciateSchema)
export const denunciatesVacant = model('denunciatesVacant', denunciatesVacantSchema)
export const PromotionFm = model('PromotionFm', PromotionFmSchema)
export const PromotionJobs = model('PromotionJobs', PromotionJobsSchema)