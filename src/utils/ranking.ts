import type { Context } from 'koa';

const getLeagueBadgeByFFTPadelRank = (gender: "male" | "female", ranking: number) => {
    if (gender === "male") {
        if (ranking <= 500) return "legend"; // p1000
        if (ranking <= 1000) return "premium"; // p500
        if (ranking <= 3000) return "gold"; // p250
        if (ranking <= 10000) return "silver"; // p100
        return "bronze";
    } else {
        if (ranking <= 100) return "diamant";
        if (ranking <= 200) return "rubis";
        if (ranking <= 800) return "emeraude";
        if (ranking <= 1500) return "saphir";
        return "quartz";
    }
}

// League is caped to gold/emeraude when using the quizz
const getLeagueBadgeByQuizScore = (gender: "male" | "female", quizzScore: number) => {
    if (gender === "male") {
        if (quizzScore <= 10) return "bronze";
        if (quizzScore <= 15) return "silver"; 
        return "gold";
    } else {
        if (quizzScore <= 10) return "quartz";
        if (quizzScore <= 15) return "saphir"; 
        return "emeraude";
    }
};

export const getLeagueBySelfEvaluation = async (ctx: Context, { gender, fftPadelRank, quizScore }: { gender: "male" | "female", fftPadelRank?: number, quizScore?: number }) => {
    let matchingLeague;  
    if (fftPadelRank) {
        // Déterminer la ligue à partir du classement
        const leagueName = getLeagueBadgeByFFTPadelRank(gender, fftPadelRank);
  
        matchingLeague = await strapi.documents("api::league.league").findFirst({
          filters: { badge: { $eq: leagueName }, gender: { $eq: gender } },
        });
  
        if (!matchingLeague) {
          return ctx.badRequest(`Aucune league trouvée pour le ranking ${fftPadelRank}`);
        }

      } else if (quizScore) {
        // Déterminer la ligue à partir du résultat du quizz
        const leagueName = getLeagueBadgeByQuizScore(gender, quizScore);

        matchingLeague = await strapi.documents("api::league.league").findFirst({
          filters: { badge: { $eq: leagueName }, gender: { $eq: gender } },
        });
  
        if (!matchingLeague) {
          return ctx.badRequest(`Aucune league trouvée pour le quiz score ${quizScore}`);
        }
      }
      return matchingLeague;
};