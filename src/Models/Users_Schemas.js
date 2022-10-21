const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    birth: { type: String, required: true },
    phone: { type: String, required: true },
    place: { type: String, required: true },
    middlename: { type: String, required: true },
    address: { type: String, required: false },
    country: { type: String, required: false },
    profile_pic: { type: String, required: false },
    interest: { type: Array, required: false },
    market: { type: Boolean, required: true },
    viewer: { type: Boolean, required: true },
    favorite: { type: Object, required: false },
    membership: { type: Boolean, required: true },
    notifications: { type: Array, required: false },
    verified: { type: Boolean, required: true },
    professionalProfiles: [
      { name: { type: String, required: false } ,
       details: { type: String, required: false } ,
       qualities: { type: Array, required: false } ,
       languages: { type: Array, required: false } ,
       degrees: { type: Array, required: false } ,
       jobs: { type: Array, required: false } ,
       skills: { type: Array, required: false } },
    ],
    languages: [
      { name: { type: String, required: false } ,
       level: { type: String, required: false } },
    ],
    degrees: [
      { title: { type: String, required: true } ,
       place: { type: String, required: true } ,
       level: { type: String, required: true } ,
       studying: { type: Boolean, required: true } ,
       since: { type: String, required: true } ,
       until: { type: String, required: true } }
    ],
    jobs: [
      { name: { type: String, required: false } ,
       company: { type: String, required: false } ,
       details: { type: String, required: false } ,
       working: { type: Boolean, required: false } ,
       since: { type: String, required: false } ,
       until: { type: String, required: false } }
    ],
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);

// module.exports = model('User', UserSchema)
