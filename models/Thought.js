const { Schema, model, Types } = require("mongoose");
// const User = require("./User.js");
const moment = require('moment');

const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      minlength: 1,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD YYYY [at] hh:mm a')
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);
const ThoughtSchema = new Schema
(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => moment(createdAtVal).format('MMM DD YYYY [at] hh:mm a')
    },
    reactions: [ReactionSchema],
    username: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

ThoughtSchema.virtual('reactionCount')
.get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;