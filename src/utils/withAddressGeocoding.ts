import { geocodeAddress, hasAddressChanged } from './geocode';

/**
 * Hook générique pour gérer la géolocalisation automatique sur un composant address
 *
 * @param contentTypeUID string — Exemple : 'api::club.club'
 * @param options object :
 *  - addressFieldName string — nom du champ qui contient le composant address (par défaut 'address')
 */
export const withAddressGeocoding = (
  contentTypeUID: string,
  options?: { addressFieldName?: string }
) => {
  const addressField = options?.addressFieldName || 'address';

  return {
    async beforeCreate(event) {
      const { data } = event.params;

      const address = data[addressField];
      if (address) {
        const { latitude, longitude } = address;

        if (!latitude || !longitude) {
          const geo = await geocodeAddress(address);
          address.latitude = geo.latitude;
          address.longitude = geo.longitude;
        }
      }
    },

    async beforeUpdate(event) {
      const { data, where } = event.params;

      const address = data[addressField];
      if (address) {
        const { latitude, longitude } = address;

        const previousEntity = await strapi.db.query(contentTypeUID).findOne({
          where: { id: where.id },
          populate: { [addressField]: true },
        });

        const previousAddress = previousEntity?.[addressField];

        const needsGeocode =
          !latitude ||
          !longitude ||
          (previousAddress && hasAddressChanged(previousAddress, address));

        if (needsGeocode) {
          const geo = await geocodeAddress(address);
          address.latitude = geo.latitude;
          address.longitude = geo.longitude;
        }
      }
    },
  };
};
