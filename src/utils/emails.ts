import jwt from 'jsonwebtoken';

export const registerNewsletterEmail = (userEmail: string) => {
    const token = jwt.sign(
        { email: userEmail }, 
        process.env.NEWSLETTER_SECRET, 
        { expiresIn: '1y' }
    );

    const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe-newsletter?token=${token}`;

    return strapi.plugin('email').service('email').send({
        to: userEmail,
        subject: 'Merci pour ton inscription à la newsletter FPL 🎾🎉',
        html: `
            <p>Bonjour,</p>
            <p>Merci pour ton inscription à la newsletter de French Padel League !</p>
            <p>Pour te désinscrire, clique sur ce lien :<br/><a href="${unsubscribeLink}">Se désinscrire</a></p>
        `
    });
};

export const confirmationEmail = (userEmail: string, userPrettyName: string, confirmationCode: string) => {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?code=${confirmationCode}`;

    return strapi.plugin('email').service('email').send({
      to: userEmail,
      subject: 'Confirmation de l\'email',
      html: `
          <p>Bonjour ${userPrettyName},</p>
          <p>Pour confirmer ton email auprès de French Padel League, clique sur ce lien :<br/><a href="${confirmationUrl}">Confirmer l'email</a></p>
      `
  });
}
