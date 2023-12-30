import express from 'express';

import * as userController from '../controllers/userController-OLD';
import * as authController from '../controllers/authController-OLD';

// import userController from '../controllers/userController';

const router = express.Router();

router.route('/login').post(authController.logInUser);

router
  .route('/')
  .get(
    authController.authUser,
    authController.setPrivilege('admin'),
    userController.getAllUsers
  )
  .post(userController.createUser);
router
  .route('/:id')
  .get(
    authController.authUser,
    authController.setPrivilege('self'),
    userController.getUser
  )
  .patch(
    authController.authUser,
    authController.setPrivilege('self'),
    userController.updateUser
  )
  .delete(
    authController.authUser,
    authController.setPrivilege('admin'),
    userController.deleteUser
  );

export default router;
