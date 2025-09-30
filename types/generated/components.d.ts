import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    description: 'Reusable address component with geolocation';
    displayName: 'Address';
    icon: 'map-marker-alt';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    latitude: Schema.Attribute.Decimal;
    longitude: Schema.Attribute.Decimal;
    street: Schema.Attribute.String & Schema.Attribute.Required;
    streetComplement: Schema.Attribute.String;
    zipcode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedElo extends Struct.ComponentSchema {
  collectionName: 'components_shared_elos';
  info: {
    displayName: 'Elo';
  };
  attributes: {
    best: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    bestMixed: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    current: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    mixed: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedMatchSet extends Struct.ComponentSchema {
  collectionName: 'components_shared_match_sets';
  info: {
    displayName: 'MatchSet';
  };
  attributes: {
    teamAScore: Schema.Attribute.Integer & Schema.Attribute.Required;
    teamBScore: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedOpeningHour extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours';
  info: {
    displayName: 'OpeningHours';
  };
  attributes: {
    closingTime: Schema.Attribute.Time &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'22:00:00.000'>;
    days: Schema.Attribute.Component<'shared.weekday', true>;
    openingTime: Schema.Attribute.Time &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'09:00:00.000'>;
  };
}

export interface SharedPadelCourt extends Struct.ComponentSchema {
  collectionName: 'components_shared_padel_courts';
  info: {
    displayName: 'PadelCourt';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['indoor', 'outdoor']>;
  };
}

export interface SharedSelfEvaluation extends Struct.ComponentSchema {
  collectionName: 'components_shared_self_evaluations';
  info: {
    displayName: 'SelfEvaluation';
  };
  attributes: {
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    fftLicenceNumber: Schema.Attribute.String;
    fftPadelRank: Schema.Attribute.Integer;
    quizScore: Schema.Attribute.Integer;
  };
}

export interface SharedWeekday extends Struct.ComponentSchema {
  collectionName: 'components_shared_weekdays';
  info: {
    displayName: 'Weekday';
  };
  attributes: {
    name: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.address': SharedAddress;
      'shared.elo': SharedElo;
      'shared.match-set': SharedMatchSet;
      'shared.media': SharedMedia;
      'shared.opening-hour': SharedOpeningHour;
      'shared.padel-court': SharedPadelCourt;
      'shared.self-evaluation': SharedSelfEvaluation;
      'shared.weekday': SharedWeekday;
    }
  }
}
