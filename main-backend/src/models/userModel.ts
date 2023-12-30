import prisma from './db';

// builder.prismaObject('User', {
//   fields: (t) => ({
//     id: t.exposeID('id'),
//     email: t.exposeString('email'),
//     name: t.exposeString('name'),
//     password: t.exposeString('password'),
//     //  messages: t.relation('messages'),
//   }),
// });

// builder.queryField('users', (t) =>
//   t.prismaField({
//     type: ['User'],
//     resolve: async (query, root, args, ctx, info) => {
//       return prisma.user.findMany({ ...query });
//     },
//   })
// );

// builder.mutationType({
//   fields: (t) => ({
//     // Add mutation that returns a simple boolean
//     post: t.string({
//       args: {
//         name: t.arg.string(),
//       },
//       resolve: async (root, args) => {
//         // Do something with the message
//         const success = await prisma.user.create({
//           data: t.args,
//         });

//         return success;
//       },
//     }),
//   }),
// });

// type RegisterUserForm = {
//   name: string;
//   email: string;
//   password:string;
//   confirmPassford: string;
// }

// builder.mutationField('createUser', (t) =>
//   t.field({
//     type: Giraffe,
//     args: {
//       name: t.arg.string(),
//     },
//     resolve: async (root, args) => {
//       const giraffe = {
//         name: args.name,
//       };

//       await db.giraffes.create(giraffe);

//       return giraffe;
//     },
//   })
// );

/* import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import { createUser } from '../controllers/userController';

const Owner = new GraphQLObjectType({
  name: 'OwnerType',
  fields: () => ({
    owner_id: { type: GraphQLInt },
    owner_name: { type: GraphQLString },
    email: { type: GraphQLString },
    thing_id: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    owners: {
      type: new GraphQLList(Owner),
      resolve: async () => {
        return getAllOwners();
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: Thing,
      args: {
        thing_name: { type: GraphQLString },
        owner_id: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return createUser(args.thing_name, args.owner_id);
      },
    },
  }),
});
 */
