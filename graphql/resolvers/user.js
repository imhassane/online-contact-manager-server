const { User, validateUser } = require('../../models/user');
const { Profil } = require('../../models/profil');

const { sign } = require('jsonwebtoken');

const me = async (parent, data, context) => {
  try {
    let _profil = await Profil.findOne({ user: context.user }).populate('user');
    if(!_profil) {
      _profil = new Profil();
      _profil.user = context.user;
      _profil = await _profil.save();
    }

    return _profil;
  } catch(ex) { throw ex; }
}

const user = async (parent, data, context) => {
    try {
        const _user = await User.findOne(data);
        if(!_user) throw new Error();
        return _user;
    } catch(ex) { throw ex; }
};

const createUser = async (parent, data, context) => {
    try {
        const { errors } = validateUser(data);
        if(errors) throw new Error(errors.details[0].message);

        let _user = new User(data);
        _user = await _user.save();

        return _user;
    } catch(ex) { throw ex; }
};

const authenticate = async (parent, { email, password }, context) => {
    try {
        const _user = await User.findOne({ email: email });
        if(!_user)
            throw new Error("This email adress doesn't exist");

        if(!_user.comparePasswords(password))
            throw new Error("The password is wrong");

        // On créé un token avec JWT.
        const token = sign({ _id: _user._id }, "secret");

        return { token };
    } catch(ex) { throw ex; }
}

const updateUser = async (parent, data, context) => {
    try {
        const _user = await User.findOneAndUpdate({ _id: data._id }, {
            $set: data
        }, { new: true });
        return _user;
    } catch(ex) { throw ex; }
};

const deleteUser = async (parent, data, context) => {
    try {
        const _user = await User.findOneAndRemove(data);
        return _user;
    } catch(ex) { throw ex; }
};

module.exports = {
    UserQueries: { user, me },
    UserMutations: { createUser, authenticate, updateUser, deleteUser },
};
