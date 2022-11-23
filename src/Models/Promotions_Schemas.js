const { Schema, model } = require('mongoose')

const PromotionsHomeSchema = new Schema({
  type: { type: Number, required: true },
  info_type: { type: Number, required: true },
  since: { type: Date, required: true},
  until: { type: Date, required: false },
  gender: { type: String, required: true },
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
  tagetID: { type: String, required: true, },
  title: { type: String, required: false },
  relation: { type: String, required: false },
  description: { type: String, required: false },
  rif: { type: String, required: true},
  social:
    {
      messenger: { type: String, required: false },
      whatsapp: { type: String, required: false },
      map: { type: Array, required: false },
      messages: { type: String, required: false },
      phone: { type: String, required: false },
      instagram: { type: String, required: false },
      tiktok: { type: String, required: false },
      twitter: { type: String, required: false },
      app: { type: String, required: false },
      other_link: { type: Array, required: false },
    },
  address: { type: String, required: true }


}, {
  timestamps: true
})

export const PromotionsHome = model("PromotionsHome", PromotionsHomeSchema);