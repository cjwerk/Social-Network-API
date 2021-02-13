const { Thought, User } = require("../models");

const thoughtController = {
  // add Thought to User
  getAllThought(req, res) {
    TThought.find()
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one Thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({
      _id: req.params.id,
    })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  addThought(req, res) {
    let thoughtLocal;
    //find user first to get the username
    Thought.create(
      {
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.body.userId
      }
    )
    .then(thought => {
      thoughtLocal = thought;
      return User.findOneAndUpdate
      (
        {
          _id: req.body.userId
        },
        { $push: { thoughts: thought._id } },
        {
          new: true,
        }
      )
      .populate(
        {
          path: 'thoughts',
          select: '-__v'
        }
      )
      .select('-__v')
    })
    .then(user => {
      if (!user) {
        res.status(404).json({message: `no user found with the id of ${req.body.userId}`});
      }
      res.status(200).json(user); 
    })
    .catch(e => { console.log(e); res.status(500).json(e); });
  },

  // add reply to Thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.ThoughtId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // remove Thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.ThoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: "No Thought with this id!" });
        }
        return User.findOneAndUpdate(
          { _id: params.UserId },
          { $pull: { Thoughts: params.ThoughtId } },
          { new: true }
        );
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No User found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.ThoughtId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
