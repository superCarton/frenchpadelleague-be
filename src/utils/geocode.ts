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
 * Géocode une adresse en récupérant latitude et longitude
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
