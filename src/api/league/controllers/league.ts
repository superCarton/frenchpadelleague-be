/**
 * league controller
 */

import { factories } from '@strapi/strapi'
import { getLeagueBySelfEvaluation } from '../../../utils/ranking';

export default factories.createCoreController("api::league.league", ({ strapi }) => ({

  async selfEvaluation(ctx) {
    const { gender, fftPadelRank, quizScore } = ctx.request.body as {
        gender: "male" | "female";
        fftPadelRank?: number;
        quizScore?: number;
      };

      if (!gender) {
        return ctx.badRequest("Gender is required");
      }
    
      if (!fftPadelRank && !quizScore) {
        return ctx.badRequest("Either fftPadelRank or quizScore is required");
      }

      try {
        const matchingLeague = await getLeagueBySelfEvaluation(ctx, { gender, fftPadelRank, quizScore });
        return ctx.send(matchingLeague);
      } catch (error) {
      strapi.log.error(error);
      return ctx.internalServerError("Failed to evaluate league");
    }  
}
}));