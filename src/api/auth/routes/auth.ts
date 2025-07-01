export default {
    routes: [
      {
        method: 'POST',
        path: '/auth/register',
        handler: 'auth.register',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/auth/login',
        handler: 'auth.login',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/auth/forgot-password',
        handler: 'auth.forgotPassword',
        config: { auth: false },
      },
      {
        method: 'POST',
        path: '/auth/reset-password',
        handler: 'auth.resetPassword',
        config: { auth: false },
      },
    ],
  };
  