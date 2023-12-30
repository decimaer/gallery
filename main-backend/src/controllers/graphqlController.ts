import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { createUser, deleteUser, getUser, updateUser } from './userController';
import { loginUser, authUser } from './authController';

// GraphQL Schema
const User = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const DeleteType = new GraphQLObjectType({
  name: 'DeleteType',
  fields: () => ({
    deleteMessage: { type: GraphQLString },
  }),
});

const LoginType = new GraphQLObjectType({
  name: 'LoginType',
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: User,
      args: {
        email: { type: GraphQLString },
      },
      resolve(_, args, context) {
        if (!authUser(context.token, args.email)) context.res.status(401);

        return getUser(args.email);
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
      type: LoginType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, args, context) {
        const response = await loginUser(args);

        if (response) {
          context.res.cookie('jwt', response.token, {
            httpOnly: true,
            //domain: 'example.com', //set your domain
          });
          return { email: response.email, name: response.name };
        } else {
          context.res.status(401);
        }
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
