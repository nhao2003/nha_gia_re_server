import { ApartmentTypes, Direction, FurnitureStatus, LandTypes, LegalDocumentStatus } from '~/constants/enum';

abstract class PropertyFeature {
  static fromJson(json: Record<string, any>): PropertyFeature {
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

  static fromJson(json: Record<string, any>): Motel {
    if (json.water_price == null || json.electric_price == null || json.furniture_status == null) {
      throw new Error('Invalid motel');
    }
    return new Motel(json.water_price, json.electric_price, json.furniture_status);
  }
}

class Apartment implements PropertyFeature {
  constructor(
    public apartment_type: ApartmentTypes,
    public is_hand_over: boolean,
    public num_of_bed_rooms: number,
    public furniture_status: FurnitureStatus | null,
    public num_of_toilets: number | null,
    public balcony_direction: string | null,
    public block: string | null,
    public floor: string | null,
    public legal_document_status: LegalDocumentStatus | null,
    public apartment_number: string | null,
    public show_apartment_number: boolean | null,
  ) {}

  static fromJson(json: Record<string, any>): Apartment {
    return new Apartment(
      json.apartment_type,
      json.is_hand_over,
      json.num_of_bed_rooms,
      json.furniture_status ?? null,
      json.num_of_toilets ?? null,
      json.balcony_direction ?? null,
      json.block ?? null,
      json.floor ?? null,
      json.legal_document_status ?? null,
      json.apartment_number ?? null,
      json.show_apartment_number ?? null,
    );
  }
}

class Office implements PropertyFeature {
  constructor(
    public office_type: string,
    public is_facade: boolean | null,
    public main_door_direction: Direction | null,
    public block: string | null,
    public floor: string | null,
    public legal_document_status: LegalDocumentStatus | null,
    public office_number: string | null,
    public show_office_number: boolean | null,
    public furniture_status: FurnitureStatus | null,
  ) {}

  static fromJson(json: Record<string, any>): Office {
    return new Office(
      json.office_type,
      json.is_facade ?? null,
      json.main_door_direction ?? null,
      json.block ?? null,
      json.floor ?? null,
      json.legal_document_status ?? null,
      json.office_number ?? null,
      json.show_office_number ?? null,
      json.furniture_status ?? null,
    );
  }
}

class House implements PropertyFeature {
  constructor(
    public house_type: string,
    public num_of_bed_rooms: number,
    public is_widens_towards_the_back: boolean | null,
    public num_of_toilets: number | null,
    public num_of_floors: number | null,
    public main_door_direction: Direction | null,
    public width: number | null,
    public length: number | null,
    public area_used: number | null,
    public legal_document_status: LegalDocumentStatus | null,
    public house_number: string | null,
    public show_house_number: boolean | null,
    public furniture_status: FurnitureStatus | null,
  ) {}

  static fromJson(json: Record<string, any>): House {
    return new House(
      json.house_type,
      json.num_of_bed_rooms,
      json.is_widens_towards_the_back ?? null,
      json.num_of_toilets ?? null,
      json.num_of_floors ?? null,
      json.main_door_direction ?? null,
      json.width ?? null,
      json.length ?? null,
      json.area_used ?? null,
      json.legal_document_status ?? null,
      json.house_number ?? null,
      json.show_house_number ?? null,
      json.furniture_status ?? null,
    );
  }
}

class Land implements PropertyFeature {
  constructor(
    public land_type: LandTypes,
    public land_lot_code: string | null,
    public subdivision_name: string | null,
    public is_facade: boolean | null,
    public has_wide_alley: boolean | null,
    public is_widens_towards_the_back: boolean | null,
    public land_direction: Direction | null,
    public width: number | null,
    public length: number | null,
    public legal_document_status: LegalDocumentStatus | null,
    public show_land_lot_code: boolean | null,
  ) {}

  static fromJson(json: Record<string, any>): Land {
    return new Land(
      json.land_type,
      json.land_lot_code ?? null,
      json.subdivision_name ?? null,
      json.is_facade ?? null,
      json.has_wide_alley ?? null,
      json.is_widens_towards_the_back ?? null,
      json.land_direction ?? null,
      json.width ?? null,
      json.length ?? null,
      json.legal_document_status ?? null,
      json.show_land_lot_code ?? null,
    );
  }
}

export { Motel, Apartment, Office, House, Land, PropertyFeature as PropertyFeatures };
