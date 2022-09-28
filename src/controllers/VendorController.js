const User = require('../model/User');
const Role = require('../model/Role');
const { protectedUser } = require('../helpers');

class VendorController {
  async getAllVendors(req, res, next) {
    try {
      const users = await User.query().withGraphJoined('roles(defaultSelects)').where('roles.name', ['vendor']);
      const result = users.map((u) => protectedUser(u));
      res.send(result);
    } catch (err) {
      return next(err);
    }
  }

  getVendor = async (req, res, next) => {
    try {
      const vendor = await User.query().findById(req.params.id);

      if (vendor) {
        res.send(protectedUser(vendor));
      } else {
        res.send({ status: 'error', message: 'User not found' });
      }
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = new VendorController();
