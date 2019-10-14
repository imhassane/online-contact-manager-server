const jwt = require('jsonwebtoken');
const { User } = require('../models/user');


const getUserFromToken = async (token) => {
    try {
        let decoded = jwt.verify(token, 'secret');
        const user = await User.findOne({ _id: decoded._id })
                                .populate('contacts');
        if(user) return user;
        
        return {};
    } catch(ex) {
        throw ex;
    }
};

module.exports = { getUserFromToken };