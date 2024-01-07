import { Response } from 'express';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type GraphQLContext = { res: Response; token: string };
