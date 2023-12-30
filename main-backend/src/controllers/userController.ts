import prisma from '../models/db';
import bcrypt from 'bcryptjs';

// Get a specific user by email
export const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({});

    return users;
  } catch (error) {
    console.error(error);
  }
};

// Create a new user
export const createUser = async (user: {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    if (user.password !== user.passwordConfirm) {
      throw new Error('Passwords do not match');
    }
    const passwordHash = await bcrypt.hash(user.password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: passwordHash,
      },
    });

    console.log(newUser); // Log the new user to the console for debugging purposes

    return newUser;
  } catch (error) {
    console.error(error);
  }
};

// Update a specific user by ID
export const updateUser = async (user: {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}) => {
  try {
    if (user.password !== user.passwordConfirm) {
      throw new Error('Passwords do not match');
    }
    const passwordHash = await bcrypt.hash(user.password, 12);

    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: {
        name: user.name,
        email: user.email,
        password: passwordHash,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

// Delete a specific user by ID
export const deleteUser = async (email: string) => {
  try {
    const deleted = await prisma.user.delete({
      where: {
        email,
      },
    });
    return { deleteMessage: 'User was successfully deleted.' };
  } catch (error) {
    console.error(error);
  }
};
