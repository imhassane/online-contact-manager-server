const { User, validateUser } = require('../../models/user');
const { Profil } = require('../../models/profil');
const randomstring = require('randomstring');
const { sign } = require('jsonwebtoken');

const { sendMail } = require('../../helpers');

const me = async (parent, data, context) => {
  try {
    let _profil = await Profil.findOne({ user: context.user }).populate('user');
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
        const { email } = data;
        let emails = await User.find();
        emails = emails.filter(u => u.email === email);
        if(emails.length !== 0) throw new Error("This email already exist");

        const _user = await User.findOneAndUpdate({ _id: context.user._id }, {
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

const updatePassword = async (parent, data, context) => {
  try {
      if(!context.user.comparePasswords(data.password))
        throw new Error("The current password is wrong!");

      await context.user.update({ password: data.newPassword });
      return context.user;
  } catch(ex) { throw ex; }
}

const generateNewPassword = async (parent, data, context) => {
  try {
    const _password = randomstring.generate(8);
    let _user = await User.findOne(data);
    if(!_user)
      throw new Error("This email address does not exist");

    _user.password = _password;
    await _user.save();

    const To = [{ Email: data.email }];
    const Subject = "Your password has been reseted";
    const HTMLPart = `
    <style>div {margin: 0;padding: 2em;text-align: center;}.title {text-align: center;font-size: 2em;}.password {font-weight: bold;font-style: italic;}</style>
    <div>
      <p class="title">Your password has been succesfully reseted.</p>
      <p>In order to access to your account, you may need to use this one: <span class="password">${_password}</span></p>
      <p>Click the following link <a target="_blank" href="">to access to our login page</a> then update your password once logged.</p>
      <p>We hope you are appreciating our product a lot and wish you the best.</p>
    </div>
    `;

    await sendMail({ To, Subject, HTMLPart });
    return _user;
  } catch(ex) { throw ex; }
}

module.exports = {
    UserQueries: { user, me },
    UserMutations: { createUser, authenticate, updateUser, deleteUser, updatePassword, generateNewPassword },
};
