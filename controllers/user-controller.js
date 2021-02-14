const { User, Thought } = require("../models");

const userController = {
  // get all Users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // update User by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete User
  deleteUser: async  (req, res) => {
    try{
      // find and delete all those thoughts that match with the username in the req.body
      const deletedThoughts = await Thought.deleteMany({
        username: req.body.username,
      });
      console.log(deletedThoughts);
      //find all users that have this user on deck for deletion in their friends list
      // and update the queried users' friendslists to not include the deleted user's id
      const deletedFriend = await User.updateMany(
        //get all users

        {},
        //pull friend Id from all users that have that friend id in their friends array
        {
          $pull: {
            friends: req.params.id,
          },
        }
      );
      console.log(deletedFriend);
      //delete the user
      const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
      console.log(deletedUser);
      if (!deletedUser) {
        res
          .status(404)
          .json({ message: `no user found with the id of ${req.params.id}` });
          return
      }
      res
        .status(200)
        .json({
          message: `the user ${req.body.username} and their thoughts have been deleted.`,
        })
      } catch (e){
          res.json(e);
      }
  },
  //add friend method
  //like an update method
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { friends: req.params.friendId } }, //parameter containing friendId
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(404)
            .json({ message: `no user found with the id of ${req.params.id}` });
        }
        res.status(200).json(dbUserData);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  },

  //delete friend method
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(404)
            .json({ message: `no user found with the id of ${req.params.id}` });
        }
        res.status(200).json(dbUserData);
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  },
};

module.exports = userController;
