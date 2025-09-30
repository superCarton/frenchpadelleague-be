import type { Context } from 'koa';
import { getLeagueByFFTPadelRank, getLeagueByQuizScore } from '../../../utils/ranking';
import sharp from "sharp";

const populatePlayer = ['league', 'league.badgeImage', 'user', 'elo', 'selfEvaluation', 'photo'] as any;

async function getEntityByUser(ctx: Context, entityUID: string) {
  const user = ctx.state.user;
  if (!user) {
    return null;
  }

  return strapi.db.query(entityUID).findOne({
    where: { user: user.id },
    populate: populatePlayer,
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

  async selfEvaluation(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }
  
    const { fftPadelRank, fftLicenceNumber, quizScore } = ctx.request.body as {
      fftPadelRank?: number;
      fftLicenceNumber?: string;
      quizScore?: number;
    };
  
    if (!fftPadelRank && !quizScore) {
      return ctx.badRequest("Either fftPadelRank or quizScore is required");
    }

    if (fftPadelRank && !fftLicenceNumber) {
      return ctx.badRequest("fftLicenceNumber is required when fftPadelRank is given");
    }
  
    try {
      const player = await strapi.documents("api::player.player").findFirst({
        filters: { user: user.id },
        populate: populatePlayer,
      }) as any;
  
      if (!player) {
        return ctx.notFound("Player not found");
      }
  
      let matchingLeague: any;
  
      if (fftPadelRank) {
        // Déterminer la ligue à partir du classement
        const leagueName = getLeagueByFFTPadelRank(player.gender, fftPadelRank);
  
        matchingLeague = await strapi.documents("api::league.league").findFirst({
          filters: { badge: { $eq: leagueName }, gender: { $eq: player.gender } },
        });
  
        if (!matchingLeague) {
          return ctx.badRequest(`Aucune league trouvée pour le ranking ${fftPadelRank}`);
        }

      } else if (quizScore) {
        // Déterminer la ligue à partir du résultat du quizz
        const leagueName = getLeagueByQuizScore(player.gender, quizScore);

        matchingLeague = await strapi.documents("api::league.league").findFirst({
          filters: { badge: { $eq: leagueName }, gender: { $eq: player.gender } },
        });
  
        if (!matchingLeague) {
          return ctx.badRequest(`Aucune league trouvée pour le quiz score ${quizScore}`);
        }
  
        if (!matchingLeague) {
          return ctx.badRequest(`Aucune league trouvée pour le quiz score ${quizScore}`);
        }
      }

      // Elo = milieu de la plage de la ligue
      const newElo = Math.ceil((matchingLeague.minElo + matchingLeague.maxElo) / 2);
      const newBest = Math.max(player.elo.best, newElo);

      const elo = {
        ...player.elo,
        current: newElo,
        best: newBest,
      };

      const selfEvaluation = {
        date: new Date(),
        fftPadelRank,
        fftLicenceNumber,
        quizScore
      };

      const updated = await strapi.documents("api::player.player").update({
        documentId: player.documentId,
        data: {
          elo,
          selfEvaluation,
          league: matchingLeague.documentId,
        },
        populate: populatePlayer,
      });
      
  
      return ctx.send(updated);
    } catch (error) {
      strapi.log.error(error);
      return ctx.internalServerError("Failed to update player elo");
    }
  },

  async uploadProfilePhoto(ctx: Context) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized("You must be logged in");

    // 2. Récupérer le player lié au user
    const player = await strapi.documents("api::player.player").findFirst({
      filters: { user: user.id },
    });
    if (!player) return ctx.notFound("Player not found");

    if (!ctx.request.files || !ctx.request.files.file) {
      return ctx.badRequest("A file is required");
    }

    try {

      const file = ctx.request.files.file as any;

      // Compression via sharp
      const compressedPath = file.filepath + "-compressed.jpg";
      await sharp(file.filepath)
        .resize(600, 600, { fit: "inside" }) // max 600px
        .jpeg({ quality: 80 })
        .toFile(compressedPath);
  
      // Remplacer le fichier original par le compressé
      const compressedFile = {
        ...file,
        filepath: compressedPath,
        newFilename: "compressed-" + file.originalFilename,
        mimetype: "image/jpeg",
      };
  
      const uploadedFiles = await strapi
        .plugin("upload")
        .service("upload")
        .upload({
          data: {},
          files: compressedFile,
        });

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return ctx.badRequest("Upload failed");
      }

      const uploaded = uploadedFiles[0];

      // 3. Associer la photo au player
      const updated = await strapi.documents("api::player.player").update({
        documentId: player.documentId,
        data: {
          photo: {
            connect: [uploaded.id],
          },
        },        
        populate: populatePlayer,
      });

      return ctx.send(updated);
    } catch (err) {
      strapi.log.error(err);
      return ctx.internalServerError("Failed to upload profile picture");
    }
  },

  async updateProfile(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized("You must be logged in");
    }

    const { firstname, lastname, email, phoneNumber } = ctx.request.body as {
      firstname: string;
      lastname: string;
      email: string;
      phoneNumber?: string;
    };

    if (!firstname || !lastname || !email) {
      return ctx.badRequest("Firstname, lastname and email are required");
    }

    try {
      // 1. Récupérer le player lié au user
      const player = await strapi.documents("api::player.player").findFirst({
        filters: { user: user.id },
      });
      if (!player) return ctx.notFound("Player not found");

      // 2. Update Player (firstname, lastname, phone)
      await strapi.documents("api::player.player").update({
        documentId: player.documentId,
        data: {
          firstname,
          lastname,
          phoneNumber,
        },
      });

      // 3. Update User (email)
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: user.id },
        data: { email },
      });

      // 4. Retourner player avec populate
      const updatedPlayer = await strapi.documents("api::player.player").findOne({
        documentId: player.documentId,
        populate: populatePlayer,
      });

      return ctx.send(updatedPlayer);
    } catch (error) {
      strapi.log.error(error);
      return ctx.internalServerError("Failed to update profile");
    }
  },
};
