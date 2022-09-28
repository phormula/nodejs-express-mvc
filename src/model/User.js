const { compare } = require('bcrypt');
const { tokenHelper, mailHelper } = require('../helpers');
const { Model } = require('objection');
const Role = require('./Role');

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  static modifiers = {
    defaultSelects(query) {
      query.select('id', 'name', 'email');
    },
  };

  generateToken(expiresIn = '2h') {
    const data = { id: this.id, email: this.email };
    return tokenHelper.generateToken(data, expiresIn);
  }

  validatePassword(plainPassword) {
    return compare(plainPassword, this.password);
  }

  sendMail(mail) {
    const payload = { ...mail, to: `${this.first_name} ${this.last_name} <${this.email}>` };
    return mailHelper(payload);
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      // required: ['first_name', 'last_name', 'email', 'password'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.

    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'user_roles.user_id',
            to: 'user_roles.role_id',
          },
          to: 'roles.id',
        },
      },
    };
  }
}

module.exports = User;
