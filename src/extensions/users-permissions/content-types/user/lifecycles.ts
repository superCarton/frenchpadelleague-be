export default {
  async beforeCreate(event) {
    const { data } = event;

    if (!data.username) {
        const emailPrefix = data.email.split('@')[0];
        data.username = `${emailPrefix}_${Date.now()}`;
    }
  },
};
