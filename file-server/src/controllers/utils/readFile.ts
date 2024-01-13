import { Response } from 'express';
import fs from 'fs';

export function readFile(
  filePath: string,
  mimeType: string,
  res: Response
): void {
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      res.status(404).send('File not found');
    } else {
      res.setHeader('Content-Type', mimeType);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        res.status(500).send('Internal Server Error');
      });

      fileStream.on('end', () => {
        console.log('File streaming complete.');
        res.end();
      });
    }
  });
}
