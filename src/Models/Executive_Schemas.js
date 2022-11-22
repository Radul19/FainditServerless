import getMultipleImages from '@/helpers/getMultipleImages'
import getSignedURL from '@/helpers/getSignedURL'

const { Schema, model, SchemaTypes } = require('mongoose')
const objId = SchemaTypes.ObjectId

const ExecutiveSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  catalogue: { type: Array, required: true, default: [] },
  ownerID: { type: String, required: true },
  admins: { type: [objId], required: false, ref: 'User' },
  categories: { type: Array, required: false },
  social: { type: Object, required: true },
  stadistics: { type: Object, required: false },
  schedule: { type: Object, required: false },
  delivery: { type: Boolean, required: false },
  address: { type: String, required: true },
  reviews: { type: Array, required: true, default: [] },
  photos: { type: Array, required: false },
  logo: { type: String, required: false },
  membership: { type: Boolean, required: false },
  promotions: { type: Array, required: true, default: [] },
  rif: { type: String, required: true },
  relation: { type: String, required: true, default: 'Owner' },
  sub_categories: { type: Array, required: false },
  place: { type: Object, required: false },
  favorites: { type: Array,required: true, default: []  }


}, {
  timestamps: true
})
const VacantSchema = new Schema({
  name: { type: String, required: true },
  place: { type: Object, required: true },
  salary: { type: Number, required: true },
  duration: { type: String, required: true },
  marketID: { type: String, required: true },
  market: { type: objId, required: true, ref: 'Executive' },
  favorites: { type: Array, required: true },
  description: { type: String, required: true },
  requiriments: { type: String, required: true },
  applicants: [{
    userID: { type: String, required: true },
    cvID: { type: String, required: true },
    status: { type: Number, required: true, default: 2 }
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
  sections: { type: [String], required: true },
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


const ExecutiveVerify = new Schema({
  marketID: { type: String, required: true },
  relationPhoto: { type: String, required: true },
  status: { type: Number, required: true }
})


const TicketSchema = new Schema({
  marketID: { type: String, required: true },
  relationPhoto: { type: String, required: true },
  status: { type: Number, required: true, default: 2 }
}, {
  timestamps: true
})

const PromotionSchema = new Schema({
  type: { type: Number, required: true },
  info_type: { type: Number, required: true },
  since: { type: Date, required: true },
  until: { type: Date, required: true },
  gender: { type: Number, required: true },
  age_min: { type: Number, required: true },
  age_max: { type: Number, required: true },
  place: { type: Object, required: true },
  images: { type: [String], required: true },
  categories: { type: [String], required: true },
  status: { type: Boolean, required: true },
  targetID: { type: String, required: false },
  title: { type: String, required: false },
  relation: { type: String, required: false },
  description: { type: String, required: false },
  rif: { type: String, required: false },
  social: { type: Object, required: false },
  address: { type: String, required: false },

}, {
  timestamps: true
})

/** EXECUTIVE METHODS */
ExecutiveSchema.methods.getLogo = async function () {
  this.logo = await getSignedURL(this.logo)
  return this
}
ExecutiveSchema.methods.logoAndPhoto = async function () {
  this.logo = await getSignedURL(this.logo)
  this.photos[0] = await getSignedURL(this.photos[0])
  return this
}
/** ITEMS METHODS */
ItemSchema.methods.getImages = async function () {
  this.images = await getMultipleImages(this.images)
  return this
}

/** VACANTS METHODS */
VacantSchema.methods.logoAndPhoto = async function () {
  this.market.logo = await getSignedURL(this.market.logo)
  this.market.photos[0] = await getSignedURL(this.market.photos[0])
  return this
}
VacantSchema.methods.getLogo = async function () {
  this.market.logo = await getSignedURL(this.market.logo)
  return this
}


export const Executive = model('Executive', ExecutiveSchema)
export const Vacant = model('Vacant', VacantSchema)
export const Item = model('Item', ItemSchema)
export const Promotion = model('Promotion', PromotionSchema)
export const Ticket = model('Ticket', TicketSchema)
