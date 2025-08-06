import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::player.player', ({ strapi }) => ({
  async create(ctx) {
    const data = ctx.request.body;

    if (!data) {
      return ctx.badRequest('Données manquantes');
    }

    const { email, password, firstname, lastname, ...playerData } = data;

    if (!email || !password || !firstname || !lastname) {
      return ctx.badRequest('Email, mot de passe, prénom et nom sont requis');
    }

    // Vérifie que l'email n'est pas déjà utilisé
    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email },
    });

    if (existingUser) {
      return ctx.badRequest('Un utilisateur avec cet email existe déjà');
    }

    // Crée le user
    const newUser = await strapi.db.query('plugin::users-permissions.user').create({
      data: {
        email,
        username: email,
        password,
      },
    });

    // Crée le player et lie le user
    const newPlayer = await strapi.db.query('api::player.player').create({
      data: {
        firstname,
        lastname,
        ...playerData,
        user: newUser.id,
      },
    });

    // Génère le token JWT
    const token = strapi.plugins['users-permissions'].services.jwt.issue({
      id: newUser.id,
    });

    // Retourne le token et le player
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
