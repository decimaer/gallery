import express from 'express';

import * as taskController from '../controllers/taskController-OLD';
import * as authController from '../controllers/authController-OLD';

const router = express.Router();

router
  .route('/')
  .post(
    authController.authUser,
    authController.setPrivilege('self'),
    taskController.createTask
  );

router
  .route('/:id')
  .delete(
    authController.authUser,
    authController.setPrivilege('self'),
    taskController.deleteTask
  );

router.route('/top-three').get();

router
  .route('/task-stats/:id')
  .get(
    authController.authUser,
    authController.setPrivilege('self'),
    taskController.getStatsByUser
  );

export default router;
