const { Schema, model } = require('mongoose')

const ExecutiveSchema = new Schema({
  rif: { type: String, required: true },
  name: { type: String, required: true },
  rate: { type: Object, required: true },
  social: { type: String, required: true },
  address: { type: String, required: true },
  owner_id: { type: Array, required: true },
  relation: { type: String, required: false },
  schedule: { type: Object, required: false },
  catalogue: { type: Array, required: false },
  delivery: { type: Boolean, required: false },
  categories: { type: Array, required: false },
  comments: { type: Object, required: false },
  photos_name: { type: Array, required: false },
  description: { type: String, required: false },
  extra_links: { type: String, required: false },
  sub_categories: { type: Array, required: false },
  logo_filename: { type: String, required: false },

}, {
  timestamps: true
})
const VacantSchema = new Schema({
  name: { type: String, required: true },
  place: { type: String, required: true },
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


export const Executive = model('Executive', ExecutiveSchema)
export const Vacant = model('Vacant', VacantSchema)

