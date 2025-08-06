/**
 * newsletter controller
 */
import jwt, { JwtPayload } from 'jsonwebtoken';

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::newsletter.newsletter', {
    async delete(ctx) {
        const token = ctx.query.token;
    
        if (!token) {
          return ctx.badRequest('Token manquant');
        }
    
        try {
          const jwtPayload = jwt.verify(token as string, process.env.NEWSLETTER_SECRET);
    
          const entries = await strapi.db.query('api::newsletter.newsletter').findMany({
            where: { email: (jwtPayload as JwtPayload).email },
          });
    
          if (!entries.length) {
            return ctx.notFound('Abonné non trouvé');
          }
    
          for (const entry of entries) {
            await strapi.db.query('api::newsletter.newsletter').delete({
              where: { id: entry.id },
            });
          }
    
          return ctx.send({ message: 'Désinscription réussie' });
        } catch (err) {
          strapi.log.error('Erreur désinscription newsletter :', err);
          return ctx.unauthorized('Lien invalide ou expiré');
        }
      },
});
