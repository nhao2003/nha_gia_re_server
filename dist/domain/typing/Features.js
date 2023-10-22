"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyFeatures = exports.Land = exports.House = exports.Office = exports.Apartment = exports.Motel = void 0;
class PropertyFeature {
    static fromJson(json) {
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
exports.PropertyFeatures = PropertyFeature;
class Motel {
    water_price;
    electric_price;
    furniture_status;
    constructor(water_price, electric_price, furniture_status) {
        this.water_price = water_price;
        this.electric_price = electric_price;
        this.furniture_status = furniture_status;
    }
    static fromJson(json) {
        if (!json.water_price || !json.electric_price || !json.furniture_status)
            throw new Error('Invalid motel');
        return new Motel(json.water_price, json.electric_price, json.furniture_status);
    }
}
exports.Motel = Motel;
class Apartment {
    apartment_type;
    is_hand_over;
    num_of_bed_rooms;
    furniture_status;
    num_of_toilets;
    balcony_direction;
    block;
    floor;
    legal_document_status;
    apartment_number;
    show_apartment_number;
    constructor(apartment_type, is_hand_over, num_of_bed_rooms, furniture_status, num_of_toilets, balcony_direction, block, floor, legal_document_status, apartment_number, show_apartment_number) {
        this.apartment_type = apartment_type;
        this.is_hand_over = is_hand_over;
        this.num_of_bed_rooms = num_of_bed_rooms;
        this.furniture_status = furniture_status;
        this.num_of_toilets = num_of_toilets;
        this.balcony_direction = balcony_direction;
        this.block = block;
        this.floor = floor;
        this.legal_document_status = legal_document_status;
        this.apartment_number = apartment_number;
        this.show_apartment_number = show_apartment_number;
    }
    static fromJson(json) {
        return new Apartment(json.apartment_type, json.is_hand_over, json.num_of_bed_rooms, json.furniture_status, json.num_of_toilets, json.balcony_direction, json.block, json.floor, json.legal_document_status, json.apartment_number, json.show_apartment_number);
    }
}
exports.Apartment = Apartment;
class Office {
    office_type;
    is_facade;
    main_door_direction;
    block;
    floor;
    legal_document_status;
    office_number;
    show_office_number;
    furniture_status;
    constructor(office_type, is_facade, main_door_direction, block, floor, legal_document_status, office_number, show_office_number, furniture_status) {
        this.office_type = office_type;
        this.is_facade = is_facade;
        this.main_door_direction = main_door_direction;
        this.block = block;
        this.floor = floor;
        this.legal_document_status = legal_document_status;
        this.office_number = office_number;
        this.show_office_number = show_office_number;
        this.furniture_status = furniture_status;
    }
    static fromJson(json) {
        return new Office(json.office_type, json.is_facade, json.main_door_direction, json.block, json.floor, json.legal_document_status, json.office_number, json.show_office_number, json.furniture_status);
    }
}
exports.Office = Office;
class House {
    house_type;
    num_of_bed_rooms;
    is_widens_towards_the_back;
    num_of_toilets;
    num_of_floors;
    main_door_direction;
    width;
    length;
    area_used;
    legal_document_status;
    house_number;
    show_house_number;
    furniture_status;
    constructor(house_type, num_of_bed_rooms, is_widens_towards_the_back, num_of_toilets, num_of_floors, main_door_direction, width, length, area_used, legal_document_status, house_number, show_house_number, furniture_status) {
        this.house_type = house_type;
        this.num_of_bed_rooms = num_of_bed_rooms;
        this.is_widens_towards_the_back = is_widens_towards_the_back;
        this.num_of_toilets = num_of_toilets;
        this.num_of_floors = num_of_floors;
        this.main_door_direction = main_door_direction;
        this.width = width;
        this.length = length;
        this.area_used = area_used;
        this.legal_document_status = legal_document_status;
        this.house_number = house_number;
        this.show_house_number = show_house_number;
        this.furniture_status = furniture_status;
    }
    static fromJson(json) {
        return new House(json.house_type, json.num_of_bed_rooms, json.is_widens_towards_the_back, json.num_of_toilets, json.num_of_floors, json.main_door_direction, json.width, json.length, json.area_used, json.legal_document_status, json.house_number, json.show_house_number, json.furniture_status);
    }
}
exports.House = House;
class Land {
    land_type;
    land_lot_code;
    subdivision_name;
    is_facade;
    has_wide_alley;
    is_widens_towards_the_back;
    land_direction;
    width;
    length;
    legal_document_status;
    show_land_lot_code;
    constructor(land_type, land_lot_code, subdivision_name, is_facade, has_wide_alley, is_widens_towards_the_back, land_direction, width, length, legal_document_status, show_land_lot_code) {
        this.land_type = land_type;
        this.land_lot_code = land_lot_code;
        this.subdivision_name = subdivision_name;
        this.is_facade = is_facade;
        this.has_wide_alley = has_wide_alley;
        this.is_widens_towards_the_back = is_widens_towards_the_back;
        this.land_direction = land_direction;
        this.width = width;
        this.length = length;
        this.legal_document_status = legal_document_status;
        this.show_land_lot_code = show_land_lot_code;
    }
    static fromJson(json) {
        return new Land(json.land_type, json.land_lot_code, json.subdivision_name, json.is_facade, json.has_wide_alley, json.is_widens_towards_the_back, json.land_direction, json.width, json.length, json.legal_document_status, json.show_land_lot_code);
    }
}
exports.Land = Land;
