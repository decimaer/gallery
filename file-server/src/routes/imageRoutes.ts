import express, { NextFunction } from 'express';
import {
  writeStreamToFile,
  readFileAndSendAsStream,
} from '../controllers/imageController';
import { Request, Response } from 'express';
import { authUser } from '../controllers/authController';
import prisma from '../models/db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router
  .route('/:userId/:fileId/:filename')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    const fileName = req.params.filename;
    const fileId = req.params.fileId;
    const filePath = `./data/${fileId}`;
    const userId = Number.parseInt(req.params.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return next(res.status(404));

    if (!(await authUser(req.cookies.jwt, user.email)))
      return next(res.status(401));

    const image = await prisma.image.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!image) return next(res.status(404));

    if (image?.userId !== user.id) return next(res.status(401));

    readFileAndSendAsStream(filePath, image.mimeType, res);
  });

router
  .route('/:userId')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number.parseInt(req.params.userId);
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) return next(res.status(404));

      if (!(await authUser(req.cookies.jwt, user.email)))
        return next(res.status(401));

      const uuid = uuidv4();

      const metaData = await writeStreamToFile(req, uuid);

      console.log(metaData);

      const newImage = await prisma.image.create({
        data: {
          id: uuid,
          fileName: metaData.filename,
          mimeType: metaData.mimeType,
          userId: user.id,
        },
      });

      res.status(200).send(newImage);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default router;
