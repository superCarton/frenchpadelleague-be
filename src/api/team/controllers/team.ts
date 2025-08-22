import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::team.team", ({ strapi }) => ({

  async register(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("Vous devez être connecté.");
    }

    const { tournamentId, partnerId } = ctx.request.body as {
      tournamentId: string;
      partnerId: string;
    };

    if (!tournamentId || !partnerId) {
      return ctx.badRequest("Vous devez fournir un partenaire et un tournoi.");
    }

    const currentPlayer = await strapi.db.query("api::player.player").findOne({
      where: { user: { id: user.id } },
      populate: ["league", "user"],
    });

    if (!currentPlayer) {
      return ctx.forbidden("Vous n'avez pas de profil joueur associé.");
    }

    const partner = await strapi.db.query("api::player.player").findOne({
      where: { documentId: partnerId },
      populate: ["league", "user"],
    });

    if (!partner) {
      return ctx.badRequest("Le joueur partenaire n'existe pas.");
    }

    const tournament = await strapi.db.query("api::tournament.tournament").findOne({
      where: { documentId: tournamentId },
      populate: {
        league: true,
        teams: { populate: ["players"] },
      },
    });

    if (!tournament) {
      return ctx.notFound("Tournoi introuvable.");
    }

    if (tournament.currentStatus !== "registrations-opened") {
      return ctx.badRequest("Les inscriptions pour ce tournoi sont fermées.");
    }

    const sameLeague =
      currentPlayer.league?.documentId === tournament.league.documentId &&
      partner.league?.documentId === tournament.league.documentId;

    if (!sameLeague) {
      return ctx.badRequest("Les joueurs ne sont pas dans la même ligue que le tournoi.");
    }

    const alreadyRegistered = tournament.teams.some((team) =>
      team.players.some((p) => [currentPlayer.documentId, partner.documentId].includes(p.documentId))
    );

    if (alreadyRegistered) {
      return ctx.badRequest("Un ou plusieurs joueurs sont déjà inscrits à ce tournoi.");
    }

    const team = await strapi.documents("api::team.team").create({
        data: {
            tournament: tournamentId,
            playerA: currentPlayer.documentId,
            playerB: partner.documentId,
            confirmed: false,
            name: `${currentPlayer.lastname} - ${partner.lastname}`
        },
        populate: ["playerA", "playerB", "tournament"],
      });

    return ctx.send(team);
  },

}));
