import authService from '../services/auth';

export default {
  async register(ctx) {
    try {
      const result = await authService.register(ctx.request.body);
      ctx.send(result);
    } catch (err) {
      ctx.throw(400, err.message);
    }
  },

  async login(ctx) {
    try {
      const result = await authService.login(ctx.request.body);
      ctx.send(result);
    } catch (err) {
      ctx.throw(400, err.message);
    }
  },

  async forgotPassword(ctx) {
    try {
      const result = await authService.forgotPassword(ctx.request.body);
      ctx.send(result);
    } catch (err) {
      ctx.throw(400, err.message);
    }
  },

  async resetPassword(ctx) {
    try {
      const result = await authService.resetPassword(ctx.request.body);
      ctx.send(result);
    } catch (err) {
      ctx.throw(400, err.message);
    }
  },
};
