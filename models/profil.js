const mongoose = require('mongoose');
const Joi = require('joi');

const ProfilSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    avatar: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Profil = mongoose.model('Profil', ProfilSchema);

const validateProfil = (data) => Joi.validate(data, {
    first_name: Joi.string(),
    last_name: Joi.string(),
    avatar: Joi.string(),
    user: Joi.string().required(),
});

module.exports = { Profil, validateProfil };
