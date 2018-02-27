const { mongoose, Schema } = require('../db/mongoose')

const BaseSchema = new Schema(
  {
    sys_created_by: {
      type: Schema.ObjectId,
      ref: 'Users'
    },
    sys_updated_by: {
      type: Schema.ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: {
      createdAt: 'sys_created_at',
      updatedAt: 'sys_updated_at'
    }
  }
)

const BaseModel = mongoose.model('base', BaseSchema)

module.exports = { BaseSchema, BaseModel }
