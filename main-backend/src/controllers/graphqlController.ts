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
      resolve(_, args, context) {
        if (!authUser(context.token, args.email)) context.res.status(401);

        return getUser(args.email);
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
      resolve(_, args, context) {
        if (!authUser(context.token, args.email)) context.res.status(401);

        return updateUser(args);
      },
    },
    deleteUser: {
      type: DeleteType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(_, args, context) {
        if (!authUser(context.token, args.email)) context.res.status(401);

        return deleteUser(args.email);
      },
    },
    loginUser: {
      type: User,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        const response = await loginUser(args);

        if (!response || !response.token) throw new Error('Failed to login');

        context.res.cookie('jwt', response.token, {
          httpOnly: true,
        });
        return response.user;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
