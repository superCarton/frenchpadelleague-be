import crypto from 'crypto';

export default {
  async register(payload) {
    const { email, password, username, role, ...profileData } = payload;

    if (!email || !password || !role) {
      throw new Error('Missing email, password, or role');
    }

    if (!['player', 'referee', 'club'].includes(role)) {
      throw new Error('Invalid role');
    }

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email is already taken');
    }

    const user = await strapi.plugins['users-permissions'].services.user.add({
      email,
      username: username || email,
      password,
      confirmed: true,
      blocked: false,
    });

    const profile = await strapi.db.query(`api::${role}.${role}`).create({
      data: {
        ...profileData,
        user: user.id,
      },
    });

    const token = strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id });

    return { jwt: token, user, profile };
  },

  async login(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error('Missing email or password');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      password,
      user.password
    );

    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    const token = strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id });

    return { jwt: token, user };
  },

  async forgotPassword(payload) {
    const { email } = payload;
    if (!email) {
      throw new Error('Missing email');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('No user found with this email');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpires: Date.now() + 3600000 },
    });

    await strapi.plugins['email'].services.email.send({
      to: email,
      subject: 'Reset your password',
      text: `Click this link to reset your password: https://your-app.com/reset-password?token=${resetToken}`,
    });

    return { message: 'Password reset email sent' };
  },

  async resetPassword(payload) {
    const { token, password } = payload;

    if (!token || !password) {
      throw new Error('Missing token or password');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { resetPasswordToken: token },
    });

    if (!user) {
      throw new Error('Invalid token');
    }

    const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword({
      password,
    });

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id });

    return { jwt, user };
  },
};
