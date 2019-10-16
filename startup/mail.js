const mailjet = require('node-mailjet');
const connect = mailjet.connect(process.env.MAILJET_ID, process.env.MAILJET_ACCESS_TOKEN);

module.exports.post = connect.post('send', { version: 'v3.1'});
