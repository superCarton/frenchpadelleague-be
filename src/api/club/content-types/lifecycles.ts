import { geocodeAddress } from '../../../utils/geocode';

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.address) {
      const { latitude, longitude } = await geocodeAddress(data.address);
      data.address.latitude = latitude;
      data.address.longitude = longitude;
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    if (data.address) {
      const { latitude, longitude } = await geocodeAddress(data.address);
      data.address.latitude = latitude;
      data.address.longitude = longitude;
    }
  },
};
