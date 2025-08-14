import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::player.player', ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body;

    if (!data) {
      return ctx.badRequest('Données manquantes');
    }

    const { email, password, firstname, lastname, birthdate, ...playerData } = data;

    if (!email || !password || !firstname || !lastname || !birthdate) {
      return ctx.badRequest('Email, mot de passe, prénom, nom et date de naissance sont requis');
    }

    // Vérifie que l'email n'est pas déjà utilisé
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.badRequest('Un utilisateur avec cet email existe déjà');
    }

    // Crée le user via le service pour avoir le hash et les hooks
    const newUser = await strapi
      .plugin('users-permissions')
      .service('user')
      .add({
        email,
        username: email,
        password,
        provider: 'local',
        role: 1,
        blocked: false,
        confirmed: true,
      });

    // Crée le player et lie le user
    const newPlayer = await strapi.db.query('api::player.player').create({
      data: {
        firstname,
        lastname,
        birthdate,
        ...playerData,
        user: newUser.id,
      },
    });

    // Génère le token JWT
    const token = strapi
      .plugin('users-permissions')
      .service('jwt')
      .issue({ id: newUser.id });

    return ctx.created({
      jwt: token,
      player: newPlayer,
    });
  },

  async update(ctx: Context) {
    const user = ctx.state.user;
    const playerId = ctx.params.id;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const player = await strapi.db.query('api::player.player').findOne({
      where: { id: playerId },
      populate: ['user'],
    });

    if (!player) {
      return ctx.notFound('Player not found.');
    }

    if (player.user?.id !== user.id) {
      return ctx.forbidden('You can only update your own player profile.');
    }

    const updatedPlayer = await strapi.db.query('api::player.player').update({
      where: { id: playerId },
      data: ctx.request.body,
    });

    return ctx.send(updatedPlayer);
  },

  async delete(ctx: Context) {
    const user = ctx.state.user;
    const playerId = ctx.params.id;

    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const player = await strapi.db.query('api::player.player').findOne({
      where: { id: playerId },
      populate: ['user'],
    });

    if (!player) {
      return ctx.notFound('Player not found.');
    }

    if (player.user?.id !== user.id) {
      return ctx.forbidden('You can only delete your own player profile.');
    }

    await strapi.db.query('api::player.player').delete({
      where: { id: playerId },
    });

    return ctx.send({ message: 'Player deleted successfully' });
  },
}));
