"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseDefaultValues = exports.PostgresDataType = void 0;
//Enum data type orm postgres
var PostgresDataType;
(function (PostgresDataType) {
    PostgresDataType["varchar"] = "varchar";
    PostgresDataType["integer"] = "integer";
    PostgresDataType["boolean"] = "boolean";
    PostgresDataType["timestamp_without_timezone"] = "timestamp without time zone";
    PostgresDataType["uuid"] = "uuid";
    PostgresDataType["jsonb"] = "jsonb";
    PostgresDataType["text"] = "text";
    PostgresDataType["date"] = "date";
    PostgresDataType["double_precision"] = "double precision";
    PostgresDataType["bigint"] = "bigint";
    PostgresDataType["point"] = "point";
})(PostgresDataType || (exports.PostgresDataType = PostgresDataType = {}));
exports.DatabaseDefaultValues = {
    now: 'CURRENT_TIMESTAMP',
    true: 'true',
    false: 'false'
};
