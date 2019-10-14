const { UserQueries, UserMutations } = require('./user');
const { ContactQueries, ContactMutations } = require('./contact');

module.exports.resolvers = {
    Query: Object.assign({}, 
                            UserQueries,
                            ContactQueries
                        ),
    Mutation: Object.assign({},
                                UserMutations,
                                ContactMutations
                            )
};
