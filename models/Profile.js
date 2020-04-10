const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  avatar: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  place: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      location: {
        type: String,
        required: true
      },
      image: {
        type: String,        
      },
      coordinates: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
      },
      date: {
        type: Date,
        default: Date.now
      },
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)