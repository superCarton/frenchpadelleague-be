import jwt from 'jsonwebtoken';

import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

const gray50BgColor = "#fbf9fa";
const gray800TextColor = "#1e2939";
const gray700TextColor = "#364153";
const gray500TextColor = "#4a5565";
const yellowPrimary = "#d7a63c";

const emailTemplateContainer = (content: string, title?: string) => {
    return `
        <html lang="fr">
        <body>
      <div bgcolor="${gray50BgColor}" style="background-color:${gray50BgColor}; padding:50px 0; font-family:Arial, sans-serif; color:#333;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <!-- Conteneur global -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="background:#000; min-height:185px">
                    <img src="https://res.cloudinary.com/dldzuelcq/image/upload/v1757010050/logo_black_with_title_email_banner_31fbd72d00.jpg"
                         alt="French Padel League" 
                         width="600" 
                         style="display:block; margin:0 auto;" />
                  </td>
                </tr>
                
                <tr>
                  <td style="padding:40px; text-align:center; color:${gray700TextColor};">

                    ${title ? `
                        <h2 style="margin:0 0 24px 0; color:${gray800TextColor};font-size:20px; text-transform: uppercase">${title}</h2>
                    `: null}

                    ${content}
                    
                    <!-- Footer -->
                    <p style="font-size:12px; color:${gray500TextColor}; margin-top:30px;">
                      Merci de faire partie de la French Padel League 💛
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </div>
      </body>
      </html>
    `;
  };
  

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
        html: emailTemplateContainer(`
            <p>Bonjour,</p>
            <p>Merci pour ton inscription à la newsletter de French Padel League !</p>
            <p>Pour te désinscrire, clique sur ce lien :<br/><a href="${unsubscribeLink}">Se désinscrire</a></p>
        `, "Confirmation d'inscription")
    });
};

export const confirmationEmail = (userEmail: string, userPrettyName: string, confirmationCode: string) => {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?code=${confirmationCode}`;

    return strapi.plugin('email').service('email').send({
      to: userEmail,
      subject: 'Confirmation de l\'email',
      html: emailTemplateContainer(`
          <p>Bonjour ${userPrettyName},</p>
          <p>Pour confirmer ton email auprès de French Padel League, clique sur ce lien :<br/><a href="${confirmationUrl}">Confirmer l'email</a></p>
      `, "Confirmation de l'email")
  });
}

export const registerTournamentEmail = (userEmail: string, userPrettyName: string, tournament: any) => {
    const formattedDate = dayjs(tournament.startDate).format("dddd DD MMMM YYYY");
    return strapi.plugin('email').service('email').send({
      to: userEmail,
      subject: 'Confirmation d\'inscription au tournoi FPL',
      html: emailTemplateContainer(`
            <p style="font-size:16px; line-height:1.5; margin-bottom:20px;">
                Bonjour <strong>${userPrettyName}</strong>,<br><br>
                Ton inscription au tournoi <strong>${tournament.name}</strong> du <strong>${formattedDate}</strong> a bien été prise en compte 🎾
            </p>

            <a href="${process.env.FRONTEND_URL}/tournaments/${tournament.documentId}" 
                style="display:inline-block; padding:12px 40px; background-color:${yellowPrimary}; color:#fff; text-decoration:none; border-radius:2px; font-weight:bold; font-size: 16px;">
                Voir le tournoi
            </a>`, "Confirmation d'inscription")
  });
}

