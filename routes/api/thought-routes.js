const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  addThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

router.route('/')
.post(addThought)
.get(getAllThought);

router
  .route('/:id')
  .put(getThoughtById)
  .put(updateThought);

router.route('/:id/users/:userId')
.delete(removeThought);

router.route('/:id/reactions/')
.post(addReaction);

router.route('/:id/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;
