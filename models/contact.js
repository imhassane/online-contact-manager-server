const mongoose = require('mongoose');
const Joi = require('joi');

const ContactSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: String,
    country_code: Number,
    phone_number: String,
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

const validateContact = (data) => Joi.validate(data, {
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email(),
    country_code: Joi.number(),
    phone_number: Joi.string()
});

module.exports = { Contact, validateContact };
