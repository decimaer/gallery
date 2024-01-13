import { Request } from 'express';
import fs from 'fs';
import busboy from 'busboy';
import { ImageMetaData } from '../types';

export function writeFile(
  req: Request,
  fileId: string
): Promise<ImageMetaData> {
  return new Promise(async (resolve, reject) => {
    const bb = busboy({ headers: req.headers });

    const fileStream = fs.createWriteStream(`./data/${fileId}`);

    let metaData: ImageMetaData;

    bb.on(
      'file',
      (
        _fieldname: string,
        file: NodeJS.ReadableStream,
        fileData: ImageMetaData
      ): void => {
        file.pipe(fileStream);
        metaData = fileData;
      }
    );

    bb.on('finish', () => {
      fileStream.on('finish', () => {
        fileStream.close();

        resolve(metaData);
      });
    });

    bb.on('error', (err) => {
      reject(err);
    });

    req.pipe(bb);
  });
}
