const router = require('express').Router();
const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend

} = require('../../controllers/user-controller');

router
.route('/')
.post(createUser)
.get(getAllUser);

router
.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router
.route('/:id/friends/:friendId')
.post(addFriend);

router.route('/:id/friends/:friendId')
.delete(deleteFriend);

module.exports = router;