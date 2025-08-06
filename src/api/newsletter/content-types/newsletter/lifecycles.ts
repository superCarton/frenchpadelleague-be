import jwt from 'jsonwebtoken';

export default {
    async afterCreate(event) {
      const { result: { email } } = event;

      const token = jwt.sign(
        { email: email }, 
        process.env.NEWSLETTER_SECRET, 
        { expiresIn: '1y' }
      );

      const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe-newsletter?token=${token}`;
  
      await strapi.plugin('email').service('email').send({
        to: email,
        subject: 'Merci pour votre inscription à la newsletter 🎾🎉',
        html: `
          <p>Bonjour,</p>
          <p>Merci pour votre inscription à la newsletter de French Padel League !</p>
          <p>Pour vous désinscrire, cliquez sur ce lien :<br/><a href="${unsubscribeLink}">Se désinscrire</a></p>
        `
      });
    },
  };