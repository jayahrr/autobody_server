const { mongoose, Schema } = require('../db/mongoose'),
  { BaseSchema } = require('./base'),
  validator = require('validator'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcryptjs')

// Create the User Schemas
const UserSchema = BaseSchema.extend(
  {
    active: {
      type: Boolean,
      default: true
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      index: true
    },
    first_name: {
      type: String,
      required: [true, 'First name is required!'],
      minlength: 1,
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required!'],
      minlength: 1,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'An email is required!'],
      minlength: 1,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [15, '{VALUE} is too long for a mobile phone number!']
    },
    primary_location: {
      type: String,
      trim: true,
      default: ''
    },
    type: String,
    rating: Number,
    reviews: [
      {
        review_id: {
          ref: 'review',
          type: Schema.ObjectId
        }
      }
    ],
    password: {
      type: String,
      required: [true, 'A password is required!'],
      minlength: 6
    },
    tokens: [
      {
        access: {
          type: String,
          required: true,
          trim: true
        },
        token: {
          type: String,
          required: true,
          trim: true
        }
      }
    ]
  },
  { collection: 'Users', discriminatorKey: 'type' }
)

UserSchema.pre('save', function(next) {
  let user = this

  if (!Number(user.__v)) {
    user.username = user.email
    user.first_name = _.capitalize(user.first_name)
    user.last_name = _.capitalize(user.last_name)
    user.name = `${user.first_name} ${user.last_name}`

    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash
          next()
        })
      })
    } else {
      next()
    }
  }

  next()
})

UserSchema.methods.toJSON = function() {
  let user = this,
    userObject = user.toObject(),
    userPublic = [
      '_id',
      'sys_created',
      'active',
      'name',
      'primary_location',
      'email',
      'phone',
      'username'
    ]

  return _.pick(userObject, userPublic)
}

UserSchema.methods.generateAuthToken = function() {
  let user = this,
    access = 'auth',
    token = jwt
      .sign({ _id: user._id.toHexString(), access }, 'abc123')
      .toString()

  user.tokens.push({ access, token })

  return user.save().then(() => {
    return token
  })
}

UserSchema.methods.removeToken = function(token) {
  let user = this

  return user.update({
    $pull: {
      tokens: { token }
    }
  })
}

UserSchema.statics.findByToken = function(token) {
  let User = this,
    decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (error) {
    return Promise.reject()
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function(username, password) {
  let User = this

  return User.findOne({ username }).then(user => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password).then(res => {
        if (res) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  })
}

// Create the Customer Schemas
const CustomerSchema = UserSchema.extend(
  {
    type: {
      type: String,
      default: 'customer'
    },
    vehicle_instances: [
      {
        ref: 'vehicle_instance',
        type: Schema.ObjectId
      }
    ]
  },
  { collection: 'Users' }
)

// Create the Service Provider Schemas
const ServiceProviderSchema = UserSchema.extend(
  {
    type: {
      type: String,
      default: 'Servicer'
    },
    company: {
      type: String,
      default: ''
    },
    services: [
      {
        ref: 'service',
        type: Schema.ObjectId
      }
    ],
    service_instances: [
      {
        ref: 'service_instance',
        type: Schema.ObjectId
      }
    ]
  },
  { collection: 'Users' }
)

// Create the data models
const User = mongoose.model('User', UserSchema),
  Customer = mongoose.model('Customer', CustomerSchema),
  ServiceProvider = mongoose.model('Servicer', ServiceProviderSchema)

module.exports = { User, Customer, ServiceProvider }
