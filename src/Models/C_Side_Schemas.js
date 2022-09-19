const { Schema, model } = require('mongoose')

const VerifyUserRequestSchema = new Schema({
  userId: { type: String, required: true },
  id_card_filename: { type: String, required: true },
  selfie_filename: { type: String, required: true },
  type: { type: Number, required: true },
}, {
  timestamps: true
})

export const VerifyUserReq = model('VerifyUserRequest', VerifyUserRequestSchema)