import type { Context } from 'koa';

async function getEntityByUser(ctx: Context, entityUID: string, notFoundMsg: string) {
  const user = ctx.state.user;
  if (!user) {
    return ctx.unauthorized('You must be logged in.');
  }

  const entity = await strapi.db.query(entityUID).findOne({
    where: { user: user.id },
    populate: ['user'],
  });

  if (!entity) {
    return ctx.notFound(notFoundMsg);
  }

  ctx.body = entity;
}

export default {
  async getPlayer(ctx: Context) {
    return getEntityByUser(ctx, 'api::player.player', 'Player not found.');
  },

  async getReferee(ctx: Context) {
    return getEntityByUser(ctx, 'api::referee.referee', 'Referee not found.');
  },

  async getClub(ctx: Context) {
    return getEntityByUser(ctx, 'api::club.club', 'Club not found.');
  },
};
