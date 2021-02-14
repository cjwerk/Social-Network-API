const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  addThought,
  removeThought,
  addReaction,
  removeReaction,
  updateThought
} = require('../../controllers/thought-controller');

router.route('/')
.post(addThought)
.get(getAllThought);

router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

router.route('/:id/reactions/')
.post(addReaction);

router.route('/:id/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;
