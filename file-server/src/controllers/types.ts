import type { Request } from 'express';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ImageMetaData = {
  filename: string;
  encoding: string;
  mimeType: string;
};

export type AuthRequest = Request & { authorizedUserId?: number };
