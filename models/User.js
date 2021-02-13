const { Schema, model, Types } = require('mongoose');
const Thought = require('./Thought.js');
const moment = require('moment');


const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            require: true,
            match: [/.+@.+\..+/]
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'

            },
        ],
        toJSON: {
            virtuals: true,
            getters: true
          },
          id: false
        }
);

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
  });

const User = model('User', UserSchema);

module.exports = User;
