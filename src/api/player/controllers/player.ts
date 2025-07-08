import { factories } from '@strapi/strapi';
import type { Context } from 'koa';

export default factories.createCoreController('api::player.player', ({ strapi }) => ({
  async create(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const { firstname, lastname, elo = 600 } = ctx.request.body;

    if (!firstname || !lastname) {
      return ctx.badRequest('Firstname and lastname are required.');
    }

    const existingPlayer = await strapi.db.query('api::player.player').findOne({
      where: { user: user.id },
    });

    if (existingPlayer) {
      return ctx.conflict('A player is already associated with this user.');
    }

    const player = await strapi.db.query('api::player.player').create({
      data: {
        firstname,
        lastname,
        elo,
        user: user.id,
      },
      populate: ['user'],
    });

    return ctx.send(player);
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
