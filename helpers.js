const { post } = require('./startup/mail');

module.exports.sendMail = async ({ To, Subject, HTMLPart}) => {
    try {
        const data = await post.request({
            "Messages": [
                {
                    "From": {
                        "Email": "adcontact.manager@gmail.com",
                        "Name": "Contact Manager"
                        },
                    To,
                    Subject,
                    HTMLPart
                }
            ]
        });
        return data;
    } catch(ex) { throw ex; }
}
