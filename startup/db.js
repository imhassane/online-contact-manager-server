const { connect } = require('mongoose');
const logger = require('./logger');

module.exports = async () => {
    try {
        await connect(`mongodb://localhost:27017/contact_manager`, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
        logger.info(`Connexion à la base mongodb://localhost:27017/contact_manager réussie`);
    } catch({ message }) {
        logger.error(message);
    }
}