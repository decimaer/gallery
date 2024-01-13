import type { NextFunction } from 'express';
import type { Response } from 'express';
import prisma from '../models/db';
import { v4 as uuidv4 } from 'uuid';
import { readFile } from './utils/readFile';
import { writeFile } from './utils/writeFile';
import { AuthRequest } from './types';

export async function getImage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const fileId = req.params.fileId;
  const filePath = `./data/${fileId}`;
  const userId = req.authorizedUserId!;

  try {
    const image = await prisma.image.findUnique({
      where: {
        id: fileId,
      },
    });

    if (image?.userId !== userId) throw new Error('File not found.');

    readFile(filePath, image.mimeType, res);
  } catch (error) {
    console.error('Error: ', error);
    return next(res.status(404));
  }
}

export async function createImage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  let response;

  try {
    const uuid = uuidv4();
    const userId = req.authorizedUserId!;

    const metaData = await writeFile(req, uuid);

    console.log(metaData);

    if (!metaData) throw new Error('Error writing file.');

    const newImage = await prisma.image.create({
      data: {
        id: uuid,
        fileName: metaData.filename,
        mimeType: metaData.mimeType,
        userId,
      },
    });

    response = { path: `${newImage.id}/${newImage.fileName}` };
  } catch (error) {
    console.error('Error uploading file:', error);
    return next(res.status(500).json({ error: 'Internal Server Error' }));
  }

  return next(res.status(200).json(response));
}
