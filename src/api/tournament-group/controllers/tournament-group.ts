const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tournament-group.tournament-group', ({ strapi }) => ({

  async find(ctx) {
    const { query } = ctx;

    // tes populate obligatoires
    const defaultPopulate = {
      teams: true,
      matches: {
        populate: {
          team_a: true,
          team_b: true,
          winner: true,
          score: true,
        },
      },
      tournament: true,
    };

    // merge avec ce que le frontend a envoyé
    const finalQuery = {
      ...query,
      populate: {
        ...defaultPopulate,
        ...(query.populate || {}),
      },
    };

    // récupération avec populate final
    const entities = await strapi.entityService.findMany(
      'api::tournament-group.tournament-group',
      finalQuery
    );

    // puis ton traitement des stats...
    const withStats = entities.map(group => {
      const stats = group.teams.map(team => {
        let played = 0, won = 0, lost = 0, gamesFor = 0, gamesAgainst = 0;

        group.matches.forEach(match => {
          if (match.matchStatus !== 'finished') return;

          if (match.team_a.id === team.id || match.team_b.id === team.id) {
            played++;

            const isTeamA = match.team_a.id === team.id;
    

            const teamGames = match.score.reduce(
              (sum, set) => sum + (isTeamA ? set.teamAScore : set.teamBScore),
              0
            ) || 0;

            const oppGames = match.score.reduce(
              (sum, set) => sum + (isTeamA ? set.teamBScore : set.teamAScore),
              0
            ) || 0;

            gamesFor += teamGames;
            gamesAgainst += oppGames;

            if (match.winner.id === team.id) {
              won++;
            } else {
              lost++;
            }
          }
        });

        return { team, played, won, lost, gamesFor, gamesAgainst, gamesDiff: gamesFor - gamesAgainst };
      });

      const totalMatches = group.matches.length;
      const finishedMatches = group.matches.filter(m => m.matchStatus === 'finished').length;
      const isFinished = totalMatches > 0 && finishedMatches === totalMatches;

      return { ...group, stats, isFinished };
    });

    return withStats;
  },

}));
