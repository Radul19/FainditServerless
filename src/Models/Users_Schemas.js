import getSignedURL from "@/helpers/getSignedURL";

const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    birth: { type: String, required: false },
    phone: { type: String, required: true },
    contacts: { type: Object, required: true },
    gender: { type: Number, required: true, default: 1 },
    place: { type: Object, required: true },
    viewer: { type: Boolean, required: true, default: false },
    address: { type: String, required: false },
    interest: { type: Array, required: false, default: [] },
    verified: { type: Boolean, required: true, default: false },
    favorite: { type: Object, required: false, default: {} },
    middlename: { type: String, required: false },
    profile_pic: { type: String, required: false, default: "profilepicture" },
    notifications: { type: Array, required: false, default: [] },
    professionalProfiles: [
      {
        name: { type: String, required: true },
        details: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        birth: { type: String, required: true },
        qualities: { type: Array, required: false },
        languages: { type: Array, required: false },
        degrees: { type: Array, required: false },
        jobs: { type: Array, required: false },
        skills: { type: Array, required: false },
      }
    ],
    languages: [
      {
        name: { type: String, required: false },
        level: { type: String, required: false }
      },
    ],
    degrees: [
      {
        title: { type: String, required: true },
        place: { type: String, required: true },
        level: { type: String, required: true },
        studying: { type: Boolean, required: true },
        since: { type: String, required: true },
        until: { type: String, required: true }
      }
    ],
    jobs: [
      {
        name: { type: String, required: false },
        company: { type: String, required: false },
        details: { type: String, required: false },
        working: { type: Boolean, required: false },
        since: { type: String, required: false },
        until: { type: String, required: false }
      }
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.changeName = function () {
  // console.log(`Testing name here ${this.name}`)
  return this.name = 'Testing here'
}
UserSchema.methods.presignedProfile = async function () {
  // console.log(`Testing name here ${this.name}`)
  this.profile_pic = await getSignedURL(this.profile_pic)
  return this
}

export const User = model("User", UserSchema);

// module.exports = model('User', UserSchema)
