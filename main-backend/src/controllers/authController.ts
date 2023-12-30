import prisma from '../models/db';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import * as taskController from './taskController-OLD';
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

  // const stats = (await taskController.statsByUser(email))?.at(0) || {};

  const token = signToken(email);

  return {
    token,
    email: user?.email,
    name: user?.name,
  };
};

export const authUser = async (authToken: string) => {
  try {
    console.log(authToken);
    const token = authToken?.split(' ')[1];

    if (!token) throw new Error('You have not logged in!');

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    });

    if (!user) throw new Error('This user is not valid.');

    return true;
  } catch (error: any) {
    console.log(error);
    return false;
  }
};

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    console.log(credentials);
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
