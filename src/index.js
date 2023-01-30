import { ApolloServer, gql } from 'apollo-server';
import { v4 } from 'uuid';

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String
    website: String
  }
  type DeleteResponse {
    ok: Boolean!
  }
  type Query {
    users: [User]
  }
  type Mutation {
    addUser(name: String!, username: String!, email: String!, phone: String, website: String): User
    editUser(id: ID!, name: String!, username: String!, email: String!, phone: String, website: String): User
    deleteUser(id: ID!): DeleteResponse
  }
`;

const users = {};
const addUser = user => {
  const id = v4();
  return users[id] = { ...user, id };
};

// Start with a few initial users
addUser({
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@doe.com',
  phone: '123456789',
  website: 'johndoe.com',
});

addUser({
  name: 'Pepe Lul',
  username: 'plul',
  email: 'pepe@lul.ok',
  phone: '111222333',
  website: 'pepelul.com',
});

addUser({
  name: 'Lolo Pep',
  username: 'lolopep',
  email: 'lolo@pep.com',
  phone: '333222111',
  website: 'lolopep.com',
});

const resolvers = {
  Query: {
    users: () => Object.values(users),
  },
  Mutation: {
    addUser: async (parent, user) => {
      return addUser(user);
    },
    editUser: async (parent, { id, ...user }) => {
      if (!users[id]) {
        throw new Error("User doesn't exist");
      }

      users[id] = {
        ...users[id],
        ...user,
      };

      return users[id];
    },
    deleteUser: async (parent, { id }) => {
      const ok = Boolean(users[id]);
      delete users[id];

      return { ok };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});