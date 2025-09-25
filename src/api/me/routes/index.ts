export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/me/player',
      handler: 'me.getPlayer',
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: 'GET',
      path: '/me/referee',
      handler: 'me.getReferee',
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: 'GET',
      path: '/me/club',
      handler: 'me.getClub',
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: 'GET',
      path: '/me/profiles',
      handler: 'me.getProfiles',
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: "POST",
      path: "/me/player/level-quizz",
      handler: "me.updateEloFromQuizz",
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: "POST",
      path: "/me/player/photo",
      handler: "me.uploadProfilePhoto",
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
    {
      method: "POST",
      path: "/me/update-profile",
      handler: "me.updateProfile",
      config: {
        auth: {
          strategies: ['users-permissions'],
        },
      },
    },
  ],
};
