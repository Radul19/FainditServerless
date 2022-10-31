const { Schema, model } = require('mongoose')

const ExecutiveSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  catalogue: { type: Array, required: false },
  ownerID: { type: String, required: true },
  admins: { type: Array, required: false },
  categories: { type: Array, required: false },
  social: { type: Object, required: true },
  stadistics: { type: Object, required: false },
  schedule: { type: Object, required: false },
  delivery: { type: Boolean, required: false },
  address: { type: String, required: true },
  reviews: { type: Object, required: true },
  photos: { type: Array, required: false },
  logo: { type: String, required: false },
  membership: { type: Boolean, required: false },
  promotions: { type: Array, required: true },
  rif: { type: String, required: true },
  relation: { type: String, required: false },
  sub_categories: { type: Array, required: false },
  place: { type: Object, required: false },


}, {
  timestamps: true
})
const VacantSchema = new Schema({
  name: { type: String, required: true },
  place: { type: Object, required: true },
  salary: { type: Number, required: true },
  duration: { type: String, required: true },
  marketID: { type: String, required: true },
  favorites: { type: Array, required: true },
  description: { type: String, required: true },
  requiriments: { type: String, required: true },
  applicants: [{
    userID: { type: String, required: true },
    cvID: { type: String, required: true },
  }],
}, {
  timestamps: true
})

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categories: { type: Array, required: true },
  favorites: { type: Array, required: true },
  images: { type: Array, required: true },
  place: { type: Object, required: true },
  marketID: { type: String, required: true },
  reviews: [{
    userID: { type: String, required: true },
    comment: { type: String, required: true },
    stars: { type: Number, required: true },
    date: { type: Date, required: true },
    edited: { type: Boolean, required: true },
    reply: { type: String, required: true },
    reply_date: { type: Date, required: true },
    reply_edited: { type: Boolean, required: true },
  }],
})


export const Executive = model('Executive', ExecutiveSchema)
export const Vacant = model('Vacant', VacantSchema)
export const Item = model('Item', ItemSchema)

