import express from 'express';
// import mysql from 'mysql';
import { middlewareType } from '../types/expressTypes';

import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './userController';

import { loginUser } from './authController';

// MySQL database connection
// const con = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'testuser',
//   password: 'password',
//   database: 'test_DB',
// });

// con.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected to test_DB!');
// });

const dbQueryCallback =
  (resolve: any, reject: any, single = false) =>
  (err: any, result: any) => {
    if (err) {
      reject(err);
    }

    if (single && result.length > 0) {
      result = result[0];
    } else if (single && result.length === 0) {
      result = null;
    }

    resolve(result);
  };

// GraphQL Schema
const User = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

console.log(User);

// const Thing = new GraphQLObjectType({
//   name: 'ThingType',
//   fields: () => ({
//     owner_id: { type: GraphQLInt },
//     thing_name: { type: GraphQLString },
//     thing_id: { type: GraphQLInt },
//   }),
// });

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
    token: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: async () => {
        return getAllUsers();
      },
    },
    user: {
      type: User,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return getUser(args.email);
      },
    },
    // things: {
    //   type: new GraphQLList(Thing),
    //   resolve: async () => {
    //     return getAllThings();
    //   },
    // },
    // thing: {
    //   type: Thing,
    //   args: {
    //     thing_id: { type: GraphQLInt },
    //   },
    //   resolve(parentValue, args) {
    //     console.log(args);
    //     return getThing(args.thing_id);
    //   },
    // },
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
      resolve(parentValue, args) {
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
      resolve(parentValue, args) {
        return updateUser(args);
      },
    },
    deleteUser: {
      type: DeleteType,
      args: {
        email: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        console.log(parentValue);
        return deleteUser(args.email);
      },
    },
    loginUser: {
      type: LoginType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        console.log(parentValue);
        return loginUser(args);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

export default schema;
