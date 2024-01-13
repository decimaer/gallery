import type { NextFunction } from 'express';
import type { Request, Response } from 'express';
import prisma from '../models/db';

import jwt from 'jsonwebtoken';
import { AuthRequest } from './types';

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = Number.parseInt(req.params.userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(await checkUser(req.cookies.jwt, user.email)))
      throw new Error('User is not authorized.');

    req.authorizedUserId = user.id;

    return next();
  } catch (error) {
    console.error(error);
    return next(res.status(401));
  }
}

const checkUser = async (token: string, email?: string) => {
  if (!token) return false;

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as jwt.JwtPayload;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    });
  } catch (error: any) {
    console.log(error);
    return false;
  }
  if (!user) return false;
  if (email && email !== decodedToken.email) return false;

  return true;
};
