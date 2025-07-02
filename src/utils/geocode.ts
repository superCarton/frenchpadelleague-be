import axios from 'axios';

export type Address = {
  street: string;
  streetComplement?: string;
  city: string;
  zipcode: string;
  country: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

/**
 * Géocode une adresse
 */
export const geocodeAddress = async (address: Address): Promise<Coordinates> => {
  const query = `${address.street} ${address.streetComplement || ''} ${address.zipcode} ${address.city} ${address.country}`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'frenchpadelleague-app',
    },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error(`Geocoding failed for address: ${query}`);
  }

  const { lat, lon } = response.data[0];

  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
  };
};

/**
 * Compare deux adresses pour vérifier si elles ont changé
 */
export const hasAddressChanged = (oldAddress: Address, newAddress: Address): boolean => {
  return (
    oldAddress.street !== newAddress.street ||
    oldAddress.streetComplement !== newAddress.streetComplement ||
    oldAddress.city !== newAddress.city ||
    oldAddress.zipcode !== newAddress.zipcode ||
    oldAddress.country !== newAddress.country
  );
};
