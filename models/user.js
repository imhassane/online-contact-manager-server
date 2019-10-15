const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Profil } = require('./profil');

const UserSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }],
   favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contact" }]
}, { timestamps: true });

UserSchema.pre('save', function() {
    if(this.isModified('password')) {
        // Hachage du mot de passe avant de l'enregistrer.
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
});

// Création du profil de l'utilisateur après la création de son compte.
UserSchema.post('save', async function() {
  const profil = new Profil();
  profil.user = this;
  await profil.save();
});

UserSchema.methods.comparePasswords = function(other) {
    return bcrypt.compareSync(other, this.password);
}

UserSchema.methods.inFavorites = function(favorite) {
  let _favs = this.favorites.filter(f => f._id.toString() === favorite);
  return _favs.length > 0;
}

UserSchema.methods.hasContact = function(email, country_code, phone_number) {
    let _contacts = this.contacts.filter(c => c.email === email);
    _contacts = _contacts.filter(c => c.country_code === country_code);
    _contacts = _contacts.filter(c => c.phone_number === phone_number);

    return _contacts.length > 0;
}

const User = mongoose.model('User', UserSchema);

const validateUser = (data) => Joi.validate(data, {
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { User, validateUser };
