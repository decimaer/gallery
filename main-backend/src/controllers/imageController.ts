import prisma from '../models/db';
import { authUser } from './authController';
import { GraphQLContext } from './types';

// Get all users
export const getAllImages = async (
  args: { userId: number },
  context: GraphQLContext
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: args.userId,
      },
    });

    if (!user) throw new Error('User not found.');

    if (!(await authUser(context.token, user.email))) context.res.status(401);

    const images = await prisma.image.findMany({
      where: { userId: user.id },
    });

    console.log('IMAGES', images);

    return images.map((image) => ({ path: `${image.id}/${image.fileName}` }));
  } catch (error) {
    console.error(error);
    context.res.status(500);
  }
};
