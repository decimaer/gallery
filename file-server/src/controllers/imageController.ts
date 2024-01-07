import { Request, Response } from 'express';
import fs from 'fs';
import busboy from 'busboy';
import prisma from '../models/db';
import { ImageMetaData } from './types';

export function writeStreamToFile(
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

export function readFileAndSendAsStream(
  filePath: string,
  mimeType: string,
  res: Response
): void {
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      // Handle file not found or permission issues
      res.status(404).send('File not found');
    } else {
      // Set appropriate headers for streaming
      res.setHeader('Content-Type', mimeType);
      // res.setHeader('Content-Type', 'application/octet-stream');
      // res.setHeader(
      //   'Content-Disposition',
      //   `attachment; filename=${encodeURIComponent(filePath)}`
      // );

      // Create a readable stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Handle errors during streaming
      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).send('Internal Server Error');
      });

      // Handle the end of the stream
      fileStream.on('end', () => {
        console.log('File streaming complete.');
        res.end();
      });
    }
  });
}

/* export const uploadImage: Controller = async function (req, res, next) {
  try {
    console.log(req.file);
    console.log(req.body);
    console.log('START WRITING FILE');

    if (req.file && req.file.buffer) {
      await minioClient.putObject('asdf', 'test4.png', req.file.buffer);
      console.log('File uploaded successfully.');
    } else {
      console.error('File or buffer is missing.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle the error appropriately
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; */

/* export const uploadImage: Controller = async function (req, res, next) {
  console.log(req.file);
  console.log(req.body);
  console.log('START WRITING FILE');
  // @ts-ignore
  minioClient.putObject('asdf', 'test3', req.file?.buffer);
  const chunks = [];
  req
    .on('data', (data) => {
      console.log(data);

      chunks.push(data);
    })
    .on('end', () => {
      // fs.writeFile('file.txt', Buffer.concat(chunks), (err) => {
      //   err ? console.error(err) : console.log('saved successfully!');
      // })

      console.log(`finished! ${chunks.length} chunks recieved.`);
    });
};
 */
