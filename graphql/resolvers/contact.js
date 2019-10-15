const { Contact, validateContact } = require('../../models/contact');

const contact = async (parent, data, context) => {
    try {
        const _contact = await Contact.findOne(data);
        if(!_contact) throw new Error();
        return _contact;
    } catch(ex) { throw ex; }
};

const contacts = async (parent, data, context) => {
    return context.user.contacts.reverse();
}

const favorites = async (parent, data, context) => {
  return context.user.favorites.reverse();
}

const createContact = async (parent, data, context) => {
    try {
        const { errors } = validateContact(data);
        if(errors) throw new Error(errors.details[0].message);

        if(context.user.hasContact(data.email, data.country_code, data.phone_number))
            throw new Error("Ce contact existe déjà dans votre repertoire");

        let _contact = new Contact(data);
        _contact = await _contact.save();

        // On ajoute le contact à la liste de contacts de l'utilisateur.
        context.user.contacts.push(_contact);
        await context.user.save();

        return _contact;
    } catch(ex) { throw ex; }
};

const updateContact = async (parent, data, context) => {
    try {
        const _contact = await Contact.findOneAndUpdate({ _id: data._id }, {
            $set: data
        }, { new: true });
        return _contact;
    } catch(ex) { throw ex; }
};

const deleteContact = async (parent, data, context) => {
    try {
        const _contact = await Contact.findOneAndRemove(data);
        return _contact;
    } catch(ex) { throw ex; }
};

const addToFavorites = async (parent, data, context) => {
  try {
    const _contact = await Contact.findOne(data);
    if(!_contact) throw new Error("This contact does not exist");

    if(!context.user.inFavorites(data._id)) {
      context.user.favorites.push(_contact);
      await context.user.save();

      _contact.in_favorites = true;
      await _contact.save();
    }

    return _contact;
  } catch(ex) { throw ex; }
}

const removeFromFavorites = async (parent, data, context) => {
  try {
    const _contact = await Contact.findOne(data);
    if(!_contact) throw new Error("This contact does not exist");

    if(context.user.inFavorites(data._id)) {
      context.user.favorites.remove(_contact);
      await context.user.save();

      _contact.in_favorites = false;
      await _contact.save();
    }

    return _contact;
  } catch(ex) { throw ex; }
}

module.exports = {
    ContactQueries: { contact, contacts, favorites },
    ContactMutations: { createContact, updateContact, deleteContact, addToFavorites, removeFromFavorites },
};
