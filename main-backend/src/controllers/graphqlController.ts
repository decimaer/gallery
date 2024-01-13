import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { createUser, deleteUser, getUser, updateUser } from './userController';
import { loginUser, authUser } from './authController';
import { getAllImages } from './imageController';

// GraphQL Schema
const User = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const Image = new GraphQLObjectType({
  name: 'ImageType',
  fields: () => ({
    path: { type: GraphQLString },
  }),
});

const DeleteType = new GraphQLObjectType({
  name: 'DeleteType',
  fields: () => ({
    deleteMessage: { type: GraphQLString },
  }),
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: User,
      args: {
        email: { type: GraphQLString },
        id: { type: GraphQLInt },
      },
      async resolve(_, args, context) {
        try {
          if (!(await authUser(context.req.cookies.jwt, args.email)))
            throw new Error('User not authorized.');

          return getUser(args.email);
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
    images: {
      type: new GraphQLList(Image),
      args: {
        userId: { type: GraphQLInt },
      },
      resolve(_, args, context) {
        try {
          const images = getAllImages(args, context);

          if (!images) throw new Error('Failed to get images');

          return images;
        } catch (error) {
          console.error(error as Error);
          return error;
        }
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        passwordConfirm: { type: GraphQLString },
      },
      resolve(_, args) {
        return createUser(args);
      },
    },
    updateUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        passwordConfirm: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        try {
          if (!(await authUser(context.req.cookies.jwt, args.email)))
            throw new Error('User not authorized.');

          return updateUser(args);
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
    deleteUser: {
      type: DeleteType,
      args: {
        email: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        try {
          if (!(await authUser(context.req.cookies.jwt, args.email)))
            throw new Error('User not authorized.');

          return deleteUser(args.email);
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
    loginUser: {
      type: User,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        try {
          const response = await loginUser(args);

          if (!response || !response.token) throw new Error('Failed to login');

          context.res.cookie('jwt', response.token, {
            httpOnly: true,
          });
          return response.user;
        } catch (error) {
          console.error(error);
          return error;
        }
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
