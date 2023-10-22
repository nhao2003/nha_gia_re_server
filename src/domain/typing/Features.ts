import { ApartmentTypes, Direction, FurnitureStatus, LandTypes, LegalDocumentStatus } from '~/constants/enum';

abstract class PropertyFeature {
  static fromJson(json: any): PropertyFeature {
    switch (json.type_id) {
      case 'motel':
        return Motel.fromJson(json);
      case 'apartment':
        return Apartment.fromJson(json);
      case 'office':
        return Office.fromJson(json);
      case 'house':
        return House.fromJson(json);
      case 'land':
        return Land.fromJson(json);
      default:
        throw new Error('Invalid property type');
    }
  }
}

class Motel implements PropertyFeature {
  constructor(
    public water_price: number,
    public electric_price: number,
    public furniture_status: FurnitureStatus,
  ) {}

  static fromJson(json: any): Motel {
    if(!json.water_price || !json.electric_price || !json.furniture_status) throw new Error('Invalid motel');
    return new Motel(json.water_price, json.electric_price, json.furniture_status);
  }
}

class Apartment implements PropertyFeature {
  constructor(
    public apartment_type: ApartmentTypes,
    public is_hand_over: boolean,
    public num_of_bed_rooms: number,
    public furniture_status?: FurnitureStatus,
    public num_of_toilets?: number,
    public balcony_direction?: string,
    public block?: string,
    public floor?: string,
    public legal_document_status?: LegalDocumentStatus,
    public apartment_number?: string,
    public show_apartment_number?: boolean,
  ) {}

  static fromJson(json: any): Apartment {
    return new Apartment(
      json.apartment_type,
      json.is_hand_over,
      json.num_of_bed_rooms,
      json.furniture_status,
      json.num_of_toilets,
      json.balcony_direction,
      json.block,
      json.floor,
      json.legal_document_status,
      json.apartment_number,
      json.show_apartment_number,
    );
  }
}

class Office implements PropertyFeature {
  constructor(
    public office_type: string,
    public is_facade?: boolean,
    public main_door_direction?: Direction,
    public block?: string,
    public floor?: string,
    public legal_document_status?: LegalDocumentStatus,
    public office_number?: string,
    public show_office_number?: boolean,
    public furniture_status?: FurnitureStatus,
  ) {}

  static fromJson(json: any): Office {
    return new Office(
      json.office_type,
      json.is_facade,
      json.main_door_direction,
      json.block,
      json.floor,
      json.legal_document_status,
      json.office_number,
      json.show_office_number,
      json.furniture_status,
    );
  }
}

class House implements PropertyFeature {
  constructor(
    public house_type: string,
    public num_of_bed_rooms: number,
    public is_widens_towards_the_back?: boolean,
    public num_of_toilets?: number,
    public num_of_floors?: number,
    public main_door_direction?: Direction,
    public width?: number,
    public length?: number,
    public area_used?: number,
    public legal_document_status?: LegalDocumentStatus,
    public house_number?: string,
    public show_house_number?: boolean,
    public furniture_status?: FurnitureStatus,
  ) {}

  static fromJson(json: any): House {
    return new House(
      json.house_type,
      json.num_of_bed_rooms,
      json.is_widens_towards_the_back,
      json.num_of_toilets,
      json.num_of_floors,
      json.main_door_direction,
      json.width,
      json.length,
      json.area_used,
      json.legal_document_status,
      json.house_number,
      json.show_house_number,
      json.furniture_status,
    );
  }
}

class Land implements PropertyFeature {
  constructor(
    public land_type: LandTypes,
    public land_lot_code?: string,
    public subdivision_name?: string,
    public is_facade?: boolean,
    public has_wide_alley?: boolean,
    public is_widens_towards_the_back?: boolean,
    public land_direction?: Direction,
    public width?: number,
    public length?: number,
    public legal_document_status?: LegalDocumentStatus,
    public show_land_lot_code?: boolean,
  ) {}

  static fromJson(json: any): Land {
    return new Land(
      json.land_type,
      json.land_lot_code,
      json.subdivision_name,
      json.is_facade,
      json.has_wide_alley,
      json.is_widens_towards_the_back,
      json.land_direction,
      json.width,
      json.length,
      json.legal_document_status,
      json.show_land_lot_code,
    );
  }
}
export { Motel, Apartment, Office, House, Land, PropertyFeature as PropertyFeatures };
