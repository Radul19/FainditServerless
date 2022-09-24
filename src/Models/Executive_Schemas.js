const { Schema, model } = require('mongoose')

const ExecutiveSchema = new Schema({
  rif: { type: String, required: true },
  name: { type: String, required: true },
  rate: { type: Object, required: true },
  social: { type: String, required: true },
  address: { type: String, required: true },
  owner_id: { type: Array, required: true },
  relation: { type: String, required: true },
  schedule: { type: Object, required: true },
  favorite: { type: Array, required: false },
  catalogue: { type: Array, required: true },
  delivery: { type: Boolean, required: true },
  categories: { type: Array, required: true },
  comments: { type: Object, required: false },
  photos_name: { type: Array, required: true },
  description: { type: String, required: true },
  extra_links: { type: String, required: false },
  sub_categories: { type: Array, required: true },
  logo_filename: { type: String, required: false },

}, {
  timestamps: true
})


export const Executive = model('Executive', ExecutiveSchema)

