const { connect } = require('mongoose');
const logger = require('./logger');

module.exports = async () => {
    try {
        const database = process.env.DATABASE || 'mongodb://localhost:27017/contact_manager';
        await connect(database, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
        logger.info(`Connexion à la base ${database} réussie`);
    } catch({ message }) {
        logger.error(message);
    }
}
