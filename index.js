const { ApolloServer } = require('apollo-server');
const { importSchema } = require('graphql-import');

const { resolvers } = require('./graphql/resolvers');

const typeDefs = importSchema("./graphql/schema.graphql");
const GraphQLDateTime = require('graphql-type-datetime');

const { getUserFromToken } = require('./middlewares/auth');

// Lancement de la base de données.
require('./startup/db')();

// Chargement du logger.
const logger = require('./startup/logger');

// Contexte de l'application.
const context = async ({ req }) => {
    try {
        let _context = {};
        const token = req.headers.authtoken;
        if(token) {
            const user = await getUserFromToken(token);
            _context = { ..._context, user };
        }
        return _context;
    } catch(ex) {
        throw ex;
    }
};

const server = new ApolloServer({ typeDefs, resolvers: { ...resolvers, DateTime: GraphQLDateTime }, context });

server.listen().then(({ url }) => {
    logger.info("Serveur lancé à l'url: " + url);
})