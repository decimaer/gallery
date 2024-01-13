import prisma from '../models/db';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import { LoginCredentials } from './types';

const signToken = (email: string) => {
  console.log(process.env.JWT_EXPIRES_IN);
  return jwt.sign({ email }, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const comparePasswords = async function (
  currentPassword: string,
  originalPassword: string
) {
  return await bcrypt.compare(currentPassword, originalPassword);
};

// Returns for both a logged in user and for logging in a new registered user
export const loggedInUserResponse = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  const token = signToken(email);

  return {
    token,
    user: {
      id: user?.id,
      email: user?.email,
      name: user?.name,
    },
  };
};

export const authUser = async (token: string, email?: string) => {
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

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    console.log('CREDENTIALS', credentials);
    if (!credentials.email || !credentials.password)
      throw new Error('Wrong email or password!');

    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (
      !user ||
      !(await comparePasswords(credentials.password, user.password))
    ) {
      throw new Error('Wrong email or password!');
    }

    return await loggedInUserResponse(credentials.email);
  } catch (error: any) {
    console.error(error);
  }
};
