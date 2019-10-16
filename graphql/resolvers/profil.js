const { Profil } = require('../../models/profil');

const updateProfil = async (parent, data, context) => {
  try {
    const _profil = await Profil.findOneAndUpdate({ user: context.user }, { $set: data }, { new: true });
    return _profil;
  } catch(ex) { throw ex; }
};

module.exports = {
  ProfilMutations: { updateProfil }
}
