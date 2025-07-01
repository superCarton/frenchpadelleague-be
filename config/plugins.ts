export default ({env }) => ({
    email: {
        config: {
          provider: 'nodemailer',
          providerOptions: {
            host: env('SMTP_HOST', 'smtp.gmail.com'),
            port: env.int('SMTP_PORT', 587),
            auth: {
              user: env('SMTP_USERNAME'),
              pass: env('SMTP_PASSWORD'),
            },
          },
          settings: {
            defaultFrom: env('SMTP_DEFAULT_FROM', 'noreply@tondomaine.com'),
            defaultReplyTo: env('SMTP_DEFAULT_REPLYTO', 'noreply@tondomaine.com'),
          },
        },
    },
});
