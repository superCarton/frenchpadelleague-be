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

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
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
      'shared.match-set': SharedMatchSet;
      'shared.media': SharedMedia;
      'shared.opening-hour': SharedOpeningHour;
      'shared.padel-court': SharedPadelCourt;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.weekday': SharedWeekday;
    }
  }
}
