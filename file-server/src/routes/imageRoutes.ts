import express from 'express';
import { createImage, getImage } from '../controllers/imageController';
import { authenticate } from '../controllers/authController';

const router = express.Router();

router.route('/:userId/:fileId/:filename').get(authenticate, getImage);

router.route('/:userId').post(authenticate, createImage);

export default router;
