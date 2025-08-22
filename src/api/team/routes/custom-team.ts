export default {
    routes: [
      {
        method: "POST",
        path: "/teams/register",
        handler: "team.register",
        config: {
            auth: {
              strategies: ['users-permissions'],
            },
          },
      },
    ],
  };
  