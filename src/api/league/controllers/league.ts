/**
 * league controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController("api::league.league", ({ strapi }) => ({

  async register(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Vous devez être connecté.");
    }
    }
}));