export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::session',
    config: {
      cookie: {
        secure: false,
        sameSite: 'lax',
      },
    },
  },
  'strapi::favicon',
  'strapi::public',
  {
    name: "strapi::body",
    config: {
      formLimit: "20mb",    // formulaires textuels
      jsonLimit: "20mb",    // JSON
      textLimit: "20mb",    // text/plain
      formidable: {
        maxFileSize: 20 * 1024 * 1024, // 20 MB max pour les fichiers
      },
    },
  },
];
