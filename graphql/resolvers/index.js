const { UserQueries, UserMutations } = require('./user');
const { ContactQueries, ContactMutations } = require('./contact');
const { ProfilMutations } = require('./profil');

module.exports.resolvers = {
    Query: Object.assign({},
                            UserQueries,
                            ContactQueries
                        ),
    Mutation: Object.assign({},
                                UserMutations,
                                ContactMutations,
                                ProfilMutations
                            )
};
