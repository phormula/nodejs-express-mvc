require('dotenv').config();
const createHttpError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../model/User');
const Role = require('../model/Role');
const Mail = require('../model/Mail');
const { protectedUser, tokenHelper } = require('../helpers');

class AuthController {
  /**`
   * POST /auth/login
   * Login request
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user by email address
      const user = await User.query().findOne({ email }).withGraphJoined('roles(defaultSelects)');
      if (!user) {
        return next(createHttpError(400, 'There is no user with this email address!'));
      }

      // Check user password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return next(createHttpError(400, 'Incorrect password!'));
      }
      // Generate and return token
      const token = user.generateToken();
      const refreshToken = user.generateToken('2h');
      return res.status(200).json({ token, refreshToken, ...protectedUser(user) });
    } catch (err) {
      return next(err);
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassRequest(req, res, next) {
    try {
      const { email } = req.body;

      // Find user by email address
      const user = await User.query().findOne({ email }).withGraphJoined('roles(defaultSelects)');
      if (!user) {
        return next(createHttpError(400, 'There is no user with this email address!'));
      }

      // Generate and return token
      const token = user.generateToken('0.5h', 'reset');
      const resetLink = `${process.env.APP_URL}/auth/resetpass?token=${token}`;
      await user.sendMail({
        subject: 'Password Reset Request',
        text: `Hello ${user.first_name}, You have requested a password reset. 
        click on the link below to reset your password.\n\n
        ${resetLink}
        \n\n
        If you did not make this request please ignore this email.`,
        html: `<h3>Hello ${user.first_name},</h3>
        <p>You have requested a password reset.</p>
        <p>click on the link below to reset your password.</p><br/>
        <p>${resetLink}</p><br/>
        <p>If you did not make this request please ignore this email.</p>`,
      });
      return res.status(200).json({ success: true, message: 'password reset email sent' });
    } catch (err) {
      return next(err);
    }
  }

  /**`
   * POST /auth/resetpass
   * Reset Password request
   */
  async resetPassword(req, res, next) {
    try {
      const { newPassword, confirmPassword, token } = req.body;
      const tokenData = tokenHelper.verifyToken(token);
      console.log(req.body);
      if (newPassword !== confirmPassword) {
        return next(createHttpError(400, 'Passwords do not match'));
      }

      const updateUser = await User.query()
        .update({ password: bcrypt.hashSync(newPassword, Number(process.env.SALT)) })
        .where('id', tokenData.id);
      const user = await User.query().findById(tokenData.id);
      console.log(updateUser);
      console.log(user);
      if (!updateUser) {
        return next(createHttpError(400, 'There is no user with this email address!'));
      }

      await user.sendMail({
        subject: 'Password Reset Successful',
        text: `Your password has been succesfully reset.`,
        html: `<p>Your password has been succesfully reset</p>`,
      });
      return res.status(200).json({ success: true, message: 'password reset successful' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /auth/register
   * Register request
   */
  async register(req, res, next) {
    try {
      const { first_name, last_name, email, password } = req.body;
      const roleName = req.body.role || 'customer';
      const role = await Role.query().select('id').findOne({ name: roleName });
      const user = await User.query().insertGraph(
        [
          {
            first_name,
            last_name,
            email,
            password: bcrypt.hashSync(password, Number(process.env.SALT)),
            roles: [role],
          },
        ],
        {
          relate: ['roles'],
        },
      );

      const registeredUser = await User.query().findById(user[0].id);

      // Generate and return tokens
      const token = registeredUser.generateToken();
      const refreshToken = registeredUser.generateToken('2h');

      const mailTemplate = await Mail.query().select('subject', 'text', 'html').findOne({ type: 'register' });
      await registeredUser.sendMail(mailTemplate);
      res.status(201).json({ token, refreshToken, ...protectedUser(registeredUser) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /auth/me
   * Get current user
   */
  async getCurrentUser(req, res, next) {
    try {
      res.json(protectedUser(req.user));
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /auth/me
   * Update current user
   */
  async updateCurrentUser(req, res, next) {
    try {
      req.user = await User.query().updateAndFetchById(req.user.id, { ...req.body });

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /auth/me
   * Delete current user
   */
  async deleteCurrentUser(req, res, next) {
    try {
      await req.user.destroy();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /auth/me/password
   * Update password of current user
   */
  async updatePassword(req, res, next) {
    try {
      const { current, password } = req.body;

      // Check user password
      const isValidPassword = await req.user.validatePassword(current);
      if (!isValidPassword) {
        return next(createHttpError(400, 'Incorrect password!'));
      }

      // Update password
      req.user.password = password;
      await req.user.save();

      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
