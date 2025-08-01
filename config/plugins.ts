export default ({env }) => ({
    'users-permissions': {
        enabled: true,
    },
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
          secure: env.bool('SMTP_SECURE', false),
        },
    },
    documentation: {
        enabled: true,
        config: {
            auth: {
                enabled: false,
                // secret: env('DOCS_PASSWORD_SECRET'),
            },
            info: {
                title: 'API Padel League',
                version: '1.0.0',
                description: 'Documentation sécurisée',
            },
            generateDefaultDocumentation: true,
        },
    }
});
