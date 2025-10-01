export default {
    type: 'content-api',
    routes: [
        {
            method: "POST",
            path: "/leagues/self-evaluation",
            handler: "league.selfEvaluation",
            config: {
              auth: {
                strategies: ['users-permissions'],
              },
            },
          },
    ]
}