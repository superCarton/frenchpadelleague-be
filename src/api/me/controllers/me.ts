import type { Context } from 'koa';

async function getEntityByUser(ctx: Context, entityUID: string) {
  const user = ctx.state.user;
  if (!user) {
    return null;
  }

  return strapi.db.query(entityUID).findOne({
    where: { user: user.id },
    populate: ['user'],
  });
}

export default {
  async getPlayer(ctx: Context) {
    const player = await getEntityByUser(ctx, 'api::player.player');
    if (!player) return ctx.notFound('Player not found.');
    ctx.body = player;
  },

  async getReferee(ctx: Context) {
    const referee = await getEntityByUser(ctx, 'api::referee.referee');
    if (!referee) return ctx.notFound('Referee not found.');
    ctx.body = referee;
  },

  async getClub(ctx: Context) {
    const club = await getEntityByUser(ctx, 'api::club.club');
    if (!club) return ctx.notFound('Club not found.');
    ctx.body = club;
  },

  async getProfiles(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in.');
    }

    const [player, referee, club] = await Promise.all([
      getEntityByUser(ctx, 'api::player.player'),
      getEntityByUser(ctx, 'api::referee.referee'),
      getEntityByUser(ctx, 'api::club.club'),
    ]);

    ctx.body = { player, referee, club };
  },
};
