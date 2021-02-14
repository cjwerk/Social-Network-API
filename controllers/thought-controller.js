const { Thought, User } = require("../models");

const thoughtController = {
  // add Thought to User
  getAllThought(req, res) {
    Thought.find()
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one Thought by id
  getThoughtById({ params }, res, req) {
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
    Thought.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
      userId: req.body.userId,
    })
      .then((thought) => {
        thoughtLocal = thought;
        return User.findOneAndUpdate(
          {
            _id: req.body.userId,
          },
          { $push: { thoughts: thought._id } },
          {
            new: true,
          }
        )
          .populate({
            path: "thoughts",
            select: "-__v",
          })
          .select("-__v");
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({
            message: `no user found with the id of ${req.body.userId}`,
          });
          return;
        }
        res.status(200).json(user);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  },

  // add reaction to Thought
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

  // update thought

  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
  removeThought(req, res) {
    Thought.findOneAndDelete({
      _id: req.params.id,
    })
      .then((thought) => {
        console.log(thought);
        if (!thought) {
          return res
            .status(404)
            .json({
              message: `no thought found with the id of ${req.params.id}`,
            });
        }
        //then delete the thought from the user collection
        return User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then((userInfo) => {
        if (!userInfo) {
          res
            .status(404)
            .json({
              message: `no user found with the id of ${req.params.userId}`,
            });
        }
        res
          .status(200)
          .json({
            message: `thought id of ${req.params.id} has been deleted from the user with the id of ${req.params.userId}`,
          });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  },
  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.ThoughtId },
      { $pull: { replies: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
