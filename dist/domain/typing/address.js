"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    province_code;
    district_code;
    ward_code;
    detail;
    constructor(province_code, district_code, ward_code, detail) {
        this.province_code = province_code;
        this.district_code = district_code;
        this.ward_code = ward_code;
        this.detail = detail;
    }
    //fromJSON
    static fromJSON(data) {
        if (!data)
            throw new Error("Add is null");
        if (typeof data.province_code !== 'number')
            throw new Error("Province code is not valid");
        if (typeof data.district_code !== 'number')
            throw new Error("District code is not valid");
        if (typeof data.ward_code !== 'number')
            throw new Error("Ward code is not valid");
        if (data.detail && typeof data.detail !== 'string')
            throw new Error("Detail is not valid");
        return new Address(data.province_code, data.district_code, data.ward_code, data.detail);
    }
}
exports.default = Address;
