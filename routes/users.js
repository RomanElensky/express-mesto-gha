const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserById,
  patchAvatar,
  patchProfile,
} = require('../controllers/users');
const { validateUserId, validatePatchProfile, validatePatchAvatar } = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validatePatchProfile, patchProfile);
router.patch('/me/avatar', validatePatchAvatar, patchAvatar);

module.exports = router;
